import React, { useEffect, useRef } from 'react';

/**
 * Professional AI Light Background Animation (Light Theme Dedicated)
 * 
 * Features:
 *  - Ethereal daylight rays & volumetric light shafts
 *  - Prismatic pastel aurora mesh blooms (indigo, sky cyan, subtle violet)
 *  - Floating crystal sapphire photon dust motes (Tyndall light scattering)
 *  - Interactive state transitions ('idle', 'processing', 'completed')
 *  - 100% GPU-accelerated, non-intrusive, zero eye fatigue
 * 
 * Props:
 *  - state: 'idle' | 'processing' | 'completed'
 */
export default function AIOrbBackground({ state = 'idle' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Floating crystal/sapphire photon dust motes
    const particleCount = 48;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.15 - Math.random() * 0.35, // gentle upward floating drift
      size: 0.9 + Math.random() * 1.6,
      baseAlpha: 0.22 + Math.random() * 0.35,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.015 + Math.random() * 0.025,
    }));

    const focalX = () => width * 0.5;
    const focalY = () => 40;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const fX = focalX();
      const fY = focalY();

      // Draw subtle porcelain gradient base
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#ffffff');
      bgGrad.addColorStop(0.5, '#f8fafc');
      bgGrad.addColorStop(1, '#f1f5f9');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw floating luminous sapphire/crystal particles
      particles.forEach((p) => {
        p.pulse += p.pulseSpeed;

        if (state === 'processing') {
          // Particles pull inward toward top light aperture
          const dx = fX - p.x;
          const dy = fY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          p.x += p.vx + (dx / dist) * 0.6;
          p.y += p.vy * 1.8 + (dy / dist) * 0.4;
        } else {
          // Gentle ambient floating
          p.x += p.vx + Math.sin(p.pulse) * 0.15;
          p.y += p.vy;
        }

        // Screen boundary wrapping
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Tyndall light scattering boost
        const distFromCenterBeam = Math.abs(p.x - fX) / (width * 0.5);
        const inBeamBoost = Math.max(0, 1 - distFromCenterBeam * 1.8);

        const pulseFactor = 0.7 + 0.3 * Math.sin(p.pulse);
        let alpha = p.baseAlpha * pulseFactor * (1 + inBeamBoost * 0.9);

        if (state === 'processing') {
          alpha = Math.min(0.9, alpha * 1.4);
        } else if (state === 'completed') {
          alpha = Math.min(0.85, alpha * 1.25);
        }

        // Particle color according to state
        let colorRGB;
        if (state === 'completed') {
          colorRGB = '16, 185, 129'; // emerald-500
        } else if (state === 'processing') {
          colorRGB = '79, 70, 229'; // indigo-600
        } else {
          colorRGB = inBeamBoost > 0.4 ? '99, 102, 241' : '14, 165, 233'; // sapphire / sky
        }

        // Soft radial particle glow
        const glowRadius = p.size * (state === 'processing' ? 3.5 : 2.5);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        grad.addColorStop(0, `rgba(${colorRGB}, ${alpha})`);
        grad.addColorStop(0.5, `rgba(${colorRGB}, ${alpha * 0.35})`);
        grad.addColorStop(1, `rgba(${colorRGB}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [state]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-slate-50">
      {/* 1. Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      {/* 2. Soft Ambient Pastel Aurora Blooms */}
      <div
        className={`absolute -top-32 left-1/4 w-[540px] h-[540px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ${
          state === 'processing'
            ? 'bg-cyan-200/60 scale-125'
            : state === 'completed'
            ? 'bg-emerald-200/50 scale-110'
            : 'bg-sky-200/40'
        }`}
      />
      <div
        className={`absolute -top-32 right-1/4 w-[540px] h-[540px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ${
          state === 'processing'
            ? 'bg-indigo-200/60 scale-125'
            : state === 'completed'
            ? 'bg-teal-200/50 scale-110'
            : 'bg-indigo-100/50'
        }`}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] rounded-full bg-indigo-50/60 blur-[130px] pointer-events-none" />

      {/* 3. Volumetric Overhead Spotlights & Light Cones */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[850px] pointer-events-none flex justify-center overflow-visible">
        {/* Volumetric Center Daylight Key Light */}
        <div
          className={`absolute top-0 w-[420px] sm:w-[680px] h-[750px] transition-all duration-1000 origin-top ${
            state === 'processing'
              ? 'opacity-85 scale-105'
              : state === 'completed'
              ? 'opacity-70 scale-100'
              : 'opacity-55 animate-beam-sway-3'
          }`}
          style={{
            background:
              state === 'completed'
                ? 'conic-gradient(from 180deg at 50% 0%, rgba(16, 185, 129, 0.12) 0deg, rgba(52, 211, 153, 0.06) 35deg, transparent 75deg, transparent 285deg, rgba(52, 211, 153, 0.06) 325deg, rgba(16, 185, 129, 0.12) 360deg)'
                : state === 'processing'
                ? 'conic-gradient(from 180deg at 50% 0%, rgba(79, 70, 229, 0.16) 0deg, rgba(6, 182, 212, 0.08) 35deg, transparent 75deg, transparent 285deg, rgba(6, 182, 212, 0.08) 325deg, rgba(79, 70, 229, 0.16) 360deg)'
                : 'conic-gradient(from 180deg at 50% 0%, rgba(99, 102, 241, 0.09) 0deg, rgba(56, 189, 248, 0.04) 30deg, transparent 70deg, transparent 290deg, rgba(56, 189, 248, 0.04) 330deg, rgba(99, 102, 241, 0.09) 360deg)',
            maskImage: 'radial-gradient(ellipse 90% 80% at 50% 0%, black 20%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 0%, black 20%, transparent 80%)',
          }}
        />

        {/* Volumetric Left Light Shaft */}
        <div
          className={`absolute top-0 -left-12 sm:left-12 w-[240px] sm:w-[360px] h-[700px] transition-all duration-1000 origin-top-left pointer-events-none ${
            state === 'processing' ? 'opacity-80 scale-105' : 'opacity-45 animate-beam-sway-1'
          }`}
          style={{
            background:
              'linear-gradient(135deg, rgba(99, 102, 241, 0.09) 0%, rgba(56, 189, 248, 0.03) 45%, transparent 80%)',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            filter: 'blur(28px)',
          }}
        />

        {/* Volumetric Right Light Shaft */}
        <div
          className={`absolute top-0 -right-12 sm:right-12 w-[240px] sm:w-[360px] h-[700px] transition-all duration-1000 origin-top-right pointer-events-none ${
            state === 'processing' ? 'opacity-80 scale-105' : 'opacity-45 animate-beam-sway-2'
          }`}
          style={{
            background:
              'linear-gradient(225deg, rgba(168, 85, 247, 0.08) 0%, rgba(99, 102, 241, 0.03) 45%, transparent 80%)',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            filter: 'blur(28px)',
          }}
        />

        {/* Overhead Light Core / Anamorphic Aperture Lens Flare */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
          {/* Anamorphic Flare Line */}
          <div
            className={`h-[1.5px] rounded-full transition-all duration-700 ${
              state === 'processing'
                ? 'w-72 sm:w-[480px] bg-gradient-to-r from-transparent via-indigo-600 to-transparent shadow-[0_0_20px_rgba(79,70,229,0.5)]'
                : state === 'completed'
                ? 'w-64 sm:w-[420px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_18px_rgba(16,185,129,0.4)]'
                : 'w-48 sm:w-[360px] bg-gradient-to-r from-transparent via-indigo-400/80 to-transparent shadow-[0_0_14px_rgba(99,102,241,0.3)] animate-flare-breathe'
            }`}
          />

          {/* Central Optic Glow Disc */}
          <div
            className={`w-32 h-16 sm:w-52 sm:h-24 rounded-full blur-2xl transition-all duration-1000 ${
              state === 'processing'
                ? 'bg-gradient-to-b from-indigo-300/50 to-transparent scale-125'
                : state === 'completed'
                ? 'bg-gradient-to-b from-emerald-300/40 to-transparent scale-110'
                : 'bg-gradient-to-b from-indigo-200/40 to-transparent scale-100'
            }`}
          />
        </div>
      </div>

      {/* 4. Canvas for Floating Photon / Crystal Dust Motes */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 5. Photonic Laser Scan Wave (Only active during Processing state) */}
      {state === 'processing' && (
        <div className="absolute inset-x-0 pointer-events-none animate-scan-beam">
          {/* Main Laser Line */}
          <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-indigo-600 to-transparent shadow-[0_0_18px_rgba(79,70,229,0.5)]" />
          {/* Volumetric Trailing Light Sheen */}
          <div className="h-14 w-full -mt-7 blur-md bg-gradient-to-b from-transparent via-indigo-500/12 to-transparent" />
        </div>
      )}

      {/* 6. Horizon Gradient Transition */}
      <div className="absolute bottom-0 inset-x-0 h-28 pointer-events-none bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent" />
    </div>
  );
}
