'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const LAUGH_FRAMES = [
` /\\_/\\
(  ^  ^ )
(= · = )
 \\___/`,
` /\\_/\\
(  x  x )
(= · = )
 \\___/`,
` /\\_/\\
(  ^  x )
(= · = )
 \\___/`,
` /\\_/\\
(  x  ^ )
(= · = )
 \\___/`,
` /\\_/\\
(  ^  ^ )
(= · = )
 \\___/`,
` /\\_/\\
(  x  x )
(= · = )
 \\___/`,
` /\\_/\\
(  ^  x )
(= · = )
 \\___/`,
` /\\_/\\
(  x  ^ )
(= · = )
 \\___/`,
` /\\_/\\
(  ^  ^ )
(= · = )
 \\___/`,
` /\\_/\\
(  x  x )
(= · = )
 \\___/`,
` /\\_/\\
(  ^  ^ )
(= · = )
 \\___/`,
` /\\_/\\
(  x  x )
(= · = )
 \\___/`,
` /\\_/\\
(  ^  x )
(= · = )
 \\___/`,
` /\\_/\\
(  x  ^ )
(= · = )
 \\___/`,
];

const SHOCKED_FRAMES = [
` /\\_/\\
(  -  - )
(= · = )
 \\___/`,
` /\\_/\\
(  o  o )
(= · = )
 \\___/`,
` /\\_/\\
(  O  O )
(= · = )
 \\___/`,
` /\\_/\\
(  O  O )
(= · = )
 \\___/`,
` /\\_/\\
(  O  O )
(= · = )
 \\___/`,
` /\\_/\\
(  o  O )
(= · = )
 \\___/`,
` /\\_/\\
(  O  o )
(= · = )
 \\___/`,
` /\\_/\\
(  O  O )
(= · = )
 \\___/`,
` /\\_/\\
(  ?  ? )
(= · = )
 \\___/`,
` /\\_/\\
(  O  O )
(= · = )
 \\___/`,
` /\\_/\\
(  O  O )
(= · = )
 \\___/`,
` /\\_/\\
(  o  o )
(= · = )
 \\___/`,
` /\\_/\\
(  O  O )
(= · = )
 \\___/`,
` /\\_/\\
(  O  O )
(= · = )
 \\___/`,
];

const IDLE_FRAMES = [
` /\\_/\\
(  -  - )
(= · = )
 \\___/`,
` /\\_/\\
(  -  - )
(= · = )
 \\___/`,
` /\\_/\\
(  -  - )
(= · = )
 \\___/`,
` /\\_/\\
(  -  . )
(= · = )
 \\___/`,
` /\\_/\\
(  -  - )
(= · = )
 \\___/`,
` /\\_/\\
(  -  - )
(= · = )
 \\___/`,
` /\\_/\\
(  -  - )
(= · = )
 \\___/`,
` /\\_/\\
(  .  - )
(= · = )
 \\___/`,
` /\\_/\\
(  -  - )
(= · = )
 \\___/`,
` /\\_/\\
(  -  ◉ )
(= · = )
 \\___/`,
` /\\_/\\
(  -  - )
(= · = )
 \\___/`,
` /\\_/\\
(  -  - )
(= · = )
 \\___/`,
` /\\_/\\
(  ◉  - )
(= · = )
 \\___/`,
` /\\_/\\
(  -  - )
(= · = )
 \\___/`,
];
import { IconFolder, IconFile, IconFlame, IconShare, IconSmirk, IconCat } from '../icons';

declare const html2canvas: (el: HTMLElement, opts: Record<string, unknown>) => Promise<HTMLCanvasElement>;

interface RoastItem {
  file: string | null;
  text: string;
  severity: string;
  badge: string;
  isBank: boolean;
}
interface RoastResult {
  score: number;
  verdict: string;
  repoType: string;
  roastItems: RoastItem[];
  captionOptions: { label: string; text: string }[];
}
interface StoredState {
  result: RoastResult;
  repo: string;
  mode: string;
  files: { path: string }[];
  meta: Record<string, unknown> | null;
}

