import React from 'react';
import { UploadCloud, Briefcase, Cpu, Award, Lightbulb, ArrowRight } from 'lucide-react';

export default function HowItWorks({ onGetStarted }) {
  const steps = [
    {
      step: '01',
      title: 'Upload Resume PDF',
      description: 'Upload your existing resume in PDF format (up to 10 MB). Our PyMuPDF parser cleanly extracts structured text, section blocks, and formatting.',
      icon: UploadCloud,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
    {
      step: '02',
      title: 'Select Target Job Role',
      description: 'Choose your desired tech role from 15 target categories to benchmark against industry hiring standards.',
      icon: Briefcase,
      color: 'bg-violet-50 text-violet-600 border-violet-200',
    },
    {
      step: '03',
      title: 'AI Machine Learning Classification',
      description: 'Your processed text is transformed via TF-IDF vectorization and analyzed by our pre-trained Machine Learning model artifacts (.pkl).',
      icon: Cpu,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    },
    {
      step: '04',
      title: 'Explainable Score Breakdown',
      description: 'Receive an overall score (0–100) calculated transparently: Skill Match (40%), Resume Structure (30%), Job Match (20%), and ATS Keyword Density (10%).',
      icon: Award,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      step: '05',
      title: 'Actionable Recommendations',
      description: 'Get dynamic strengths, structural weakness warnings, and personalized numbered recommendations to boost your callback rate.',
      icon: Lightbulb,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How Resume Reviewer Works
        </h2>
        <p className="text-base text-slate-600 max-w-xl mx-auto">
          Our AI engine combines Machine Learning classification with rule-based ATS analysis to give you instant, explainable feedback.
        </p>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 hover:shadow-md transition-all"
            >
              <div className="flex items-center space-x-4 shrink-0">
                <span className="text-2xl font-black text-slate-300 w-8">{item.step}</span>
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 text-white rounded-2xl p-8 text-center space-y-4 shadow-xl">
        <h3 className="text-2xl font-extrabold text-white">Ready to Analyze Your Resume?</h3>
        <p className="text-sm text-indigo-100 max-w-md mx-auto">
          Get your overall score, role prediction, matched skills, and personalized recommendations in seconds.
        </p>
        <button
          onClick={onGetStarted}
          className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-indigo-900 font-bold text-sm shadow-md hover:bg-indigo-50 transition-colors cursor-pointer"
        >
          Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}
