/**
 * GARFIELD ROAST — Jokes Bank v2 (MAXED OUT)
 * 32 roast lines + repo-type detection + caption system + rotation logic
 *
 * PHILOSOPHY:
 * - Garfield is the STAR. Every joke is delivered AS Garfield, not ABOUT Garfield.
 * - Jokes feel targeted even when they're from the bank — achieved through
 *   repo-type detection (markdown repo vs source code vs no-tests etc)
 * - Captions are designed to be screenshot-shared on X, not just copy-pasted
 *
 * LIMIT STRATEGY:
 * - 3 bank jokes + 2-3 Claude specific findings per roast
 * - Bank jokes: FREE (zero API cost)
 * - Claude only writes TARGETED lines per actual file content
 * - Result: ~60% less tokens per request
 */

// ─── REPO TYPE DETECTION ──────────────────────────────────────────────────────

export type RepoType =
  | 'markdown_collection'  // awesome-lists, curated repos — mostly .md files
  | 'frontend'             // React, Vue, HTML/CSS heavy
  | 'backend'              // Node/Python/Go/Java — API/server
  | 'ml_data'              // Jupyter notebooks, datasets, ML pipelines
  | 'config_infra'         // Dockerfiles, CI/CD, .yaml heavy
  | 'generic'              // fallback

export function detectRepoType(files: string[]): RepoType {
  const exts = files.map(f => f.split('.').pop()?.toLowerCase() ?? '')
  const count = (ext: string) => exts.filter(e => e === ext).length
  const total = files.length || 1

  if (count('md') / total > 0.5)                          return 'markdown_collection'
  if (count('ipynb') > 0 || count('csv') > 2)             return 'ml_data'
  if (count('yaml') + count('yml') + count('dockerfile') > files.length * 0.3) return 'config_infra'
  if (count('jsx') + count('tsx') + count('vue') + count('svelte') > 3) return 'frontend'
  if (count('py') + count('go') + count('java') + count('rs') > 3)      return 'backend'
  return 'generic'
}

// ─── JOKE STRUCTURE ───────────────────────────────────────────────────────────

export interface GarfieldJoke {
  id: string
  tier: 'garfield' | 'dev_culture' | 'code_quality' | 'repo_type'
  repoTypes: RepoType[] // which repo types this joke fits. ['generic'] = always fits
  severity: 'critical' | 'warning' | 'note'
  text: string          // The actual Garfield roast line
  badge: string         // Short label shown as tag on the card
}

// ─── THE JOKES BANK (32 entries) ─────────────────────────────────────────────

