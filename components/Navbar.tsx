'use client';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => router.push('/')}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.jpeg" alt="Garfield" style={{ height: 28, width: 28, objectFit: 'cover', borderRadius: 4, filter: 'drop-shadow(0 0 5px rgba(234,140,30,0.6))' }} />
        GARFIELD ROAST
        <span className="nav-claude-badge">CLAUDE</span>
      </div>
      <div className="nav-links">
        <span className="nav-link" onClick={() => router.push('/roast')}>ROAST REPO</span>
        <span className="nav-link" onClick={() => router.push('/docs')}>DOCS</span>
        <a className="nav-link" href="https://x.com/garfieldroast" target="_blank" rel="noreferrer" aria-label="X (Twitter)">
          <svg width="14" height="14" viewBox="0 0 1200 1227" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.163 519.284ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.828Z"/>
          </svg>
        </a>
        <button className="nav-cta" onClick={() => router.push('/roast')}>GET ROASTED →</button>
      </div>
    </nav>
  );
}
