import React, { useState } from 'react';
import {
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  FileCheck,
  Award,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  ChevronRight,
  BookOpen,
  Send,
  Loader2
} from 'lucide-react';
import { rewriteBullet } from '../services/api';

export default function DetailedFeedbackCard({ detailedFeedback = {}, targetRole = 'Frontend Developer', recommendations = [] }) {
  const [activeSubTab, setActiveSubTab] = useState('checklist'); // 'checklist', 'verbs', 'metrics', 'playbook', 'rewriter'
  
  // Bullet rewriter state
  const [bulletInput, setBulletInput] = useState('');
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewrittenVariations, setRewrittenVariations] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const checklist = detailedFeedback.checklist || { critical: [], recommended: [], polishing: [] };
  const actionVerbs = detailedFeedback.action_verbs || { strong_detected: [], weak_detected: [], strong_count: 0, weak_count: 0 };
  const quantification = detailedFeedback.quantification || { density_percentage: 0, quantified_bullets: 0, total_bullets: 0, rating: 'Moderate', advice: '' };
  const playbook = detailedFeedback.playbook || {
    priority_focus: 'System Architecture & Business Outcomes',
    key_metrics_advice: 'Quantify metrics with percentages and scale.',
    must_have_concepts: ['Technical Competence', 'Hands-on Projects', 'Measurable Results'],
    bullet_examples: []
  };

  const handleRewrite = async () => {
    if (!bulletInput.trim() || bulletInput.trim().length < 5) return;
    setIsRewriting(true);
    try {
      const data = await rewriteBullet(bulletInput, targetRole);
      setRewrittenVariations(data.variations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleCopyVariation = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const totalActionItems = (checklist.critical?.length || 0) + (checklist.recommended?.length || 0) + (checklist.polishing?.length || 0);

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 inline-flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Deep AI Resume Feedback
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Tailored for <span className="font-bold text-slate-800">{targetRole}</span>
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-2">
            Multi-Dimensional Feedback Hub
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Actionable recruiter insights, phrasing audits, metric densities, and interactive bullet rewriting.
          </p>
        </div>

        {/* Metric Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Action Items</span>
            <span className="text-lg font-black text-indigo-600">{totalActionItems} Suggested</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('checklist')}
          className={`px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'checklist'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Priority Checklist</span>
          {checklist.critical?.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 text-[10px] flex items-center justify-center font-extrabold ml-0.5">
              {checklist.critical.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('verbs')}
          className={`px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'verbs'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-indigo-600" />
          <span>Action Verbs ({actionVerbs.strong_count})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('metrics')}
          className={`px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'metrics'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-cyan-600" />
          <span>Metric Density ({quantification.density_percentage}%)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('playbook')}
          className={`px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'playbook'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-violet-600" />
          <span>{targetRole} Playbook</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rewriter')}
          className={`px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'rewriter'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>AI Bullet Rewriter</span>
        </button>
      </div>

      {/* Tab 1: Priority Action Checklist */}
      {activeSubTab === 'checklist' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Critical Fixes */}
          {checklist.critical?.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Critical High-Impact Fixes (Do First)
              </span>
              <div className="grid grid-cols-1 gap-2.5">
                {checklist.critical.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">{idx + 1}</span>
                        <span>{item.title}</span>
                      </h4>
                      <p className="text-xs text-rose-900/80 mt-1 sm:ml-5.5">{item.desc}</p>
                    </div>
                    <span className="shrink-0 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 font-extrabold text-[11px] self-start sm:self-center border border-rose-200">
                      {item.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Optimizations */}
          {checklist.recommended?.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-600" /> Recommended ATS Enhancements
              </span>
              <div className="grid grid-cols-1 gap-2.5">
                {checklist.recommended.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>{item.title}</span>
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 sm:ml-5.5">{item.desc}</p>
                    </div>
                    <span className="shrink-0 px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 font-extrabold text-[11px] self-start sm:self-center border border-indigo-200">
                      {item.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Polishing Touches */}
          {checklist.polishing?.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-600" /> Polishing Touches for Competitive Advantage
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {checklist.polishing.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {item.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Action Verbs & Phrasing Audit */}
      {activeSubTab === 'verbs' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Summary Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Strong Action Verbs Found</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">{actionVerbs.strong_count}</p>
              <p className="text-[11px] text-emerald-900 mt-1">Conveys decisive leadership, ownership, and technical execution.</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">Passive / Weak Phrases</span>
              <p className="text-2xl font-black text-amber-700 mt-1">{actionVerbs.weak_count}</p>
              <p className="text-[11px] text-amber-900 mt-1">Phrases like "responsible for" sound passive to engineering hiring managers.</p>
            </div>
          </div>

          {/* Strong Verbs Pills */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Strong Verbs Active in Your Resume:
            </h4>
            {actionVerbs.strong_detected?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {actionVerbs.strong_detected.map((v) => (
                  <span key={v} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                    ✓ {v}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No strong action verbs identified. Try starting bullets with Architected, Built, or Deployed.</p>
            )}
          </div>

          {/* Weak Phrases & Instant Replacement Recommendations */}
          {actionVerbs.weak_detected?.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Phrases to Upgrade:
              </h4>
              <div className="space-y-2">
                {actionVerbs.weak_detected.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-rose-700 line-through">
                      “{item.phrase}”
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Replace with: <strong className="text-indigo-700">{item.suggestion}</strong></span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Metric Density & Quantification Health */}
      {activeSubTab === 'metrics' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Quantification Density
              </span>
              <h4 className="text-2xl font-black text-slate-900 mt-1">
                {quantification.density_percentage}% of bullets quantified
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-md">{quantification.advice}</p>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <span className={`px-3 py-1.5 rounded-xl text-xs font-extrabold inline-block border ${
                quantification.rating === 'Excellent'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : quantification.rating === 'Moderate'
                  ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                  : 'bg-amber-100 text-amber-800 border-amber-200'
              }`}>
                {quantification.rating} Rating
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                {quantification.quantified_bullets} of {quantification.total_bullets} statements
              </p>
            </div>
          </div>

          {/* Formula Card */}
          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                The Gold Standard: Google XYZ Formula
              </h4>
            </div>

            <div className="p-3 rounded-xl bg-white border border-indigo-200/80 text-xs font-medium text-slate-800 leading-relaxed shadow-2xs">
              “Accomplished <strong className="text-indigo-600">[X: Outcome]</strong>, as measured by <strong className="text-cyan-600">[Y: Metric/Number]</strong>, by doing <strong className="text-emerald-600">[Z: Tech Stack/Action]</strong>.”
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <p><strong>Example (Before):</strong> Worked on improving database speed for search queries.</p>
              <p><strong>Example (After):</strong> Reduced p95 search query latency by <span className="text-emerald-700 font-bold">42%</span> across 5M+ records by implementing composite indexing in PostgreSQL and Redis caching.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Role Playbook */}
      {activeSubTab === 'playbook' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="p-4 rounded-xl bg-violet-50/70 border border-violet-200 space-y-1">
            <span className="text-xs font-bold text-violet-800 uppercase tracking-wider block">
              Core Hiring Benchmark for {targetRole}
            </span>
            <p className="text-sm font-bold text-violet-950">{playbook.priority_focus}</p>
            <p className="text-xs text-violet-900 mt-1">{playbook.key_metrics_advice}</p>
          </div>

          {/* Concepts Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Must-Have Technical Concepts for {targetRole}:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {playbook.must_have_concepts?.map((concept) => (
                <div key={concept} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
                  <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>{concept}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real World Before & After Examples */}
          {playbook.bullet_examples?.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Model Senior-Level Bullet Points to Replicate:
              </h4>
              <div className="space-y-2">
                {playbook.bullet_examples.map((example, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{example}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Interactive AI Bullet Rewriter */}
      {activeSubTab === 'rewriter' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Paste any bullet point to instantly generate 3 high-impact versions:
              </label>
              <span className="text-[11px] text-indigo-600 font-semibold">
                Target Role: {targetRole}
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={bulletInput}
                onChange={(e) => setBulletInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRewrite()}
                placeholder="e.g. Worked on frontend bug fixes and added new features in React"
                className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
              />
              <button
                onClick={handleRewrite}
                disabled={isRewriting || bulletInput.trim().length < 5}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs text-white transition-all flex items-center gap-1.5 shadow-xs shrink-0 ${
                  bulletInput.trim().length >= 5 && !isRewriting
                    ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer shadow-indigo-600/20'
                    : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                }`}
              >
                {isRewriting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Rewriting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Improve Bullet</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Pre-fills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-500">
            <span>Try sample:</span>
            {[
              "Responsible for managing backend APIs",
              "Helped build responsive landing page",
              "Worked on machine learning model"
            ].map((sample) => (
              <button
                key={sample}
                onClick={() => setBulletInput(sample)}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-medium transition-colors cursor-pointer border border-slate-200"
              >
                "{sample}"
              </button>
            ))}
          </div>

          {/* Rewritten Variations Display */}
          {rewrittenVariations.length > 0 && (
            <div className="space-y-3 pt-3">
              <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 3 AI-Enhanced Variations:
              </h4>

              <div className="space-y-2.5">
                {rewrittenVariations.map((v, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 shadow-xs transition-all space-y-2 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-900">{v.style}</span>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {v.tag}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyVariation(v.text, idx)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                        title="Copy to clipboard"
                      >
                        {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-800 leading-relaxed font-medium font-sans">
                      {v.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