export const JOKES_BANK: GarfieldJoke[] = [

  // ══ TIER A: GARFIELD CHARACTER (Garfield speaks in first person / references his world)

  {
    id: 'gf-01', tier: 'garfield', repoTypes: ['generic'],
    severity: 'warning',
    text: `Garfield has a philosophy: do as little as possible, and do it with maximum comfort. This codebase has adopted the same philosophy. Unfortunately, it also skipped the 'comfort' part.`,
    badge: 'GARFIELD PHILOSOPHY',
  },
  {
    id: 'gf-02', tier: 'garfield', repoTypes: ['generic'],
    severity: 'critical',
    text: `Garfield once looked at a Monday and said "I hate you." He is now looking at this repository with the same expression. The main difference is that Mondays are mandatory. This is a choice.`,
    badge: 'WORSE THAN MONDAY',
  },
  {
    id: 'gf-03', tier: 'garfield', repoTypes: ['generic'],
    severity: 'warning',
    text: `Garfield's diet has been "lasagna and contempt" for 40+ years. After reviewing this repo, he's adding "existential dread about variable naming" to the menu. It pairs surprisingly well with Mondays.`,
    badge: 'CONTEMPT ADDED TO DIET',
  },
  {
    id: 'gf-04', tier: 'garfield', repoTypes: ['generic'],
    severity: 'note',
    text: `Odie once ran into a wall headfirst. He learned. He adapted. He never did it again. Meanwhile, this codebase has been running into the same wall since the initial commit. Odie is smarter than this code. Let that sink in.`,
    badge: 'ODIE > CODEBASE',
  },
  {
    id: 'gf-05', tier: 'garfield', repoTypes: ['generic'],
    severity: 'critical',
    text: `Jon once tried to make Garfield exercise. Garfield's response was to lie down more aggressively. This README has taken the same approach to documentation: it exists, technically, but it's doing the absolute minimum while somehow appearing busy.`,
    badge: 'PERFORMATIVE DOCUMENTATION',
  },
  {
    id: 'gf-06', tier: 'garfield', repoTypes: ['generic'],
    severity: 'warning',
    text: `Garfield has consumed more lasagna than most humans consume food in a lifetime. He has seen things. He has opinions. His opinion on code with zero test coverage is the same face he makes when Jon serves him diet cat food: quiet, absolute, total disdain.`,
    badge: 'DIET CAT FOOD ENERGY',
  },
  {
    id: 'gf-07', tier: 'garfield', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'critical',
    text: `In 1978, Garfield debuted in 41 newspapers. He has since appeared in 2,500. In that same amount of time, this codebase accumulated 0 unit tests. Garfield has been more productive than your entire test suite.`,
    badge: '0 TESTS SINCE 1978',
  },
  {
    id: 'gf-08', tier: 'garfield', repoTypes: ['generic'],
    severity: 'note',
    text: `Garfield once said: "I'm not overweight, I'm under-tall." This repository is not unmaintained — it's under-committed. This is the same logic. Garfield recognizes it. He invented it. He's not proud.`,
    badge: 'GARFIELD LOGIC DETECTED',
  },

  // ══ TIER B: DEV CULTURE (universal developer experiences)

  {
    id: 'dev-01', tier: 'dev_culture', repoTypes: ['generic'],
    severity: 'critical',
    text: `The commit message that started this file was "initial commit." The commit message that last touched it was "fix." Between those two messages is the entire emotional arc of someone's relationship with this project: hope, then resignation.`,
    badge: 'COMMIT ARCHAEOLOGY',
  },
  {
    id: 'dev-02', tier: 'dev_culture', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'warning',
    text: `There are console.log statements that say: "here", "test", "aaa", "ok", "wtf", and "WHYYYY". This is not debugging. This is a developer screaming into the void using the only vocabulary available to them at 2am.`,
    badge: '2AM DEBUGGING EVIDENCE',
  },
  {
    id: 'dev-03', tier: 'dev_culture', repoTypes: ['generic'],
    severity: 'critical',
    text: `The README says "coming soon" in the installation section. It was written 14 months ago. Coming soon, in the context of software, means "never, but we haven't accepted it yet." Garfield has accepted it. He asks that you do the same.`,
    badge: 'COMING NEVER',
  },
  {
    id: 'dev-04', tier: 'dev_culture', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'warning',
    text: `Stack Overflow was consulted. The answer was from 2013. The answer was deprecated in 2016. It was copy-pasted in 2024. The timestamp is visible in the code comments. Garfield has seen this exact move in 80% of repositories. He's not surprised. He's tired.`,
    badge: 'VINTAGE STACK OVERFLOW',
  },
  {
    id: 'dev-05', tier: 'dev_culture', repoTypes: ['frontend', 'backend', 'generic'],
    severity: 'note',
    text: `package.json says "version: 1.0.0" and has never been updated. Meanwhile there are 47 commits, 3 breaking changes, and a complete rewrite of the core logic. Version 1.0.0 is doing a lot of heavy lifting here. Almost as much as the lack of a changelog.`,
    badge: 'ETERNAL VERSION 1.0.0',
  },
  {
    id: 'dev-06', tier: 'dev_culture', repoTypes: ['generic'],
    severity: 'critical',
    text: `The branch is called "main-new-final-v2-PLEASE-USE-THIS". There is also a branch called "main-new-final-v2-PLEASE-USE-THIS-for-real". Git was invented so you wouldn't need to name files like it's 2003 and you're saving a Word document. You are naming branches like it's 2003 and you're saving a Word document.`,
    badge: 'BRANCH NAME CHAOS',
  },
  {
    id: 'dev-07', tier: 'dev_culture', repoTypes: ['backend', 'generic'],
    severity: 'warning',
    text: `The .env.example has 18 variables. The documentation explains 3 of them. The remaining 15 are a hazing ritual. New team members spend their first week deciphering them. Garfield respects the commitment to mystery. He does not respect the wasted human hours.`,
    badge: 'ENV HAZING RITUAL',
  },
  {
    id: 'dev-08', tier: 'dev_culture', repoTypes: ['generic'],
    severity: 'note',
    text: `git blame reveals that the most important function was last touched by someone who left the company two years ago. The function is still running in production. Nobody fully understands it. Removing it causes three unrelated things to break. It will outlive everyone on the current team. This is software heritage.`,
    badge: 'LEGACY HAUNTING',
  },

  // ══ TIER C: CODE QUALITY (universal anti-patterns)

  {
    id: 'code-01', tier: 'code_quality', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'critical',
    text: `The function is named "processData". It accepts "data". It returns "result". The parameter names, return types, and function name contain a combined total of zero information about what this function actually does. It is documentation-shaped code with no documentation inside.`,
    badge: 'CONTENT-FREE NAMING',
  },
  {
    id: 'code-02', tier: 'code_quality', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'critical',
    text: `The error handling is: catch(e) {}. Empty. Silent. The error is caught like a butterfly in a jar, observed briefly, then released back into the wild with no record that it was ever there. Users experience mysterious failures. The code experiences nothing. It is enlightened in the worst way.`,
    badge: 'ENLIGHTENED ERROR HANDLING',
  },
  {
    id: 'code-03', tier: 'code_quality', repoTypes: ['frontend', 'generic'],
    severity: 'warning',
    text: `There is a ternary inside a ternary inside a ternary. It spans one line. That line is 187 characters long. It was written in a single commit with the message "simplify logic". The person who wrote this believes this is simpler. Garfield believes many things are simpler than this. Lasagna. Mondays. Nihilism.`,
    badge: 'RECURSIVE TERNARY',
  },
  {
    id: 'code-04', tier: 'code_quality', repoTypes: ['generic'],
    severity: 'warning',
    text: `The magic number 86400 appears 9 times with no constant, no comment, and no explanation. For those who don't know: 86400 is the number of seconds in a day. The developer knew this. They chose not to mention it. Future developers will learn it the same way — by Googling it at 11pm on a Tuesday.`,
    badge: 'MAGIC NUMBER ARCHAEOLOGY',
  },
  {
    id: 'code-05', tier: 'code_quality', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'critical',
    text: `There are 14 TODO comments. The oldest is 847 days old. It says "TODO: fix this, it's a temporary hack." It is no longer temporary. It has surpassed "temporary" and entered "load-bearing infrastructure." If you fix it now, two production systems will fail. Congratulations on your permanent temporary solution.`,
    badge: 'PERMANENT TEMPORARY HACK',
  },
  {
    id: 'code-06', tier: 'code_quality', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'note',
    text: `The test coverage is listed in the README as "comprehensive." The actual test coverage is 4%. These two statements are technically compatible if you define "comprehensive" as "exists and is countable." Garfield does not define it this way. Neither does any person who has ever written a test.`,
    badge: '"COMPREHENSIVE" COVERAGE',
  },
  {
    id: 'code-07', tier: 'code_quality', repoTypes: ['frontend', 'backend', 'generic'],
    severity: 'warning',
    text: `A component file is 743 lines. It renders a button. Somewhere between line 1 and line 743, the button acquired: an authentication check, two API calls, a date formatter, and what appears to be a partial reimplementation of Redux. The button still renders. Garfield respects its resilience. Not its architecture.`,
    badge: 'BUTTON WITH AMBITIONS',
  },
  {
    id: 'code-08', tier: 'code_quality', repoTypes: ['ml_data', 'generic'],
    severity: 'warning',
    text: `The Jupyter notebook has 94 cells. Cells 1 through 47 are for data loading. Cell 48 is for "exploration." Cells 49 through 93 are variations of the same plot with slightly different colors. Cell 94 is titled "actual analysis" and was added 6 months after everything else. Garfield has eaten lasagna with more structure than this notebook.`,
    badge: 'NOTEBOOK ARCHAEOLOGY',
  },

  // ══ TIER D: REPO-TYPE SPECIFIC (targeted by repo category)

  {
    id: 'rt-markdown-01', tier: 'repo_type', repoTypes: ['markdown_collection'],
    severity: 'critical',
    text: `This repository contains no code. It is a markdown file with links in it. It has been starred thousands of times. Garfield has stared at this for a long time and is choosing to respect the audacity. A list of links is apparently worth more recognition than entire codebases. Garfield is reconsidering his career.`,
    badge: 'NOT CODE BUT STARRED',
  },
  {
    id: 'rt-markdown-02', tier: 'repo_type', repoTypes: ['markdown_collection'],
    severity: 'warning',
    text: `The entire contribution process is: open a PR that adds one line to a markdown file. The CI pipeline validates that the line is a valid URL. Garfield has automated the acceptance of links. This is peak software: maximum infrastructure for minimum content.`,
    badge: 'CI FOR A MARKDOWN FILE',
  },
  {
    id: 'rt-markdown-03', tier: 'repo_type', repoTypes: ['markdown_collection'],
    severity: 'note',
    text: `Section: "Awesome Resources." Section: "More Awesome Resources." Section: "Even More Resources." At some point the word "awesome" stops meaning anything. Garfield feels the same way about Mondays — overexposed, under-validated, present regardless.`,
    badge: 'AWESOME INFLATION',
  },
  {
    id: 'rt-frontend-01', tier: 'repo_type', repoTypes: ['frontend'],
    severity: 'critical',
    text: `The bundle size is 4.2MB for a landing page with one form. Garfield weighs more than he should. He owns this. He is not packaging 47 npm dependencies to display a form with three fields.`,
    badge: 'BUNDLE > CAT',
  },
  {
    id: 'rt-backend-01', tier: 'repo_type', repoTypes: ['backend'],
    severity: 'critical',
    text: `The API has 23 endpoints. 4 of them are documented. The remaining 19 are discoverable by reading the code, running the server, and making requests until something works. This is not an API. This is a scavenger hunt with HTTP verbs.`,
    badge: 'API SCAVENGER HUNT',
  },
  {
    id: 'rt-infra-01', tier: 'repo_type', repoTypes: ['config_infra'],
    severity: 'warning',
    text: `The Dockerfile runs as root. The docker-compose has passwords in plain text. The CI pipeline uploads to production on every push to main. Garfield has seen less dangerous configurations inside active volcanoes. And he's a cartoon cat who has never been near a volcano.`,
    badge: 'PRODUCTION ROULETTE',
  },
  {
    id: 'rt-ml-01', tier: 'repo_type', repoTypes: ['ml_data'],
    severity: 'warning',
    text: `The model achieves 99.7% accuracy on the training set. On the test set: 61%. The README proudly features the 99.7% number in the title. Garfield has eaten lasagna that looked better than it tasted. He recognizes this pattern. He is not impressed by it.`,
    badge: 'TRAINING SET CONFIDENCE',
  },
]

