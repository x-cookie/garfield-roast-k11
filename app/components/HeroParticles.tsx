'use client';
import { useEffect, useRef } from 'react';

const CODE_CHARS = '{}();=>/\\#@!01<>?*&|~%^';

interface Particle {
  x: number; y: number; char: string;
  speed: number; opacity: number; size: number;
  drift: number;
}

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const mkParticle = (): Particle => ({
      x: rand(0, canvas.width),
      y: rand(0, canvas.height),
      char: CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
      speed: rand(0.15, 0.55),
      opacity: rand(0.025, 0.075),
      size: rand(9, 15),
      drift: rand(-0.12, 0.12),
    });

    const particles: Particle[] = Array.from({ length: 55 }, mkParticle);

    let animId: number;
    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      for (const p of particles) {
        ctx!.globalAlpha = p.opacity;
        ctx!.fillStyle = '#EA8C1E';
        ctx!.font = `${p.size}px 'JetBrains Mono', monospace`;
        ctx!.fillText(p.char, p.x, p.y);
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -20 || p.x < -20 || p.x > canvas!.width + 20) {
          Object.assign(p, mkParticle(), { y: canvas!.height + 10, x: rand(0, canvas!.width) });
        }
      }
      animId = requestAnimationFrame(draw);
    }
    draw();

    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}
