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

  // ══ GARFIELD +9 (gf-12 → gf-20)

  {
    id: 'gf-12', tier: 'garfield', repoTypes: ['generic'],
    severity: 'critical',
    text: `This function is 300 lines long with zero comments. Every developer who opens it has to read all 300 lines before they can understand what it does or safely change anything. You wrote 300 lines and left no explanation. That's not code, that's a hostage situation for whoever comes next.`,
    badge: 'HOSTAGE FUNCTION',
  },
  {
    id: 'gf-13', tier: 'garfield', repoTypes: ['generic'],
    severity: 'warning',
    text: `This codebase has 23 files named some variation of utils, helpers, misc, or common. None of them have a clear scope. Everything without an obvious home got thrown into one of these. Every developer who joins spends their first week just figuring out where things live.`,
    badge: 'MISC GRAVEYARD',
  },
  {
    id: 'gf-14', tier: 'garfield', repoTypes: ['generic'],
    severity: 'note',
    text: `Last commit was 8 months ago. 14 open issues, 3 labeled urgent. PRs sitting unreviewed for 6 months. This repo is not maintained — it's just not deleted yet. Anyone relying on this in production is on their own and doesn't know it.`,
    badge: 'ABANDONED BUT ALIVE',
  },
  {
    id: 'gf-15', tier: 'garfield', repoTypes: ['generic'],
    severity: 'critical',
    text: `There are 6 different ways to do the same thing in this codebase and all 6 are in active use simultaneously. Every new developer picks one at random. The codebase is drifting in 6 directions with no indication of which one is right. Nobody will ever pick a direction because that would require admitting the other 5 exist.`,
    badge: 'SIX WAYS TO FAIL',
  },
  {
    id: 'gf-16', tier: 'garfield', repoTypes: ['generic'],
    severity: 'note',
    text: `Every function here has a comment that just restates the function name. // gets the user — getUser(). // saves the data — saveData(). The comments add nothing. Someone spent time writing them. Every developer who reads them spends time reading them. All of that time produced zero information.`,
    badge: 'COMMENT THEATER',
  },
  {
    id: 'gf-17', tier: 'garfield', repoTypes: ['generic'],
    severity: 'warning',
    text: `Every error in this app surfaces as "something went wrong." Not which thing. Not where. Not why. Every time a user hits an error they get the same message regardless of what broke. Nobody who uses this app can ever tell you what actually went wrong because you made sure they couldn't.`,
    badge: 'SOMETHING WENT WRONG',
  },
  {
    id: 'gf-18', tier: 'garfield', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'critical',
    text: `Global variables being mutated from 6 different places. State that should be scoped is living at the top level. When a bug appears nobody knows which of the 6 mutation points caused it. You built a system where the source of truth is "wherever it was last touched."`,
    badge: 'GLOBAL MUTATION PARTY',
  },
  {
    id: 'gf-19', tier: 'garfield', repoTypes: ['generic'],
    severity: 'warning',
    text: `The project structure has folders called src, source, app, lib, utils, helpers, common, shared, and misc. Nine folders for code that should have a clear home. Nobody joining this project can predict where anything lives. Every search is a full-repo grep because the structure tells you nothing.`,
    badge: 'NINE FOLDERS OF CHAOS',
  },
  {
    id: 'gf-20', tier: 'garfield', repoTypes: ['generic'],
    severity: 'critical',
    text: `The entire auth logic is in a single 500-line middleware file imported everywhere and understood by nobody. Four comments say "don't touch this." No explanation of why. Everyone working here has silently agreed not to ask questions about this file. That agreement is your documentation.`,
    badge: 'DO NOT TOUCH',
  },

  // ══ DEV CULTURE +10 (dev-11 → dev-20)

  {
    id: 'dev-11', tier: 'dev_culture', repoTypes: ['generic'],
    severity: 'critical',
    text: `The PR that introduced this was titled "quick fix." The diff was 847 lines. "Quick fix" is what you label something when you know it should have been reviewed properly but you needed it merged fast. It got merged. That's what's running in production now.`,
    badge: 'QUICK FIX (847 LINES)',
  },
  {
    id: 'dev-12', tier: 'dev_culture', repoTypes: ['generic'],
    severity: 'warning',
    text: `34 commented-out blocks of code, dated from 2019 to 2024. Not removed. Commented out. Every developer who reads through this has to figure out if the commented code is a backup, a reference, or waiting to be uncommented. You couldn't decide, so everyone after you inherits the indecision.`,
    badge: 'COMMENTED CEMETERY',
  },
  {
    id: 'dev-13', tier: 'dev_culture', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'critical',
    text: `The code review on the PR that introduced this bug had one comment: "LGTM." The PR was 400 lines. Nothing in a 400-line PR gets reviewed with one comment. LGTM is not a review. LGTM is what you write when you want something merged and you haven't read it.`,
    badge: 'LGTM (400 LINES)',
  },
  {
    id: 'dev-14', tier: 'dev_culture', repoTypes: ['generic'],
    severity: 'note',
    text: `8 issues labeled "good first issue" have been open for over a year. New contributors opened 4 of them, asked clarifying questions, got no response, and left. You posted "good first issue" and then abandoned everyone who tried. The label is still there inviting more people to be ignored.`,
    badge: 'GOOD FIRST GHOST',
  },
  {
    id: 'dev-15', tier: 'dev_culture', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'warning',
    text: `The deployment process is documented as: run the script, check if it worked, if not — ask Dave. Dave left the company in March. Step 3 is currently "ask around and hope someone knows." That's the entire disaster recovery plan for this service.`,
    badge: 'ASK DAVE',
  },
  {
    id: 'dev-16', tier: 'dev_culture', repoTypes: ['generic'],
    severity: 'critical',
    text: `12 consecutive commits with the message "fix." Not "fix X," not "fix issue #123." Just "fix." When something breaks and someone goes to git blame, they'll find 12 commits that say nothing. Every one of those commits is a moment you chose not to explain what you did.`,
    badge: 'FIX FIX FIX FIX',
  },
  {
    id: 'dev-17', tier: 'dev_culture', repoTypes: ['backend', 'generic'],
    severity: 'warning',
    text: `Staging was last synced with production 4 months ago. Every test run on staging is testing against config and data that no longer matches what's live. Staging isn't a test environment. It's a historical artifact everyone pretends is still relevant.`,
    badge: 'STAGING FICTION',
  },
  {
    id: 'dev-18', tier: 'dev_culture', repoTypes: ['frontend', 'backend', 'generic'],
    severity: 'note',
    text: `6 different date formatting functions across this codebase, written separately, with slightly different behavior. Nobody knows which one is canonical. New code picks one at random. The date formatting is inconsistent across the UI and has been since the second developer joined.`,
    badge: 'SIX DATE FORMATS',
  },
  {
    id: 'dev-19', tier: 'dev_culture', repoTypes: ['generic'],
    severity: 'critical',
    text: `The on-call runbook says "see internal wiki for details" for every incident type. The internal wiki link is a 404. It has been a 404 for 6 months. When something breaks at 2am, the runbook sends the on-call engineer to a dead link. That's the emergency response plan you shipped.`,
    badge: 'RUNBOOK 404',
  },
  {
    id: 'dev-20', tier: 'dev_culture', repoTypes: ['generic'],
    severity: 'warning',
    text: `The tests folder has one file: placeholder.test.js. One test: it('should work', () => { expect(true).toBe(true) }). It always passes. It is completely meaningless. Someone created a test folder, wrote a test that can never fail, checked the CI box, and moved on. The pipeline shows green.`,
    badge: 'TESTS (1, MEANINGLESS)',
  },

  // ══ CODE QUALITY +10 (code-11 → code-20)

  {
    id: 'code-11', tier: 'code_quality', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'critical',
    text: `No input validation anywhere in this API. Every field from a request goes directly into business logic — no type checking, no length limits, no sanitization. This isn't an API. It's a direct line into your application logic for anyone who knows the endpoint.`,
    badge: 'UNVALIDATED EVERYTHING',
  },
  {
    id: 'code-12', tier: 'code_quality', repoTypes: ['frontend', 'backend', 'generic'],
    severity: 'warning',
    text: `Every API call catches errors and sets a variable to true. Not to the error message. Not to the error code. Just true. When something fails, the UI knows something failed and cannot tell the user what, why, or what to do. You built an error handler that destroys the error.`,
    badge: 'ERROR = TRUE',
  },
  {
    id: 'code-13', tier: 'code_quality', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'critical',
    text: `Database query inside a for loop. One query per item. 200 items means 200 sequential queries on every page load. Everyone who uses this app waits for 200 database round trips before they see anything. Nobody measured this before shipping it.`,
    badge: 'N+1 SHIPPED',
  },
  {
    id: 'code-14', tier: 'code_quality', repoTypes: ['generic'],
    severity: 'warning',
    text: `11 different functions that check if a user is authenticated, written separately, with different logic. Some check session. Some check JWT. Some check neither in certain edge cases. Nobody knows which one is correct. All 11 are in active use. The authentication is a lottery.`,
    badge: 'AUTH LOTTERY',
  },
  {
    id: 'code-15', tier: 'code_quality', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'note',
    text: `The constants file is 847 lines, imports from 12 other files, and 3 of those are circular. It's imported by everything. Changing one constant triggers a cascade of re-imports across the entire codebase. You built a dependency that everything depends on and then made it a circular mess.`,
    badge: 'CIRCULAR CONSTANTS',
  },
  {
    id: 'code-16', tier: 'code_quality', repoTypes: ['frontend'],
    severity: 'warning',
    text: `The component re-renders on every keystroke and fires an API call on every render. Typing a 10-character search sends 10 API calls. Nobody measured this. Nobody set up debouncing. Every user is funding 10x the necessary API calls and waiting for responses that are immediately discarded.`,
    badge: 'KEYSTROKE API FLOOD',
  },
  {
    id: 'code-17', tier: 'code_quality', repoTypes: ['backend', 'generic'],
    severity: 'critical',
    text: `SQL queries built with string concatenation. User input goes directly into the string. This is textbook SQL injection. This has been a known vulnerability since 1998. Parameterized queries exist and have existed for decades. You chose string concatenation anyway.`,
    badge: 'SQL INJECTION OPEN',
  },
  {
    id: 'code-18', tier: 'code_quality', repoTypes: ['generic'],
    severity: 'warning',
    text: `200+ lines of dead code in this file, some commented out, some just unreachable. None of it removed. Every developer who opens this file reads through 200 lines that do nothing before finding what they came for. You had the chance to delete it. You kept it.`,
    badge: '200 LINES OF NOTHING',
  },
  {
    id: 'code-19', tier: 'code_quality', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'note',
    text: `index.js is 1,200 lines. Every feature, helper, config, and handler lives in one file. Adding anything to this project means opening 1,200 lines, finding the right place, and hoping you don't break something adjacent. You have one file where there should be twenty.`,
    badge: '1200-LINE INDEX',
  },
  {
    id: 'code-20', tier: 'code_quality', repoTypes: ['backend', 'generic'],
    severity: 'critical',
    text: `Passwords stored in plaintext in the database. Not hashed, not salted. Plaintext. Anyone with read access to the users table has every user's password. If this database leaks — and databases leak — every password is immediately readable. This is not a nuance or an edge case. This is a fundamental failure.`,
    badge: 'PLAINTEXT PASSWORDS',
  },

  // ══ REPO TYPE: FRONTEND +7 (rt-frontend-02 → rt-frontend-08)

  {
    id: 'rt-frontend-02', tier: 'repo_type', repoTypes: ['frontend'],
    severity: 'warning',
    text: `Inline styles on 47 different components as the primary styling method. There's a CSS file that's mostly empty. The styling is scattered across JSX as inline objects that can't be overridden, can't be themed, can't be searched. Every UI change is a hunt through component files.`,
    badge: 'INLINE STYLE SPRAWL',
  },
  {
    id: 'rt-frontend-03', tier: 'repo_type', repoTypes: ['frontend'],
    severity: 'critical',
    text: `Everything is stored in one top-level useState. Every state change triggers a full re-render of every component on the page. Someone went out of their way to avoid any state management pattern and built a setup where a checkbox triggers a full-app re-render. Nobody profiled this before shipping.`,
    badge: 'ONE STATE TO RULE ALL',
  },
  {
    id: 'rt-frontend-04', tier: 'repo_type', repoTypes: ['frontend'],
    severity: 'note',
    text: `No alt text. No form labels. No focus states. Screen readers can't navigate this app. Keyboard users can't use it. This wasn't an oversight — these were just never built. That's a real decision that affects real users every day this ships without them.`,
    badge: 'ACCESSIBILITY ZERO',
  },
  {
    id: 'rt-frontend-05', tier: 'repo_type', repoTypes: ['frontend'],
    severity: 'warning',
    text: `14 API calls on initial load before rendering anything. Every user waits for all 14 to complete before they see content. On a slow connection that's 8+ seconds of blank screen. Nobody measured time to first contentful paint. The number 14 appeared gradually and nobody stopped to count.`,
    badge: '14 CALLS TO RENDER',
  },
  {
    id: 'rt-frontend-06', tier: 'repo_type', repoTypes: ['frontend'],
    severity: 'critical',
    text: `API keys hardcoded in frontend JavaScript. Not environment variables — actual strings in the shipped bundle. Anyone who opens DevTools can read them. Anyone who downloads the bundle has them. The keys have been public since the first deploy.`,
    badge: 'KEYS IN THE BUNDLE',
  },
  {
    id: 'rt-frontend-07', tier: 'repo_type', repoTypes: ['frontend'],
    severity: 'warning',
    text: `6 different button components written by 6 different developers who didn't check if one already existed. All 6 look slightly different. Users get 6 different hover states, 6 different click behaviors, 6 different loading states across the same app. The UI is not inconsistent by accident.`,
    badge: 'SIX BUTTONS',
  },
  {
    id: 'rt-frontend-08', tier: 'repo_type', repoTypes: ['frontend'],
    severity: 'note',
    text: `The mobile layout was last tested on a real device 2 years ago. Since then: 3 new features added, none checked on mobile. The responsive breakpoints handle screen widths no current device uses. Real users on real phones are seeing a layout nobody has looked at in 2 years.`,
    badge: 'MOBILE UNTESTED (2YR)',
  },

  // ══ REPO TYPE: BACKEND +6 (rt-backend-03 → rt-backend-08)

  {
    id: 'rt-backend-03', tier: 'repo_type', repoTypes: ['backend'],
    severity: 'critical',
    text: `No rate limiting on this API. Any client can make unlimited requests. No throttling, no backoff, no circuit breaker. Someone with a basic script can take this service down in minutes and it would be indistinguishable from a traffic spike. There's no way to tell the difference because nothing measures it.`,
    badge: 'NO RATE LIMIT',
  },
  {
    id: 'rt-backend-04', tier: 'repo_type', repoTypes: ['backend'],
    severity: 'warning',
    text: `Response times range from 80ms to 14 seconds depending on the code path. No timeouts, no slow query logging, no alerting on latency. Users occasionally wait 14 seconds and nobody knows because nothing is measuring it. The monitoring is users filing support tickets.`,
    badge: '14 SECOND RESPONSES',
  },
  {
    id: 'rt-backend-05', tier: 'repo_type', repoTypes: ['backend'],
    severity: 'note',
    text: `The API returns the full database row on every request — password hashes, internal IDs, admin flags, audit timestamps. The client receives data it didn't ask for and absolutely should not have. Every response is a data leak you designed into the API contract.`,
    badge: 'FULL ROW LEAK',
  },
  {
    id: 'rt-backend-06', tier: 'repo_type', repoTypes: ['backend'],
    severity: 'critical',
    text: `CORS is set to '*'. Every origin is allowed. Every request from every domain is accepted without verification. Any website on the internet can make authenticated requests to this API on behalf of your users. That's not an open API. That's no API security at all.`,
    badge: 'CORS WILDCARD',
  },
  {
    id: 'rt-backend-07', tier: 'repo_type', repoTypes: ['backend'],
    severity: 'warning',
    text: `No database indexes on the columns used in WHERE clauses. Every query does a full table scan. On a table with 100k rows this is slow. On a table with 1M rows this takes down the service. Nobody added indexes. Nobody measured query time before shipping this.`,
    badge: 'NO INDEXES',
  },
  {
    id: 'rt-backend-08', tier: 'repo_type', repoTypes: ['backend'],
    severity: 'critical',
    text: `No API versioning. Every breaking change is deployed directly to the current endpoint with no warning, no migration path, no deprecation notice. Clients discover breaking changes when they start getting 500 errors. That's how you told them something changed.`,
    badge: 'BREAKING CHANGES SILENT',
  },

  // ══ REPO TYPE: GENERIC +7 (rt-generic-02 → rt-generic-08)

  {
    id: 'rt-generic-02', tier: 'repo_type', repoTypes: ['generic'],
    severity: 'warning',
    text: `The license file says MIT. The README says "all rights reserved." These directly contradict each other. Anyone who used this under MIT is either safe or infringing and there's no way to know which. You published two conflicting legal terms and never noticed.`,
    badge: 'LICENSE CONTRADICTION',
  },
  {
    id: 'rt-generic-03', tier: 'repo_type', repoTypes: ['generic'],
    severity: 'critical',
    text: `Dependencies haven't been updated in 2 years. 14 known CVEs in the current dependency tree, 3 rated critical. They're visible in npm audit output. They've been there for months. Either nobody ran npm audit, or someone ran it and closed the terminal.`,
    badge: '14 KNOWN CVES',
  },
  {
    id: 'rt-generic-04', tier: 'repo_type', repoTypes: ['generic'],
    severity: 'note',
    text: `The changelog says "various improvements" for every release since 0.3.0. Not what improved. Not what changed. Not what broke. Anyone upgrading this dependency has no idea what changed between versions. They're upgrading blind and trusting that "various improvements" means nothing broke.`,
    badge: 'VARIOUS IMPROVEMENTS',
  },
  {
    id: 'rt-generic-05', tier: 'repo_type', repoTypes: ['generic'],
    severity: 'warning',
    text: `Three different config files for the same tool in the root directory with conflicting rules. Which one the linter uses depends on the version and the developer's local setup. The linting is inconsistent between machines. Two developers can have different linting results on the same file.`,
    badge: 'THREE CONFIGS, ONE TOOL',
  },
  {
    id: 'rt-generic-06', tier: 'repo_type', repoTypes: ['generic'],
    severity: 'critical',
    text: `The .gitignore doesn't include .env. The .env file has been committed 4 times. Real credentials are in the git history since the initial commit. Removing them from the working tree doesn't remove them from history. Those credentials are still there and always will be.`,
    badge: '.ENV IN HISTORY',
  },
  {
    id: 'rt-generic-07', tier: 'repo_type', repoTypes: ['generic'],
    severity: 'warning',
    text: `No contributing guide, no style guide, no PR template, no issue template. Every contributor does things differently. The codebase has 8 different indentation styles, 4 quote preferences, and 3 naming conventions, all in active use. The inconsistency compounds with every new contributor.`,
    badge: 'CONTRIBUTING: NOTHING',
  },
  {
    id: 'rt-generic-08', tier: 'repo_type', repoTypes: ['generic'],
    severity: 'note',
    text: `The project description says "blazing fast." The benchmark behind that claim was run on the author's machine with a 3-item dataset. No production benchmarks have been published. "Blazing fast" is a marketing claim with a 3-item proof. Everyone using this at scale is finding out what that means.`,
    badge: 'BLAZING FAST (3 ITEMS)',
  },

  // ══ REPO TYPE: CONFIG/INFRA +5 (rt-infra-02 → rt-infra-06)

  {
    id: 'rt-infra-02', tier: 'repo_type', repoTypes: ['config_infra'],
    severity: 'critical',
    text: `The production database backup runs daily. The last time a restore was tested: never. A backup that has never been tested is not a backup. It's a file that exists until the moment you need it, at which point you find out whether it was ever valid.`,
    badge: 'BACKUP NEVER TESTED',
  },
  {
    id: 'rt-infra-03', tier: 'repo_type', repoTypes: ['config_infra'],
    severity: 'warning',
    text: `Kubernetes resource limits all set to unlimited. In any resource contention scenario, one misbehaving pod can consume all available CPU and memory on the node, taking down every other service running there. No limits means no isolation. That's not a cluster, it's a shared failure domain.`,
    badge: 'UNLIMITED RESOURCES',
  },
  {
    id: 'rt-infra-04', tier: 'repo_type', repoTypes: ['config_infra'],
    severity: 'note',
    text: `3 different Terraform state files for the same infrastructure in 3 different locations, none referencing each other. Nobody is certain which one reflects the actual current state. Changes applied from the wrong state file will overwrite what's actually running in production.`,
    badge: 'THREE STATE FILES',
  },
  {
    id: 'rt-infra-05', tier: 'repo_type', repoTypes: ['config_infra'],
    severity: 'critical',
    text: `SSH port open to 0.0.0.0/0. Every IP address in the world can attempt to connect. The server logs show 40,000 failed login attempts in the last 24 hours. Nobody is monitoring this. Nobody has restricted access. The brute force attempts are ongoing right now as you read this.`,
    badge: 'SSH OPEN TO WORLD',
  },
  {
    id: 'rt-infra-06', tier: 'repo_type', repoTypes: ['config_infra'],
    severity: 'warning',
    text: `No health check on the load balancer. When a service goes down, traffic keeps routing to it. Users get connection errors until someone manually notices and removes the instance. The detection system for outages is users filing support tickets. That's the monitoring you shipped.`,
    badge: 'NO HEALTH CHECK',
  },

  // ══ REPO TYPE: ML/DATA +4 (rt-ml-02 → rt-ml-05)

  {
    id: 'rt-ml-02', tier: 'repo_type', repoTypes: ['ml_data'],
    severity: 'critical',
    text: `Train/test split happened after feature engineering on the full dataset. The model has seen information from the test set during training. The accuracy numbers are not real. The model will perform differently on unseen data and nobody measured what that performance actually is.`,
    badge: 'DATA LEAKAGE',
  },
  {
    id: 'rt-ml-03', tier: 'repo_type', repoTypes: ['ml_data'],
    severity: 'warning',
    text: `Model trained on 2020 data, running in production in 2025. No drift detection set up. Nobody has measured whether the training distribution still matches current inputs. The model is answering questions about a world that may no longer look like its training set.`,
    badge: 'MODEL DRIFT IGNORED',
  },
  {
    id: 'rt-ml-04', tier: 'repo_type', repoTypes: ['ml_data'],
    severity: 'note',
    text: `Feature names in the training code are x1 through x47. Not named after what they represent. The person who knows what x23 means left the company. The model makes 47-dimensional decisions and 44 of those dimensions are undocumented. Nobody maintaining this can explain what the model is actually using.`,
    badge: 'X1 THROUGH X47',
  },
  {
    id: 'rt-ml-05', tier: 'repo_type', repoTypes: ['ml_data'],
    severity: 'warning',
    text: `Model outputs in production are never logged. No record of what predictions were made, on what inputs, with what confidence. When the model produces a wrong answer there's nothing to debug it with. You have a model making real decisions with no audit trail.`,
    badge: 'NO PREDICTION LOG',
  },

  // ══ REPO TYPE: MARKDOWN +2 (rt-markdown-04 → rt-markdown-05)

  {
    id: 'rt-markdown-04', tier: 'repo_type', repoTypes: ['markdown_collection'],
    severity: 'warning',
    text: `47% of the links in this repo return 404 or redirect to a domain that no longer hosts the original content. The CI pipeline checking this has been failing silently for 3 months. The list is curated the same way any garbage pile grows: things get added, nothing gets removed.`,
    badge: '47% DEAD LINKS',
  },
  {
    id: 'rt-markdown-05', tier: 'repo_type', repoTypes: ['markdown_collection'],
    severity: 'note',
    text: `Last meaningfully updated 2 years ago. Libraries listed have been deprecated. Tools have been superseded. Three of the listed repos have been archived by their authors. The list is still described as "actively maintained." Anyone using this as a reference is working from stale information they were told was current.`,
    badge: 'ACTIVELY STALE',
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
