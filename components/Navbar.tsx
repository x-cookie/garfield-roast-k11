'use client';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => router.push('/')}>
        <span className="logo-icon">ᗢ</span>
        GARFIELD ROAST
        <span className="nav-claude-badge">DEEPSEEK</span>
      </div>
      <div className="nav-links">
        <span className="nav-link" onClick={() => router.push('/roast')}>ROAST REPO</span>
        <a className="nav-link" href="https://github.com/spooky-may/project-garfield" target="_blank" rel="noreferrer">GITHUB</a>
        <button className="nav-cta" onClick={() => router.push('/roast')}>GET ROASTED →</button>
      </div>
    </nav>
  );
}
