'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

declare const html2canvas: (el: HTMLElement, opts: Record<string, unknown>) => Promise<HTMLCanvasElement>;

interface RoastItem { file: string; text: string; severity: string; }
interface RoastResult { score: number; verdict: string; roastItems: RoastItem[]; captions: string[]; }
interface StoredState { result: RoastResult; repo: string; mode: string; files: { path: string }[]; meta: Record<string, unknown> | null; }

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
  const [caption, setCaption] = useState('');
  const [visibleItems, setVisibleItems] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem('garfield_result');
    if (!stored) { router.push('/roast'); return; }
    const d: StoredState = JSON.parse(stored);
    setData(d);
    setCaption(d.result?.captions?.[0] || '');
    const count = d.result?.roastItems?.length || 0;
    let i = 0;
    const id = setInterval(() => { i++; setVisibleItems(i); if (i >= count) clearInterval(id); }, 550);
    return () => clearInterval(id);
  }, [router]);

  async function loadCodeFile(path: string) {
    if (!data) return;
    setSelectedFile(path);
    try {
      const branch = (data.meta?.defaultBranch as string) || 'main';
      const r = await fetch(`https://raw.githubusercontent.com/${data.repo}/${branch}/${path}`);
      const text = r.ok ? (await r.text()).slice(0, 12000) : '// could not load';
      setCodeLines(text.split('\n'));
    } catch {
      setCodeLines(['// could not load']);
    }
  }

  async function doShare() {
    const cap = caption || `My code got roasted by Garfield. garfieldroast.site`;
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
  const roastedFiles = new Set((result?.roastItems || []).map(r => r.file));
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
          <span>📁</span>
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
                <div key={i} className={`cl ${roastedFiles.has(selectedFile || '') && i < 6 ? 'hl' : ''}`}>
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
            <pre className="rp-gf">{` /\\_/\\\n(-  -)\n(= · =)\n \\___/`}</pre>
            <div>
              <div className="rp-title">GARFIELD&apos;S VERDICT</div>
              <div className="rp-sub">Powered by DeepSeek · OpenRouter</div>
            </div>
          </div>

          <div className="score-card">
            <div className="score-lbl">CODE QUALITY SCORE</div>
            <div className="score-val" style={{ color: scoreColor }}>{result.score}/10</div>
            <div className="score-verd">{result.verdict}</div>
          </div>

          <div className="ritems">
            {(result.roastItems || []).slice(0, visibleItems).map((item, i) => (
              <div
                key={i}
                className={`ritem ${mode === 'gentle' ? 'gentle' : ''}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="ri-file">📄 <span>{item.file}</span></div>
                <div className="ri-text">{item.text}</div>
                <span className={`ri-sev sev-${item.severity[0]}`}>{item.severity.toUpperCase()}</span>
              </div>
            ))}
          </div>

          <div className="share-footer">
            <div className="caption-lbl">PICK YOUR CAPTION</div>
            <div className="captions">
              {(result.captions || []).map((c, i) => (
                <button key={i} className={`cap ${caption === c ? 'on' : ''}`} onClick={() => setCaption(c)}>
                  {c}
                </button>
              ))}
            </div>
            <button className="btn btn-primary share-x-btn" onClick={doShare}>SHARE ON X →</button>
          </div>
        </div>

      </div>
    </div>
  );
}
