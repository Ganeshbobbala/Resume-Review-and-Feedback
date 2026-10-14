import React, { useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  Target,
  Award,
  Bot,
  Zap,
  Cpu,
  Quote
} from 'lucide-react';

/**
 * Minimalist, High-End Designer Hero Interface
 * Clean, spacious, and focused solely on the core value:
 * AI Resume Review & Job Description Matching.
 */
export default function InteractiveHeroScanner({
  onNavigateToDashboard,
  onNavigateToJobMatcher
}) {
  const canvasRef = useRef(null);

  // Subtle Ambient Frequency Wave & Floating Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const barCount = 40;
    let angleOffset = 0;

    const particleCount = 20;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 1.2 + Math.random() * 1.8,
      opacity: 0.2 + Math.random() * 0.4,
      pulse: Math.random() * Math.PI * 2
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      angleOffset += 0.008;

      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const baseRadius = Math.min(width, height) * 0.38;

      // 1. Subtle Radial Pulse Nodes
      for (let i = 0; i < barCount; i++) {
        const angle = (i / barCount) * Math.PI * 2 + angleOffset;
        const wave = Math.sin(angle * 3 + angleOffset * 2) * 8;
        const barLength = 6 + Math.abs(wave);

        const x1 = centerX + Math.cos(angle) * (baseRadius - barLength * 0.5);
        const y1 = centerY + Math.sin(angle) * (baseRadius - barLength * 0.5);
        const x2 = centerX + Math.cos(angle) * (baseRadius + barLength * 0.5);
        const y2 = centerY + Math.sin(angle) * (baseRadius + barLength * 0.5);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.18 + (i % 3) * 0.1})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // 2. Floating sapphire photon particles
      particles.forEach((p) => {
        p.pulse += 0.015;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const pulseAlpha = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${pulseAlpha * 0.75})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full max-w-5xl mx-auto py-8 sm:py-16 px-4 select-none animate-in fade-in duration-500 text-center">
      
      {/* 1. Category Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 shadow-xs mb-6 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Next-Generation Resume Reviewer</span>
      </div>

      {/* 2. Bold Designer Headline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6">
        Transform Your Resume with{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600">
          Explainable AI
        </span>
      </h1>

      {/* 3. Subtitle */}
      <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
        Instant Machine Learning role classification, transparent 0–100 scoring, and precision job description alignment tailored for modern tech careers.
      </p>

      {/* 4. Sleek Hero Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
        <button
          onClick={onNavigateToDashboard}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Analyze Resume</span>
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </button>

        <button
          onClick={onNavigateToJobMatcher}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-xs transition-all cursor-pointer hover:border-slate-300"
        >
          <Target className="w-4 h-4 text-cyan-600" />
          <span>Compare Job Description</span>
        </button>
      </div>

      {/* 5. Central Holographic Visual Hub */}
      <div className="relative w-full max-w-md h-72 sm:h-80 mx-auto flex items-center justify-center mb-16">
        {/* Background Wave Canvas */}
        <div className="absolute inset-0 pointer-events-none">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        {/* Ambient Radial Core Glow */}
        <div className="absolute inset-8 rounded-full blur-3xl pointer-events-none bg-gradient-to-tr from-indigo-200/30 via-sky-200/25 to-violet-200/20 scale-100" />

        {/* Outer Minimal Ring */}
        <div className="absolute inset-4 rounded-full border border-dashed border-indigo-200/60 animate-[spin_60s_linear_infinite]" />

        {/* Middle Clean Ring */}
        <div className="absolute inset-12 rounded-full border border-indigo-100 shadow-[0_0_20px_rgba(99,102,241,0.05)]" />

        {/* Sweep Beam */}
        <div className="absolute inset-12 rounded-full pointer-events-none animate-radar-sweep overflow-hidden">
          <div
            className="w-1/2 h-1/2 origin-bottom-right"
            style={{
              background:
                'conic-gradient(from 0deg at 100% 100%, rgba(99,102,241,0.15) 0deg, rgba(6,182,212,0.05) 45deg, transparent 75deg, transparent 360deg)',
            }}
          />
        </div>

        {/* Center Porcelain Floating Disc */}
        <div className="relative z-10 w-28 h-28 rounded-full bg-white/95 border border-indigo-100 shadow-xl backdrop-blur-xl flex flex-col items-center justify-center text-center p-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 mb-1.5">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-extrabold text-slate-900 tracking-tight">
            AI ENGINE
          </span>
          <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">
            READY
          </span>
        </div>

        {/* Floating Minimal Telemetry Badges (4 Corners) */}
        <div className="absolute top-4 left-0 sm:left-2 px-3 py-1.5 rounded-full bg-white/95 border border-slate-200/80 shadow-xs backdrop-blur-md text-[11px] font-semibold text-slate-700 hidden sm:flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span>LinearSVC ML Model</span>
        </div>

        <div className="absolute top-4 right-0 sm:right-2 px-3 py-1.5 rounded-full bg-white/95 border border-slate-200/80 shadow-xs backdrop-blur-md text-[11px] font-semibold text-slate-700 hidden sm:flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
          <span>Explainable 0–100 Scoring</span>
        </div>

        <div className="absolute bottom-4 left-0 sm:left-2 px-3 py-1.5 rounded-full bg-white/95 border border-slate-200/80 shadow-xs backdrop-blur-md text-[11px] font-semibold text-slate-700 hidden sm:flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          <span>15 Tech Roles Supported</span>
        </div>

        <div className="absolute bottom-4 right-0 sm:right-2 px-3 py-1.5 rounded-full bg-white/95 border border-slate-200/80 shadow-xs backdrop-blur-md text-[11px] font-semibold text-slate-700 hidden sm:flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Job Gap Analysis</span>
        </div>
      </div>

      {/* 6. Three Clean Designer Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left pt-4">
        
        {/* Card 1: Transparent Scoring */}
        <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Explainable Scoring
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Multi-factor 0–100 evaluation weighted across skill relevance (40%), structural integrity (30%), role fit (20%), and ATS keyword density (10%).
          </p>
        </div>

        {/* Card 2: ML Role Classifier */}
        <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100">
            <Bot className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            ML Role Prediction
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Pre-trained LinearSVC model trained on thousands of resumes instantly categorizes your profile across 15 specialized engineering tracks.
          </p>
        </div>

        {/* Card 3: Job Description Matcher */}
        <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Target Job Matcher
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Compare your resume directly with any specific job posting from LinkedIn or Indeed to pinpoint exact skill gaps and ATS compatibility.
          </p>
        </div>
      </div>

      {/* 7. Inspirational Philosophy & Mission Quote */}
      <div className="relative mt-12 p-8 sm:p-10 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm max-w-3xl mx-auto overflow-hidden text-center group hover:shadow-md transition-all">
        {/* Radiant Ambient Glow & Top Accent Line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-56 h-20 bg-indigo-100/40 rounded-full blur-2xl pointer-events-none" />

        {/* Quote Icon */}
        <div className="relative z-10 w-11 h-11 mx-auto mb-4 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-xs group-hover:scale-105 transition-transform">
          <Quote className="w-5 h-5 text-indigo-600" />
        </div>

        {/* Quote Body */}
        <blockquote className="relative z-10 text-base sm:text-lg lg:text-xl font-medium text-slate-800 leading-relaxed italic max-w-2xl mx-auto">
          “A resume is more than a document; it is a story of what someone is capable of doing. Through our AI, we transform those capabilities into something tangible for every candidate striving toward their dream career.”
        </blockquote>

        {/* Attribution & Signature */}
        <div className="relative z-10 mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span className="w-6 h-[1px] bg-slate-300" />
          <span className="text-indigo-600 font-bold">Resume Reviewer</span>
          <span>•</span>
          <span>Our Guiding Philosophy</span>
          <span className="w-6 h-[1px] bg-slate-300" />
        </div>

        {/* Direct Action Link */}
        <div className="relative z-10 mt-6 pt-1">
          <button
            onClick={onNavigateToDashboard}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200/80 shadow-xs transition-all cursor-pointer hover:-translate-y-0.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Discover Your Capabilities</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
