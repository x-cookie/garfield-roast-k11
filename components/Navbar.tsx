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
        <a className="nav-link" href="https://github.com/spooky-may/project-garfield" target="_blank" rel="noreferrer">GITHUB</a>
        <button className="nav-cta" onClick={() => router.push('/roast')}>GET ROASTED →</button>
      </div>
    </nav>
  );
}
