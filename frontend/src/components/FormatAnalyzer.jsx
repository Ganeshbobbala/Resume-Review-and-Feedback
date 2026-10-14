import React, { useState } from 'react';
import { Layout, FileText, Check, AlertCircle, Loader2 } from 'lucide-react';
import { analyzeResumeFormat } from '../services/api';
import ResumeFormatCard from './ResumeFormatCard';

export default function FormatAnalyzer({ selectedFile, setSelectedFile }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleAnalyzeFormat = async () => {
    if (!selectedFile) {
      setError('Please upload a resume PDF before checking format.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const data = await analyzeResumeFormat(selectedFile);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze format.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Layout className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> Structure & Readability Audit
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Resume Format Analyzer
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Check your resume structure, readability, sections, and content quality.
        </p>
      </div>

      {/* Selected Resume Banner & Action */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
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

          <label className="cursor-pointer text-xs font-semibold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl border border-indigo-200 transition-all inline-flex items-center justify-center">
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

        {/* Submit Button */}
        <div className="text-center pt-2">
          <button
            onClick={handleAnalyzeFormat}
            disabled={!selectedFile || isLoading}
            className={`w-full sm:w-auto min-w-[240px] inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white transition-all shadow-md ${
              selectedFile && !isLoading
                ? 'bg-gradient-to-r from-emerald-600 via-indigo-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-emerald-600/20 cursor-pointer hover:-translate-y-0.5'
                : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin text-white" />
                Auditing Resume Format...
              </>
            ) : (
              <>
                <Layout className="w-5 h-5 mr-2" />
                Analyze Format Quality
              </>
            )}
          </button>
        </div>
      </div>

      {/* Format Result Display */}
      {result && <ResumeFormatCard result={result} />}
    </div>
  );
}

