'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { IconFlame } from '../icons';

const NAV = [
  { group: 'GETTING STARTED', items: [
    { id: 'overview',    label: 'Overview' },
    { id: 'quickstart',  label: 'Quick Start' },
  ]},
  { group: 'HOW IT WORKS', items: [
    { id: 'pipeline',    label: 'The Pipeline' },
    { id: 'modes',       label: 'Roast Modes' },
    { id: 'scoring',     label: 'Score System' },
    { id: 'security',    label: 'Security Pre-scan' },
  ]},
  { group: 'API', items: [
    { id: 'api-roast',   label: 'POST /api/roast' },
    { id: 'api-meta',    label: 'GET /api/repo-meta' },
    { id: 'api-errors',  label: 'Error Codes' },
  ]},
  { group: 'CONFIGURATION', items: [
    { id: 'rate-limits', label: 'Rate Limits' },
    { id: 'github-token',label: 'GitHub Token' },
    { id: 'redis',       label: 'Redis Cache' },
    { id: 'env-vars',    label: 'Environment Vars' },
  ]},
  { group: 'DEPLOYMENT', items: [
    { id: 'stack',       label: 'Tech Stack' },
    { id: 'self-hosting',label: 'Self-hosting' },
  ]},
  { group: 'LEGAL', items: [
    { id: 'privacy',     label: 'Privacy & Data' },
  ]},
];

function CodeBlock({ children }: { children: string }) {
  return (
    <pre style={{
      background: 'var(--bg)', border: '1px solid var(--border)',
      padding: '16px 18px', fontSize: '12px', lineHeight: 1.75,
      color: 'var(--text-2)', overflowX: 'auto', margin: '12px 0 20px',
      scrollbarWidth: 'thin',
    }}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  );
}