// ─── ROTATION + SELECTION LOGIC ───────────────────────────────────────────────

export function hashRepo(repoUrl: string): number {
  let hash = 0
  for (let i = 0; i < repoUrl.length; i++) {
    const c = repoUrl.charCodeAt(i)
    hash = Math.imul(31, hash) + c | 0
  }
  return Math.abs(hash)
}

/**
 * Select N jokes, biased toward repo type
 * Distribution: 1 garfield + 1 dev_culture + 1 code_quality + 1 repo_type (if not generic)
 */
export function selectJokes(
  repoUrl: string,
  repoType: RepoType,
  count = 3
): GarfieldJoke[] {
  const seed = hashRepo(repoUrl)
  const pick = (arr: GarfieldJoke[]) => arr[seed % arr.length]

  const garfield   = JOKES_BANK.filter(j => j.tier === 'garfield')
  const devCulture = JOKES_BANK.filter(j => j.tier === 'dev_culture')
  const codeQual   = JOKES_BANK.filter(j => j.tier === 'code_quality')
  const repoSpec   = JOKES_BANK.filter(j =>
    j.tier === 'repo_type' && j.repoTypes.includes(repoType)
  )

  const result: GarfieldJoke[] = []

  // Always include 1 Garfield character joke (seed-based, deterministic)
  result.push(garfield[(seed * 7) % garfield.length])

  // Include 1 repo-type specific if available
  if (repoSpec.length > 0) {
    result.push(repoSpec[(seed * 3) % repoSpec.length])
  }

  // Fill remaining from dev_culture and code_quality
  const pool = [...devCulture, ...codeQual].filter(j => !result.includes(j))
  while (result.length < count && pool.length > 0) {
    const idx = (seed * (result.length + 1) * 2654435761) % pool.length
    result.push(pool.splice(idx | 0, 1)[0])
  }

  return result
}

