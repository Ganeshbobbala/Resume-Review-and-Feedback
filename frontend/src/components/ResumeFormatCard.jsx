import React from 'react';
import { Layout, CheckCircle2, AlertTriangle, FileText, Smartphone, Mail, Globe, Github, Linkedin } from 'lucide-react';

export default function ResumeFormatCard({ result }) {
  if (!result) return null;

  const { format_score, pages, sections = {}, contact = {}, bullet_analysis = {}, quantification = {}, readability = {}, warnings = [], recommendations = [] } = result;

  const getFormatRating = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 75) return { label: 'Good', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
    if (score >= 60) return { label: 'Needs Improvement', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Poor', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Format Score Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Heuristic Resume Format Score</span>
        
        <div className="flex flex-col items-center justify-center">
          <span className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-indigo-600 to-cyan-600">
            {format_score} <span className="text-2xl text-slate-400">/ 100</span>
          </span>
          <span className={`mt-3 inline-flex items-center px-4 py-1 rounded-full text-xs font-extrabold border ${getFormatRating(format_score).color}`}>
            {getFormatRating(format_score).label}
          </span>
        </div>

        <p className="text-xs text-slate-500 italic max-w-md mx-auto">
          This analysis checks common resume structure, page length, and content readability factors.
        </p>
      </div>

      {/* Grid Row 1: Structure & Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Structure Analysis */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layout className="w-5 h-5 text-indigo-600" /> Section Structure
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries({
              contact: 'Contact Info',
              summary: 'Summary',
              education: 'Education',
              skills: 'Skills',
              experience: 'Work Experience',
              projects: 'Projects',
              certifications: 'Certifications',
              achievements: 'Achievements'
            }).map(([key, label]) => {
              const present = Boolean(sections[key]);
              return (
                <div key={key} className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  present ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}>
                  <span>{label}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${present ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-600'}`}>
                    {present ? '✓' : '✗'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Info Verification */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-600" /> Contact Information Details
          </h3>

          <div className="space-y-2 text-xs">
            {[
              { key: 'email', label: 'Email Address', icon: Mail },
              { key: 'phone', label: 'Phone Number', icon: Smartphone },
              { key: 'linkedin', label: 'LinkedIn Profile', icon: Linkedin },
              { key: 'github', label: 'GitHub Profile', icon: Github },
              { key: 'portfolio', label: 'Portfolio Link', icon: Globe }
            ].map((item) => {
              const Icon = item.icon;
              const present = Boolean(contact[item.key]);
              return (
                <div key={item.key} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <Icon className="w-4 h-4 text-indigo-600" />
                    <span>{item.label}</span>
                  </div>
                  <span className={`text-xs font-bold ${present ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {present ? 'Detected ✓' : 'Missing ✗'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid Row 2: Bullet Quality & Readability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bullet Quality */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" /> Bullet Point Quality
            </span>
            <span className="text-xs text-slate-500 font-medium">Pages: {pages}</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Total Bullets</span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">{bullet_analysis.total || 0}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Strong Bullets</span>
              <span className="text-xl font-bold text-emerald-700 mt-1 block">{bullet_analysis.strong || 0}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Needs Improvement</span>
              <span className="text-xl font-bold text-amber-700 mt-1 block">{bullet_analysis.needs_improvement || 0}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Quantified Results</span>
              <span className="text-xl font-bold text-indigo-600 mt-1 block">
                {quantification.quantified || 0} / {bullet_analysis.total || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Readability Metrics */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" /> Readability & Formatting
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700">Sentence Clarity</span>
                <span className="text-indigo-600 font-bold">{readability.sentence_clarity || 85}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${readability.sentence_clarity || 85}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700">Content Density</span>
                <span className="text-indigo-600 font-bold">{readability.content_density || 80}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-violet-500 rounded-full" style={{ width: `${readability.content_density || 80}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700">Section Clarity</span>
                <span className="text-indigo-600 font-bold">{readability.section_clarity || 90}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${readability.section_clarity || 90}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warnings & Recommendations */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" /> Formatting Warnings & Recommendations
        </h3>

        <div className="space-y-2 text-xs sm:text-sm">
          {warnings.map((warn, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{warn}</span>
            </div>
          ))}

          {recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

