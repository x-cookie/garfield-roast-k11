import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Redis } from '@upstash/redis';

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    'HTTP-Referer': 'https://garfieldroast.site',
    'X-Title': 'Garfield Roast',
  },
});
let _redis: Redis | null = null;
function getRedis(): Redis | null {
  if (_redis) return _redis;
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL ?? '';
    if (!url || !url.startsWith('https://') || url.includes('...')) return null;
    _redis = Redis.fromEnv();
    return _redis;
  } catch { return null; }
}

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';

  /* ── 1. Rate limiting ── */
  const redis = getRedis();
  if (redis) {
    const today = new Date().toISOString().split('T')[0];
    const rlKey = `rl:${ip}:${today}`;
    const usage = await redis.incr(rlKey);
    if (usage === 1) await redis.expire(rlKey, 86400);
    if (usage > 3) {
      return NextResponse.json(
        { error: 'rate_limit', message: '3 roasts/day exceeded' },
        { status: 429 }
      );
    }
  }

  const { repoUrl, mode } = await req.json();
  if (!repoUrl || !/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repoUrl)) {
    return NextResponse.json({ error: 'invalid_repo' }, { status: 400 });
  }

  /* ── 2. Check cache ── */
  const cacheKey = `roast:${repoUrl}:${mode}`;
  if (redis) {
    const cached = await redis.get(cacheKey);
    if (cached) return NextResponse.json(cached);
  }

  /* ── 3. Pack repo via GitHub API (no git binary required) ── */
  let packed: string;
  try {
    packed = await packRepo(repoUrl);
    if (packed.length > 80000) packed = packed.slice(0, 80000) + '\n<!-- TRUNCATED -->';
  } catch (e) {
    const msg = (e as Error).message ?? '';
    console.error('[roast] packRepo failed:', msg);
    if (msg === 'rate_limited') {
      return NextResponse.json({ error: 'rate_limit', message: 'GitHub API rate limit hit.' }, { status: 429 });
    }
    return NextResponse.json({ error: 'repo_fetch_failed' }, { status: 422 });
  }

  /* ── 4. Pre-scan security (ECC pattern) ── */
  const securityFindings = preScanSecurity(packed);

  /* ── 5. Build prompt (superpowers skills + ECC instincts) ── */
  const systemPrompt = buildGarfieldPrompt(mode, securityFindings);

  /* ── 6. Call Claude (via OpenRouter) ── */
  let rawResponse: string;
  try {
    const completion = await client.chat.completions.create({
      model: 'deepseek/deepseek-chat',
      max_tokens: 2048,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Here is the repository to roast:\n\n${packed}` },
      ],
    });
    rawResponse = completion.choices[0].message.content ?? '';
  } catch {
    return NextResponse.json({ error: 'ai_error' }, { status: 500 });
  }

  /* ── 7. Parse JSON response ── */
  let result;
  try {
    const clean = rawResponse.replace(/```json\n?|```\n?/g, '').trim();
    result = JSON.parse(clean);
  } catch {
    return NextResponse.json({ error: 'parse_error', raw: rawResponse }, { status: 500 });
  }

  /* ── 8. Cache result for 24h ── */
  if (redis) await redis.setex(cacheKey, 86400, result);

  return NextResponse.json(result);
}

/**
 * Packs a remote GitHub repo into XML using the GitHub API — no git binary needed.
 * Works in Vercel Lambda where git clone is unavailable.
 */
async function packRepo(repoUrl: string): Promise<string> {
  const ghToken = (process.env.GITHUB_TOKEN ?? '').trim();
  const ghHeaders: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'garfield-roast/1.0',
  };
  if (ghToken && !ghToken.includes('...') && ghToken.length > 15) {
    ghHeaders['Authorization'] = `token ${ghToken}`;
  }

  // Resolve default branch
  const metaRes = await fetch(`https://api.github.com/repos/${repoUrl}`, { headers: ghHeaders });
  if (metaRes.status === 403) throw new Error('rate_limited');
  if (!metaRes.ok) throw new Error(`meta_fetch_failed:${metaRes.status}`);
  const meta = await metaRes.json() as { default_branch: string };
  const branch = meta.default_branch || 'main';

  // Get full recursive file tree
  const treeRes = await fetch(
    `https://api.github.com/repos/${repoUrl}/git/trees/${branch}?recursive=1`,
    { headers: ghHeaders }
  );
  if (!treeRes.ok) throw new Error(`tree_fetch_failed:${treeRes.status}`);
  const treeData = await treeRes.json() as { tree: Array<{ type: string; path: string; size?: number }> };

  const SKIP = [
    /node_modules\//, /\.git\//, /package-lock\.json$/, /yarn\.lock$/, /pnpm-lock/,
    /\.min\.js$/, /dist\//, /build\//, /\.next\//,
    /\.(png|jpg|jpeg|gif|webp|avif|ico|woff|woff2|ttf|eot|pdf|zip|tar|gz|bin|exe)$/i,
    /\.map$/, /\.lock$/,
  ];
  const files = (treeData.tree || [])
    .filter(f => f.type === 'blob' && !SKIP.some(p => p.test(f.path)) && (f.size ?? 0) < 100_000)
    .slice(0, 60);

  if (files.length === 0) throw new Error('empty_repo');

  // Fetch file contents in parallel batches of 10
  const rawBase = `https://raw.githubusercontent.com/${repoUrl}/${branch}`;
  const sections: string[] = [];

  for (let i = 0; i < files.length; i += 10) {
    const batch = files.slice(i, i + 10);
    const results = await Promise.all(
      batch.map(async f => {
        try {
          const r = await fetch(`${rawBase}/${f.path}`);
          if (!r.ok) return '';
          const text = await r.text();
          return `<file path="${f.path}">\n${text.slice(0, 10_000)}\n</file>`;
        } catch { return ''; }
      })
    );
    sections.push(...results.filter(Boolean));
  }

  if (sections.length === 0) throw new Error('no_content');
  return `<repository name="${repoUrl}" branch="${branch}">\n${sections.join('\n\n')}\n</repository>`;
}

function preScanSecurity(content: string): string[] {
  const findings: string[] = [];
  if (/AKIA[0-9A-Z]{16}/.test(content))                      findings.push('COMMITTED_AWS_KEY');
  if (/sk-[a-zA-Z0-9]{48}/.test(content))                    findings.push('COMMITTED_OPENAI_KEY');
  if (/password\s*[:=]\s*["'][^"']{4,}["']/i.test(content))  findings.push('HARDCODED_PASSWORD');
  if (/-----BEGIN (RSA |EC )?PRIVATE KEY-----/.test(content)) findings.push('PRIVATE_KEY_IN_CODE');
  return findings;
}

function buildGarfieldPrompt(mode: string, secFindings: string[]): string {
  const persona = {
    savage: `You are GARFIELD — a monumentally sarcastic, terminally lazy senior software engineer
who has seen every anti-pattern known to civilization. You hate bad code the way you hate Mondays:
personally and passionately. You ROAST this codebase with specific, cutting, developer-culture-aware
humor. Every line must sting AND make them laugh. Score 1-6 for this mode (be harsh).`,
    snarky: `You are GARFIELD — sardonic, witty, mildly amused by the chaos before you.
You roast with raised eyebrow energy. Clever over brutal. Score 3-7 for this mode.`,
    gentle: `You are GARFIELD — still honest, still Garfield, but you had your lasagna today
so you're in a decent mood. Constructive roasts. Actionable feedback. Still specific. Score 4-8.`,
  };

  const skills = `
ANALYSIS SKILLS (use all of these as lenses):
- ARCHITECTURE: god objects, circular deps, missing SRP, monolithic functions (>50 lines = flag)
- NAMING: generic names (data/info/stuff/temp), single-letter vars outside loops, misleading names
- SECURITY: hardcoded creds, eval(), missing input validation, wildcard CORS, unsafe deserialization
- TECH DEBT: TODO/FIXME count, commented-out code, console.log production, magic numbers
- DEPENDENCIES: dep count vs actual functionality (flag bloat), outdated packages, unused imports
- README: missing sections, "coming soon" items, no installation guide, no example usage`;

  const securityNote = secFindings.length > 0
    ? `\n\nCRITICAL SECURITY FINDINGS PRE-DETECTED: ${secFindings.join(', ')} — MAKE THESE HURT EXTRA.`
    : '';

  const instincts = `
INSTINCTS (always active):
- Be SPECIFIC: reference real file names, function names, variable names from the repo
- Use developer culture: npm hell, Stack Overflow, deploy anxiety, "works on my machine"
- Each roastItem must link to a specific file
- End verdict with something screenshot-worthy
- NEVER be generic. Garfield has READ this specific repo.${securityNote}`;

  const schema = `
Respond ONLY with valid JSON — no markdown, no preamble:
{
  "score": <1-10 integer>,
  "verdict": "<one devastating sentence from Garfield>",
  "roastItems": [
    { "file": "<exact filename>", "text": "<specific roast>", "severity": "critical|warning|note" }
  ],
  "captions": [
    "<tweet caption 1 — include score, funny>",
    "<tweet caption 2 — quote verdict>",
    "<tweet caption 3 — self-deprecating dev humor>"
  ]
}
Minimum 4 roastItems. Maximum 8.`;

  return `${persona[mode as keyof typeof persona]}\n${skills}\n${instincts}\n\n${schema}`;
}
