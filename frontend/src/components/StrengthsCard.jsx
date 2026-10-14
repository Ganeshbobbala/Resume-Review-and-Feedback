import React from 'react';
import { ThumbsUp, CheckCircle } from 'lucide-react';

export default function StrengthsCard({ strengths = [] }) {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
          <ThumbsUp className="w-4 h-4" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Your Strengths</h3>
      </div>

      <ul className="space-y-2.5">
        {strengths.length > 0 ? (
          strengths.map((strength, idx) => (
            <li key={idx} className="flex items-start text-xs font-medium text-emerald-950 bg-emerald-50/80 p-3 rounded-xl border border-emerald-200/90">
              <CheckCircle className="w-4 h-4 text-emerald-600 mr-2.5 mt-0.5 shrink-0" />
              <span>{strength}</span>
            </li>
          ))
        ) : (
          <li className="text-xs text-slate-500 italic">No specific key strengths identified.</li>
        )}
      </ul>
    </div>
  );
}
