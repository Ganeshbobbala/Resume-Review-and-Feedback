import React from 'react';
import { Briefcase, ChevronDown, Sparkles, Target, CheckCircle2 } from 'lucide-react';

const ROLE_GROUPS = [
  {
    category: "Software Development",
    roles: [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Java Developer"
    ]
  },
  {
    category: "Data & Artificial Intelligence",
    roles: [
      "Data Scientist",
      "ML Engineer",
      "Data Engineer"
    ]
  },
  {
    category: "Cloud, DevOps & Security",
    roles: [
      "DevOps Engineer",
      "Cloud Architect",
      "Cybersecurity Analyst"
    ]
  },
  {
    category: "Mobile & Quality Assurance",
    roles: [
      "Android Developer",
      "iOS Developer",
      "QA / Automation Engineer"
    ]
  },
  {
    category: "Design & Product",
    roles: [
      "UI/UX Designer",
      "Product Manager"
    ]
  }
];

export default function RoleSelector({
  targetRole = 'Frontend Developer',
  setTargetRole,
  analysisMode = 'with_role', // 'with_role' | 'without_role'
  setAnalysisMode
}) {
  const isWithoutRole = analysisMode === 'without_role';

  const handleModeSwitch = (mode) => {
    if (setAnalysisMode) {
      setAnalysisMode(mode);
    }
    if (mode === 'without_role') {
      setTargetRole('auto');
    } else {
      if (targetRole === 'auto' || !targetRole) {
        setTargetRole('Frontend Developer');
      }
    }
  };

  const handleSelectChange = (e) => {
    const val = e.target.value;
    if (val === 'auto') {
      if (setAnalysisMode) setAnalysisMode('without_role');
      setTargetRole('auto');
    } else {
      if (setAnalysisMode) setAnalysisMode('with_role');
      setTargetRole(val);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto text-left space-y-3.5">
      {/* 1. Mode Switcher (With Target Role vs Without Target Role) */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
          <span>Analysis Track Mode</span>
        </label>
        <span className="text-[11px] text-slate-400 font-medium">Choose evaluation style</span>
      </div>

      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => handleModeSwitch('with_role')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            !isWithoutRole
              ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Target className="w-3.5 h-3.5 text-indigo-600" />
          <span>With Target Role</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeSwitch('without_role')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            isWithoutRole
              ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Without Target Role</span>
        </button>
      </div>

      {/* 2. Mode Content */}
      {!isWithoutRole ? (
        /* Mode A: With Target Role (Dropdown Selection) */
        <div className="space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <span>Select Desired Engineering Role</span>
            </span>
            <span className="text-[11px] text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              15 Tracks Available
            </span>
          </div>

          <div className="relative">
            <select
              value={targetRole === 'auto' ? 'Frontend Developer' : targetRole}
              onChange={handleSelectChange}
              className="w-full appearance-none bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all cursor-pointer pr-10 hover:border-indigo-300"
            >
              {ROLE_GROUPS.map((group) => (
                <optgroup key={group.category} label={`── ${group.category} ──`}>
                  {group.roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-indigo-600">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            Benchmarks your resume specifically against the core required skills and keywords for this target role.
          </p>
        </div>
      ) : (
        /* Mode B: Without Target Role (Auto-Detect AI Mode) */
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-900">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Auto-Detect Role Analysis</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-200">
              Open Analysis
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            No target role required. The Machine Learning model will analyze your resume holistically, detect your dominant skill sets, and automatically benchmark against your best-fit engineering track.
          </p>
          <div className="pt-1 flex items-center gap-1 text-[11px] text-indigo-700 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Optimal for open career discovery or broad technical review</span>
          </div>
        </div>
      )}
    </div>
  );
}