function Section({ id, title, tag, children }: { id: string; title: string; tag?: string; children: React.ReactNode }) {
  return (
    <section data-section={id} id={id} style={{ paddingTop: '64px', marginTop: '-8px' }}>
      {tag && <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '8px' }}>{tag}</div>}
      <h2 style={{ fontSize: 'clamp(20px,2.5vw,30px)', fontWeight: 800, letterSpacing: '-0.01em', marginBottom: '24px', lineHeight: 1.1 }}>{title}</h2>
      {children}
      <div style={{ height: '1px', background: 'var(--border)', marginTop: '64px' }} />
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.75, marginBottom: '14px' }}>{children}</p>;
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', marginBottom: '20px' }}>
      <thead>
        <tr>{headers.map(h => <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--text-3)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
            {row.map((cell, j) => <td key={j} style={{ padding: '12px 14px', color: j === 0 ? 'var(--text)' : 'var(--text-2)', verticalAlign: 'top' }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Badge({ children, color = 'orange' }: { children: string; color?: 'orange' | 'green' | 'red' }) {
  const colors = {
    orange: { bg: 'var(--orange-lo)', color: 'var(--orange)', border: 'rgba(234,140,30,0.25)' },
    green:  { bg: 'rgba(90,158,111,0.1)', color: 'var(--green)', border: 'rgba(90,158,111,0.3)' },
    red:    { bg: 'rgba(192,83,78,0.1)', color: 'var(--red)', border: 'rgba(192,83,78,0.3)' },
  };
  const c = colors[color];
  return (
    <span style={{ fontSize: '10px', padding: '2px 8px', letterSpacing: '0.08em', background: c.bg, color: c.color, border: `1px solid ${c.border}`, display: 'inline-block' }}>
      {children}
    </span>
  );
}

export default function DocsPage() {
  const router = useRouter();
  const [active, setActive] = useState('overview');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActive((entry.target as HTMLElement).dataset.section || '');
        }
      }
    }, { rootMargin: '-10% 0px -80% 0px', threshold: 0 });
    document.querySelectorAll('[data-section]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ paddingTop: '52px', minHeight: '100vh' }}>
      <style>{`
        .docs-sidebar-link { display:block; padding:6px 20px 6px 16px; font-size:12px; color:var(--text-2); cursor:pointer; transition:color 0.12s; border-left:2px solid transparent; letter-spacing:0.02em; }
        .docs-sidebar-link:hover { color:var(--text); }
        .docs-sidebar-link.active { color:var(--orange); border-left-color:var(--orange); background:var(--orange-lo); }
        .docs-sidebar-group { font-size:9.5px; font-weight:700; letter-spacing:0.14em; color:var(--text-3); padding:18px 16px 6px; text-transform:uppercase; }
        .docs-sidebar-group:first-child { padding-top:28px; }
        .docs-callout { background:var(--bg-card); border:1px solid var(--border); border-left:3px solid var(--orange); padding:14px 18px; font-size:12px; color:var(--text-2); line-height:1.65; margin-bottom:20px; }
        .docs-callout strong { color:var(--text); }
        .docs-step { display:grid; grid-template-columns:40px 1fr; gap:16px; background:var(--bg-card); border:1px solid var(--border); padding:18px 20px; margin-bottom:1px; }
        .docs-step:hover { border-color:var(--border-hi); }
        .docs-step-n { font-size:10px; color:var(--orange); font-weight:700; letter-spacing:0.1em; padding-top:2px; }
        .docs-step-title { font-size:13px; font-weight:700; margin-bottom:5px; }
        .docs-step-body { font-size:12px; color:var(--text-2); line-height:1.65; }
        .api-card { background:var(--bg-card); border:1px solid var(--border); overflow:hidden; margin-bottom:20px; }
        .api-card-head { display:flex; align-items:center; gap:12px; padding:14px 18px; border-bottom:1px solid var(--border); }
        .api-method { font-size:11px; font-weight:800; letter-spacing:0.1em; padding:3px 10px; }
        .api-method.post { background:var(--orange-lo); color:var(--orange); border:1px solid rgba(234,140,30,0.25); }
        .api-method.get  { background:rgba(90,158,111,0.1); color:var(--green); border:1px solid rgba(90,158,111,0.3); }
        .api-path { font-size:13px; font-weight:700; }
        .api-desc { font-size:11.5px; color:var(--text-2); margin-left:auto; }
        .api-body { padding:18px 20px; }
        .api-sub { font-size:10px; letter-spacing:0.1em; color:var(--text-3); text-transform:uppercase; margin-bottom:8px; font-weight:600; }
        .mode-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; margin-bottom:20px; }
        .mode-card { background:var(--bg-card); border:1px solid var(--border); padding:20px; }
        .mode-card-name { font-size:12px; font-weight:800; letter-spacing:0.08em; margin-bottom:8px; }
        .mode-card-range { font-size:11px; color:var(--orange); margin-bottom:8px; }
        .mode-card-desc { font-size:11.5px; color:var(--text-2); line-height:1.6; }
        .stack-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1px; }
        .stack-card { background:var(--bg-card); border:1px solid var(--border); padding:18px 20px; }
        .stack-card-badge { font-size:9px; letter-spacing:0.12em; color:var(--text-3); margin-bottom:8px; text-transform:uppercase; }
        .stack-card-name { font-size:14px; font-weight:700; margin-bottom:5px; }
        .stack-card-desc { font-size:11.5px; color:var(--text-2); line-height:1.55; }
        @media (max-width:768px) {
          .docs-layout { grid-template-columns:1fr !important; }
          .docs-sidebar-col { display:none; }
          .mode-grid { grid-template-columns:1fr; }
          .stack-grid { grid-template-columns:1fr; }
        }
      `}</style>

      {/* Docs hero */}
      <div style={{ padding: '52px 40px 44px', textAlign: 'center', borderBottom: '1px solid var(--border)', background: 'radial-gradient(ellipse 55% 60% at 50% 0%, rgba(234,140,30,0.06) 0%, transparent 70%)' }}>
        <span className="tag" style={{ marginBottom: '24px', display: 'inline-block' }}>[ TECHNICAL DOCS ]</span>
        <h1 style={{ fontSize: 'clamp(28px,4.5vw,56px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '14px' }}>
          How Garfield<br /><span style={{ color: 'var(--orange)' }}>judges your code.</span>
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--text-2)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
          Everything under the hood — the roast pipeline, API reference, rate limits, deployment, and how to get the most out of Garfield&apos;s brutal honesty.
        </p>
      </div>

      {/* Layout */}
      <div className="docs-layout" style={{ display: 'grid', gridTemplateColumns: '220px 1fr' }}>

        {/* Sidebar */}
        <div className="docs-sidebar-col" style={{ borderRight: '1px solid var(--border)', position: 'sticky', top: '52px', height: 'calc(100vh - 52px)', overflowY: 'auto', background: 'var(--bg-card)', scrollbarWidth: 'thin' }}>
          {NAV.map(({ group, items }) => (
            <div key={group}>
              <div className="docs-sidebar-group">{group}</div>
              {items.map(({ id, label }) => (
                <div key={id} className={`docs-sidebar-link ${active === id ? 'active' : ''}`} onClick={() => scrollTo(id)}>
                  {label}
                </div>
              ))}
            </div>
          ))}
          <div style={{ height: '40px' }} />
        </div>

        {/* Main content */}
        <div ref={mainRef} style={{ maxWidth: '740px', padding: '0 52px 100px', margin: '0 auto' }}>

          <Section id="overview" title="What is Garfield Roast?" tag="overview">
            <P>Garfield Roast is a developer tool that uses Claude AI to analyze public GitHub repositories and deliver brutal, specific, developer-culture-aware code reviews — formatted as shareable roast cards.</P>
            <P>Unlike generic linters, Garfield reads your <em>actual code</em> — file names, function names, patterns, architecture — and produces feedback that references real files and real problems. Then he makes it funny enough to screenshot and post on X.</P>
            <div className="docs-callout">
              <strong>What makes it different:</strong> Most AI code review tools give generic advice. Garfield references <code>src/utils/doStuff.js</code> line 247 specifically and explains why naming a function <code>handleTheThing</code> is a cry for help.
            </div>
            <Table
              headers={['Feature', 'Value']}
              rows={[
                ['Roasts per day', '3 (free, no account)'],
                ['Supported repos', 'Any public GitHub repository'],
                ['Analysis depth', 'Up to 60 files, 100KB each'],
                ['Response time', '15–60 seconds depending on repo size'],
                ['Output format', 'JSON: score, verdict, roastItems, captions'],
              ]}
            />
          </Section>

          <Section id="quickstart" title="Quick Start" tag="getting started">
            <P>No account needed. Paste a public GitHub URL and Garfield does the rest.</P>
            <div className="docs-step">
              <div className="docs-step-n">01 /</div>
              <div><div className="docs-step-title">Go to /roast</div><div className="docs-step-body">Navigate to the Roast page. Enter any public GitHub repo in <code>owner/repo</code> format. The chip preview confirms the repo exists.</div></div>
            </div>
            <div className="docs-step">
              <div className="docs-step-n">02 /</div>
              <div><div className="docs-step-title">Pick your mode</div><div className="docs-step-body">SAVAGE (score 1–6, no mercy), SNARKY (score 3–7, witty), or GENTLE (score 4–8, constructive). Mode affects tone and harshness, not the findings themselves.</div></div>
            </div>
            <div className="docs-step">
              <div className="docs-step-n">03 /</div>
              <div><div className="docs-step-title">Hit ROAST IT</div><div className="docs-step-body">Garfield wakes up, scans the repo, runs security checks, and writes the verdict. Takes 15–60 seconds. The progress bar tracks each stage.</div></div>
            </div>
            <div className="docs-step">
              <div className="docs-step-n">04 /</div>
              <div><div className="docs-step-title">Share the carnage</div><div className="docs-step-body">Pick a caption from the 3 generated options and hit SHARE ON X. html2canvas screenshots the roast card for a ready-to-post image.</div></div>
            </div>
          </Section>

          <Section id="pipeline" title="The Roast Pipeline" tag="how it works">
            <P>Every roast request executes these steps in order. No step is skipped, and the order is fixed — each step feeds into the next.</P>
            {[
              { n: '01', title: 'IP rate limit check', body: 'Server-side check via Upstash Redis. Each IP gets 3 roasts per 24-hour window. If Redis is unavailable, the check is skipped and localStorage rate limiting (client-side) acts as a soft guard.' },
              { n: '02', title: 'Input validation', body: 'The repoUrl is validated against /^[a-zA-Z0-9_.-]+\\/[a-zA-Z0-9_.-]+$/ before any network calls. Invalid format returns 400 immediately.' },
              { n: '03', title: 'Cache lookup', body: 'Redis is checked for a cached result keyed by repoUrl+mode. Cache hit returns immediately without touching the AI. Cache TTL is 24 hours.' },
              { n: '04', title: 'GitHub API fetch', body: 'The repo\'s default branch is resolved, then the full recursive file tree is fetched (/git/trees/{branch}?recursive=1). Files are filtered by extension and size, capped at 60 files × 100KB. No git binary required — pure HTTPS.' },
              { n: '05', title: 'Security pre-scan', body: 'Regex patterns run over the raw file content before AI sees it: AWS keys (AKIA...), OpenAI tokens (sk-...), hardcoded passwords, private keys. Findings are injected into the prompt as CRITICAL items.' },
              { n: '06', title: 'Claude AI analysis', body: 'The packed repository XML is sent to Claude with a system prompt encoding Garfield\'s persona, analysis skills (architecture, naming, security, tech debt, dependencies, docs), and strict JSON output schema.' },
              { n: '07', title: 'JSON parse & validate', body: 'Claude\'s response is cleaned of markdown fences and parsed. The schema requires: score (integer 1–10), verdict (string), roastItems (array, 4–8 items), captions (array of 3 strings).' },
              { n: '08', title: 'Cache & return', body: 'The result is written to Redis with 24h TTL (keyed by repoUrl+mode), then returned to the client as JSON.' },
            ].map(({ n, title, body }) => (
              <div key={n} className="docs-step">
                <div className="docs-step-n">{n} /</div>
                <div><div className="docs-step-title">{title}</div><div className="docs-step-body">{body}</div></div>
              </div>
            ))}
          </Section>

          <Section id="modes" title="Roast Modes" tag="how it works">
            <P>Mode controls Garfield&apos;s tone and the expected score range. The underlying analysis is identical — the same files, same security checks, same findings. Only the <em>delivery</em> changes.</P>
            <div className="mode-grid">
              <div className="mode-card">
                <div className="mode-card-name" style={{ color: 'var(--red)' }}>SAVAGE</div>
                <div className="mode-card-range">Score range: 1–6</div>
                <div className="mode-card-desc">No mercy. Every finding is amplified. Garfield is personally offended by your architecture choices. Best for repos you want brutally torn apart.</div>
              </div>
              <div className="mode-card">
                <div className="mode-card-name" style={{ color: 'var(--orange)' }}>SNARKY</div>
                <div className="mode-card-range">Score range: 3–7</div>
                <div className="mode-card-desc">Witty over brutal. Raised-eyebrow energy. Garfield is sardonic and clever rather than enraged. The most shareable mode for X posts.</div>
              </div>
              <div className="mode-card">
                <div className="mode-card-name" style={{ color: 'var(--green)' }}>GENTLE</div>
                <div className="mode-card-range">Score range: 4–8</div>
                <div className="mode-card-desc">Still honest, still Garfield. He had his lasagna today. Constructive feedback with specific actionable suggestions. For repos you actually want to improve.</div>
              </div>
            </div>
            <div className="docs-callout">
              <strong>Same repo, different modes:</strong> Running the same repo in SAVAGE and GENTLE will find the same issues but frame them differently. SAVAGE: <em>&quot;This isn&apos;t a utils file, it&apos;s a confession.&quot;</em> GENTLE: <em>&quot;utils.js is carrying too much responsibility — consider splitting by domain.&quot;</em>
            </div>
          </Section>

          <Section id="scoring" title="Score System" tag="how it works">
            <P>The score is an integer from 1–10, set by Claude based on the overall quality of the codebase. It is influenced by mode (SAVAGE biases lower, GENTLE biases higher) but ultimately reflects the actual findings.</P>
            <Table
              headers={['Score', 'Label', 'What it means']}
              rows={[
                ['1–2', 'Catastrophic', 'Multiple security incidents, no structure, committed secrets'],
                ['3–4', 'Poor', 'Major architecture problems, widespread naming issues'],
                ['5–6', 'Below average', 'Functional but sloppy. TODOs everywhere. No docs.'],
                ['7', 'Average', 'Works. Has problems. Most repos land here.'],
                ['8–9', 'Good', 'Clean structure, reasonable naming, some docs'],
                ['10', 'Excellent', 'Garfield gives this to maybe 1 in 100 repos'],
              ]}
            />
            <P>The score is displayed in the result panel colored by range: red (≤3), orange (4–6), green (7+). It appears on the shareable card.</P>
          </Section>

          <Section id="security" title="Security Pre-scan" tag="how it works">
            <P>Before Claude sees any code, a regex-based pre-scan runs over the packed file content. Findings are injected into the system prompt as CRITICAL items, ensuring Claude calls them out specifically.</P>
            <Table
              headers={['Pattern', 'Finding ID', 'What it catches']}
              rows={[
                ['/AKIA[0-9A-Z]{16}/', 'COMMITTED_AWS_KEY', 'AWS IAM access key IDs in source code'],
                ['/sk-[a-zA-Z0-9]{48}/', 'COMMITTED_OPENAI_KEY', 'OpenAI API keys committed to the repo'],
                ['/password\\s*[:=]\\s*["\'][^"\']{4,}["\']/i', 'HARDCODED_PASSWORD', 'Hardcoded password strings in any file'],
                ['/-----BEGIN (RSA |EC )?PRIVATE KEY-----/', 'PRIVATE_KEY_IN_CODE', 'Private key material committed directly'],
              ]}
            />
            <div className="docs-callout">
              <strong>Note:</strong> The pre-scan is additive — it makes existing security findings <em>louder</em> in the output. It does not replace Claude&apos;s own security analysis, which also catches eval(), missing validation, wildcard CORS, and unsafe deserialization patterns.
            </div>
          </Section>

          <Section id="api-roast" title="POST /api/roast" tag="API">
            <P>Runs the full roast pipeline. This is a server action that calls the GitHub API and Claude. Expect 15–60 second response time.</P>
            <div className="api-card">
              <div className="api-card-head">
                <span className="api-method post">POST</span>
                <span className="api-path">/api/roast</span>
              </div>
              <div className="api-body">
                <div className="api-sub">Request body (application/json)</div>
                <CodeBlock>{`{
  <span style="color:#7fb8d4">"repoUrl"</span>: <span style="color:#96ba78">"owner/repo"</span>,   <span style="color:#4e4e45">// required — GitHub owner/repo slug, not full URL</span>
  <span style="color:#7fb8d4">"mode"</span>:    <span style="color:#96ba78">"savage"</span>       <span style="color:#4e4e45">// "savage" | "snarky" | "gentle"</span>
}`}</CodeBlock>
                <div className="api-sub">Response — 200 OK</div>
                <CodeBlock>{`{
  <span style="color:#7fb8d4">"score"</span>:      <span style="color:#d4a574">7</span>,
  <span style="color:#7fb8d4">"verdict"</span>:    <span style="color:#96ba78">"One devastating sentence summarizing the repo's quality."</span>,
  <span style="color:#7fb8d4">"roastItems"</span>: [
    {
      <span style="color:#7fb8d4">"file"</span>:     <span style="color:#96ba78">"src/utils/helpers.js"</span>,
      <span style="color:#7fb8d4">"text"</span>:     <span style="color:#96ba78">"Specific roast referencing this file."</span>,
      <span style="color:#7fb8d4">"severity"</span>: <span style="color:#96ba78">"critical"</span>  <span style="color:#4e4e45">// "critical" | "warning" | "note"</span>
    }
  ],
  <span style="color:#7fb8d4">"captions"</span>: [
    <span style="color:#96ba78">"Tweet caption 1 — with score"</span>,
    <span style="color:#96ba78">"Tweet caption 2 — quoting verdict"</span>,
    <span style="color:#96ba78">"Tweet caption 3 — self-deprecating dev humor"</span>
  ]
}`}</CodeBlock>
              </div>
            </div>
          </Section>

          <Section id="api-meta" title="GET /api/repo-meta" tag="API">
            <P>Fetches repository metadata from the GitHub API. Used by the roast input page to show the repo chip preview before roasting.</P>
            <div className="api-card">
              <div className="api-card-head">
                <span className="api-method get">GET</span>
                <span className="api-path">/api/repo-meta</span>
              </div>
              <div className="api-body">
                <div className="api-sub">Query parameters</div>
                <CodeBlock>{`?<span style="color:#7fb8d4">repo</span>=<span style="color:#96ba78">owner/repo</span>`}</CodeBlock>
                <div className="api-sub">Response — 200 OK</div>
                <CodeBlock>{`{
  <span style="color:#7fb8d4">"name"</span>:          <span style="color:#96ba78">"owner/repo"</span>,
  <span style="color:#7fb8d4">"description"</span>:   <span style="color:#96ba78">"Repository description"</span>,
  <span style="color:#7fb8d4">"stars"</span>:         <span style="color:#d4a574">142</span>,
  <span style="color:#7fb8d4">"language"</span>:      <span style="color:#96ba78">"TypeScript"</span>,
  <span style="color:#7fb8d4">"defaultBranch"</span>: <span style="color:#96ba78">"main"</span>,
  <span style="color:#7fb8d4">"isPrivate"</span>:     <span style="color:#d4a574">false</span>,
  <span style="color:#7fb8d4">"size"</span>:          <span style="color:#d4a574">2048</span>   <span style="color:#4e4e45">// KB</span>
}`}</CodeBlock>
                <P>Response is cached via <code>Cache-Control: s-maxage=300</code> (5 minutes at the CDN).</P>
              </div>
            </div>
          </Section>

          <Section id="api-errors" title="Error Codes" tag="API">
            <Table
              headers={['Status', 'Error field', 'Cause', 'When']}
              rows={[
                ['400', 'invalid_repo', 'repoUrl failed format validation', 'POST /api/roast — bad slug format'],
                ['404', 'not_found', 'GitHub returned non-200 for the repo', 'GET /api/repo-meta — repo does not exist or is private'],
                ['422', 'repo_fetch_failed', 'Could not fetch or pack the repository', 'POST /api/roast — repo empty, too large, or access denied'],
                ['429', 'rate_limit', '3 roasts/day per IP exceeded', 'POST /api/roast — Redis rate limit hit'],
                ['500', 'ai_error', 'Claude API call failed', 'POST /api/roast — OpenRouter / Claude issue'],
                ['500', 'parse_error', 'Claude returned malformed JSON', 'POST /api/roast — rare, retry usually fixes it'],
                ['503', 'rate_limited', 'GitHub API rate limit (60/hr no token)', 'GET /api/repo-meta — add GITHUB_TOKEN to fix'],
              ]}
            />
          </Section>

          <Section id="rate-limits" title="Rate Limits" tag="configuration">
            <Table
              headers={['Limit', 'Value', 'Scope', 'How to raise']}
              rows={[
                ['Roasts per day', '3', 'Per IP (server) + localStorage (client)', 'N/A — by design'],
                ['GitHub API (no token)', '60 req/hr', 'Per IP', 'Add GITHUB_TOKEN env var'],
                ['GitHub API (with token)', '5,000 req/hr', 'Per token', 'Each roast uses ~12 API calls'],
                ['Redis cache TTL', '24 hours', 'Per repo+mode key', 'Configurable in route.ts'],
                ['Max files per repo', '60 files', 'Per roast request', 'Configurable in packRepo()'],
                ['Max file size', '100 KB', 'Per file', 'Configurable in packRepo()'],
                ['Max packed content', '80,000 chars', 'Total after packing', 'Truncated at this limit'],
                ['AI max tokens', '2,048', 'Claude response', 'Sufficient for 8 roast items'],
              ]}
            />
            <div className="docs-callout">
              <strong>Rate limit behavior:</strong> When Redis is unavailable (e.g., env vars not set), server-side rate limiting is skipped. The client-side localStorage guard (3/day) still applies as a soft limit. For production, Redis is strongly recommended.
            </div>
          </Section>

          <Section id="github-token" title="GitHub Token Setup" tag="configuration">
            <P>Without a GitHub token, the GitHub API allows 60 requests per hour per IP. Each roast uses ~12 API calls. At 60/hour, you can do about 5 roasts before hitting the limit. A token raises this to 5,000/hour.</P>
            <div className="docs-step">
              <div className="docs-step-n">01 /</div>
              <div><div className="docs-step-title">Generate token</div><div className="docs-step-body">Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token.</div></div>
            </div>
            <div className="docs-step">
              <div className="docs-step-n">02 /</div>
              <div><div className="docs-step-title">Select scope</div><div className="docs-step-body">Check <code>public_repo</code> only. No write access needed. The token is only used to read public repository data.</div></div>
            </div>
            <div className="docs-step">
              <div className="docs-step-n">03 /</div>
              <div><div className="docs-step-title">Add to environment</div><div className="docs-step-body">Set <code>GITHUB_TOKEN=ghp_your_token_here</code> in <code>.env.local</code> for local dev, and in Vercel env vars for production. No spaces around the value.</div></div>
            </div>
            <div className="docs-callout">
              <strong>Security:</strong> Never share your token in chat, commit it to source control, or paste it in public channels. GitHub automatically revokes tokens it detects in public repositories.
            </div>
          </Section>

          <Section id="redis" title="Redis Cache Setup" tag="configuration">
            <P>Upstash Redis provides serverless Redis with a generous free tier (10,000 commands/day). Each roast uses ~4 Redis commands. The free tier supports ~2,500 roasts/day.</P>
            <div className="docs-step">
              <div className="docs-step-n">01 /</div>
              <div><div className="docs-step-title">Create database</div><div className="docs-step-body">Go to upstash.com → Create account → Create Database. Choose Redis, region US-East-1 (lowest latency with Vercel), Free tier.</div></div>
            </div>
            <div className="docs-step">
              <div className="docs-step-n">02 /</div>
              <div><div className="docs-step-title">Copy credentials</div><div className="docs-step-body">In the database dashboard → REST API tab. Copy <code>UPSTASH_REDIS_REST_URL</code> and <code>UPSTASH_REDIS_REST_TOKEN</code>.</div></div>
            </div>
            <div className="docs-step">
              <div className="docs-step-n">03 /</div>
              <div><div className="docs-step-title">Set env vars</div><div className="docs-step-body">Add both to <code>.env.local</code> and to Vercel env vars. The app validates URL format on startup and gracefully skips Redis if the values are placeholder strings.</div></div>
            </div>
            <P>Without Redis, the app falls back to stateless operation: no caching (every request re-runs Claude), and no server-side rate limiting (client localStorage only).</P>
          </Section>

          <Section id="env-vars" title="Environment Variables" tag="configuration">
            <Table
              headers={['Variable', 'Required', 'Description']}
              rows={[
                ['OPENROUTER_API_KEY', 'Yes', 'OpenRouter API key for Claude access. Get from openrouter.ai'],
                ['GITHUB_TOKEN', 'Recommended', 'GitHub PAT (public_repo scope). Raises rate limit from 60 to 5000/hr'],
                ['UPSTASH_REDIS_REST_URL', 'Recommended', 'Upstash Redis REST URL. Required for caching and rate limiting'],
                ['UPSTASH_REDIS_REST_TOKEN', 'Recommended', 'Upstash Redis REST token. Paired with the URL above'],
              ]}
            />
          </Section>

          <Section id="stack" title="Tech Stack" tag="deployment">
            <div className="stack-grid">
              {[
                { badge: 'FRAMEWORK', name: 'Next.js 14', desc: 'App Router. API routes run as Vercel serverless functions. Static pages for landing, roast, result, and docs.' },
                { badge: 'AI', name: 'Claude (via OpenRouter)', desc: 'claude-sonnet model. System prompt encodes Garfield persona, analysis skills, and strict JSON output schema.' },
                { badge: 'DATA', name: 'GitHub API', desc: 'REST API v3 for repo metadata, file tree, and raw file content. No git binary required — pure HTTPS fetch.' },
                { badge: 'CACHE', name: 'Upstash Redis', desc: 'Serverless Redis for 24h result caching and IP-based rate limiting. Free tier: 10K commands/day.' },
                { badge: 'HOSTING', name: 'Vercel', desc: 'Edge network deployment. maxDuration=60s on /api/roast. Auto-deploys from GitHub on push to master.' },
                { badge: 'SCREENSHOT', name: 'html2canvas', desc: 'Loaded via CDN. Converts the roast panel DOM to a PNG canvas for the Share to X flow.' },
              ].map(({ badge, name, desc }) => (
                <div key={name} className="stack-card">
                  <div className="stack-card-badge">{badge}</div>
                  <div className="stack-card-name">{name}</div>
                  <div className="stack-card-desc">{desc}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="self-hosting" title="Self-hosting" tag="deployment">
            <P>Fork the repo, set your env vars, and deploy to Vercel in under 10 minutes.</P>
            <CodeBlock>{`<span style="color:#4e4e45"># 1. Clone</span>
git clone https://github.com/spooky-may/project-garfield
cd project-garfield

<span style="color:#4e4e45"># 2. Install dependencies</span>
npm install

<span style="color:#4e4e45"># 3. Configure environment</span>
cp .env.example .env.local
<span style="color:#4e4e45"># Fill in OPENROUTER_API_KEY, GITHUB_TOKEN, UPSTASH_*</span>

<span style="color:#4e4e45"># 4. Run locally</span>
npm run dev

<span style="color:#4e4e45"># 5. Deploy to Vercel</span>
npx vercel --prod

<span style="color:#4e4e45"># 6. Add env vars to Vercel</span>
npx vercel env add OPENROUTER_API_KEY production
npx vercel env add GITHUB_TOKEN production
npx vercel env add UPSTASH_REDIS_REST_URL production
npx vercel env add UPSTASH_REDIS_REST_TOKEN production`}</CodeBlock>
            <div className="docs-callout">
              <strong>Vercel settings to check:</strong> The <code>vercel.json</code> in this repo already sets <code>maxDuration: 60</code> for the roast API route. If you see timeout errors, verify this config is deployed. Node.js version should be 20.x.
            </div>
          </Section>

          <Section id="privacy" title="Privacy & Data" tag="legal">
            <P>Garfield Roast is designed to handle as little data as possible.</P>
            <Table
              headers={['What', 'Stored?', 'Where', 'For how long']}
              rows={[
                ['GitHub repo URL + mode', 'Yes (cache key)', 'Upstash Redis', '24 hours, then auto-expired'],
                ['Packed repository content', 'Never', '—', 'Processed in-memory, never persisted'],
                ['Roast result (JSON)', 'Yes (cached result)', 'Upstash Redis', '24 hours, then auto-expired'],
                ['IP address', 'Yes (rate limiting)', 'Upstash Redis', '24 hours (resets daily)'],
                ['GitHub credentials', 'Never', '—', 'Token is server-side env var only'],
                ['User account / email', 'Never', '—', 'No authentication system exists'],
                ['Roast history', 'Never', '—', 'Results are not linked across sessions'],
              ]}
            />
            <div className="docs-callout">
              <strong>Public repos only:</strong> Garfield Roast only processes public GitHub repositories. Private repos return a 404 from the GitHub API and are never accessed. Your private code is never seen by this service.
            </div>
            <P>The service does not use analytics, tracking pixels, or third-party telemetry beyond what Vercel collects by default (basic request logs).</P>
          </Section>

        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '72px 40px', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: 'clamp(22px,3vw,38px)', fontWeight: 800, marginBottom: '12px' }}>Ready to face the truth?</h2>
        <p style={{ color: 'var(--text-2)', marginBottom: '30px', fontSize: '13px' }}>3 free roasts per day. No account. No mercy.</p>
        <button className="btn btn-primary" style={{ padding: '14px 38px', fontSize: '13px' }} onClick={() => router.push('/roast')}>
          <IconFlame size={14} /> ROAST MY REPO
        </button>
      </div>
    </div>
  );
}
