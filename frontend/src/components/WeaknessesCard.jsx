import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function WeaknessesCard({ weaknesses = [] }) {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Areas to Improve</h3>
      </div>

      <ul className="space-y-2.5">
        {weaknesses.length > 0 ? (
          weaknesses.map((weakness, idx) => (
            <li key={idx} className="flex items-start text-xs font-medium text-amber-950 bg-amber-50/80 p-3 rounded-xl border border-amber-200/90">
              <AlertTriangle className="w-4 h-4 text-amber-600 mr-2.5 mt-0.5 shrink-0" />
              <span>{weakness}</span>
            </li>
          ))
        ) : (
          <li className="text-xs text-emerald-700 font-medium bg-emerald-50 p-3 rounded-xl border border-emerald-200">Great job! No major structural weaknesses detected.</li>
        )}
      </ul>
    </div>
  );
}
