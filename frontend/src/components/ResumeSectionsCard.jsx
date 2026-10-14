import React from 'react';
import { Layers, CheckCircle2, XCircle } from 'lucide-react';

const SECTION_LABELS = {
  contact: 'Contact Information',
  summary: 'Professional Summary',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  experience: 'Work Experience',
  certifications: 'Certifications',
  achievements: 'Achievements'
};

export default function ResumeSectionsCard({ sections = {} }) {
  const totalDetected = Object.values(sections).filter(Boolean).length;
  const totalSections = Object.keys(SECTION_LABELS).length;

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" /> Resume Structure Analysis
        </h3>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          {totalDetected} / {totalSections} Detected
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {Object.entries(SECTION_LABELS).map(([key, label]) => {
          const isPresent = Boolean(sections[key]);

          return (
            <div
              key={key}
              className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-colors ${
                isPresent
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <span className="flex items-center space-x-2">
                {isPresent ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>{label}</span>
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  isPresent ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200/80 text-slate-600 border border-slate-300'
                }`}
              >
                {isPresent ? 'Present' : 'Missing'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