// ─── CAPTION SYSTEM ───────────────────────────────────────────────────────────

export interface CaptionSet {
  main: string      // Primary share caption — punchy, includes score
  challenge: string // "Challenge" format — tags someone else
  humble: string    // Self-deprecating dev humor
  lore: string      // Garfield-lore based, for the niche audience
}

export function generateCaptions(
  repoPath: string,
  score: number,
  verdict: string,
  mode: string
): CaptionSet {
  const site = 'garfieldroast.site'
  const scoreLabel = score <= 3
    ? 'absolutely destroyed' : score <= 5
    ? 'professionally humiliated' : score <= 7
    ? 'mildly judged' : 'reluctantly respected'

  const garfieldLines = [
    "Garfield reviewed my code and he's going back to sleep.",
    "Garfield has seen worse. He had to think about it for a while though.",
    "Even Garfield's worst Monday was better than this codebase.",
    "Garfield rates it below lasagna. Above Odie. Barely.",
    "Garfield looked at this and immediately asked for Jon's lasagna.",
  ]
  const gfLine = garfieldLines[hashRepo(repoPath) % garfieldLines.length]

  return {
    main: `I got ${scoreLabel} by an AI cat 💀 ${score}/10 on my ${repoPath.split('/')[1]} repo\n\n"${verdict.slice(0, 120)}..."\n\n→ ${site} #GarfieldRoast`,

    challenge: `roast challenge 🔥 i got ${score}/10 from Garfield on github.com/${repoPath}\n\nbet your repo scores lower → ${site}\n\n#GarfieldRoast #CodeRoast`,

    humble: `just let an AI cat audit my entire repo and now i feel things\n\n${score}/10. the score is ${score}/10.\n\n${site} #GarfieldRoast`,

    lore: `${gfLine}\n\n${score}/10 → ${site}`,
  }
}

