'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const HERO_FRAMES = [
`   /\\___/\\
  (  -.- )
  ( = · = )
   \\  ω  /
    |ZZzZ|
     \\___/
  ▓▓▓▓▓▓▓▓▓`,
`   /\\___/\\
  (  u.- )
  ( = · = )
   \\  ω  /
    |Zzz..|
     \\___/
  ▓▓▓▓▓▓▓▓▓`,
`   /\\___/\\
  (  u.u )
  ( = · = )
   \\  ω  /
    |..zZ.|
     \\___/
  ▓▓▓▓▓▓▓▓▓`,
];

const CHARS = '!@#$%^*<>/\\|~`░▒▓█▄▀';

function scramble(el: Element, orig: string, ms = 700) {
  let n = 0;
  const max = Math.ceil(ms / 45);
  const id = setInterval(() => {
    (el as HTMLElement).textContent = orig.split('').map((c, i) => {
      if (c === ' ') return ' ';
      if (i < (n / max) * orig.length) return c;
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }).join('');
    n++;
    if (n > max) { (el as HTMLElement).textContent = orig; clearInterval(id); }
  }, 45);
}

const TICKER_ITEMS = [
  'naming a variable "data" is not a personality',
  'your 500-line function wants to speak to a manager',
  'TODO: fix this later = never. we all know it',
  "console.log debugging in production, bold choice",
  "copy-pasted from Stack Overflow and didn't even read it",
  'your README.md is a cry for help',
  'three nested ternaries? you absolute monster',
  'the .env was committed. to a public repo. in 2024.',
];

const EXAMPLE_ROASTS = [
  { repo: 'github.com/someone/my-todo-app', text: '"A React app with 47 dependencies to render a checkbox. node_modules is 312MB. The actual logic is 23 lines. I\'ve seen simpler architectures in Egyptian pyramids."', badge: 'OVER-ENGINEERED' },
  { repo: 'github.com/dev/portfolio-2019', text: '"You have a file called utils.js that contains 800 lines and a function named doStuff. This is not a utility file. This is a confession."', badge: 'NAMING CRIME' },
  { repo: 'github.com/startup/backend-v3', text: '"The error handling strategy is: catch the error, console.log it, and pretend it didn\'t happen. Garfield respects the audacity. Not the architecture."', badge: 'YOLO ERROR HANDLING' },
  { repo: 'github.com/learner/first-api', text: '"Every function is called from main(). No separation of concerns. This isn\'t spaghetti code — this is spaghetti that achieved sentience and filed for IP rights."', badge: 'ARCHITECTURAL CHAOS' },
  { repo: 'github.com/coder/ml-project', text: '"You committed your .env with AWS credentials. In a public repo. Garfield is too tired to even be angry. Please rotate your keys and reconsider your life choices."', badge: 'SECURITY INCIDENT' },
];

