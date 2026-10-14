import React from 'react';
import {
  FileText,
  Sparkles,
  RefreshCw,
  LayoutDashboard,
  Target,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  onReset,
  hasResult,
  aiState = 'idle'
}) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
            onClick={() => setActiveTab('hero')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-2">
                Resume Reviewer
                {/* AI State Badge */}
                {aiState === 'processing' ? (
                  <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200 animate-pulse">
                    <Loader2 className="w-3 h-3 mr-1.5 animate-spin text-cyan-600" /> Analyzing...
                  </span>
                ) : aiState === 'completed' ? (
                  <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Complete
                  </span>
                ) : (
                  <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" /> AI Ready
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Analysis Feature Nav Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('hero')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'hero'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-600" />
              <span>Resume Analysis</span>
            </button>

            <button
              onClick={() => setActiveTab('job-matcher')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'job-matcher'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Target className="w-4 h-4 text-cyan-600" />
              <span>Job Matcher</span>
            </button>
          </nav>

          {/* Right Links & Action */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
            <button
              onClick={() => setActiveTab('how-it-works')}
              className="hidden md:inline-block text-slate-600 hover:text-slate-900 px-2 py-1 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className="hidden md:inline-block text-slate-600 hover:text-slate-900 px-2 py-1 transition-colors cursor-pointer"
            >
              About
            </button>

            {hasResult && activeTab === 'dashboard' && (
              <button
                onClick={onReset}
                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all border border-slate-200 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
