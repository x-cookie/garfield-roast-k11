import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Redis } from '@upstash/redis';
import {
  detectRepoType,
  assembleRoast,
  buildClaudePrompt,
  type ClaudeFindings,
  type RepoType,
} from '@/lib/jokes-bank-v2';

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
  const redis = getRedis();
  const { repoUrl, mode } = await req.json();
  if (!repoUrl || !/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repoUrl)) {
    return NextResponse.json({ error: 'invalid_repo' }, { status: 400 });
  }

  /* ── 2. Check cache — key computed after repoType detection below ── */
  let cacheKey = `roast:${repoUrl}:${mode}`;
  if (redis) {
    const cached = await redis.get(cacheKey);
    if (cached) return NextResponse.json(cached);
  }

  /* ── 3. Pack repo via GitHub API (no git binary required) ── */
  let packed: string;
  let repoType: RepoType = 'generic';
  try {
    const { content, files } = await packRepo(repoUrl);
    repoType = detectRepoType(files.map(f => f.path));
    cacheKey = `roast:${repoUrl}:${mode}:${repoType}`;
    // re-check cache with type-aware key
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) return NextResponse.json(cached);
    }
    packed = content;
    if (packed.length > 32000) packed = packed.slice(0, 32000) + '\n<!-- TRUNCATED -->';
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

  /* ── 5. Build prompt ── */
  let systemPrompt = buildClaudePrompt(mode, repoUrl, repoType);
  if (securityFindings.length > 0) systemPrompt += `\n\nCRITICAL: ${securityFindings.join(', ')}. Make these the first findings and severity=critical.`;

  /* ── 6. Call Claude (via OpenRouter) ── */
  let rawResponse: string;
  try {
    const completion = await client.chat.completions.create({
      model: 'nvidia/nemotron-nano-9b-v2',
      max_tokens: 1400,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Here is the repository to roast:\n\n${packed}` },
      ],
    });
    rawResponse = completion.choices[0].message.content ?? '';
  } catch (e) {
    console.error('[roast] ai_error:', e);
    return NextResponse.json({ error: 'ai_error' }, { status: 500 });
  }

  /* ── 7. Parse JSON response + assemble with jokes bank ── */
  let result;
  try {
    const clean = rawResponse.replace(/<think>[\s\S]*?<\/think>/g, '').replace(/```json\n?|```\n?/g, '').trim();
    const parsed = JSON.parse(clean);
    // Normalise: model sometimes returns roastItems instead of findings
    const claudeFindings: ClaudeFindings = {
      score: parsed.score,
      verdict: parsed.verdict,
      findings: parsed.findings ?? parsed.roastItems ?? [],
    };
    result = assembleRoast(
      `https://github.com/${repoUrl}`,
      repoType,
      claudeFindings,
      mode as 'savage' | 'snarky' | 'gentle'
    );
  } catch (e) {
    console.error('[roast] parse_error — raw:', rawResponse, 'err:', e);
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
async function packRepo(repoUrl: string): Promise<{ content: string; files: { path: string }[] }> {
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
    .slice(0, 30);

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
          return `<file path="${f.path}">\n${text.slice(0, 2_500)}\n</file>`;
        } catch { return ''; }
      })
    );
    sections.push(...results.filter(Boolean));
  }

  if (sections.length === 0) throw new Error('no_content');
  return {
    content: `<repository name="${repoUrl}" branch="${branch}">\n${sections.join('\n\n')}\n</repository>`,
    files,
  };
}

function preScanSecurity(content: string): string[] {
  const findings: string[] = [];
  if (/AKIA[0-9A-Z]{16}/.test(content))                      findings.push('COMMITTED_AWS_KEY');
  if (/sk-[a-zA-Z0-9]{48}/.test(content))                    findings.push('COMMITTED_OPENAI_KEY');
  if (/password\s*[:=]\s*["'][^"']{4,}["']/i.test(content))  findings.push('HARDCODED_PASSWORD');
  if (/-----BEGIN (RSA |EC )?PRIVATE KEY-----/.test(content)) findings.push('PRIVATE_KEY_IN_CODE');
  return findings;
}

