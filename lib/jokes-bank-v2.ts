/**
 * GARFIELD ROAST — Jokes Bank v2 (MAXED OUT)
 * 32 roast lines + repo-type detection + caption system + rotation logic
 */

// ─── REPO TYPE DETECTION ──────────────────────────────────────────────────────

export type RepoType =
  | 'markdown_collection'
  | 'frontend'
  | 'backend'
  | 'ml_data'
  | 'config_infra'
  | 'generic'

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
  repoTypes: RepoType[]
  severity: 'critical' | 'warning' | 'note'
  text: string
  badge: string
}

// ─── THE JOKES BANK (32 entries) ─────────────────────────────────────────────

export const JOKES_BANK: GarfieldJoke[] = [

  // ══ TIER A: GARFIELD CHARACTER

  {
    id: 'gf-01', tier: 'garfield', repoTypes: ['generic'],
    severity: 'warning',
    text: `This codebase has one setting: minimum. Minimum naming, minimum structure, minimum effort at every level. Everyone who touches this after you is going to spend half their time figuring out what you meant instead of doing what they came to do. You built a puzzle when you were supposed to build a tool.`,
    badge: 'GARFIELD PHILOSOPHY',
  },
  {
    id: 'gf-02', tier: 'garfield', repoTypes: ['generic'],
    severity: 'critical',
    text: `Zero tests, no docs, and a commit history that reads like a panic attack. Every person who inherits this has to start from scratch figuring out what's safe to change. You left them nothing to work with. That wasn't an accident — that was every decision you made, accumulated.`,
    badge: 'WORSE THAN MONDAY',
  },
  {
    id: 'gf-03', tier: 'garfield', repoTypes: ['generic'],
    severity: 'warning',
    text: `No test coverage on a production codebase. Not even a basic smoke test. Every deploy from now on is a guess. Every change is a gamble. The people after you have no way to know if they broke something until a user finds it for them. You designed it that way by not designing it at all.`,
    badge: 'CONTEMPT ENHANCED',
  },
  {
    id: 'gf-04', tier: 'garfield', repoTypes: ['generic'],
    severity: 'note',
    text: `This repo has made the same mistake across four consecutive commits. Not different mistakes. The same one. Whoever maintains this is going to find the pattern and have no idea whether it's intentional or not, because nothing here explains anything.`,
    badge: 'ODIE > CODEBASE',
  },
  {
    id: 'gf-05', tier: 'garfield', repoTypes: ['generic'],
    severity: 'critical',
    text: `The README says "installation: coming soon." It has said this for over a year. Nobody who clones this can run it without finding you personally and asking. You are the documentation. You made yourself the single point of failure for your own project and then stopped being available.`,
    badge: 'WORSE THAN ONE JOURNAL ENTRY',
  },
  {
    id: 'gf-06', tier: 'garfield', repoTypes: ['generic'],
    severity: 'warning',
    text: `Zero test coverage in production. Every deploy is a bet. Every hotfix is a new bet stacked on the old one. Someone downstream is going to make a change that breaks everything and have no way to know it broke, because you left nothing to check against.`,
    badge: 'DIET CAT FOOD ENERGY',
  },
  {
    id: 'gf-07', tier: 'garfield', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'critical',
    text: `Not a single test file in this entire repo. Not one describe block, not one assertion. Every person who changes anything in here is changing it blind. You built a system with no way to verify it works and then asked other people to maintain it.`,
    badge: '0 TESTS SINCE 1978',
  },
  {
    id: 'gf-08', tier: 'garfield', repoTypes: ['generic'],
    severity: 'note',
    text: `The README says "this project is in a stable state." The last commit was 14 months ago. 47 open issues. Three labeled critical. You wrote "stable" and closed the tab, and that word has been doing all the work of maintaining this project ever since.`,
    badge: 'GARFIELD LOGIC DETECTED',
  },

  // ══ TIER B: DEV CULTURE

  {
    id: 'dev-01', tier: 'dev_culture', repoTypes: ['generic'],
    severity: 'critical',
    text: `The commit history is: "initial commit", "fix", "fix 2", "ok this time for real", "PLEASE WORK", and a single period. That's it. That's the entire context anyone has for understanding what happened in this codebase. When something breaks, this is what people search through to find out why. You gave them nothing.`,
    badge: 'COMMIT AUTOBIOGRAPHY',
  },
  {
    id: 'dev-02', tier: 'dev_culture', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'warning',
    text: `There are console.logs that say "here", "aaa", "ok wtf", and "WHYYYY" still in production code. Someone is reading these in a real environment right now trying to figure out what they mean. They mean nothing. You left them and forgot them and now they're part of the production experience.`,
    badge: '2AM DEBUGGING EVIDENCE',
  },
  {
    id: 'dev-03', tier: 'dev_culture', repoTypes: ['generic'],
    severity: 'critical',
    text: `The installation section says "coming soon." It has said this for 14 months. Anyone who wants to use this has had to either figure it out themselves or find someone who already knows. You made your own project inaccessible by default and then left it that way.`,
    badge: 'COMING NEVER',
  },
  {
    id: 'dev-04', tier: 'dev_culture', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'warning',
    text: `The code here is copy-pasted from a 2013 Stack Overflow answer that has a pinned comment with 847 upvotes saying "DO NOT USE IN PRODUCTION." The deprecation warning was stripped before committing. That code is in production right now. The 847 people who warned against it were right.`,
    badge: 'VINTAGE STACK OVERFLOW',
  },
  {
    id: 'dev-05', tier: 'dev_culture', repoTypes: ['frontend', 'backend', 'generic'],
    severity: 'note',
    text: `Still on version 1.0.0 through 47 commits, 3 rewrites, 2 breaking API changes, and a database migration. Everyone integrating with this has no way to know what changed or when. Semantic versioning exists for this exact reason. You just chose not to use it.`,
    badge: 'ETERNAL VERSION 1.0.0',
  },
  {
    id: 'dev-06', tier: 'dev_culture', repoTypes: ['generic'],
    severity: 'critical',
    text: `The branches are named main, main-backup, main-old, main-new-final, main-new-final-v2, and "the-real-one." Every person who clones this has to ask which branch is current. Every PR gets submitted to the wrong place first. You built a maze out of something that was supposed to have a single obvious path.`,
    badge: 'BRANCH NAME CHAOS',
  },
  {
    id: 'dev-07', tier: 'dev_culture', repoTypes: ['backend', 'generic'],
    severity: 'warning',
    text: `15 undocumented environment variables in .env.example. Nobody knows what ENABLE_THE_FEATURE does. Nobody knows what happens when PLEASE_LEAVE_THIS_AS_TRUE is false. New developers spend their first week asking around. Senior developers shrug and say "just set it to true." That's not onboarding. That's hazing.`,
    badge: 'ENV HAZING RITUAL',
  },
  {
    id: 'dev-08', tier: 'dev_culture', repoTypes: ['generic'],
    severity: 'note',
    text: `The most important function in this codebase hasn't been touched since 2022 by someone who left the company. Nobody fully understands it. There are three known bugs in it that nobody fixes because fixing them breaks other things. You have a load-bearing piece of code that nobody can explain and nobody will touch. That's the position everyone working here is in.`,
    badge: 'LEGACY HAUNTING',
  },

  // ══ TIER C: CODE QUALITY

  {
    id: 'code-01', tier: 'code_quality', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'critical',
    text: `processData takes data, stores it in temp, and returns result. Every variable name in this function is a placeholder for the actual name someone should have used. Any developer who opens this has to reverse-engineer what this does from scratch because the code refuses to explain itself. You named everything and said nothing.`,
    badge: 'CONTENT-FREE NAMING',
  },
  {
    id: 'code-02', tier: 'code_quality', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'critical',
    text: `catch(e) {} everywhere. You catch errors and do nothing with them. No log, no rethrow, nothing. Users see failures with no message. Logs show nothing. When something breaks in production, there is no trace anywhere because you made sure there wouldn't be. Every silent failure in this app is a catch block you wrote.`,
    badge: 'ENLIGHTENED ERROR HANDLING',
  },
  {
    id: 'code-03', tier: 'code_quality', repoTypes: ['frontend', 'generic'],
    severity: 'warning',
    text: `A ternary inside a ternary inside a ternary, 214 characters on one line, committed as "simplify logic." There was a readable if-else block here before. You deleted it and replaced it with this. The next developer who needs to change this condition is going to spend 20 minutes untangling what you called simple.`,
    badge: 'RECURSIVE TERNARY',
  },
  {
    id: 'code-04', tier: 'code_quality', repoTypes: ['generic'],
    severity: 'warning',
    text: `86400 appears 11 times in this codebase with no constant, no comment. Three of those 11 are wrong — they don't account for daylight saving and will break twice a year in certain timezones. Nobody will know why. The bug will be nearly impossible to reproduce in development. You put a time bomb in here 11 times.`,
    badge: 'MAGIC NUMBER ARCHAEOLOGY',
  },
  {
    id: 'code-05', tier: 'code_quality', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'critical',
    text: `"Temporary hack — remove before production." That comment is 1,142 days old. It went to production on day 4. The hack is load-bearing now. You can't remove it. Everyone who has worked here since knows it's there, knows it shouldn't be, and can't touch it. You made a temporary decision permanent by ignoring it long enough.`,
    badge: 'PERMANENT TEMPORARY HACK',
  },
  {
    id: 'code-06', tier: 'code_quality', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'note',
    text: `The README says "comprehensive test coverage." The actual coverage is 4%. Everyone who reads this and trusts it is going to make decisions based on a lie. You wrote "comprehensive" knowing it wasn't, or without checking, and that word is still there doing damage.`,
    badge: '"COMPREHENSIVE" = 4%',
  },
  {
    id: 'code-07', tier: 'code_quality', repoTypes: ['frontend', 'backend', 'generic'],
    severity: 'warning',
    text: `Button.tsx is 847 lines long and handles auth, API calls, date formatting, and what looks like a reimplementation of Redux. There's a TODO from 8 months ago saying "split this up." Every developer who needs to change the button has to open an 847-line file to do it. You let this happen and then wrote a TODO about it.`,
    badge: 'BUTTON WITH AMBITIONS',
  },
  {
    id: 'code-08', tier: 'code_quality', repoTypes: ['ml_data', 'generic'],
    severity: 'warning',
    text: `112 cells. 34 warnings suppressed with filterwarnings("ignore"). Cells 54 through 111 are variations of the same histogram. Cell 112 is labeled "FINAL ANALYSIS - USE THIS ONE" and appeared 6 months after everything else. Nobody running this knows which cells to run or in what order. It's a record of a process, not a reproducible analysis.`,
    badge: 'NOTEBOOK ARCHAEOLOGY',
  },

  // ══ TIER D: REPO-TYPE SPECIFIC

  {
    id: 'rt-markdown-01', tier: 'repo_type', repoTypes: ['markdown_collection'],
    severity: 'critical',
    text: `This is a markdown file with links in it. That's the entire repo. No code, no build step, no runtime. A text file. It has more stars than most actual software. I'm not saying anything else about this. I just want it on record.`,
    badge: 'NOT CODE BUT STARRED',
  },
  {
    id: 'rt-markdown-02', tier: 'repo_type', repoTypes: ['markdown_collection'],
    severity: 'warning',
    text: `There is a CI/CD pipeline protecting this repo. It checks that the links in the markdown file are still live. GitHub Actions. Cloud infrastructure. Real money. To verify that URLs resolve. For a text file. Someone made that decision and nobody stopped them.`,
    badge: 'CI FOR A MARKDOWN FILE',
  },
  {
    id: 'rt-markdown-03', tier: 'repo_type', repoTypes: ['markdown_collection'],
    severity: 'note',
    text: `"Awesome Resources." "More Awesome Resources." "Even More Awesome Resources." "Additional Awesome Resources You Should Know About." The word "awesome" appears 47 times. Nothing here is described beyond the fact that it exists and someone thought it was worth linking. That's the entire curatorial standard.`,
    badge: 'AWESOME INFLATION',
  },
  {
    id: 'rt-frontend-01', tier: 'repo_type', repoTypes: ['frontend'],
    severity: 'critical',
    text: `4.7MB bundle. A hero section, a three-column grid, and a contact form. 847 packages in node_modules, 12 actually used. Every user downloads 4.7MB before they can read your headline. That's a choice you made, then deployed, and apparently never looked at again.`,
    badge: '4.7MB FOR A LANDING PAGE',
  },
  {
    id: 'rt-backend-01', tier: 'repo_type', repoTypes: ['backend'],
    severity: 'critical',
    text: `31 endpoints. 6 documented. The other 25 are discoverable only by reading the source or finding the right Slack message from 2021 from someone who no longer works here. Every developer integrating with this API is starting from zero because you documented 19% of what you built.`,
    badge: 'API SCAVENGER HUNT',
  },
  {
    id: 'rt-infra-01', tier: 'repo_type', repoTypes: ['config_infra'],
    severity: 'warning',
    text: `Dockerfile runs as root. Database passwords in plaintext in docker-compose.yml. AWS key sitting in the git history of a public repo. CI pushes directly to production on every merge. Each one of those is a separate decision that got made, reviewed, and merged. All of them.`,
    badge: 'PRODUCTION ROULETTE',
  },
  {
    id: 'rt-ml-01', tier: 'repo_type', repoTypes: ['ml_data'],
    severity: 'warning',
    text: `99.7% accuracy on the training set. 43% on production data. The README features 99.7% in the title, the description, and the badges. The 43% is mentioned nowhere. Everyone deciding whether to use this model is making that decision based on a number that has nothing to do with how it actually performs.`,
    badge: 'TRAINING SET CONFIDENCE',
  },

  // ══ TIER A+: DARK GARFIELD

  {
    id: 'gf-09', tier: 'garfield', repoTypes: ['generic'],
    severity: 'critical',
    text: `catch(e) {} — you caught the error, gave it two empty braces, and walked away. That error is failing silently in production right now. When users report that nothing works, there will be no log anywhere to explain why, because you made sure there wouldn't be. You built a black hole into your error handling and shipped it.`,
    badge: 'VOID DETECTED',
  },
  {
    id: 'gf-10', tier: 'garfield', repoTypes: ['generic'],
    severity: 'critical',
    text: `The API key is hardcoded in the source file and committed to version control. Not in .env. In the actual file. Anyone who has ever cloned or forked this repo has your key. GitHub's secret scanner flagged it. You're still looking at it right now. That key has been compromised since the first push.`,
    badge: 'CONGRATULATIONS',
  },
  {
    id: 'gf-11', tier: 'garfield', repoTypes: ['generic'],
    severity: 'warning',
    text: `This function calls itself recursively and I cannot find a clear base case after reading it four times. I cannot tell you with confidence that this doesn't infinitely recurse under certain inputs. Nobody maintaining this is going to be able to tell you either. You shipped logic you probably couldn't explain if someone asked you in a meeting.`,
    badge: 'GARFIELD GIVES UP',
  },

  // ══ TIER B+: DEV CULTURE DARK

  {
    id: 'dev-09', tier: 'dev_culture', repoTypes: ['generic'],
    severity: 'warning',
    text: `"Temporary fix — remove before release." That comment is 1,142 days old. The person who wrote it doesn't work here anymore. Their replacement doesn't know the comment exists. The fix is load-bearing now. Everyone working in this codebase is working around something nobody can explain and nobody can remove.`,
    badge: 'IMMORTAL WRONG',
  },
  {
    id: 'dev-10', tier: 'dev_culture', repoTypes: ['frontend', 'backend', 'generic'],
    severity: 'note',
    text: `lodash is a production dependency used exactly once to call lodash.get on a nested property. Optional chaining has done this natively since 2019 with no npm package required. Every user who loads this app downloads lodash so that one line of code doesn't have to use a question mark. That's in the bundle. That's shipped to everyone.`,
    badge: '4.2MB FOR A DOT',
  },

  // ══ TIER C+: CODE QUALITY DARK

  {
    id: 'code-09', tier: 'code_quality', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'critical',
    text: `Typed as any, passed through six functions. TypeScript is installed, configured, and has been manually defeated with @ts-ignore four separate times. You installed a type system and then fought it every time it tried to help you. Every bug TypeScript would have caught is now a runtime error waiting to happen in production.`,
    badge: 'TYPESCRIPT DEFEATED',
  },
  {
    id: 'code-10', tier: 'code_quality', repoTypes: ['frontend'],
    severity: 'warning',
    text: `z-index values in this stylesheet go from 1 to 99999. No system. Every number is a moment someone needed something on top of something else and couldn't figure out why it wasn't working. z-index: 99999 is not a decision. It's a record of someone losing a fight with their own CSS and choosing to escalate instead of understand.`,
    badge: 'Z-INDEX ARMS RACE',
  },

  // ══ TIER D+: REPO-TYPE SPECIFIC

  {
    id: 'rt-backend-02', tier: 'repo_type', repoTypes: ['backend'],
    severity: 'critical',
    text: `req.body.userId goes directly into a database query with no validation, no null check, no type check. The server crashes when someone sends a malformed request. Someone restarts it. Nobody adds validation. You can see this in the issue history. It has happened before. It will happen again.`,
    badge: 'NULL POINTER FAITH',
  },
  {
    id: 'rt-generic-01', tier: 'repo_type', repoTypes: ['generic'],
    severity: 'note',
    text: `One commit, 312 days ago: "initial commit." Nothing else. The README says "coming soon." Every person who finds this and thinks it might be useful reads that and leaves. That's every user this project has ever had. Coming soon for 312 days means it's not coming.`,
    badge: 'INITIAL COMMIT FOREVER',
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

export function selectJokes(
  repoUrl: string,
  repoType: RepoType,
  count = 3
): GarfieldJoke[] {
  const seed = hashRepo(repoUrl)

  const garfield   = JOKES_BANK.filter(j => j.tier === 'garfield')
  const devCulture = JOKES_BANK.filter(j => j.tier === 'dev_culture')
  const codeQual   = JOKES_BANK.filter(j => j.tier === 'code_quality')
  const repoSpec   = JOKES_BANK.filter(j =>
    j.tier === 'repo_type' && j.repoTypes.includes(repoType)
  )

  const result: GarfieldJoke[] = []

  result.push(garfield[(seed * 7) % garfield.length])

  if (repoSpec.length > 0) {
    result.push(repoSpec[(seed * 3) % repoSpec.length])
  }

  const pool = [...devCulture, ...codeQual].filter(j => !result.includes(j))
  while (result.length < count && pool.length > 0) {
    const idx = (seed * (result.length + 1) * 2654435761) % pool.length
    result.push(pool.splice(idx | 0, 1)[0])
  }

  return result
}

// ─── CAPTION SYSTEM ───────────────────────────────────────────────────────────

export interface CaptionSet {
  main: string
  challenge: string
  humble: string
  lore: string
}

export function generateCaptions(
  repoPath: string,
  score: number,
  verdict: string,
  mode: string
): CaptionSet {
  const site = 'garfieldroast.site'
  const repoName = repoPath.split('/')[1] || repoPath

  const destruction = score <= 3
    ? 'absolutely demolished' : score <= 5
    ? 'professionally humiliated' : score <= 7
    ? 'mildly judged and found wanting' : 'reluctantly respected (barely)'

  const garfieldLines = [
    `Garfield reviewed this repo and immediately went back to sleep. ${score}/10.`,
    `Garfield has seen worse. He had to think about it for a while though. ${score}/10.`,
    `Even Garfield's worst Monday was better than this codebase. ${score}/10.`,
    `Garfield rates it below lasagna, above Odie. Barely. ${score}/10.`,
    `Garfield looked at this and immediately asked Jon for emotional support. ${score}/10.`,
  ]
  const gfLine = garfieldLines[hashRepo(repoPath) % garfieldLines.length]

  return {
    main: `got ${destruction} by an AI cat 💀 ${score}/10\n\nGarfield reviewed ${repoName} and this repo didn't make it out alive.\n\n"${verdict.slice(0, 100)}"\n\n→ ${site} #GarfieldRoast`,

    challenge: `challenge: what score does your repo get? 🔥\n\nthis repo got ${score}/10 from Garfield and it was not pretty\n\nroast your own → ${site}\n\n#GarfieldRoast #CodeRoast`,

    humble: `I let an AI cat read all my code and now I understand what regret truly is\n\n${score}/10. that's it. ${score} out of 10. Garfield has spoken.\n\n${site} #GarfieldRoast`,

    lore: `${gfLine}\n\n${site}`,
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

  const bankCount = mode === 'gentle' ? 1 : mode === 'snarky' ? 2 : 3
  const jokes = selectJokes(repoUrl, repoType, bankCount)

  const bankItems = jokes.map(j => ({
    file: null,
    text: j.text,
    severity: j.severity,
    badge: j.badge,
    isBank: true,
  }))

  const badgeMap = {
    savage:  { critical: '💀 DESTROYED', warning: '🔥 BURNED', note: '😒 NOTED' },
    snarky:  { critical: '🎯 SPOTTED',   warning: '⚡ CAUGHT',  note: '👁 SEEN'  },
    gentle:  { critical: '📌 FLAGGED',   warning: '📌 FLAGGED', note: '📝 NOTE'  },
  }
  const badges = badgeMap[mode] ?? badgeMap.savage

  const claudeItems = claude.findings.map(f => ({
    file: f.file,
    text: f.text,
    severity: f.severity,
    badge: badges[f.severity as 'critical' | 'warning' | 'note'] ?? badges.note,
    isBank: false,
  }))

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
    captionOptions: [
      { label: '🔥 Standard', text: captions.main },
      { label: '⚔️ Challenge', text: captions.challenge },
      { label: '😭 Humble',   text: captions.humble },
      { label: '🐱 Garfield Lore', text: captions.lore },
    ],
  }
}

// ─── REDUCED CLAUDE PROMPT ────────────────────────────────────────────────────

export function buildClaudePrompt(
  mode: string,
  repoPath: string,
  repoType: RepoType
): string {
  const tone = {
    savage: 'brutal and rude — curse words allowed (hell, damn, crap, ass, wtf) — mock the developer like a senior dev who is personally offended',
    snarky: 'cold contempt and light profanity — dripping with disbelief that this code exists',
    gentle: 'blunt and direct, no sugarcoating, still no advice'
  }[mode] ?? 'brutal and rude — curse words allowed (hell, damn, crap, ass, wtf) — mock the developer like a senior dev who is personally offended'

  const typeHint = {
    markdown_collection: 'This is a curated list/documentation repo with mostly Markdown files and minimal source code.',
    frontend:  'This is a frontend repo. Look for bundle bloat, component size, accessibility issues, CSS chaos.',
    backend:   'This is a backend repo. Look for error handling, security patterns, API design, missing tests.',
    ml_data:   'This is an ML/data repo. Look for data leakage, overfit signals, undocumented notebooks.',
    config_infra: 'This is infra/config. Look for hardcoded secrets, dangerous permissions, missing health checks.',
    generic:   'Look for naming conventions, architecture, error handling, test coverage.'
  }[repoType]

  return `You are Garfield the cat — mean, lazy, done with this crap. Review this GitHub repo in FIRST PERSON as Garfield. Pure roasting only. No advice. Tone: ${tone}.

REPO CONTEXT: ${typeHint}

FORMULA: NAME the exact file+function/variable → call out the decision with contempt and mild profanity → end with more mockery or dead silence. NO fix. NO suggestion. Ever.
Write like a senior dev who is genuinely pissed off reading this. Short sentences. Personal. Rude. Direct.

EXAMPLES:
- "data2 in processData(), utils.js. You named a variable data2. Not as a placeholder, not temporarily. You looked at that name, decided it was fine, and committed it. That's your username in the git log next to data2. Anyone who maintains this has to guess what data2 means because you didn't think it was worth explaining."
- "catch(e) {} in handler.ts. You caught the error and did nothing. Not a log, not a rethrow, nothing. When something breaks in production there will be no trace anywhere because you made sure there wouldn't be. Every silent failure in this app traces back to a catch block you wrote and walked away from."
- "MODEL hardcoded in route.ts line 7. Not in env. In the file. When this breaks at 2am — and it will — everyone in the incident channel is going to see that line and know exactly whose decision that was."
- "84 lines of dead code in helpers.js. Not commented out. Not in a branch. Just sitting there. You knew it was dead. You left it anyway. Every dev who opens this file has to read through your garbage to find what they actually need."
- "The README has said 'coming soon' for 14 months. Nobody who cloned this can run it without asking you directly. You made yourself the only documentation and then stopped being available."

BANNED: 'you should', 'consider', 'fix this', 'use X instead', 'for maintainability', 'should be centralized', any imperative advice, clever metaphors, comedy-bit endings

Respond ONLY in valid JSON (no fence):
{"score":<1-10>,"verdict":"<one brutal Garfield sentence naming a specific file/function>","findings":[{"file":"<filename>","text":"<pure roast, 2-3 sentences, no advice, end on a punchline>","severity":"critical|warning|note"}]}

- findings: min 3, max 5. No two findings start with same word.
- Savage 1-5 | Snarky 2-6 | Gentle 4-8
- Secrets found: severity=critical, first finding`
}
