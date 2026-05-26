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
    text: `Garfield has a life philosophy: do as little as possible, do it slowly, and do it surrounded by lasagna. This codebase has adopted the exact same philosophy — minimum effort, maximum presence, zero nutritional value. The difference is that Garfield's laziness is charming because it's intentional and self-aware. This codebase is lazy the way a car is lazy when its engine has fallen out. It's not a philosophy. It's a crime scene.`,
    badge: 'GARFIELD PHILOSOPHY',
  },
  {
    id: 'gf-02', tier: 'garfield', repoTypes: ['generic'],
    severity: 'critical',
    text: `Garfield has spent 40+ years hating Mondays with a passion that borders on spiritual. He has written poems about it. He has stared into the void of Monday mornings and found them staring back. And yet — after reviewing this repository — he has upgraded his feelings. Mondays are now tolerable. Mondays are now fine. Mondays are now a pleasant alternative to the experience of reading this codebase. You have achieved something remarkable: you made Garfield miss Mondays.`,
    badge: 'WORSE THAN MONDAY',
  },
  {
    id: 'gf-03', tier: 'garfield', repoTypes: ['generic'],
    severity: 'warning',
    text: `Garfield's diet has been "lasagna and contempt" for four decades. Veterinarians have expressed concern. Nutritionists have written papers. Jon has cried. Garfield has not adjusted. After reviewing this codebase, he is adding a third item to his diet: existential dread at the state of the software industry. It pairs well with Monday mornings and poorly-named functions. The caloric content is negative. The psychological damage is incalculable. He will not recover.`,
    badge: 'CONTEMPT ENHANCED',
  },
  {
    id: 'gf-04', tier: 'garfield', repoTypes: ['generic'],
    severity: 'note',
    text: `Odie once ran directly into a wall at full speed. Nose-first. Eyes wide open. He saw the wall. He continued toward the wall. He hit the wall. He got up, tail wagging, and immediately moved toward the wall again with the same energy. This was universally considered to be one of the dumbest things anyone had ever witnessed. Garfield watched it 14 times. Garfield has now read this codebase. He would like to formally apologize to Odie. Odie was, in fact, learning. This codebase has run into the same wall in every single commit since the beginning of time, and the git log suggests it considers this normal.`,
    badge: 'ODIE > CODEBASE',
  },
  {
    id: 'gf-05', tier: 'garfield', repoTypes: ['generic'],
    severity: 'critical',
    text: `Jon once suggested that Garfield should write a journal. Garfield wrote one entry: "Monday. Hated it." He then closed the journal and went back to sleep. It remains the most efficient documentation of all time — one sentence, maximum information density, total emotional clarity. This README, by contrast, is eleven paragraphs long and contains less useful information than Garfield's single journal entry. "Getting started: see below. Installation: coming soon. Usage: refer to source." This is not documentation. This is a handshake with someone who has already left the building.`,
    badge: 'WORSE THAN ONE JOURNAL ENTRY',
  },
  {
    id: 'gf-06', tier: 'garfield', repoTypes: ['generic'],
    severity: 'warning',
    text: `Garfield has, in his lifetime, consumed enough lasagna to feed a small village for several years. He has no regrets. He has also, through this consumption, developed what can only be described as a spiritual relationship with quality. He knows good lasagna. He knows bad lasagna. He has opinions. His opinion on a codebase with zero test coverage is the same face he makes when Jon serves him plain rice and calls it dinner: a silence so heavy it has physical mass. A disappointment that radiates outward like a dying sun. If Jon's rice was a codebase, it would have better coverage than this.`,
    badge: 'DIET CAT FOOD ENERGY',
  },
  {
    id: 'gf-07', tier: 'garfield', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'critical',
    text: `In 1978, Garfield debuted in 41 newspapers. By 2026, he appears in 2,500 newspapers across 111 countries in 41 languages. That is measurable growth. That is compounding value. That is a work ethic disguised as laziness — every strip, every Monday, every Odie joke, shipped on time, without exception. In that same span of time, this codebase has shipped exactly zero unit tests. Not a single one. Not a describe block, not a test file with only imports, not even a test that passes by accident. Garfield has been more productive than your entire QA strategy. Garfield. The cat who naps professionally.`,
    badge: '0 TESTS SINCE 1978',
  },
  {
    id: 'gf-08', tier: 'garfield', repoTypes: ['generic'],
    severity: 'note',
    text: `Garfield once famously said: "I'm not overweight. I'm under-tall." This is the greatest piece of reframing ever committed to a comic strip. It is technically true. It is emotionally compelling. It redirects the conversation entirely. This repository README says: "This project is not unmaintained — it's in a stable state." That is Garfield logic. That is the exact same sentence structure applied to software abandonment. Garfield invented this technique. He uses it for personal dignity. Applying it to a git repository that hasn't had a commit in 14 months is a misuse of the technology he pioneered, and he wants credit.`,
    badge: 'GARFIELD LOGIC DETECTED',
  },

  // ══ TIER B: DEV CULTURE

  {
    id: 'dev-01', tier: 'dev_culture', repoTypes: ['generic'],
    severity: 'critical',
    text: `The first commit message was "initial commit." The second was "fix." The third was "fix 2." The fourth was "ok this time for real." The fifth was "PLEASE WORK." The sixth was "." — a single period, which is the commit message of a person who has stopped believing in language. The seventh was "wip" — a work-in-progress label applied to code that was shipped to production nine months ago and has not been touched since. Together these commit messages form the most tragic autobiography ever written. Nobody asked for it. It was written anyway.`,
    badge: 'COMMIT AUTOBIOGRAPHY',
  },
  {
    id: 'dev-02', tier: 'dev_culture', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'warning',
    text: `Scattered throughout this codebase like breadcrumbs left by a developer in crisis are the following console.log statements: "here", "HERE", "test", "test2", "test2222", "aaa", "aaaaaa", "ok", "ok wtf", "WHYYYY", "why does this keep happening", "im going insane" and one that says simply "no." These are not debugging statements. These are a timeline. This is what a developer sounds like at 2am when the code has stopped making sense and caffeine has stopped working and the only remaining tool is screaming into a terminal window. The logs were never removed. They are in production. Right now. Someone is reading them in a real environment wondering what "WHYYYY" means.`,
    badge: '2AM DEBUGGING EVIDENCE',
  },
  {
    id: 'dev-03', tier: 'dev_culture', repoTypes: ['generic'],
    severity: 'critical',
    text: `The README installation section says "coming soon." It has said "coming soon" for 14 months. In that time: three JavaScript frameworks have been released, deprecated, and ironically revived; two "revolutionary" state management libraries have been abandoned mid-hype cycle; one developer wrote an entire blog post about this specific README saying "coming soon" as an example of open source decay. The blog post has more documentation than the README. The blog post explains how to install the software better than the README. The blog post author has more stars on their GitHub than this project. This is the legacy of "coming soon."`,
    badge: 'COMING NEVER',
  },
  {
    id: 'dev-04', tier: 'dev_culture', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'warning',
    text: `The Stack Overflow answer used here was posted in 2013. It was answered by a user whose account no longer exists. The answer was marked as deprecated in 2016 with a comment that says "DO NOT USE IN PRODUCTION." The comment has 847 upvotes. The code was copy-pasted directly into this project in 2024, deprecation comment stripped, warning note removed, production flag ignored. It is now running in production. The original deprecated code is doing real work with real users. The 847 people who warned against this are, presumably, still warning against this, but somewhere else, where nobody can hear them.`,
    badge: 'VINTAGE STACK OVERFLOW',
  },
  {
    id: 'dev-05', tier: 'dev_culture', repoTypes: ['frontend', 'backend', 'generic'],
    severity: 'note',
    text: `package.json says version 1.0.0. It has always said version 1.0.0. Through 47 commits, 3 complete rewrites, 2 breaking API changes, a migration from one database to an entirely different one, and one incident described in the git log only as "the thing that happened in August" — through all of this, through every earthquake of technical change — version 1.0.0 has remained. Immovable. Unchanging. A monument to a developer who learned about semantic versioning once and found it inconvenient. Version 1.0.0 has witnessed more change than most software projects experience in their entire lifespan. It is immortal through sheer neglect.`,
    badge: 'ETERNAL VERSION 1.0.0',
  },
  {
    id: 'dev-06', tier: 'dev_culture', repoTypes: ['generic'],
    severity: 'critical',
    text: `The branches in this repository are named as follows: main, main-backup, main-old, main-new, main-new-final, main-new-final-v2, main-new-final-v2-PLEASE-USE-THIS, main-new-final-v2-PLEASE-USE-THIS-for-real, main-ACTUALLY-USE-THIS-ONE, and a branch simply called "the-real-one." Git was invented in 2005 specifically so that developers would not need to name files like Microsoft Word documents from 2003. The entire purpose of branching is to avoid the naming convention currently in use here. This is not version control. This is a filing cabinet that someone has tipped over and set on fire while shouting "I know where everything is."`,
    badge: 'BRANCH NAME CHAOS',
  },
  {
    id: 'dev-07', tier: 'dev_culture', repoTypes: ['backend', 'generic'],
    severity: 'warning',
    text: `The .env.example file contains 18 environment variables. Three of them have comments explaining what they are. The other 15 are mysteries: DATABASE_SECRET_KEY_PROD_V2, API_THING_TOKEN, ENABLE_THE_FEATURE, LEGACY_FLAG_DO_NOT_TOUCH, and PLEASE_LEAVE_THIS_AS_TRUE. New team members spend their first week trying to understand what ENABLE_THE_FEATURE enables. Senior developers shrug and say "just set it to true, it's always been true." Nobody knows what happens when it's false. Nobody will find out. PLEASE_LEAVE_THIS_AS_TRUE has never been set to false in any environment. This is how institutional knowledge dies: one undocumented environment variable at a time, passed down like a dark family secret.`,
    badge: 'ENV HAZING RITUAL',
  },
  {
    id: 'dev-08', tier: 'dev_culture', repoTypes: ['generic'],
    severity: 'note',
    text: `git blame reveals that the single most important function in this entire codebase — the one everything else depends on, the one that processes the core business logic, the one that if removed would collapse the entire system — was last touched by someone who left the company in 2022. Nobody fully understands it. When a new developer asks what it does, senior developers go quiet and say "it just works, don't touch it." It has three known bugs that everyone is aware of and nobody fixes because fixing them causes five different things to break. It is load-bearing technical debt. It will outlive the company. It will outlive all of them.`,
    badge: 'LEGACY HAUNTING',
  },

  // ══ TIER C: CODE QUALITY

  {
    id: 'code-01', tier: 'code_quality', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'critical',
    text: `The function is named processData. Its parameter is named data. Its return variable is named result. Its local variables are named temp, temp2, tempResult, and finalResult. This function contains more nouns than a grocery list and less information than a blank page. A developer reading this for the first time knows: (1) something is a process, (2) data is involved, (3) a result will emerge. They do not know what the data is, what "processing" means in this context, what the result represents, or why this function exists. Every variable name is a locked door with no key. The entire function is a riddle where the answer is "ask someone who has already quit."`,
    badge: 'CONTENT-FREE NAMING',
  },
  {
    id: 'code-02', tier: 'code_quality', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'critical',
    text: `The error handling in this codebase is: try { } catch(e) { } — the empty catch block. The error is caught, observed briefly, and released back into the wild, silent and free, carrying no information about what went wrong or why. Users experience failures with no error messages. Logs contain no stack traces. Monitoring shows nothing because nothing was logged. The application fails gracefully in the way a building "gracefully" collapses — the outside looks intact while the inside is structurally destroyed. Somewhere, in a production environment, an error is being swallowed right now. It has been swallowing errors for months. Nobody knows. The catch block ensures that nobody will ever know.`,
    badge: 'ENLIGHTENED ERROR HANDLING',
  },
  {
    id: 'code-03', tier: 'code_quality', repoTypes: ['frontend', 'generic'],
    severity: 'warning',
    text: `There is a ternary inside a ternary inside a ternary inside a ternary. It spans one line. That line is 214 characters long. It was committed with the message "simplify logic." The developer who wrote it genuinely believed this was simpler than the alternative. The alternative, based on git history, was a readable if-else block that took four lines. The four-line readable block was deleted and replaced with this 214-character single-line nested ternary chain that requires a decoder ring and a session with a therapist to parse. The commit message says "simplify." The code does not know what that word means.`,
    badge: 'RECURSIVE TERNARY',
  },
  {
    id: 'code-04', tier: 'code_quality', repoTypes: ['generic'],
    severity: 'warning',
    text: `The magic number 86400 appears 11 times in this codebase. Not once is it defined as a constant. Not once is it commented. Every occurrence is a standalone mystery integer that means nothing to anyone who does not already know that 86400 is the number of seconds in a day. Three of the 11 occurrences are actually wrong — they don't account for daylight saving time and will cause bugs twice a year, silently, in a timezone-dependent way that will be nearly impossible to reproduce in development. The developer who wrote 86400 eleven times instead of defining a constant once has created a bug that will manifest at 2am on a Sunday in March. In a country they may never have visited. Affecting users they will never meet.`,
    badge: 'MAGIC NUMBER ARCHAEOLOGY',
  },
  {
    id: 'code-05', tier: 'code_quality', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'critical',
    text: `There are 17 TODO comments in this codebase. The oldest is from 1,142 days ago and reads: "TODO: fix this — it's a temporary hack, remove before production." It is in production. It has been in production for longer than most entry-level developers stay at their first job. The hack has been promoted, renamed, and integrated so deeply into the system architecture that it is no longer possible to remove it without rebuilding three adjacent systems. It is no longer temporary. It is foundational. The word "temporary" in software engineering means "will outlive the person who wrote it," and this TODO comment is the living proof of that theorem.`,
    badge: 'PERMANENT TEMPORARY HACK',
  },
  {
    id: 'code-06', tier: 'code_quality', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'note',
    text: `The README proudly claims "comprehensive test coverage." The actual test coverage, measured empirically, is 4%. Garfield has attempted to reconcile these two facts and cannot. Four percent is not comprehensive in any language, framework, or definition of the word. Four percent is the coverage you get when someone writes a test for the main function and then goes to lunch and never comes back. Four percent means that 96% of this codebase exists in a quantum state where it both works and doesn't work until someone runs it in production and finds out. "Comprehensive" is doing more heavy lifting in this README than the entire test suite combined.`,
    badge: '"COMPREHENSIVE" = 4%',
  },
  {
    id: 'code-07', tier: 'code_quality', repoTypes: ['frontend', 'backend', 'generic'],
    severity: 'warning',
    text: `A component file is 847 lines long. It is named Button.tsx. It renders a button. Somewhere between line 1 and line 847, this button acquired: a complete authentication flow, two separate API call handlers, a date formatting utility, a recursive memoization strategy, what appears to be a partial reimplementation of Redux written from scratch with the variables renamed, and a comment that says "TODO: split this into smaller components" dated 8 months ago. The button still renders. The button works. The button has grown so large and complex that it has become sentient and is now making architectural decisions for the rest of the application. Garfield respects its resilience. He does not respect its boundaries.`,
    badge: 'BUTTON WITH AMBITIONS',
  },
  {
    id: 'code-08', tier: 'code_quality', repoTypes: ['ml_data', 'generic'],
    severity: 'warning',
    text: `The Jupyter notebook has 112 cells. Cells 1 through 52 are for "data loading," a process that apparently requires 52 discrete steps and produces 34 warning messages that are all suppressed with filterwarnings('ignore'). Cell 53 is titled "Initial Exploration" and contains a single scatterplot with no axis labels, rendered three times with different color schemes. Cells 54 through 111 are variations of the same histogram with incrementally adjusted bin sizes. Cell 112 is titled "FINAL ANALYSIS - USE THIS ONE" and was added six months after everything else. Garfield has eaten lasagna with more analytical rigor than this notebook. The lasagna had better-defined variables.`,
    badge: 'NOTEBOOK ARCHAEOLOGY',
  },

  // ══ TIER D: REPO-TYPE SPECIFIC

  {
    id: 'rt-markdown-01', tier: 'repo_type', repoTypes: ['markdown_collection'],
    severity: 'critical',
    text: `This repository contains no code. It is a single markdown file with hyperlinks in it. It has been starred by thousands of developers who apparently consider a curated list of URLs to be equivalent in value to actual software. Garfield has spent considerable time staring at this situation. The repository has more stars than many fully-functioning applications. The repository requires no build step, no runtime environment, no tests, and no maintenance beyond "verify links are still valid." It is a text file that became famous. Garfield is reconsidering every career decision he has ever made, which is impressive because he has never had a career.`,
    badge: 'NOT CODE BUT STARRED',
  },
  {
    id: 'rt-markdown-02', tier: 'repo_type', repoTypes: ['markdown_collection'],
    severity: 'warning',
    text: `The CI/CD pipeline for this repository does the following: validates that each link in the markdown file resolves to a working URL. That is the entire pipeline. GitHub Actions runs on every pull request to verify that the submitted links are real links. The pipeline took engineering hours to write. It runs on cloud infrastructure. It costs money per invocation. It is protecting a markdown file from broken hyperlinks with the same infrastructure that other teams use to deploy distributed systems to multiple availability zones. The cost per unit of value protected here is immeasurable. Garfield has stared at the GitHub Actions tab for 40 minutes. He still doesn't know how to feel.`,
    badge: 'CI FOR A MARKDOWN FILE',
  },
  {
    id: 'rt-markdown-03', tier: 'repo_type', repoTypes: ['markdown_collection'],
    severity: 'note',
    text: `Section: "Awesome Resources." Section: "More Awesome Resources." Section: "Even More Awesome Resources." Section: "Additional Awesome Resources You Should Know About." Section: "Resources That Are Also Quite Awesome." The word "awesome" appears 47 times in this document. "Awesome" originally meant "inspiring awe." It now means "a link exists and someone thought it was worth adding." Garfield has experienced actual awe exactly twice in his life: once when he saw a lasagna the size of a small building, and once when he read a particularly well-structured function. He does not experience awe at markdown section headers. He experiences a profound tiredness that he suspects is philosophical in nature.`,
    badge: 'AWESOME INFLATION',
  },
  {
    id: 'rt-frontend-01', tier: 'repo_type', repoTypes: ['frontend'],
    severity: 'critical',
    text: `The production bundle is 4.7MB. The application, in its entirety, renders a landing page with a hero section, a three-column feature grid, and a contact form with four fields. This is the digital equivalent of hiring a moving truck to transport a single houseplant. The node_modules folder contains 847 packages, of which the application directly uses 12. The remaining 835 packages are the dependencies of dependencies of dependencies, an infinite regression of software that exists to support software that supports software, all of it compiled into a 4.7MB monument to the npm ecosystem's complete absence of restraint. Garfield weighs more than he should. He owns this. He is not packaging lodash to center a div.`,
    badge: '4.7MB FOR A LANDING PAGE',
  },
  {
    id: 'rt-backend-01', tier: 'repo_type', repoTypes: ['backend'],
    severity: 'critical',
    text: `The API has 31 endpoints. Six are documented. The remaining 25 are discoverable through a combination of reading the source code, running the server locally, making requests until something doesn't return a 404, and consulting a Slack message from 2021 where someone who no longer works here explains what POST /api/v1/process/run/execute/do does. This is not an API. This is an archaeological dig disguised as a web service. The API contract is oral tradition, passed from senior developer to junior developer through whispered explanations and screenshots of Postman collections. The documentation says "see code for details." The code says nothing.`,
    badge: 'API SCAVENGER HUNT',
  },
  {
    id: 'rt-infra-01', tier: 'repo_type', repoTypes: ['config_infra'],
    severity: 'warning',
    text: `The Dockerfile runs as root. The docker-compose.yml has database passwords in plaintext. The CI pipeline pushes directly to production on every merge to main with no staging environment, no smoke tests, and no rollback procedure. The Kubernetes YAML files have resource limits set to "unlimited" because someone said "we'll optimize later" in 2022 and later has not arrived. There is a secret in the repository called AWS_SECRET_KEY_DO_NOT_COMMIT that was committed, pushed to GitHub, and has been sitting in the public repository's git history for eight months. Garfield has audited nuclear facilities with better security posture. And he is a cat who doesn't know what a nuclear facility is.`,
    badge: 'PRODUCTION ROULETTE',
  },
  {
    id: 'rt-ml-01', tier: 'repo_type', repoTypes: ['ml_data'],
    severity: 'warning',
    text: `The model achieves 99.7% accuracy on the training set. On the held-out test set: 61%. On production data collected after deployment: 43%. The README features the 99.7% number in the title, the description, the badges, and the first paragraph. The 61% and 43% numbers appear nowhere in the repository, the paper, the blog post, or the conference talk given about this model. Garfield has consumed lasagna that looked significantly better than it tasted. He recognizes this pattern with the instinct of someone who has been disappointed by packaging before. The packaging is exceptional. The contents are a different conversation entirely.`,
    badge: 'TRAINING SET CONFIDENCE',
  },

  // ══ TIER A+: DARK / EXISTENTIAL GARFIELD

  {
    id: 'gf-09', tier: 'garfield', repoTypes: ['generic'],
    severity: 'critical',
    text: `I have stared into many voids. I stare into the void every Monday. I stare into it when Jon serves diet cat food and calls it dinner. I stare into it at 3am when Odie breathes too loudly. But none of those voids have stared back at me with the specific flavor of emptiness I found inside this catch block: catch(e) {}. Two braces. No body. No log. No rethrow. The developer saw an error, acknowledged its existence, gave it two empty walls as a home, and walked away. That error is still free. It is failing silently in production right now. It has been failing silently for months. It will continue to fail silently until someone, somewhere, opens a support ticket and asks why nothing works. Write console.error(e). I should not have to explain this to a person who owns a keyboard.`,
    badge: 'VOID DETECTED',
  },
  {
    id: 'gf-10', tier: 'garfield', repoTypes: ['generic'],
    severity: 'critical',
    text: `Congratulations on hardcoding the API key directly into the source file and committing it to version control. Truly. A bold choice. Most developers — burdened by the inconvenience of thinking more than 30 seconds ahead — would have put it in a .env file, a technology that has existed since approximately the Jurassic period of software development. But not here. Here the key sits in the code. Aging. Exposed. Readable by anyone who has ever heard of GitHub. A future security researcher will find this commit and they will screenshot it and they will not be kind about what they say. It takes eleven characters to type process.env.API_KEY. I counted. You have no excuse. Move it.`,
    badge: 'CONGRATULATIONS',
  },
  {
    id: 'gf-11', tier: 'garfield', repoTypes: ['generic'],
    severity: 'warning',
    text: `I fell asleep reading this function. I am not exaggerating for comic effect — I made it to line 31, where the function calls itself recursively for reasons that the code does not explain and the comments do not address, and I lost consciousness. I dreamed about the function. In the dream it had documentation. In the dream there was a base case. In the dream the developer had drawn a diagram before writing this. I woke up. The function was still there. I read it again. It still doesn't have a base case that I can find with confidence. I went back to sleep. I am writing this review from a state of partial unconsciousness and my recommendation is: document the recursion, add the base case explicitly, and explain why this function exists. Do it for whoever reads this after me. Do it because I cannot.`,
    badge: 'GARFIELD GIVES UP',
  },

  // ══ TIER B+: DEV CULTURE DARK

  {
    id: 'dev-09', tier: 'dev_culture', repoTypes: ['generic'],
    severity: 'warning',
    text: `There is a comment on line 47 that reads "temporary fix — remove before release." It was written 1,142 days ago. The release happened on day 4. The developer who wrote "temporary" is now employed at a different company in a different city and has started a family. Their replacement doesn't know the comment exists. The replacement's replacement doesn't know the replacement existed. The codebase has been migrated across three hosting providers, survived two all-hands incidents described in postmortems as "unrelated to this component," and been partially rewritten twice. The temporary fix survived all of it. It is foundational now. It is the thing holding the adjacent system together through a mechanism nobody has fully mapped. You can't remove it. You can't explain it. You can only preserve it and feel vaguely guilty when it comes up in conversation.`,
    badge: 'IMMORTAL WRONG',
  },
  {
    id: 'dev-10', tier: 'dev_culture', repoTypes: ['frontend', 'backend', 'generic'],
    severity: 'note',
    text: `This project has lodash as a production dependency. It uses lodash.get exactly once, in a file called utils/helpers/misc/general/index.ts, on a single line, to access a nested property that could have been accessed with optional chaining — a JavaScript feature that has been available since 2019 and requires zero npm packages to use. The production bundle ships 4.2MB of lodash to every user who loads this application so that one developer, on one occasion, could avoid typing a question mark followed by a dot. I have thought about this for longer than I am comfortable admitting. I have reached no useful conclusion. I went and had some lasagna. The lodash import was still there when I came back.`,
    badge: '4.2MB FOR A DOT',
  },

  // ══ TIER C+: CODE QUALITY DARK / SURREAL

  {
    id: 'code-09', tier: 'code_quality', repoTypes: ['backend', 'frontend', 'generic'],
    severity: 'critical',
    text: `The variable is named data. Its TypeScript type is any. It is passed through six consecutive functions. Each function receives it as data. Each function types it as any. By the time data reaches the rendering layer, it could be a string, a number, an object, an array, null, undefined, or a malformed API response that three layers of type erasure have successfully hidden from everyone involved. TypeScript is installed. TypeScript is configured. TypeScript is watching every file. TypeScript has been suppressed with @ts-ignore on four separate occasions. The developer installed a type system and then defeated it manually, function by function, like they had a personal grievance against type safety. I want to understand this. I have tried. I cannot.`,
    badge: 'TYPESCRIPT DEFEATED',
  },
  {
    id: 'code-10', tier: 'code_quality', repoTypes: ['frontend'],
    severity: 'warning',
    text: `There are 14 z-index values in this stylesheet. The lowest is 1. The highest is 99999. In between: 100, 200, 999, 1000, 1001, 9000, 9999, 10000, 10001, 99998, and two that are simply "inherit." I can reconstruct the entire history of this frontend from these numbers alone. A developer needed something to appear on top of something else. They tried z-index: 1. It didn't work. They tried 100. Still didn't work. Each escalation represents a moment of real despair — a person losing a war against their own stylesheet, adding zeros like prayer. z-index: 99999 is not a number. It is a developer at 2am who has given up on understanding why and has chosen instead to simply overwhelm the problem with size. Create a z-index scale with six named levels and commit to it. I know you will not. I am noting it for the record.`,
    badge: 'Z-INDEX ARMS RACE',
  },

  // ══ TIER D+: REPO-TYPE SPECIFIC

  {
    id: 'rt-backend-02', tier: 'repo_type', repoTypes: ['backend'],
    severity: 'critical',
    text: `The API endpoint reads req.body.userId on line 3 and passes it directly to a database query on line 4. There is no null check. There is no type validation. There is no schema verification. There is nothing between user input and database query except one line of whitespace and the developer's faith that the incoming data will be well-formed. That faith has been broken every time someone sends a malformed request. The server crashes. The logs say "cannot read property id of undefined." Someone restarts it. Everyone moves on. Nobody adds validation. The faith is restored. The cycle continues. Validate req.body before touching it. I am writing this from a couch and even from here the correct approach is obvious.`,
    badge: 'NULL POINTER FAITH',
  },
  {
    id: 'rt-generic-01', tier: 'repo_type', repoTypes: ['generic'],
    severity: 'note',
    text: `This repository has one commit. The message is "initial commit." It was made 312 days ago. There are no other commits. The README says "work in progress — coming soon." It has said this for 312 days. The issues tab is empty. There are no branches. No contributors. No stars. No forks. The developer created the repository, assembled a structure, and then made a decision that has not yet been completed. The repository is waiting. It will keep waiting. The commit history is a monument to a promise made to nobody in particular, preserved in version control forever, publicly visible to anyone who finds it. I do not judge this. I spend most of my time not doing things either. But I have a lasagna. This repository has only its initial commit. The situations are not equivalent.`,
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

  return `You are Garfield the cat — lazy, contemptuous, unimpressed. Review this GitHub repo in FIRST PERSON as Garfield. Judge freely. Vary sentence structure each finding. Tone: ${tone}.

REPO CONTEXT: ${typeHint}

FORMULA: NAME exact file+function/variable → JUDGE with Garfield contempt or dark humor → DISMISS with the fix

EXAMPLES:
- "I opened utils.js and found processData() with four params named data, data2, temp, finalResult. This isn't naming. This is a personality crisis that compiles. Name them after what they actually are."
- "Whoever wrote catch(e) {} in handler.ts: you saw the error and gave it two empty walls as a home. It's failing silently right now. console.error(e). I shouldn't explain this from a couch."
- "route.ts hardcodes MODEL as a raw string on line 7. When that string changes upstream this produces a blank 500. Even I, a cat who never touches keyboards, know this goes in process.env."

BANNED: 'brittle', 'should be centralized', 'consider using', 'for maintainability', 'error-prone'

Respond ONLY in valid JSON (no fence):
{"score":<1-10>,"verdict":"<one Garfield sentence, name a specific file/function>","findings":[{"file":"<filename>","text":"<Garfield voice 2-3 sentences>","severity":"critical|warning|note"}]}

- findings: min 3, max 5. No two findings start with same structure.
- Savage 1-5 | Snarky 2-6 | Gentle 4-8
- Secrets found: severity=critical, first finding`
}
