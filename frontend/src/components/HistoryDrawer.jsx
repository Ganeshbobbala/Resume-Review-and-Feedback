import React, { useState, useEffect } from 'react';
import { Database, Clock, ArrowRight, RefreshCw, X, FileText, CheckCircle, AlertCircle, Award } from 'lucide-react';
import { getResumeHistory, getResumeReviewDetail } from '../services/api';

export default function HistoryDrawer({ isOpen, onClose, onLoadReview }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getResumeHistory(20);
      setReviews(data.reviews || []);
    } catch (err) {
      setError(err.message || 'Unable to connect to Supabase history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const handleSelectReview = async (reviewId) => {
    try {
      setLoading(true);
      const detail = await getResumeReviewDetail(reviewId);
      if (detail && onLoadReview) {
        // Map database record to frontend result format
        onLoadReview({
          filename: detail.filename || 'stored_resume.pdf',
          target_role: detail.target_role,
          predicted_category: detail.predicted_category,
          resume_score: detail.overall_score,
          skill_score: detail.overall_score,
          section_score: 85,
          job_match_score: detail.overall_score,
          keyword_score: detail.overall_score,
          detected_skills: detail.detected_skills || [],
          matched_skills: detail.detected_skills || [],
          missing_skills: detail.missing_skills || [],
          sections: {
            contact_info: true,
            skills: true,
            experience: true,
            education: true,
            projects: true
          },
          strengths: detail.strengths || [],
          weaknesses: detail.weaknesses || [],
          recommendations: detail.recommendations || [],
          detailed_feedback: {},
          extracted_text: detail.raw_text || ''
        });
        onClose();
      }
    } catch (err) {
      setError('Failed to load review details.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm transition-opacity flex justify-end">
      <div className="w-full max-w-md bg-white shadow-2xl h-full flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Supabase Database History</h3>
              <p className="text-xs text-slate-500">Stored resume feedback & reviews</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={fetchHistory}
              disabled={loading}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading && reviews.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
              <p className="text-sm">Querying Supabase database...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-semibold">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Supabase Setup Required</span>
              </div>
              <p>To enable real-time storage, make sure to execute the SQL schema in your Supabase SQL Editor.</p>
              <p className="text-slate-500 font-mono text-[11px] bg-white p-2 rounded border border-amber-100">
                supabase_schema.sql
              </p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No saved reviews yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Upload or analyze a resume to store it automatically in Supabase.
              </p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                onClick={() => handleSelectReview(rev.id)}
                className="group p-3.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer relative"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 text-sm truncate flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      {rev.filename || 'Resume.pdf'}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span className="inline-flex items-center text-[11px]">
                        <Clock className="w-3 h-3 mr-1 text-slate-400" />
                        {new Date(rev.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span>•</span>
                      <span className="font-medium text-slate-700 truncate max-w-[120px]">
                        {rev.target_role || rev.predicted_category || 'General'}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                      (rev.overall_score || 0) >= 80
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : (rev.overall_score || 0) >= 60
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {Math.round(rev.overall_score || 0)}%
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>

                {rev.detected_skills && rev.detected_skills.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {rev.detected_skills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {rev.detected_skills.length > 4 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{rev.detected_skills.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          Connected to Supabase Project <span className="font-mono text-slate-700">hbvycfvvmstsnivalbqi</span>
        </div>
      </div>
    </div>
  );
}
