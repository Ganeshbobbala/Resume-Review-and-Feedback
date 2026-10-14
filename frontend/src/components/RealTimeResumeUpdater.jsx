import React, { useState, useEffect, useRef } from 'react';
import {
  RefreshCw,
  UploadCloud,
  Sparkles,
  Zap,
  TrendingUp,
  Plus,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Target
} from 'lucide-react';
import { analyzeResume, analyzeResumeText } from '../services/api';

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

export default function RealTimeResumeUpdater({
  selectedFile,
  setSelectedFile,
  targetRole,
  setTargetRole,
  analysisMode,
  setAnalysisMode,
  result,
  setResult,
  setAiState
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [resumeText, setResumeText] = useState(result?.extracted_text || '');
  const [originalScore] = useState(result?.resume_score || 0);
  const [lastScoreDiff, setLastScoreDiff] = useState(0);
  const [copied, setCopied] = useState(false);
  const [updateNotice, setUpdateNotice] = useState('');
  const fileInputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Sync extracted text when result updates
  useEffect(() => {
    if (result?.extracted_text && !resumeText) {
      setResumeText(result.extracted_text);
    }
  }, [result]);

  // Handle uploading an updated PDF file in real-time
  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a valid PDF document.');
      return;
    }

    setIsUpdating(true);
    setAiState?.('processing');
    setSelectedFile(file);

    try {
      const roleToSend = analysisMode === 'without_role' ? 'auto' : targetRole;
      const data = await analyzeResume(file, roleToSend);
      
      const diff = data.resume_score - (result?.resume_score || 0);
      setLastScoreDiff(diff);
      setResult(data);
      setResumeText(data.extracted_text || '');
      setAiState?.('completed');
      setUpdateNotice(`Resume updated from "${file.name}" in real time!`);
      setTimeout(() => setUpdateNotice(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to update resume.');
      setAiState?.('idle');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle real-time text analysis as candidate types or injects skills
  const triggerRealtimeTextAnalysis = async (updatedText, roleOverride) => {
    if (!updatedText || updatedText.trim().length < 15) return;

    setIsUpdating(true);
    setAiState?.('processing');

    try {
      const currentRole = roleOverride || (analysisMode === 'without_role' ? 'auto' : targetRole);
      const data = await analyzeResumeText(updatedText, currentRole);
      
      const diff = data.resume_score - originalScore;
      setLastScoreDiff(diff);
      setResult(data);
      setAiState?.('completed');
    } catch (err) {
      console.error('Real-time analysis error:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Debounced text change handler
  const handleTextChange = (e) => {
    const text = e.target.value;
    setResumeText(text);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      triggerRealtimeTextAnalysis(text);
    }, 600);
  };

  // 1-Click Skill Injection into resume in real-time
  const handleInjectSkill = (skill) => {
    const addition = `\n- Technical Experience: Proficient in ${skill} with practical implementation in project architecture.`;
    const updatedText = resumeText ? `${resumeText}\n${addition}` : `Technical Skills: ${skill}`;
    setResumeText(updatedText);
    triggerRealtimeTextAnalysis(updatedText);
    setUpdateNotice(`Skill "${skill}" injected! Recalculated in real time.`);
    setTimeout(() => setUpdateNotice(''), 3000);
  };

  // Real-time Role Switcher
  const handleRoleChange = async (newRole) => {
    setTargetRole(newRole);
    setAnalysisMode('with_role');
    
    if (selectedFile) {
      setIsUpdating(true);
      setAiState?.('processing');
      try {
        const data = await analyzeResume(selectedFile, newRole);
        setResult(data);
        setAiState?.('completed');
      } catch (err) {
        console.error(err);
      } finally {
        setIsUpdating(false);
      }
    } else if (resumeText) {
      triggerRealtimeTextAnalysis(resumeText, newRole);
    }
  };

  const handleModeToggle = async (mode) => {
    setAnalysisMode(mode);
    const roleToSend = mode === 'without_role' ? 'auto' : targetRole;
    if (mode === 'without_role') setTargetRole('auto');
    else if (targetRole === 'auto') setTargetRole('Frontend Developer');

    if (selectedFile) {
      setIsUpdating(true);
      setAiState?.('processing');
      try {
        const data = await analyzeResume(selectedFile, roleToSend);
        setResult(data);
        setAiState?.('completed');
      } catch (err) {
        console.error(err);
      } finally {
        setIsUpdating(false);
      }
    } else if (resumeText) {
      triggerRealtimeTextAnalysis(resumeText, roleToSend);
    }
  };

  const handleCopyText = () => {
    if (!resumeText) return;
    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const missingSkills = result?.missing_skills || [];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4 transition-all">
      {/* Real-time Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        
        {/* Left: Active File & Live Real-Time Badge */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
            <Zap className={`w-5 h-5 ${isUpdating ? 'animate-bounce text-amber-500' : 'text-indigo-600'}`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Live Resume Evaluator
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Real-Time Sync
              </span>
            </div>
            
            <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
              <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
              <span className="truncate max-w-[220px] sm:max-w-xs">{selectedFile?.name || 'Active Resume'}</span>
              {isUpdating && (
                <span className="text-xs text-indigo-600 font-semibold inline-flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Recalculating...
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Center: Real-Time Target Role Switcher Dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switch Pills */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => handleModeToggle('with_role')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                analysisMode !== 'without_role'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Role Track
            </button>
            <button
              onClick={() => handleModeToggle('without_role')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                analysisMode === 'without_role'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Auto-Detect
            </button>
          </div>

          {/* Role Dropdown */}
          {analysisMode !== 'without_role' && (
            <div className="relative">
              <select
                value={targetRole === 'auto' ? 'Frontend Developer' : targetRole}
                onChange={(e) => handleRoleChange(e.target.value)}
                disabled={isUpdating}
                className="appearance-none bg-white border border-slate-300 rounded-xl pl-3 pr-8 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs cursor-pointer hover:border-indigo-400"
              >
                {ROLE_GROUPS.map((group) => (
                  <optgroup key={group.category} label={`── ${group.category} ──`}>
                    {group.roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Right: Actions (Update PDF / Live Editor Toggle) */}
        <div className="flex items-center gap-2">
          {/* Hidden File Input for PDF Replacement */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUpdating}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-600 text-xs font-bold border border-slate-200 shadow-xs transition-all cursor-pointer hover:border-indigo-200"
            title="Upload updated PDF version to recalculate immediately"
          >
            <UploadCloud className="w-4 h-4 text-indigo-600" />
            <span>Update PDF</span>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
              isOpen
                ? 'bg-indigo-600 text-white shadow-indigo-600/20'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Live Resume Optimizer</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
          </button>
        </div>
      </div>

      {/* Real-time Update Notice Banner */}
      {updateNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{updateNotice}</span>
          </div>
          {lastScoreDiff !== 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-extrabold text-[11px]">
              <TrendingUp className="w-3 h-3" />
              {lastScoreDiff > 0 ? `+${lastScoreDiff}` : lastScoreDiff} pts
            </span>
          )}
        </div>
      )}

      {/* Expandable Live Resume Optimizer Drawer */}
      {isOpen && (
        <div className="space-y-4 pt-2 animate-in fade-in duration-300">
          
          {/* Header Info & Telemetry */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-indigo-50/70 border border-indigo-100">
            <div>
              <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Real-Time Resume Content Booster
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Inject missing skills with 1 click or edit resume bullets below. Scores recalculate live in real-time.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Current Score</span>
                <span className="text-base font-black text-slate-900">
                  {result?.resume_score || 0} / 100
                </span>
              </div>

              {lastScoreDiff !== 0 && (
                <span className={`px-2.5 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1 ${
                  lastScoreDiff > 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}>
                  <TrendingUp className="w-3.5 h-3.5" />
                  {lastScoreDiff > 0 ? `+${lastScoreDiff}` : lastScoreDiff} pts
                </span>
              )}
            </div>
          </div>

          {/* 1-Click Quick Skill Injection Pill Bar */}
          {missingSkills.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <span>1-Click Skill Booster (Missing For {result?.target_role}):</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.slice(0, 10).map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleInjectSkill(skill)}
                    disabled={isUpdating}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-2xs"
                    title={`Click to inject ${skill} into your resume in real time`}
                  >
                    <Plus className="w-3 h-3 text-amber-600" />
                    <span>{skill}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Editable Text Area */}
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Resume Text (Live Real-Time Sync)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-mono">
                  {resumeText.length} chars
                </span>
                <button
                  onClick={handleCopyText}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>
              </div>
            </div>

            <textarea
              value={resumeText}
              onChange={handleTextChange}
              placeholder="Resume extracted text... Edit bullets, add certifications or skills to see scores update live in real-time."
              rows={8}
              className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono transition-all resize-y shadow-xs"
            />
            <p className="text-[11px] text-slate-500 italic">
              Tip: As you type or add experience, the LinearSVC model and ATS scorer analyze the changes automatically.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

