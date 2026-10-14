import React from 'react';
import { Lightbulb } from 'lucide-react';

export default function RecommendationsCard({ recommendations = [] }) {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shadow-xs">
          <Lightbulb className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Recommended Improvements</h3>
          <p className="text-xs text-slate-500">Actionable AI steps to maximize your callback rate</p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.length > 0 ? (
          recommendations.map((recommendation, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-3.5 bg-slate-50/80 hover:bg-slate-100/70 p-4 rounded-xl border border-slate-200 transition-all duration-200"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                {idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {recommendation}
              </p>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 italic">No specific recommendations at this time.</p>
        )}
      </div>
    </div>
  );
}
