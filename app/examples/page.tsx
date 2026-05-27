'use client';
import { useRouter } from 'next/navigation';
import { IconFlame } from '../icons';

type Severity = 'critical' | 'warning' | 'note';
type Mode = 'SAVAGE' | 'SNARKY' | 'GENTLE';

interface Finding {
  file: string;
  text: string;
  severity: Severity;
}

interface ExampleRoast {
  repo: string;
  description: string;
  mode: Mode;
  score: number;
  verdict: string;
  badge: string;
  findings: Finding[];
}

const EXAMPLES: ExampleRoast[] = [
  {
    repo: 'someone/my-todo-app',
    description: 'React · 47 deps · 312MB node_modules',
    mode: 'SAVAGE',
    score: 2,
    verdict: 'A checkbox app that takes more memory than Chrome.',
    badge: 'OVER-ENGINEERED',
    findings: [
      {
        file: 'src/index.js',
        text: '`var` declarations in 2024. Not a typo. Not a legacy file. You wrote this in 2024, committed it, and pushed it to a public repo.',
        severity: 'critical',
      },
      {
        file: 'src/utils.js',
        text: 'doStuff() is 312 lines. That\'s not a utility function — that\'s a graveyard with a misleading sign. Every dev who opens this file has to read through your garbage to find what they actually need.',
        severity: 'critical',
      },
      {
        file: 'package.json',
        text: '47 dependencies to render a checkbox. moment.js, lodash, axios — all of it. The actual checkbox logic is 23 lines. The rest is 312MB of decisions you made and never questioned.',
        severity: 'warning',
      },
      {
        file: 'README.md',
        text: 'Installation section says "TBD". The app has been live for 8 months. That\'s your documentation strategy.',
        severity: 'note',
      },
    ],
  },
  {
    repo: 'dev/backend-api-v3',
    description: 'Node.js · Express · No tests',
    mode: 'SNARKY',
    score: 4,
    verdict: 'Version 3 of an API that learned nothing from versions 1 and 2.',
    badge: 'YOLO ERROR HANDLING',
    findings: [
      {
        file: 'src/handlers/auth.ts',
        text: 'catch(e) {} on line 89. You caught the error and did absolutely nothing with it. Every silent failure in this API traces back to a catch block you wrote and walked away from.',
        severity: 'critical',
      },
      {
        file: 'src/config.ts',
        text: 'DATABASE_URL hardcoded on line 12. In a file called config.ts. The irony here is that you named it config, which implies you understood the concept, and then did this anyway.',
        severity: 'critical',
      },
      {
        file: 'src/helpers.js',
        text: '84 lines of dead code. Commented out. Left there. Anyone who opens this file has to scroll through your archaeology to find the working code.',
        severity: 'warning',
      },
    ],
  },
  {
    repo: 'learner/portfolio-site',
    description: 'HTML/CSS/JS · First project',
    mode: 'GENTLE',
    score: 6,
    verdict: 'Functional. Gets the job done. Garfield had lower expectations.',
    badge: 'NAMING CRIMES',
    findings: [
      {
        file: 'js/main.js',
        text: 'processData() has a variable named data2. You named a variable data2, and now data2 lives in a public repo with your name in the git log next to it. Anyone who maintains this has to guess what data2 means.',
        severity: 'warning',
      },
      {
        file: 'js/utils.js',
        text: 'Three functions named handleClick1, handleClick2, handleClick3. You figured out how to name the first one, then gave up.',
        severity: 'warning',
      },
      {
        file: 'index.html',
        text: 'Inline styles on 23 elements. You have a CSS file. It\'s right there.',
        severity: 'note',
      },
    ],
  },
  {
    repo: 'startup/ml-pipeline',
    description: 'Python · TensorFlow · Public repo',
    mode: 'SAVAGE',
    score: 1,
    verdict: 'AWS already emailed you about this.',
    badge: 'SECURITY INCIDENT',
    findings: [
      {
        file: 'config/settings.py',
        text: 'AWS key committed. AKIA... right there in settings.py, line 7. In a public repo. Pushed 3 weeks ago. Rotate this key immediately — if you haven\'t been billed for something you didn\'t do, it\'s because no one\'s found it yet.',
        severity: 'critical',
      },
      {
        file: 'src/train.py',
        text: 'except Exception: pass on line 47 inside the training loop. You\'re silently swallowing every possible error including CUDA failures, OOM errors, and corrupted data. Your training run could have failed 40 epochs ago and you wouldn\'t know.',
        severity: 'critical',
      },
      {
        file: 'src/model.py',
        text: 'main() is 600 lines. No modules. No separation. You put the data loading, preprocessing, model definition, training loop, and evaluation all in one function, and your username is in the git log next to every line of it.',
        severity: 'critical',
      },
      {
        file: 'requirements.txt',
        text: 'tensorflow==1.15. That version has 4 known CVEs and hasn\'t received security patches since 2021. Bold strategy.',
        severity: 'warning',
      },
    ],
  },
];

