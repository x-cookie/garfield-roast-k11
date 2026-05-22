'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { IconFlame, IconLink, IconCat, IconShare } from './icons';
import HeroParticles from './components/HeroParticles';

// Variable-duration timeline: each frame carries its own ms.
// Phases: sleep(14) → ear twitch(4) → wake(12) → look around(10) → judge(8) → back to sleep(10)
const HERO_TIMELINE: { t: string; ms: number }[] = [
// ── SLEEP ─────────────────────────────────────────────────────────────────
{ t:`   /\\___/\\
  (  -.- )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:650 },
{ t:`   /\\___/\\
  (  -.- )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:650 },
{ t:`   /\\___/\\
  (  -.- )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:600 },
{ t:`   /\\___/\\
  (  -.- )
  ( = · = )
   \\  _  /
    |      |   z
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:500 },
{ t:`   /\\___/\\
  (  -.- )
  ( = · = )
   \\  _  /  z
    |      |  Z
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:500 },
{ t:`   /\\___/\\
  (  -.- )
  ( = · = )  z
   \\  _  / Z
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:500 },
{ t:`   /\\___/\\
  (  -.- )  z
  ( = · = ) Z
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:500 },
{ t:`   /\\___/\\ z
  (  -.- )  Z
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:500 },
{ t:`   /\\___/\\ Z
  (  -.- )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:550 },
{ t:`   /\\___/\\
  (  -.- )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:650 },
{ t:`   /\\___/\\
  (  -.- )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:650 },
{ t:`   /\\___/\\
  (  -.- )
  ( = · = )
   \\  _  /
    |      |   z
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:500 },
{ t:`   /\\___/\\
  (  -.- )
  ( = · = )
   \\  _  /  z
    |      |  Z
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:500 },
{ t:`   /\\___/\\
  (  -.- )
  ( = · = )  z
   \\  _  / Z
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:500 },
// ── EAR TWITCH ──────────────────────────────────────────────────────────────
{ t:`   /\\___/\\
  (  -.- )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:300 },
{ t:`  ./\\___/\\
  (  -.- )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:180 },
{ t:`   /\\___/.
  (  -.- )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:180 },
{ t:`   /\\___/\\
  (  -.- )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:350 },
// ── WAKE UP ─────────────────────────────────────────────────────────────────
{ t:`   /\\___/\\
  (  -.- )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:400 },
{ t:`   /\\___/\\
  (  -.- )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:350 },
{ t:`   /\\___/\\
  (  -.· )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:350 },
{ t:`   /\\___/\\
  (  -.u )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:350 },
{ t:`   /\\___/\\
  (  -.o )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:350 },
{ t:`   /\\___/\\
  (  u.o )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:350 },
{ t:`   /\\___/\\
  (  u.u )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:320 },
{ t:`   /\\___/\\
  (  o.u )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:320 },
{ t:`   /\\___/\\
  (  o.o )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:400 },
{ t:`   /\\___/\\
  (  o.o )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:450 },
{ t:`   /\\___/\\
  (  -.- )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:180 },
{ t:`   /\\___/\\
  (  o.o )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:450 },
// ── LOOK AROUND ─────────────────────────────────────────────────────────────
{ t:`   /\\___/\\
  (  o.◉ )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:380 },
{ t:`   /\\___/\\
  (  o.◉ )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:480 },
{ t:`   /\\___/\\
  (  ◉.◉ )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:380 },
{ t:`   /\\___/\\
  (  o.o )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:500 },
{ t:`   /\\___/\\
  (  o.o )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:520 },
{ t:`   /\\___/\\
  (  ◉.o )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:380 },
{ t:`   /\\___/\\
  (  ◉.o )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:480 },
{ t:`   /\\___/\\
  (  ◉.◉ )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:420 },
{ t:`   /\\___/\\
  (  o.o )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:500 },
{ t:`   /\\___/\\
  (  o.o )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:500 },
// ── JUDGING ─────────────────────────────────────────────────────────────────
{ t:`   /\\___/\\
  (  ◉.◉ )
  ( = · = )
   \\  _  /
    |stare|
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:600 },
{ t:`   /\\___/\\
  (  ◉.◉ )
  ( = · = )
   \\  ~  /
    |stare|
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:900 },
{ t:`   /\\___/\\
  (  ◉.◉ )
  ( = · = )
   \\  ~  /
    |stare|
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:1300 },
{ t:`   /\\___/\\
  (  >.< )
  ( = · = )
   \\  >  /
    | meh |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:650 },
{ t:`   /\\___/\\
  (  >.< )
  ( = · = )
   \\  >  /
    | meh |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:1000 },
{ t:`   /\\___/\\
  (  -_- )
  ( = · = )
   \\  ~  /
    | meh |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:1100 },
{ t:`   /\\___/\\
  (  -_- )
  ( = · = )
   \\  ~  /
    | meh |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:1500 },
{ t:`   /\\___/\\
  (  -_- )
  ( = · = )
   \\  ~  /
    | meh |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:1800 },
// ── BACK TO SLEEP ───────────────────────────────────────────────────────────
{ t:`   /\\___/\\
  (  -,- )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:420 },
{ t:`   /\\___/\\
  (  u.u )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:380 },
{ t:`   /\\___/\\
  (  u.- )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:350 },
{ t:`   /\\___/\\
  (  -.- )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:500 },
{ t:`   /\\___/\\
  (  -.- )
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:550 },
{ t:`   /\\___/\\
  (  -.- )
  ( = · = )
   \\  _  /
    |      |   z
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:500 },
{ t:`   /\\___/\\
  (  -.- )
  ( = · = )
   \\  _  /  z
    |      |  Z
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:500 },
{ t:`   /\\___/\\
  (  -.- )
  ( = · = )  z
   \\  _  / Z
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:500 },
{ t:`   /\\___/\\
  (  -.- )  z
  ( = · = ) Z
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:500 },
{ t:`   /\\___/\\ z
  (  -.- )  Z
  ( = · = )
   \\  _  /
    |      |
     \\___/
  ▓▓▓▓▓▓▓▓▓`, ms:550 },
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
  const heroSectionRef = useRef<HTMLElement>(null);
  const frameIdx = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function tick() {
      const frame = HERO_TIMELINE[frameIdx.current];
      if (heroRef.current) heroRef.current.textContent = frame.t;
      frameIdx.current = (frameIdx.current + 1) % HERO_TIMELINE.length;
      timerRef.current = setTimeout(tick, frame.ms);
    }
    timerRef.current = setTimeout(tick, 0);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
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

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('revealed');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div id="landing">

      <section className="hero" ref={heroSectionRef}>
        <HeroParticles />
        <div className="hero-glow" />
        <pre className="hero-ascii" ref={heroRef}>{HERO_TIMELINE[0].t}</pre>

        <div className="hero-eyebrow">
          <span className="tag">[ GARFIELD ROAST · POWERED BY CLAUDE ]</span>
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
            <IconFlame size={16} />
            ROAST MY REPO
          </button>
          <button className="btn btn-outline btn-hero">
            SEE AN EXAMPLE →
          </button>
        </div>

        <div className="powered-pill">
          <span className="powered-dot"></span>
          POWERED BY CLAUDE
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
          <div className="section-eyebrow" data-reveal>
            <span className="tag">[ HOW IT WORKS ]</span>
            <h2 className="section-title">Three steps to<br />code humiliation.</h2>
            <p className="section-desc">Garfield wakes up, reads your repo, and delivers the verdict. He&apos;s done this in his sleep. Literally.</p>
          </div>
          <div className="steps">
            <div className="step-card" data-reveal data-delay="1">
              <div className="step-n">01 /</div>
              <span className="step-icon"><IconLink size={28} /></span>
              <div className="step-title">Paste your GitHub URL</div>
              <p className="step-text">Drop any public GitHub repo link. We fetch the files, scan the structure, and wake Garfield up from his third nap of the day.</p>
            </div>
            <div className="step-card" data-reveal data-delay="2">
              <div className="step-n">02 /</div>
              <span className="step-icon"><IconCat size={28} /></span>
              <div className="step-title">Garfield reads your code</div>
              <p className="step-text">Powered by Claude, Garfield analyzes architecture, naming, patterns, and tech debt. He&apos;s seen worse. Not by much though.</p>
            </div>
            <div className="step-card" data-reveal data-delay="3">
              <div className="step-n">03 /</div>
              <span className="step-icon"><IconShare size={28} /></span>
              <div className="step-title">Share the carnage</div>
              <p className="step-text">Get a shareable roast card, screenshot-ready for X. Because your suffering is content, and content is king.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── What Garfield Exposes ── */}
      <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div className="section">
          <div className="section-eyebrow" data-reveal>
            <span className="tag">[ WHAT GARFIELD FINDS ]</span>
            <h2 className="section-title">No bug goes<br />unroasted.</h2>
            <p className="section-desc">Garfield has a list. He checks it twice. Then he judges you for needing the list in the first place.</p>
          </div>
          <div className="expose-grid">
            {[
              { n:'01', title:'ARCHITECTURE',  desc:'God objects, circular deps, functions with 300 lines trying to do 12 different jobs.' },
              { n:'02', title:'NAMING CRIMES', desc:"Variables named 'data', 'info', 'stuff'. Functions named 'doTheThing'. Garfield weeps." },
              { n:'03', title:'SECURITY HOLES',desc:'Hardcoded secrets, eval() calls, wildcard CORS, missing validation. He will find them.' },
              { n:'04', title:'TECH DEBT',     desc:'TODO comments from 2019, console.logs in prod, magic numbers with no explanation.' },
              { n:'05', title:'DEP BLOAT',     desc:'47 packages to render a checkbox. node_modules is 800MB. The logic is 18 lines.' },
              { n:'06', title:'NO DOCS',       desc:"README says 'coming soon'. Installation section says 'TBD'. Garfield says goodbye." },
            ].map(({ n, title, desc }, i) => (
              <div key={n} className="expose-card" data-reveal data-delay={String((i % 3) + 1)}>
                <div className="expose-n">{n} /</div>
                <div className="expose-title">{title}</div>
                <p className="expose-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Value Props ── */}
      <div className="value-strip" data-reveal>
        {[
          { label: 'FREE',       sub: '3 roasts / day · no account' },
          { label: 'FAST',       sub: 'Results in under 60 seconds' },
          { label: 'SPECIFIC',   sub: 'References your actual files' },
          { label: 'SHAREABLE',  sub: 'Screenshot-ready card for X' },
        ].map(({ label, sub }) => (
          <div key={label} className="value-item">
            <div className="value-label">{label}</div>
            <div className="value-sub">{sub}</div>
          </div>
        ))}
      </div>

      <div className="roast-examples">
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div className="section-eyebrow">
            <span className="tag">[ EXAMPLE ROASTS ]</span>
            <h2 className="section-title">Garfield&apos;s greatest hits.</h2>
          </div>
          <div className="ex-scroll">
            {EXAMPLE_ROASTS.map(({ repo, text, badge }, i) => (
              <div key={i} className="ex-card" data-reveal data-delay={String(i + 1)}>
                <div className="ex-repo">{repo}</div>
                <p className="ex-text">{text}</p>
                <span className="ex-badge">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cta-bottom" data-reveal>
        <span className="tag" style={{ marginBottom: '24px', display: 'inline-block' }}>[ GET STARTED ]</span>
        <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, marginBottom: '14px' }}>
          Ready to be<br />brutally honest?
        </h2>
        <p style={{ color: 'var(--text-2)', marginBottom: '36px', fontSize: '13.5px' }}>
          3 free roasts per day. No account needed. Just a GitHub URL and a thick skin.
        </p>
        <button className="btn btn-primary" style={{ padding: '16px 44px', fontSize: '13.5px' }} onClick={() => router.push('/roast')}>
          <IconFlame size={16} />
          ROAST MY REPO NOW
        </button>
      </div>

      <footer className="footer">
        <span>GARFIELD ROAST · POWERED BY <span>CLAUDE</span></span>
        <span style={{ color: 'var(--text-3)' }}>GITHUB · X (TWITTER)</span>
        <span>© 2025 · NOT AFFILIATED WITH GARFIELD™</span>
      </footer>

    </div>
  );
}
