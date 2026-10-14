import React from 'react';
import { Cpu, CheckCircle, AlertTriangle } from 'lucide-react';

export default function SkillsCard({ detectedSkills = [], missingSkills = [] }) {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-600" /> Skills Overview
        </h3>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          {detectedSkills.length} Detected
        </span>
      </div>

      {/* Detected Skills */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Detected Skills
        </h4>
        {detectedSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {detectedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100/70 text-indigo-700 border border-indigo-200/80 transition-colors shadow-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No specific technical skills detected.</p>
        )}
      </div>

      {/* Missing Recommended Skills */}
      {missingSkills.length > 0 && (
        <div className="space-y-3 border-t border-slate-200 pt-5">
          <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Missing Recommended Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 shadow-xs"
              >
                + {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
