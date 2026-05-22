'use client';
import { useRouter } from 'next/navigation';
import { IconFlame } from '../icons';

const PIPELINE = [
  { n: '01', title: 'GitHub API fetch',     desc: 'We resolve the repo\'s default branch and fetch the full recursive file tree via GitHub\'s Trees API. No git binary required — pure HTTPS.' },
  { n: '02', title: 'File filtering',        desc: 'node_modules, build artifacts, binaries, and lock files are stripped. We cap at 60 files, 100KB each, to stay within model context limits.' },
  { n: '03', title: 'Security pre-scan',     desc: 'Before the AI sees the code, regex patterns detect committed AWS keys, OpenAI tokens, hardcoded passwords, and private keys. These become CRITICAL findings.' },
  { n: '04', title: 'Claude analysis',       desc: 'The packed repo XML is sent to Claude with a system prompt encoding Garfield\'s persona, analysis skills (architecture, naming, security, tech debt), and output schema.' },
  { n: '05', title: 'JSON verdict',          desc: 'Claude returns a structured JSON object: score (1–10), one-sentence verdict, 4–8 roast items with file references and severity, and 3 tweet captions.' },
  { n: '06', title: 'Cache + return',        desc: 'The result is cached in Upstash Redis for 24h keyed by repo+mode. Subsequent requests for the same repo return instantly without re-running the pipeline.' },
];

const STACK = [
  { name: 'Next.js 14',     role: 'App Router · API routes · Static export',     badge: 'FRAMEWORK' },
  { name: 'Claude AI',      role: 'Code analysis · Roast generation · Verdict',   badge: 'AI' },
  { name: 'GitHub API',     role: 'File tree fetch · Raw content · Repo meta',    badge: 'DATA' },
  { name: 'Upstash Redis',  role: '24h result cache · Server-side rate limiting', badge: 'CACHE' },
  { name: 'Vercel',         role: 'Edge deployment · Serverless functions',       badge: 'HOSTING' },
  { name: 'html2canvas',    role: 'Roast card screenshot · Share to X',           badge: 'SHARING' },
];

