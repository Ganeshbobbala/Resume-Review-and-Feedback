import React from 'react';
import { Sparkles, ShieldCheck, Zap, Code2, Cpu, ArrowRight } from 'lucide-react';

export default function About({ onGetStarted }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 shadow-xs inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Full-Stack AI SaaS Platform
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About Resume Reviewer
        </h2>
        <p className="text-base text-slate-600 max-w-xl mx-auto">
          An intelligent resume evaluation platform built to bridge the gap between job candidates, Applicant Tracking Systems (ATS), and modern tech roles.
        </p>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Pre-trained ML Intelligence</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Uses pre-trained Scikit-Learn classifiers (`.pkl`) and TF-IDF text vectorizers loaded into FastAPI to predict target job categories instantly without retraining overhead.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-200">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Explainable Scoring Engine</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            No black-box scores. Every score is mathematically derived from skill coverage (40%), resume structural integrity (30%), role requirements (20%), and ATS keyword density (10%).
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Privacy & Security First</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Uploaded PDFs are processed transiently in memory using PyMuPDF (`fitz`). No candidate personal data or document content is saved to disk or shared.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Modern SaaS Tech Stack</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Built using React 18, Vite, Tailwind CSS, Lucide Icons on the frontend, and Python FastAPI, PyMuPDF, Scikit-learn, and Uvicorn on the backend.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <button
          onClick={onGetStarted}
          className="inline-flex items-center px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          Try Resume Reviewer Now <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}
