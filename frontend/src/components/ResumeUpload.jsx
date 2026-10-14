import React, { useRef, useState } from 'react';
import { UploadCloud, FileCheck, AlertCircle, X, Sparkles } from 'lucide-react';

export default function ResumeUpload({ selectedFile, setSelectedFile, error, setError, onAutoAnalyze }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file) => {
    setError('');
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && !file.type.includes('pdf')) {
      setError('Please upload a valid PDF document (.pdf).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10 MB limit.');
      return;
    }

    setSelectedFile(file);
    if (onAutoAnalyze) {
      onAutoAnalyze(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center space-y-6">
      {/* Hero Header */}
      <div className="space-y-3">
        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> AI-Powered Resume Analysis
        </span>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          AI Resume Reviewer
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
          Analyze your resume. Understand your strengths. Improve your chances of getting hired with instant AI feedback.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between text-left shadow-sm">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-rose-600 hover:text-rose-800 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-8 sm:p-12 flex flex-col items-center justify-center backdrop-blur-md shadow-sm ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/60 ring-4 ring-indigo-500/10'
            : selectedFile
            ? 'border-emerald-400 bg-emerald-50/40'
            : 'border-slate-300 bg-white/95 hover:border-indigo-400 hover:bg-slate-50/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => handleFileChange(e.target.files[0])}
          className="hidden"
        />

        {selectedFile ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-sm">
              <FileCheck className="w-8 h-8" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-base">{selectedFile.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB PDF Document
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
              className="mt-2 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors inline-flex items-center space-x-1 cursor-pointer shadow-xs"
            >
              <X className="w-3.5 h-3.5 mr-1" /> Remove PDF
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center shadow-sm">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-bold text-slate-900">
                Drag & drop your resume PDF here
              </p>
              <p className="text-sm text-slate-500 mt-1">or click to browse your files</p>
            </div>
            <div className="inline-flex items-center px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors">
              Browse Resume
            </div>
            <p className="text-xs text-slate-400">PDF files up to 10 MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
