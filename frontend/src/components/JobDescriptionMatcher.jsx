import React, { useState } from 'react';
import { Target, FileText, Check, X, AlertCircle, Loader2, Sparkles, Award, Zap, BookOpen, Clock, Lightbulb, RefreshCw } from 'lucide-react';
import { matchJobDescription } from '../services/api';

export default function JobDescriptionMatcher({ selectedFile, setSelectedFile }) {
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please upload a resume PDF before analyzing a job description.');
      return;
    }

    if (!jobDescription || jobDescription.trim().length < 20) {
      setError('Please paste a complete job description (at least 20 characters).');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const data = await matchJobDescription(selectedFile, jobDescription);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze job match.');
    } finally {
      setIsLoading(false);
    }
  };

  const getMatchCategory = (score) => {
    if (score >= 80) return { label: 'Strong Match', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 65) return { label: 'Good Match', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
    if (score >= 50) return { label: 'Partial Match', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Weak Match', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs">
          <Target className="w-3.5 h-3.5 mr-1.5 text-indigo-600" /> Targeted Role Matching
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Job Description Matcher
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Compare your resume against a specific job description to discover your strengths and skill gaps.
        </p>
      </div>

      {/* Input Form Section */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Selected Resume Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Active Resume</span>
              <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                {selectedFile ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{selectedFile.name}</span>
                  </>
                ) : (
                  <span className="text-rose-600 font-normal">No resume uploaded yet</span>
                )}
              </p>
            </div>
          </div>

          <label className="cursor-pointer text-xs font-semibold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl border border-indigo-200 transition-all inline-flex items-center justify-center shadow-xs">
            {selectedFile ? 'Change Resume' : 'Upload Resume'}
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                  setError('');
                }
              }}
              className="hidden"
            />
          </label>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Job Description Textarea */}
        <div className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Paste Job Description
            </label>
            <span className="text-xs text-slate-400 font-mono">
              {jobDescription.length} / 10,000 characters
            </span>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => {
              if (e.target.value.length <= 10000) {
                setJobDescription(e.target.value);
              }
            }}
            placeholder="Paste job requirements here (e.g. We are looking for a Senior React Developer with experience in JavaScript, TypeScript, Node.js, SQL, Docker, AWS...)"
            rows={7}
            className="w-full bg-white border border-slate-300 rounded-xl p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-y shadow-xs"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center pt-2">
          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || isLoading || jobDescription.trim().length < 20}
            className={`w-full sm:w-auto min-w-[240px] inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white transition-all shadow-md ${
              selectedFile && jobDescription.trim().length >= 20 && !isLoading
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-indigo-600/25 cursor-pointer hover:-translate-y-0.5'
                : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed shadow-none'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin text-white" />
                Analyzing Job Match...
              </>
            ) : (
              <>
                <Target className="w-5 h-5 mr-2" />
                Analyze Job Match
              </>
            )}
          </button>
        </div>
      </div>

      {/* Match Results Display */}
      {result && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Main Score Header Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Job Match Score</span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <span className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600">
                {result.match_score}%
              </span>
              <span className={`mt-3 inline-flex items-center px-4 py-1 rounded-full text-xs font-extrabold border ${getMatchCategory(result.match_score).color}`}>
                {getMatchCategory(result.match_score).label}
              </span>
            </div>

            <p className="text-xs text-slate-500 italic max-w-md mx-auto">
              This score represents the alignment between your resume and the specified job description.
            </p>
          </div>

          {/* Job Match Breakdown Progress Bars */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" /> Job Match Breakdown
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Skill Match (40%) */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-700">Skill Match (40%)</span>
                  <span className="text-indigo-600 font-bold">{result.skill_match}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-700" style={{ width: `${result.skill_match}%` }} />
                </div>
              </div>

              {/* Keyword Match (25%) */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-700">Keyword Match (25%)</span>
                  <span className="text-indigo-600 font-bold">{result.keyword_match}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-700" style={{ width: `${result.keyword_match}%` }} />
                </div>
              </div>

              {/* Experience Match (15%) */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-700">Experience Match (15%)</span>
                  <span className="text-indigo-600 font-bold">{result.experience_match}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700" style={{ width: `${result.experience_match}%` }} />
                </div>
              </div>

              {/* Education Match (10%) */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-700">Education Match (10%)</span>
                  <span className="text-indigo-600 font-bold">{result.education_match}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-700" style={{ width: `${result.education_match}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Matched vs Missing Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Matched Skills */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> Matched Skills ({result.matched_skills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.matched_skills.length > 0 ? (
                  result.matched_skills.map((skill) => (
                    <span key={skill} className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
                      ✓ {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No direct matching skills detected.</p>
                )}
              </div>
            </div>

            {/* Missing Skills / Skills to Consider */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <X className="w-4 h-4 text-amber-600" /> Skills to Consider ({result.missing_skills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.missing_skills.length > 0 ? (
                  result.missing_skills.map((skill) => (
                    <span key={skill} className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 shadow-xs">
                      ✗ {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-emerald-700 font-medium">All key role skills found in resume!</p>
                )}
              </div>
              <p className="text-[11px] text-slate-500 italic pt-1">
                Consider learning or highlighting these skills if you have genuine experience with them.
              </p>
            </div>
          </div>

          {/* Recommendations Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" /> How to Improve Your Match
            </h3>
            <div className="space-y-2 text-xs sm:text-sm">
              {result.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start space-x-3 bg-slate-50 hover:bg-slate-100/70 p-3.5 rounded-xl border border-slate-200 transition-colors">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-slate-800 font-medium">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