const CAPTION_ICONS = [IconFlame, IconShare, IconSmirk, IconCat];
const CAPTION_LABELS = ['Standard', 'Challenge', 'Humble', 'Garfield Lore'];
const PREVIEW_LEN = 220;

// Deterministic unique highlight lines per file — hash of filename → line indices
function getHighlightLines(path: string, totalLines: number): Set<number> {
  if (totalLines < 6) return new Set();
  let h = 0;
  for (let i = 0; i < path.length; i++) h = (Math.imul(31, h) + path.charCodeAt(i)) | 0;
  h = Math.abs(h);
  const cap = Math.min(totalLines - 1, 100);
  const count = 3 + (h % 4);
  const lines = new Set<number>();
  for (let i = 0; lines.size < count && i < count * 5; i++) {
    const ln = Math.abs((Math.imul(h ^ (i * 2654435761 | 0), 1664525) | 0)) % cap;
    if (ln > 0) lines.add(ln);
  }
  return lines;
}

const SCORE_LABELS: Record<number, string> = {
  1: 'ARCHITECTURAL TRAGEDY', 2: 'PLEASE REFACTOR',
  3: 'GARFIELD IS SAD', 4: 'QUESTIONABLE CHOICES',
  5: 'AVERAGE CHAOS', 6: 'SURVIVABLE',
  7: 'NOT BAD, ACTUALLY', 8: 'GARFIELD IS IMPRESSED',
  9: 'SUSPICIOUSLY CLEAN', 10: 'GARFIELD RESPECTS THIS',
};

