'use client';
import { useState, useRef, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { IconFlame, IconSmirk, IconLeaf, IconFolder, IconMoon, IconWarning } from '../icons';

// Sub-frame arrays per PROG_STEP — cycles at 250ms to create living animation
// Eyes shift DOWN progressively as scan deepens (Garfield watches the progress bar below)
const STEP_FRAMES: string[][] = [
  // Step 0 — Waking up, curious, eyes scan left↔right
  [
`
   /\\_/\\
  (  o.o )
  ( =   = )
   \\  ω  /
    | ok  |
     \\___/`,
`
   /\\_/\\
  (  o.O )
  ( =   = )
   \\  ω  /
    | ok  |
     \\___/`,
`
   /\\_/\\
  (  O.o )
  ( =   = )
   \\  ω  /
    | ok  |
     \\___/`,
  ],
  // Step 1 — Reading, starting to look down
  [
`
   /\\_/\\
  (  -.- )
  ( =   = )
   \\  ω  /
    | ... |
     \\___/`,
`
   /\\_/\\
  ( '..' )
  ( =   = )
   \\  ω  /
    | ... |
     \\___/`,
  ],
  // Step 2 — Looking DOWN at progress bar (v = downward gaze)
  [
`
   /\\_/\\
  ( '..' )
  ( =   = )
   \\  v  /
    | hmm |
     \\___/`,
`
   /\\_/\\
  (  v.v )
  ( =   = )
   \\  v  /
    | hmm |
     \\___/`,
`
   /\\_/\\
  ( '..' )
  ( =   = )
   \\  v  /
    |.hmm.|
     \\___/`,
  ],
  // Step 3 — HORRIFIED by what he sees (eyes wide, staring DOWN)
  [
`
   /\\_/\\
  ( O _ O )
  ( =   = )
   \\  ↓  /
    |!wtf!|
     \\___/`,
`
   /\\_/\\
  ( o _ O )
  ( =   = )
   \\  ↓  /
    |!wtf!|
     \\___/`,
`
   /\\_/\\
  ( O _ o )
  ( =   = )
   \\  ↓  /
    | ... |
     \\___/`,
  ],
  // Step 4 — Resigned, still looking down
  [
`
   /\\_/\\
  (  -_- )
  ( =   = )
   \\  >  /
    |sigh.|
     \\___/`,
`
   /\\_/\\
  ( -_-' )
  ( =   = )
   \\  >  /
    |sigh.|
     \\___/`,
  ],
  // Step 5 — Writing verdict, glancing back up
  [
`
   /\\_/\\
  (  u.u )
  ( =   = )
   \\  ω  /
    |fine.|
     \\___/`,
`
   /\\_/\\
  (  -.- )
  ( =   = )
   \\  ω  /
    |fine.|
     \\___/`,
`
   /\\_/\\
  (  u.- )
  ( =   = )
   \\  ω  /
    |fine.|
     \\___/`,
  ],
];

const MSGS = [
  'Garfield is reading your code...',
  'Garfield has seen worse. Not by much.',
  'Garfield is counting your TODO comments...',
  'Garfield judges your variable names...',
  'Garfield is writing the verdict...',
  'Almost done. Garfield needs a second.',
];

const SKIP = [
  /node_modules/, /\.git\//, /package-lock\.json/, /yarn\.lock/,
  /pnpm-lock/, /\.min\.js$/, /dist\//, /build\//, /\.next\//,
  /\.(png|jpg|gif|svg|ico|woff|woff2|ttf|eot|pdf|zip|tar|gz)$/i,
];

function rlCheck(): boolean {
  if (typeof window === 'undefined') return true;
  const today = new Date().toDateString();
  const d = JSON.parse(localStorage.getItem('_gr') || '{"d":"","n":0}');
  if (d.d !== today) { localStorage.setItem('_gr', JSON.stringify({ d: today, n: 0 })); return true; }
  return d.n < 3;
}

function rlIncr() {
  const today = new Date().toDateString();
  const d = JSON.parse(localStorage.getItem('_gr') || '{"d":"","n":0}');
  localStorage.setItem('_gr', JSON.stringify({ d: today, n: d.d === today ? d.n + 1 : 1 }));
}

const PROG_STEPS = [
  { pct: 10, label: 'Connecting to GitHub...', ms: 300,   frame: 0 },
  { pct: 25, label: 'Fetching repository...',  ms: 1500,  frame: 1 },
  { pct: 45, label: 'Packing files...',         ms: 4000,  frame: 2 },
  { pct: 60, label: 'Running security scan...', ms: 8000,  frame: 3 },
  { pct: 78, label: 'Analyzing with Claude...', ms: 16000, frame: 4 },
  { pct: 90, label: 'Writing verdict...',        ms: 32000, frame: 5 },
];

const MODES: { key: string; ico: ReactNode; nm: string; ds: string }[] = [
  { key: 'savage', ico: <IconFlame size={22} />, nm: 'SAVAGE', ds: 'No mercy. Pure truth.' },
  { key: 'snarky', ico: <IconSmirk size={22} />, nm: 'SNARKY', ds: 'Witty. Still stings.' },
  { key: 'gentle', ico: <IconLeaf size={22} />, nm: 'GENTLE', ds: 'Honest. Kinder.' },
];

export default function RoastPage() {
  const router = useRouter();
  const [repo, setRepo] = useState('');
  const [mode, setMode] = useState('savage');
  const [inputState, setInputState] = useState('');
  const [chipVisible, setChipVisible] = useState(false);
  const [chipData, setChipData] = useState({ name: '—', lang: '—', stars: '— ⭐', files: '— files' });
  const [loading, setLoading] = useState(false);
  const [rlWarn, setRlWarn] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [gfFrame, setGfFrame] = useState(STEP_FRAMES[0][0]);
  const [gfKey, setGfKey] = useState(0);
  const [gfMsg, setGfMsg] = useState(MSGS[0]);
  const [progress, setProgress] = useState(0);
  const [stepLabel, setStepLabel] = useState('');
  const metaRef = useRef<Record<string, unknown> | null>(null);
  const filesRef = useRef<{ path: string; type: string }[]>([]);
  const loaderRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const subFrameTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepIdxRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => {
    if (loaderRef.current) clearInterval(loaderRef.current);
    if (subFrameTimer.current) clearInterval(subFrameTimer.current);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  function startLoader() {
    setLoading(true);
    setProgress(0);
    setStepLabel('Starting...');
    stepIdxRef.current = 0;
    setGfFrame(STEP_FRAMES[0][0]);
    setGfKey(0);

    // Sub-frame animation at 250ms — creates living animation within each step
    let sf = 0;
    subFrameTimer.current = setInterval(() => {
      sf++;
      const step = stepIdxRef.current;
      const frames = STEP_FRAMES[step];
      setGfFrame(frames[sf % frames.length]);
    }, 250);

    // Message cycling
    let mi = 0;
    loaderRef.current = setInterval(() => {
      mi = (mi + 1) % MSGS.length;
      setGfMsg(MSGS[mi]);
    }, 1400);

    // Progress steps — change expression + trigger pop-in
    progTimers.current = PROG_STEPS.map(({ pct, label, ms, frame }) =>
      setTimeout(() => {
        setProgress(pct);
        setStepLabel(label);
        stepIdxRef.current = frame;
        sf = 0;
        setGfFrame(STEP_FRAMES[frame][0]);
        setGfKey(k => k + 1);
      }, ms)
    );
  }

  function stopLoader() {
    if (loaderRef.current) clearInterval(loaderRef.current);
    if (subFrameTimer.current) clearInterval(subFrameTimer.current);
    progTimers.current.forEach(clearTimeout);
    progTimers.current = [];
    setLoading(false);
    setProgress(0);
    setStepLabel('');
    stepIdxRef.current = 0;
    setGfFrame(STEP_FRAMES[0][0]);
    setGfKey(0);
    setGfMsg(MSGS[0]);
  }

  async function loadRepoMeta(r: string) {
    try {
      const res = await fetch(`/api/repo-meta?repo=${r}`);
      if (!res.ok) {
        setInputState('state-bad');
        setChipVisible(false);
        if (res.status === 404) setErrorMsg('Repository not found. Make sure it\'s public and the URL is correct.');
        return;
      }
      setErrorMsg('');
      const d = await res.json();
      metaRef.current = d;
      setChipData({ name: d.name, lang: d.language || '—', stars: `${(d.stars || 0).toLocaleString()} ⭐`, files: '— files' });
      setChipVisible(true);
      loadFileTree(r, (d.defaultBranch as string) || 'main');
    } catch {
      setInputState('state-bad');
      setChipVisible(false);
    }
  }

  async function loadFileTree(r: string, branch: string) {
    try {
      const res = await fetch(`https://api.github.com/repos/${r}/git/trees/${branch}?recursive=1`);
      if (!res.ok) throw new Error('fetch failed');
      const d = await res.json();
      filesRef.current = (d.tree || [])
        .filter((f: { type: string; path: string }) => f.type === 'blob' && !SKIP.some(p => p.test(f.path)))
        .slice(0, 80);
      setChipData(prev => ({ ...prev, files: `${filesRef.current.length} files` }));
    } catch {
      setChipData(prev => ({ ...prev, files: '— files' }));
    }
  }

  function handleUrlChange(v: string) {
    const clean = v.replace(/https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '').trim();
    setRepo(clean);
    setErrorMsg('');
    const ok = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(clean);
    setInputState(ok ? 'state-ok' : clean.length > 4 ? 'state-bad' : '');
    if (!ok) { setChipVisible(false); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => loadRepoMeta(clean), 700);
  }

  async function doRoast() {
    if (!rlCheck()) { setRlWarn(true); return; }
    if (!/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repo)) { setInputState('state-bad'); return; }
    setErrorMsg('');
    startLoader();
    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: repo, mode }),
      });
      if (res.status === 429) { stopLoader(); setRlWarn(true); return; }
      if (res.status === 422) { stopLoader(); setErrorMsg('Could not fetch this repository. Make sure it\'s public and not empty.'); return; }
      if (!res.ok) { stopLoader(); setErrorMsg('Something went wrong. Try again in a moment.'); return; }
      const result = await res.json();
      rlIncr();
      sessionStorage.setItem('garfield_result', JSON.stringify({
        result, repo, mode,
        files: filesRef.current,
        meta: metaRef.current,
      }));
      router.push('/result');
    } catch (e) {
      console.error(e);
      stopLoader();
      setErrorMsg('Network error. Check your connection and try again.');
    }
  }

  return (
    <div id="roast-page">
      <div className="input-wrap">
        <span className="tag" style={{ display: 'inline-block', marginBottom: '16px' }}>[ ROAST MY REPO ]</span>
        <h1 className="input-title">
          Drop your repo.<br />
          <span style={{ color: 'var(--orange)' }}>Garfield wakes up.</span>
        </h1>
        <p className="input-sub">Public GitHub repos only. Be brave.</p>

        <div className="url-field">
          <span className="url-prefix">github.com/</span>
          <input
            type="text"
            className={`url-input ${inputState}`}
            placeholder="username/repository-name"
            value={repo}
            onChange={e => handleUrlChange(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>

        {chipVisible && (
          <div className="repo-chip show">
            <IconFolder size={20} />
            <div style={{ flex: 1 }}>
              <div className="chip-name">{chipData.name}</div>
              <div className="chip-meta">
                <span>{chipData.files}</span>
                <span>{chipData.lang}</span>
                <span>{chipData.stars}</span>
              </div>
            </div>
            <span className="chip-ok">✓</span>
          </div>
        )}

        <div className="mode-head">SELECT ROAST MODE</div>
        <div className="modes">
          {MODES.map(m => (
            <button key={m.key} className={`mode ${mode === m.key ? 'on' : ''}`} onClick={() => setMode(m.key)}>
              <span className="mode-ico">{m.ico}</span>
              <span className="mode-nm">{m.nm}</span>
              <span className="mode-ds">{m.ds}</span>
            </button>
          ))}
        </div>

        {rlWarn && (
          <div className="rl-warn show">
            <IconWarning size={14} />
            You&apos;ve used all 3 free roasts today. Come back tomorrow.
          </div>
        )}

        {errorMsg && (
          <div className="rl-warn show" style={{ borderColor: 'var(--red)', color: 'var(--red)' }}>
            <IconWarning size={14} />
            {errorMsg}
          </div>
        )}

        <button
          className="btn btn-primary submit-btn"
          disabled={loading || (!loading && !chipVisible)}
          onClick={doRoast}
          title={!chipVisible && !loading ? 'Enter a valid public GitHub repo first' : undefined}
        >
          {loading ? <><IconMoon size={14} /> Garfield is waking up...</> : <><IconFlame size={14} /> ROAST IT</>}
        </button>

        {loading && (
          <div className="gf-loader show">
            <pre key={gfKey} className="gf-anim">{gfFrame}</pre>
            <div className="gf-step-info">
              <span>{stepLabel}</span>
              <span className="gf-step-pct">{progress}%</span>
            </div>
            <div className="gf-progress-track">
              <div className="gf-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="gf-msg">{gfMsg}</div>
          </div>
        )}
      </div>
    </div>
  );
}
