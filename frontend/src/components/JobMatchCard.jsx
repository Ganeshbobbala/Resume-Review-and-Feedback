import React from 'react';
import { Target, Check, X } from 'lucide-react';

export default function JobMatchCard({
  targetRole,
  jobMatchScore,
  matchedSkills = [],
  missingSkills = [],
  isAutoRole = false
}) {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {isAutoRole ? 'Auto-Detected Role Benchmark' : 'Target Role'}
          </span>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mt-0.5">
            <Target className="w-5 h-5 text-indigo-600" />
            <span>{targetRole}</span>
            {isAutoRole && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                Auto
              </span>
            )}
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-slate-500 block">Match Score</span>
          <span className="text-2xl font-black text-indigo-600">{jobMatchScore}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${jobMatchScore}%` }}
          />
        </div>
      </div>

      {/* Skills breakdown for target role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
        {/* Matched Skills */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-600" /> Matched Skills ({matchedSkills.length})
          </h4>
          <ul className="space-y-1 text-xs text-slate-700 font-medium">
            {matchedSkills.length > 0 ? (
              matchedSkills.map((skill) => (
                <li key={skill} className="flex items-center text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" />
                  {skill}
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">No matching skills found for role</li>
            )}
          </ul>
        </div>

        {/* Missing Skills */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
            <X className="w-3.5 h-3.5 text-rose-600" /> Missing Skills ({missingSkills.length})
          </h4>
          <ul className="space-y-1 text-xs text-slate-700 font-medium">
            {missingSkills.length > 0 ? (
              missingSkills.map((skill) => (
                <li key={skill} className="flex items-center text-rose-800 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                  <X className="w-3.5 h-3.5 mr-1.5 text-rose-600 shrink-0" />
                  {skill}
                </li>
              ))
            ) : (
              <li className="text-emerald-700 italic font-semibold">All core role skills matched!</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