export default function DocsPage() {
  const router = useRouter();

  return (
    <div id="docs-page" style={{ paddingTop: '52px' }}>
      <style>{`
        #docs-page { min-height: 100vh; }
        .docs-hero {
          padding: 80px 40px 64px; text-align: center;
          border-bottom: 1px solid var(--border);
          background: radial-gradient(ellipse 60% 50% at 50% 0%, rgba(234,140,30,0.06) 0%, transparent 70%);
        }
        .docs-hero .tag { margin-bottom: 28px; display: inline-block; }
        .docs-hero h1 { font-size: clamp(32px,5vw,64px); font-weight: 800; line-height: 1.05; letter-spacing: -0.02em; margin-bottom: 18px; }
        .docs-hero p { font-size: 14px; color: var(--text-2); max-width: 520px; margin: 0 auto; line-height: 1.75; }
        .docs-body { max-width: 860px; margin: 0 auto; padding: 0 40px 80px; }
        .docs-section { padding: 64px 0 0; border-top: 1px solid var(--border); margin-top: 64px; }
        .docs-section:first-child { border-top: none; margin-top: 0; padding-top: 64px; }
        .docs-label { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; color: var(--orange); text-transform: uppercase; margin-bottom: 8px; }
        .docs-h2 { font-size: clamp(20px,3vw,32px); font-weight: 800; letter-spacing: -0.01em; margin-bottom: 24px; line-height: 1.1; }
        .pipeline-list { display: flex; flex-direction: column; gap: 1px; }
        .pipeline-item {
          display: grid; grid-template-columns: 48px 1fr;
          background: var(--bg-card); border: 1px solid var(--border);
          padding: 20px 24px; gap: 20px; align-items: start;
          transition: border-color 0.15s;
        }
        .pipeline-item:hover { border-color: var(--border-hi); }
        .pipeline-n { font-size: 10px; color: var(--orange); font-weight: 700; letter-spacing: 0.1em; padding-top: 2px; }
        .pipeline-title { font-size: 13.5px; font-weight: 700; margin-bottom: 6px; }
        .pipeline-desc { font-size: 12px; color: var(--text-2); line-height: 1.65; }
        .api-cards { display: flex; flex-direction: column; gap: 16px; }
        .api-card {
          background: var(--bg-card); border: 1px solid var(--border);
          overflow: hidden;
        }
        .api-card-head {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 20px; border-bottom: 1px solid var(--border);
        }
        .api-method {
          font-size: 11px; font-weight: 800; letter-spacing: 0.1em;
          padding: 3px 10px; background: var(--orange-lo);
          color: var(--orange); border: 1px solid rgba(234,140,30,0.25);
        }
        .api-path { font-size: 13.5px; font-weight: 700; color: var(--text); }
        .api-desc { font-size: 11.5px; color: var(--text-2); margin-left: auto; }
        .api-body { padding: 20px; }
        .api-subtitle { font-size: 10px; letter-spacing: 0.1em; color: var(--text-3); text-transform: uppercase; margin-bottom: 8px; font-weight: 600; }
        .code-block {
          background: var(--bg); border: 1px solid var(--border);
          padding: 14px 16px; font-size: 11.5px; line-height: 1.7;
          color: var(--text-2); white-space: pre; overflow-x: auto;
          margin-bottom: 16px;
          scrollbar-width: thin; scrollbar-color: var(--border) transparent;
        }
        .code-block .ck { color: #7fb8d4; }
        .code-block .cv { color: var(--orange); }
        .code-block .cs { color: #96ba78; }
        .rl-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
        .rl-table th { text-align: left; padding: 10px 16px; font-size: 10px; letter-spacing: 0.1em; color: var(--text-3); text-transform: uppercase; border-bottom: 1px solid var(--border); }
        .rl-table td { padding: 13px 16px; border-bottom: 1px solid var(--border); color: var(--text-2); }
        .rl-table tr:last-child td { border-bottom: none; }
        .rl-table .hl td { color: var(--text); }
        .rl-badge { font-size: 10px; padding: 2px 8px; letter-spacing: 0.08em; }
        .rl-badge.free { background: rgba(90,158,111,0.1); color: var(--green); border: 1px solid rgba(90,158,111,0.3); }
        .rl-badge.token { background: var(--orange-lo); color: var(--orange); border: 1px solid rgba(234,140,30,0.25); }
        .stack-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; }
        .stack-item {
          background: var(--bg-card); border: 1px solid var(--border);
          padding: 20px; transition: border-color 0.15s;
        }
        .stack-item:hover { border-color: var(--border-hi); }
        .stack-badge { font-size: 9px; letter-spacing: 0.12em; color: var(--text-3); margin-bottom: 10px; text-transform: uppercase; }
        .stack-name { font-size: 14px; font-weight: 700; margin-bottom: 6px; }
        .stack-role { font-size: 11px; color: var(--text-2); line-height: 1.55; }
        .docs-cta { text-align: center; padding: 80px 40px; border-top: 1px solid var(--border); }
        @media (max-width: 640px) {
          .stack-grid { grid-template-columns: 1fr 1fr; }
          .pipeline-item { grid-template-columns: 36px 1fr; }
          .docs-body { padding: 0 20px 60px; }
        }
      `}</style>

      {/* Hero */}
      <div className="docs-hero">
        <span className="tag">[ TECHNICAL DOCS ]</span>
        <h1>How Garfield<br /><em style={{ color: 'var(--orange)', fontStyle: 'normal' }}>judges your code.</em></h1>
        <p>Everything under the hood — the roast pipeline, API reference, rate limits, and the stack that makes Garfield&apos;s brutal honesty possible.</p>
      </div>

      <div className="docs-body">

        {/* Pipeline */}
        <div className="docs-section">
          <div className="docs-label">THE PIPELINE</div>
          <div className="docs-h2">From GitHub URL to verdict</div>
          <div className="pipeline-list">
            {PIPELINE.map(({ n, title, desc }) => (
              <div key={n} className="pipeline-item">
                <div className="pipeline-n">{n} /</div>
                <div>
                  <div className="pipeline-title">{title}</div>
                  <div className="pipeline-desc">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Reference */}
        <div className="docs-section">
          <div className="docs-label">API REFERENCE</div>
          <div className="docs-h2">Endpoints</div>
          <div className="api-cards">

            <div className="api-card">
              <div className="api-card-head">
                <span className="api-method">POST</span>
                <span className="api-path">/api/roast</span>
                <span className="api-desc">Runs the full roast pipeline</span>
              </div>
              <div className="api-body">
                <div className="api-subtitle">Request body</div>
                <div className="code-block">{`{
  <span class="ck">"repoUrl"</span>: <span class="cs">"owner/repo"</span>,   <span class="cs">// GitHub owner/repo slug</span>
  <span class="ck">"mode"</span>:    <span class="cs">"savage"</span>     <span class="cs">// "savage" | "snarky" | "gentle"</span>
}`}</div>
                <div className="api-subtitle">Response (200)</div>
                <div className="code-block">{`{
  <span class="ck">"score"</span>:     <span class="cv">7</span>,
  <span class="ck">"verdict"</span>:   <span class="cs">"One devastating sentence."</span>,
  <span class="ck">"roastItems"</span>: [
    { <span class="ck">"file"</span>: <span class="cs">"src/utils.js"</span>, <span class="ck">"text"</span>: <span class="cs">"..."</span>, <span class="ck">"severity"</span>: <span class="cs">"critical"</span> }
  ],
  <span class="ck">"captions"</span>: [<span class="cs">"tweet 1"</span>, <span class="cs">"tweet 2"</span>, <span class="cs">"tweet 3"</span>]
}`}</div>
                <div className="api-subtitle">Error responses</div>
                <div className="code-block">{`<span class="cv">429</span>  { <span class="ck">"error"</span>: <span class="cs">"rate_limit"</span> }      // 3 roasts/day exceeded
<span class="cv">422</span>  { <span class="ck">"error"</span>: <span class="cs">"repo_fetch_failed"</span> } // repo unreadable/empty
<span class="cv">500</span>  { <span class="ck">"error"</span>: <span class="cs">"ai_error"</span> }          // Claude API failure`}</div>
              </div>
            </div>

            <div className="api-card">
              <div className="api-card-head">
                <span className="api-method" style={{ background: 'rgba(90,158,111,0.1)', color: 'var(--green)', border: '1px solid rgba(90,158,111,0.3)' }}>GET</span>
                <span className="api-path">/api/repo-meta</span>
                <span className="api-desc">Fetches repository metadata</span>
              </div>
              <div className="api-body">
                <div className="api-subtitle">Query params</div>
                <div className="code-block">{`?<span class="ck">repo</span>=<span class="cs">owner/repo</span>`}</div>
                <div className="api-subtitle">Response (200)</div>
                <div className="code-block">{`{
  <span class="ck">"name"</span>:          <span class="cs">"owner/repo"</span>,
  <span class="ck">"description"</span>:   <span class="cs">"..."</span>,
  <span class="ck">"stars"</span>:         <span class="cv">142</span>,
  <span class="ck">"language"</span>:      <span class="cs">"TypeScript"</span>,
  <span class="ck">"defaultBranch"</span>: <span class="cs">"main"</span>,
  <span class="ck">"isPrivate"</span>:     <span class="cv">false</span>,
  <span class="ck">"size"</span>:          <span class="cv">2048</span>
}`}</div>
              </div>
            </div>

          </div>
        </div>

        {/* Rate Limits */}
        <div className="docs-section">
          <div className="docs-label">RATE LIMITS</div>
          <div className="docs-h2">Usage limits</div>
          <table className="rl-table">
            <thead>
              <tr>
                <th>Limit</th>
                <th>Value</th>
                <th>Scope</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hl">
                <td>Roasts per day</td>
                <td>3</td>
                <td>Per IP address</td>
                <td><span className="rl-badge free">FREE</span></td>
              </tr>
              <tr>
                <td>GitHub API (no token)</td>
                <td>60 req / hr</td>
                <td>Per IP address</td>
                <td><span className="rl-badge free">DEFAULT</span></td>
              </tr>
              <tr>
                <td>GitHub API (with token)</td>
                <td>5,000 req / hr</td>
                <td>Per token</td>
                <td><span className="rl-badge token">RECOMMENDED</span></td>
              </tr>
              <tr>
                <td>Result cache TTL</td>
                <td>24 hours</td>
                <td>Per repo + mode</td>
                <td><span className="rl-badge token">REDIS</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Stack */}
        <div className="docs-section">
          <div className="docs-label">UNDER THE HOOD</div>
          <div className="docs-h2">The stack</div>
          <div className="stack-grid">
            {STACK.map(({ name, role, badge }) => (
              <div key={name} className="stack-item">
                <div className="stack-badge">{badge}</div>
                <div className="stack-name">{name}</div>
                <div className="stack-role">{role}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* CTA */}
      <div className="docs-cta">
        <span className="tag" style={{ marginBottom: '24px', display: 'inline-block' }}>[ GET STARTED ]</span>
        <h2 style={{ fontSize: 'clamp(24px,3.5vw,44px)', fontWeight: 800, marginBottom: '14px' }}>
          Ready to face the truth?
        </h2>
        <p style={{ color: 'var(--text-2)', marginBottom: '32px', fontSize: '13px' }}>
          3 free roasts per day. No account. No mercy.
        </p>
        <button className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '13px' }} onClick={() => router.push('/roast')}>
          <IconFlame size={15} />
          ROAST MY REPO
        </button>
      </div>

    </div>
  );
}