// ─── HYBRID ROAST ASSEMBLER ───────────────────────────────────────────────────

export interface ClaudeFindings {
  score: number
  verdict: string
  findings: {
    file: string
    text: string
    severity: 'critical' | 'warning' | 'note'
  }[]
}

export function assembleRoast(
  repoUrl: string,
  repoType: RepoType,
  claude: ClaudeFindings,
  mode: 'savage' | 'snarky' | 'gentle'
) {
  const repoPath = repoUrl.replace('https://github.com/', '')

  // Gentle mode: 1 bank joke only, rest is Claude constructive
  const bankCount = mode === 'gentle' ? 1 : mode === 'snarky' ? 2 : 3
  const jokes = selectJokes(repoUrl, repoType, bankCount)

  // Format bank jokes as roast items
  const bankItems = jokes.map(j => ({
    file: null,  // null = no file reference, UI renders differently
    text: j.text,
    severity: j.severity,
    badge: j.badge,
    isBank: true,
  }))

  // Format Claude findings
  const claudeItems = claude.findings.map(f => ({
    file: f.file,
    text: f.text,
    severity: f.severity,
    badge: f.severity === 'critical' ? '🎯 SPOTTED' : '👁 NOTICED',
    isBank: false,
  }))

  // Interleave: Claude specific first (most impactful), then bank
  const roastItems = []
  for (let i = 0; i < Math.max(claudeItems.length, bankItems.length); i++) {
    if (i < claudeItems.length) roastItems.push(claudeItems[i])
    if (i < bankItems.length) roastItems.push(bankItems[i])
  }

  const captions = generateCaptions(repoPath, claude.score, claude.verdict, mode)

  return {
    score: claude.score,
    verdict: claude.verdict,
    repoType,
    roastItems,
    // 4 caption options shown to user
    captionOptions: [
      { label: '🔥 Standard', text: captions.main },
      { label: '⚔️ Challenge', text: captions.challenge },
      { label: '😭 Humble',   text: captions.humble },
      { label: '🐱 Garfield lore', text: captions.lore },
    ],
  }
}