export default function LandingPage() {
  const router = useRouter();
  const heroRef = useRef<HTMLPreElement>(null);
  const frameIdx = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (heroRef.current) {
        frameIdx.current = (frameIdx.current + 1) % HERO_FRAMES.length;
        heroRef.current.textContent = HERO_FRAMES[frameIdx.current];
      }
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const target = e.target as HTMLElement & { _sc?: number };
        if (e.isIntersecting && !target._sc) {
          target._sc = 1;
          const s = target.querySelector('span');
          if (s) scramble(s, s.textContent || '');
        }
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('.tag').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div id="landing">

      <section className="hero">
        <pre className="hero-ascii" ref={heroRef}>{HERO_FRAMES[0]}</pre>

        <div className="hero-eyebrow">
          <span className="tag">[ GARFIELD ROAST · POWERED BY DEEPSEEK ]</span>
        </div>

        <h1 className="hero-title">
          YOUR CODE<br />
          <em className="glitch">WILL BE JUDGED.</em>
        </h1>

        <p className="hero-sub">
          Garfield doesn&apos;t care about your feelings.<br />
          But he&apos;ll tell you exactly what&apos;s wrong with your codebase —
          with the brutal honesty only a cat with no deadlines can deliver.
        </p>

        <div className="hero-actions">
          <button className="btn btn-primary btn-hero" onClick={() => router.push('/roast')}>
            🔥 ROAST MY REPO
          </button>
          <button className="btn btn-outline btn-hero">
            SEE AN EXAMPLE →
          </button>
        </div>

        <div className="powered-pill">
          <span className="powered-dot"></span>
          POWERED BY DEEPSEEK · OPENROUTER
        </div>

        <div className="hero-stats">
          <div><span className="stat-val">∞</span><span className="stat-key">REPOS JUDGED</span></div>
          <div><span className="stat-val">0</span><span className="stat-key">FEELINGS SPARED</span></div>
          <div><span className="stat-val">100%</span><span className="stat-key">HONESTY RATE</span></div>
        </div>
      </section>

      <div className="ticker-wrap">
        <div className="ticker">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((text, i) => (
            <span key={i} className="ticker-item">{text}</span>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)' }}>
        <div className="section">
          <div className="section-eyebrow">
            <span className="tag">[ HOW IT WORKS ]</span>
            <h2 className="section-title">Three steps to<br />code humiliation.</h2>
            <p className="section-desc">Garfield wakes up, reads your repo, and delivers the verdict. He&apos;s done this in his sleep. Literally.</p>
          </div>
          <div className="steps">
            <div className="step-card">
              <div className="step-n">01 /</div>
              <span className="step-icon">🔗</span>
              <div className="step-title">Paste your GitHub URL</div>
              <p className="step-text">Drop any public GitHub repo link. We fetch the files, scan the structure, and wake Garfield up from his third nap of the day.</p>
            </div>
            <div className="step-card">
              <div className="step-n">02 /</div>
              <span className="step-icon">😼</span>
              <div className="step-title">Garfield reads your code</div>
              <p className="step-text">Powered by DeepSeek via OpenRouter, Garfield analyzes architecture, naming, patterns, and tech debt. He&apos;s seen worse. Not by much though.</p>
            </div>
            <div className="step-card">
              <div className="step-n">03 /</div>
              <span className="step-icon">📤</span>
              <div className="step-title">Share the carnage</div>
              <p className="step-text">Get a shareable roast card, screenshot-ready for X. Because your suffering is content, and content is king.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="roast-examples">
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div className="section-eyebrow">
            <span className="tag">[ EXAMPLE ROASTS ]</span>
            <h2 className="section-title">Garfield&apos;s greatest hits.</h2>
          </div>
          <div className="ex-scroll">
            {EXAMPLE_ROASTS.map(({ repo, text, badge }, i) => (
              <div key={i} className="ex-card">
                <div className="ex-repo">{repo}</div>
                <p className="ex-text">{text}</p>
                <span className="ex-badge">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cta-bottom">
        <span className="tag" style={{ marginBottom: '24px', display: 'inline-block' }}>[ GET STARTED ]</span>
        <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, marginBottom: '14px' }}>
          Ready to be<br />brutally honest?
        </h2>
        <p style={{ color: 'var(--text-2)', marginBottom: '36px', fontSize: '13.5px' }}>
          3 free roasts per day. No account needed. Just a GitHub URL and a thick skin.
        </p>
        <button className="btn btn-primary" style={{ padding: '16px 44px', fontSize: '13.5px' }} onClick={() => router.push('/roast')}>
          🔥 ROAST MY REPO NOW
        </button>
      </div>

      <footer className="footer">
        <span>GARFIELD ROAST · POWERED BY <span>DEEPSEEK (OPENROUTER)</span></span>
        <span style={{ color: 'var(--text-3)' }}>GITHUB · X (TWITTER)</span>
        <span>© 2025 · NOT AFFILIATED WITH GARFIELD™</span>
      </footer>

    </div>
  );
}
