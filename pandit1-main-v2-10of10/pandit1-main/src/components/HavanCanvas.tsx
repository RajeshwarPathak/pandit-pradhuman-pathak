import React, { useEffect, useRef } from 'react';

interface HavanCanvasProps {
  className?: string;
}

/**
 * Pre-renders a soft radial gradient sprite onto an offscreen canvas once
 * so the animation loop never allocates gradients per particle per frame.
 */
function createRadialSprite(size: number, stops: Array<[number, string]>): HTMLCanvasElement {
  const sprite = document.createElement('canvas');
  sprite.width = size;
  sprite.height = size;
  const sctx = sprite.getContext('2d');
  if (sctx) {
    const half = size / 2;
    const grad = sctx.createRadialGradient(half, half, 0, half, half, half);
    for (const [offset, color] of stops) {
      grad.addColorStop(offset, color);
    }
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, size, size);
  }
  return sprite;
}

export const HavanCanvas: React.FC<HavanCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let isVisible = true;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      const w = (canvas.width = canvas.clientWidth);
      const h = (canvas.height = canvas.clientHeight);
      const grad = ctx.createRadialGradient(w / 2, h, 10, w / 2, h, h * 0.8);
      grad.addColorStop(0, 'rgba(255, 122, 26, 0.25)');
      grad.addColorStop(0.5, 'rgba(179, 38, 30, 0.15)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      return;
    }

    // Cached offscreen sprites (allocated once)
    const flameSprite = createRadialSprite(96, [
      [0, 'rgba(255, 200, 90, 0.30)'],
      [0.45, 'rgba(255, 110, 30, 0.14)'],
      [1, 'rgba(180, 30, 0, 0)'],
    ]);
    const emberSprite = createRadialSprite(32, [
      [0, 'rgba(255, 230, 120, 0.95)'],
      [0.35, 'rgba(255, 138, 26, 0.45)'],
      [1, 'rgba(255, 120, 20, 0)'],
    ]);

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);

    function resize() {
      if (!canvas) return;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize);

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    interface Particle {
      t: number;
      isFlame: boolean;
      x: number;
      y: number;
      vx: number;
      vy: number;
      lifespan: number;
      size: number;
    }

    const particles: Particle[] = [];

    function spawn() {
      const isFlame = Math.random() < 0.7;
      const cx = width / 2;
      const spread = Math.min(width * 0.45, 360);

      if (isFlame) {
        particles.push({
          t: 0,
          isFlame: true,
          x: cx + (Math.random() - 0.5) * spread * 1.25,
          y: height + 10,
          vx: (Math.random() - 0.5) * 0.65,
          vy: -(1.2 + Math.random() * 2.0),
          lifespan: 65 + Math.random() * 45,
          size: 48 + Math.random() * 52,
        });
      } else {
        particles.push({
          t: 0,
          isFlame: false,
          x: cx + (Math.random() - 0.5) * spread,
          y: height - 15,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -(0.9 + Math.random() * 1.9),
          lifespan: 110 + Math.random() * 100,
          size: 8 + Math.random() * 10,
        });
      }
    }

    let time = 0;
    let lastFrameTime = 0;
    const frameIntervalMs = 1000 / 24; // Smooth 24fps decorative cap

    function render(now: number) {
      animId = requestAnimationFrame(render);
      if (!isVisible || document.hidden || !ctx) return;
      if (now - lastFrameTime < frameIntervalMs) return;
      lastFrameTime = now;

      time += 0.045;
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      const isMobile = width < 768;
      const maxCap = isMobile ? 45 : 100;
      const spawnCount = isMobile ? 2 : 3;

      if (particles.length < maxCap) {
        for (let i = 0; i < spawnCount; i++) {
          spawn();
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.t++;
        const progress = p.t / p.lifespan;

        if (progress >= 1) {
          particles.splice(i, 1);
          continue;
        }

        p.x += p.vx + Math.sin(time * 3 + i) * (p.isFlame ? 0.35 : 0.6);
        p.y += p.vy;

        const scale = 1 - progress * (p.isFlame ? 0.65 : 0.45);
        const drawSize = p.size * scale;
        const half = drawSize / 2;

        ctx.globalAlpha = Math.max(0, 1 - progress);
        ctx.drawImage(p.isFlame ? flameSprite : emberSprite, p.x - half, p.y - half, drawSize, drawSize);
      }

      ctx.globalAlpha = 1;
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={`w-full h-full pointer-events-none ${className}`} />;
};