// ─── REDUCED CLAUDE PROMPT ────────────────────────────────────────────────────
// Claude ONLY handles specific file findings + score + verdict.
// All generic humor = bank. This saves ~60% tokens per request.

export function buildClaudePrompt(
  mode: string,
  repoPath: string,
  repoType: RepoType
): string {
  const tone = {
    savage: 'brutally specific, no mercy',
    snarky: 'sardonic, witty, precise',
    gentle: 'honest, constructive, direct'
  }[mode] ?? 'brutally specific, no mercy'

  const typeHint = {
    markdown_collection: 'This is a curated list/documentation repo with mostly Markdown files and minimal source code.',
    frontend:  'This is a frontend repo. Look for bundle bloat, component size, accessibility issues, CSS chaos.',
    backend:   'This is a backend repo. Look for error handling, security patterns, API design, missing tests.',
    ml_data:   'This is an ML/data repo. Look for data leakage, overfit signals, undocumented notebooks.',
    config_infra: 'This is infra/config. Look for hardcoded secrets, dangerous permissions, missing health checks.',
    generic:   'Look for naming conventions, architecture, error handling, test coverage.'
  }[repoType]

  return `You are Garfield — sarcastic, lazy, devastating. Tone: ${tone}.

CONTEXT: ${typeHint}

Your task: Find SPECIFIC issues that only exist in THIS exact repo.
Reference real filenames. Reference real function or variable names you actually see.
Do NOT write generic observations — those are handled separately.

Respond ONLY in valid JSON (no markdown fence):
{
  "score": <integer 1-10>,
  "verdict": "<one sentence, must reference something specific from this repo>",
  "findings": [
    { "file": "<real filename from repo>", "text": "<specific Garfield observation>", "severity": "critical|warning|note" }
  ]
}

Requirements:
- findings: min 3, max 5
- Every finding MUST name a real file from the packed repo
- Verdict MUST reference a specific filename or function name
- Savage mode: score 1-5 unless code is genuinely exceptional
- Snarky mode: score 2-6
- Gentle mode: score 4-8, findings are actionable not just mean
- If you detect committed secrets: severity = critical, make it the first finding`
}

// ─── DEMO: What the OpenClaw repo would get ───────────────────────────────────
// Repo: hesamsheikh/awesome-openclaw-usecases
// Type: markdown_collection (only .md files + .yaml CI + .coderabbit.yaml)
// This is what Garfield would say about a 30k-starred markdown-only repo

export const OPENCLAW_DEMO_RESULT = assembleRoast(
  'https://github.com/hesamsheikh/awesome-openclaw-usecases',
  'markdown_collection',
  {
    score: 6, // Not low — it's actually well-maintained as a list repo
    verdict: `README.md contains more stars than lines of actual code, and somehow that's not the most alarming thing about .coderabbit.yaml running CI on a list of links.`,
    findings: [
      {
        file: 'README.md',
        text: `README.md is the entire product. There is no source code. The "repository" is a markdown file. It has 30,000 stars. Garfield has eaten lasagna that required more engineering than this. He is confused by his own feelings about this.`,
        severity: 'warning',
      },
      {
        file: '.github/workflows',
        text: `There is a CI/CD pipeline. Its purpose is to validate that markdown links are not broken. Garfield spent 40 years judging Mondays. He now adds "automated link checkers for markdown files" to his list of things that technically work but shouldn't need to exist.`,
        severity: 'note',
      },
      {
        file: '.coderabbit.yaml',
        text: `CodeRabbit AI is configured to review pull requests. The pull requests add links to a markdown file. The AI reviewer reviews whether the link is a real link. This is a very sophisticated way to determine if a URL is a URL.`,
        severity: 'note',
      },
    ],
  },
  'savage'
)