function highlight(line: string, path: string): string {
  const esc = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const isJs = /\.(js|ts|jsx|tsx|mjs|cjs)$/.test(path);
  const isPy = /\.py$/.test(path);
  if (isJs) return esc
    .replace(/\b(const|let|var|function|return|import|export|from|default|class|extends|if|else|for|while|do|switch|case|break|continue|async|await|new|typeof|instanceof|null|undefined|true|false|this|super)\b/g, '<span class="tk">$1</span>')
    .replace(/(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="ts">$&</span>')
    .replace(/\/\/.*/g, '<span class="tc">$&</span>')
    .replace(/\b\d+\.?\d*\b/g, '<span class="tn">$&</span>');
  if (isPy) return esc
    .replace(/\b(def|class|import|from|return|if|elif|else|for|while|with|as|pass|lambda|yield|True|False|None|and|or|not|in|is|raise|try|except|finally|global|nonlocal)\b/g, '<span class="tk">$1</span>')
    .replace(/(["'])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="ts">$&</span>')
    .replace(/#.*/g, '<span class="tc">$&</span>');
  return esc;
}

function FolderGroup({ folder, files, roastedFiles, selectedFile, onSelect }: {
  folder: string;
  files: { path: string }[];
  roastedFiles: Set<string>;
  selectedFile: string | null;
  onSelect: (path: string) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <div className="fi folder" onClick={() => setOpen(o => !o)}>
        <span className="fi-ico">{open ? '▾' : '▸'}</span> {folder}/
      </div>
      {open && files.map(f => {
        const display = f.path.split('/').slice(1).join('/');
        return (
          <div
            key={f.path}
            className={`fi i1 ${roastedFiles.has(f.path) ? 'roasted' : ''} ${selectedFile === f.path ? 'active' : ''}`}
            onClick={() => onSelect(f.path)}
          >
            <span className="fi-ico">○</span> {display}
          </div>
        );
      })}
    </>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<StoredState | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [codeLines, setCodeLines] = useState<string[]>([]);
  const [selectedCaption, setSelectedCaption] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [visibleItems, setVisibleItems] = useState(0);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [highlightLines, setHighlightLines] = useState<Set<number>>(new Set());
  const [gfFrame, setGfFrame] = useState(IDLE_FRAMES[0]);
  const gfTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gfFrameRef = useRef(0);

  useEffect(() => {
    const stored = sessionStorage.getItem('garfield_result');
    if (!stored) { router.push('/roast'); return; }
    const d: StoredState = JSON.parse(stored);
    setData(d);
    setSelectedCaption(0);

    // Animate score counter
    let n = 0;
    const target = d.result?.score ?? 0;
    const counter = setInterval(() => {
      n = Math.min(n + 1, target);
      setDisplayScore(n);
      if (n >= target) clearInterval(counter);
    }, 100);

    // Reveal roast items one by one
    const count = d.result?.roastItems?.length || 0;
    let i = 0;
    const id = setInterval(() => { i++; setVisibleItems(i); if (i >= count) clearInterval(id); }, 550);
    return () => { clearInterval(counter); clearInterval(id); };
  }, [router]);

  useEffect(() => {
    if (!data) return;
    const count = data.result?.roastItems?.length || 0;
    if (visibleItems < count) return;
    const score = data.result?.score ?? 5;
    const frames = score <= 3 ? LAUGH_FRAMES : score >= 7 ? SHOCKED_FRAMES : IDLE_FRAMES;
    const interval = score <= 3 ? 160 : score >= 7 ? 280 : 650;
    gfFrameRef.current = 0;
    if (gfTimerRef.current) clearInterval(gfTimerRef.current);
    gfTimerRef.current = setInterval(() => {
      gfFrameRef.current = (gfFrameRef.current + 1) % frames.length;
      setGfFrame(frames[gfFrameRef.current]);
    }, interval);
    return () => { if (gfTimerRef.current) clearInterval(gfTimerRef.current); };
  }, [visibleItems, data]);

  async function loadCodeFile(path: string) {
    if (!data) return;
    setSelectedFile(path);
    setHighlightLines(new Set());
    try {
      const branch = (data.meta?.defaultBranch as string) || 'main';
      const r = await fetch(`https://raw.githubusercontent.com/${data.repo}/${branch}/${path}`);
      const text = r.ok ? (await r.text()).slice(0, 12000) : '// could not load';
      const lines = text.split('\n');
      setCodeLines(lines);
      setHighlightLines(getHighlightLines(path, lines.length));
    } catch {
      setCodeLines(['// could not load']);
    }
  }

  async function doShare() {
    const cap = data?.result?.captionOptions?.[selectedCaption]?.text
      || `My code got roasted by Garfield. garfieldroast.site`;
    try {
      if (typeof html2canvas !== 'undefined') {
        const card = document.getElementById('roast-card');
        if (card) {
          const canvas = await html2canvas(card, { backgroundColor: '#0d0d0a', scale: 2, useCORS: true });
          const a = document.createElement('a');
          a.download = 'garfield-roast.png';
          a.href = canvas.toDataURL('image/png');
          a.click();
        }
      }
    } catch (e) { console.warn('Screenshot failed', e); }
    const tweet = encodeURIComponent(`${cap}\n\nhttps://github.com/${data?.repo}\n\n#GarfieldRoast #CodeRoast`);
    window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank');
  }

  if (!data) return null;

  const { result, repo, mode, files } = data;
  const roastedFiles = new Set(
    (result?.roastItems || []).map(r => r.file).filter((f): f is string => f !== null)
  );
  const scoreColor = result.score <= 3 ? 'var(--red)' : result.score <= 6 ? 'var(--orange)' : 'var(--green)';

  const folders: Record<string, { path: string }[]> = {};
  (files || []).forEach(f => {
    const parts = f.path.split('/');
    const folder = parts.length > 1 ? parts[0] : '';
    if (!folders[folder]) folders[folder] = [];
    folders[folder].push(f);
  });

  return (
    <div id="result-page">

      <div className="result-bar">
        <div className="res-left">
          <IconFolder size={15} />
          <span className="res-repo">{repo}</span>
          <span className="res-badge">{mode.toUpperCase()} MODE</span>
        </div>
        <div className="res-right">
          <button className="btn btn-ghost" style={{ fontSize: '11px', padding: '6px 12px' }} onClick={() => router.push('/roast')}>
            ← ROAST ANOTHER
          </button>
          <button className="btn btn-outline" style={{ fontSize: '11px', padding: '6px 14px' }} onClick={doShare}>
            SHARE ON X →
          </button>
        </div>
      </div>

      <div className="split">

        {/* File tree */}
        <div className="ftree">
          <div className="ftree-head">FILES</div>
          <div>
            {(folders[''] || []).map(f => (
              <div key={f.path} className={`fi ${roastedFiles.has(f.path) ? 'roasted' : ''} ${selectedFile === f.path ? 'active' : ''}`} onClick={() => loadCodeFile(f.path)}>
                <span className="fi-ico">○</span> {f.path}
              </div>
            ))}
            {Object.keys(folders).filter(k => k).map(folder => (
              <FolderGroup key={folder} folder={folder} files={folders[folder]} roastedFiles={roastedFiles} selectedFile={selectedFile} onSelect={loadCodeFile} />
            ))}
          </div>
        </div>

        {/* Code viewer */}
        <div className="cview">
          <div className="cview-bar">
            <span className="cview-file">{selectedFile || '← select a file'}</span>
            <span style={{ marginLeft: 'auto', fontSize: '10px' }}>UTF-8</span>
          </div>
          <div className="cview-body">
            {codeLines.length > 0 ? (
              codeLines.map((line, i) => (
                <div key={i} className={`cl${highlightLines.has(i) ? ' hl' : ''}`}>
                  <span className="ln">{i + 1}</span>
                  <span className="lc" dangerouslySetInnerHTML={{ __html: highlight(line, selectedFile || '') }} />
                </div>
              ))
            ) : (
              <div style={{ padding: '40px', color: 'var(--text-3)', textAlign: 'center', fontSize: '12px' }}>
                Click a file in the tree to view its contents.
              </div>
            )}
          </div>
        </div>

        {/* Roast panel */}
        <div className="rpanel" id="roast-card">
          <div className="rp-head">
            <pre className="rp-gf">{gfFrame}</pre>
            <div>
              <div className="rp-title">GARFIELD&apos;S VERDICT</div>
              <div className="rp-sub">Powered by Claude</div>
            </div>
          </div>

          {/* Score card — animated counter + bar + label */}
          <div className="score-card">
            <div className="score-lbl">
              {result.repoType?.toUpperCase().replace('_', ' ') || 'CODE QUALITY'}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <div className="score-val" style={{ color: scoreColor }}>{displayScore}</div>
              <span style={{ color: 'var(--text-3)', fontSize: 16 }}>/10</span>
            </div>
            <div className="score-category" style={{ border: `1px solid ${scoreColor}`, color: scoreColor }}>
              {SCORE_LABELS[result.score] || 'JUDGED'}
            </div>
            <div style={{ display: 'flex', gap: 4, margin: '10px 0' }}>
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} style={{
                  flex: 1, height: 6, borderRadius: 2,
                  background: i < displayScore ? scoreColor : 'var(--border)',
                  transition: 'background 0.1s',
                }} />
              ))}
            </div>
            <div className="score-verd">&ldquo;{result.verdict}&rdquo;</div>
          </div>

          {/* Findings stats — 3-column grid */}
          {(() => {
            const all = result.roastItems || [];
            const crit = all.filter(r => r.severity === 'critical').length;
            const warn = all.filter(r => r.severity === 'warning').length;
            const note = all.filter(r => r.severity === 'note').length;
            const stats = [
              { label: 'CRITICAL', count: crit, color: 'var(--red)',    bg: 'rgba(192,83,78,0.08)',   icon: '💀' },
              { label: 'WARNING',  count: warn, color: 'var(--orange)', bg: 'rgba(234,140,30,0.06)',  icon: '⚠' },
              { label: 'NOTE',     count: note, color: 'var(--green)',  bg: 'rgba(90,158,111,0.06)', icon: '📝' },
            ];
            return (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '2px solid var(--border)' }}>
                {stats.map(({ label, count, color, bg, icon }, idx) => (
                  <div key={label} style={{
                    padding: '14px 8px', textAlign: 'center', background: bg,
                    borderRight: idx < 2 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                      {visibleItems > 0 ? count : '—'}
                    </div>
                    <div style={{ fontSize: 8, color, letterSpacing: '0.12em', marginTop: 5, fontWeight: 700 }}>
                      {icon} {label}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Roast items — expandable 3-zona */}
          <div className="ritems">
            {(result.roastItems || []).slice(0, visibleItems).map((item, i) => {
              const isExpanded = expanded.has(i);
              const needsTruncate = item.text.length > PREVIEW_LEN;
              const displayText = needsTruncate && !isExpanded
                ? item.text.slice(0, PREVIEW_LEN) + '…'
                : item.text;
              return (
                <div
                  key={i}
                  className={`ritem sev-${item.severity[0]} ${item.isBank ? 'is-bank' : 'is-specific'}`}
                  style={{ animationDelay: `${i * 0.05}s`, padding: 0, overflow: 'hidden' }}
                >
                  {/* Header zona */}
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '7px 10px',
                      borderBottom: '1px solid var(--border)',
                      background: item.isBank ? 'var(--orange-lo)' : 'rgba(201,122,94,0.07)',
                      cursor: item.file ? 'pointer' : 'default',
                    }}
                    onClick={() => item.file && loadCodeFile(item.file)}
                  >
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                      background: item.severity === 'critical' ? 'var(--red)'
                        : item.severity === 'warning' ? 'var(--orange)' : 'var(--green)',
                    }} />
                    <span style={{
                      fontSize: 9.5, fontWeight: 700, flex: 1,
                      color: item.file ? 'var(--text)' : 'var(--text-3)',
                      fontStyle: item.file ? 'normal' : 'italic',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {item.file || 'general observation'}
                    </span>
                    <span style={{
                      fontSize: 8, padding: '1px 5px', borderRadius: 2,
                      background: item.isBank ? 'rgba(234,140,30,0.15)' : 'rgba(201,122,94,0.15)',
                      color: item.isBank ? 'var(--orange)' : 'var(--claude)',
                    }}>
                      {item.isBank ? 'BANK' : 'CLAUDE'}
                    </span>
                    <span className={`ri-sev sev-${item.severity[0]}`} style={{ marginTop: 0 }}>
                      {item.badge || item.severity.toUpperCase()}
                    </span>
                  </div>
                  {/* Body zona */}
                  <div style={{ padding: '10px 10px 8px', fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.7 }}>
                    <span style={{ fontStyle: 'italic', color: 'var(--text)' }}>{displayText}</span>
                    {needsTruncate && (
                      <button
                        onClick={() => setExpanded(prev => {
                          const next = new Set(prev);
                          isExpanded ? next.delete(i) : next.add(i);
                          return next;
                        })}
                        style={{
                          display: 'block', marginTop: 6,
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: 9.5, color: 'var(--orange)', letterSpacing: '0.08em',
                          fontFamily: 'var(--font)', padding: 0,
                        }}
                      >
                        {isExpanded ? '↑ COLLAPSE' : '↓ READ MORE'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Share footer — 4-tab caption system */}
          <div className="share-footer">
            <div className="caption-lbl">PICK YOUR CAPTION</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginBottom: 8 }}>
              {(result.captionOptions || []).map((_, i) => {
                const Icon = CAPTION_ICONS[i];
                return (
                  <button
                    key={i}
                    className={`cap ${selectedCaption === i ? 'on' : ''}`}
                    style={{ padding: '6px 8px', fontSize: '9.5px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                    onClick={() => setSelectedCaption(i)}
                  >
                    {Icon && <Icon size={12} />}
                    {CAPTION_LABELS[i]}
                  </button>
                );
              })}
            </div>
            <div style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              padding: '9px 10px', fontSize: '10.5px', color: 'var(--text)',
              lineHeight: 1.55, minHeight: 60, marginBottom: 10, whiteSpace: 'pre-wrap',
            }}>
              {result.captionOptions?.[selectedCaption]?.text || ''}
            </div>
            <button className="btn btn-primary share-x-btn" onClick={doShare}>SHARE ON X →</button>
          </div>
        </div>

      </div>
    </div>
  );
}