const SEV_CLASS: Record<Severity, string> = {
  critical: 'sev-c',
  warning: 'sev-w',
  note: 'sev-n',
};

const MODE_COLOR: Record<Mode, string> = {
  SAVAGE: 'var(--red)',
  SNARKY: 'var(--orange)',
  GENTLE: 'var(--green)',
};

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="ex-score-bar">
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className={`ex-score-seg${i < score ? ' filled' : ''}`}
          style={i < score ? { background: score <= 3 ? 'var(--red)' : score <= 6 ? 'var(--orange)' : 'var(--green)' } : {}}
        />
      ))}
    </div>
  );
}

export default function ExamplesPage() {
  const router = useRouter();

  return (
    <div id="examples-page">
      {/* Header */}
      <div className="ex-hero">
        <span className="tag">[ EXAMPLE ROASTS ]</span>
        <h1 className="ex-title">Garfield&apos;s greatest hits.</h1>
        <p className="ex-sub">
          Real findings. Real contempt. This is what happens when you paste your repo.
        </p>
      </div>

      {/* Cards */}
      <div className="ex-page-grid">
        {EXAMPLES.map((ex, idx) => (
          <div key={idx} className="ex-page-card">
            {/* Card header */}
            <div className="ex-card-header">
              <div className="ex-card-meta">
                <span className="ex-repo-name">{ex.repo}</span>
                <span className="ex-repo-desc">{ex.description}</span>
              </div>
              <span className="ex-mode-badge" style={{ color: MODE_COLOR[ex.mode], borderColor: MODE_COLOR[ex.mode] }}>
                {ex.mode}
              </span>
            </div>

            {/* Score row */}
            <div className="ex-score-row">
              <div className="ex-score-num" style={{ color: ex.score <= 3 ? 'var(--red)' : ex.score <= 6 ? 'var(--orange)' : 'var(--green)' }}>
                {ex.score}
                <span className="ex-score-denom">/10</span>
              </div>
              <div className="ex-score-right">
                <ScoreBar score={ex.score} />
                <p className="ex-verdict">&ldquo;{ex.verdict}&rdquo;</p>
              </div>
            </div>

            {/* Findings */}
            <div className="ex-findings">
              {ex.findings.map((f, fi) => (
                <div key={fi} className={`ex-finding ex-sev-${f.severity}`}>
                  <div className="ri-file">
                    <span style={{ opacity: 0.45 }}>◆</span>
                    {f.file}
                  </div>
                  <div className="ri-text">{f.text}</div>
                  <span className={`ri-sev ${SEV_CLASS[f.severity]}`}>{f.severity.toUpperCase()}</span>
                </div>
              ))}
            </div>

            {/* Badge */}
            <div className="ex-card-footer">
              <span className="ex-badge-large">{ex.badge}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="ex-cta">
        <span className="tag" style={{ marginBottom: 20, display: 'inline-block' }}>[ YOUR TURN ]</span>
        <h2 className="ex-cta-title">Think yours is different?</h2>
        <p className="ex-cta-sub">Paste your GitHub URL. Garfield will tell you exactly how it isn&apos;t.</p>
        <button className="btn btn-primary" style={{ padding: '16px 44px', fontSize: '13px' }} onClick={() => router.push('/roast')}>
          <IconFlame size={16} />
          ROAST MY REPO
        </button>
      </div>

      <footer className="footer">
        <span onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>GARFIELD ROAST · POWERED BY <span>CLAUDE</span></span>
        <span style={{ color: 'var(--text-3)' }}>GITHUB · X (TWITTER)</span>
        <span>© 2025 · NOT AFFILIATED WITH GARFIELD™</span>
      </footer>
    </div>
  );
}
