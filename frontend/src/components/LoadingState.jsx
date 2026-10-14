import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Circle, Cpu } from 'lucide-react';

const STEPS = [
  'Reading resume PDF',
  'Extracting text & structure',
  'Analyzing technical skills',
  'ML Model classification',
  'Matching job role requirements',
  'Generating AI recommendations'
];

export default function LoadingState() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-8 border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm">
          <Cpu className="w-8 h-8 animate-pulse text-indigo-600" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Analyzing your resume...</h3>
        <p className="text-xs text-slate-500">AI Processing core is evaluating your credentials against industry benchmarks.</p>
      </div>

      <div className="space-y-3 text-left border-t border-slate-200 pt-5">
        {STEPS.map((step, idx) => {
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div
              key={step}
              className={`flex items-center space-x-3 text-xs sm:text-sm transition-all duration-300 ${
                isDone
                  ? 'text-emerald-700 font-semibold'
                  : isCurrent
                  ? 'text-indigo-600 font-bold'
                  : 'text-slate-400'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-300 shrink-0" />
              )}
              <span>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
