import React from 'react';
import { ScreenId, ArchetypeResult } from '../types';
import { useToast } from '../components/Toast';

interface ArchetypeResultViewProps {
  onNavigate: (screen: ScreenId) => void;
  archetype: ArchetypeResult;
}

export const ArchetypeResultView: React.FC<ArchetypeResultViewProps> = ({
  onNavigate,
  archetype,
}) => {
  const { showToast } = useToast();

  const handleShare = () => {
    showToast('Career Archetype synchronized to Student Passport!', 'success', 'badge');
    onNavigate('passport');
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-24 md:pb-12 p-3 sm:p-4 md:p-6 lg:p-8 space-y-6 animate-in fade-in duration-200">
      {/* Hero Badge Banner */}
      <section className="rounded-3xl p-6 md:p-8 bg-white space-y-3 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-widest text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 font-mono">
              APTITUDE DIAGNOSTIC RESULT
            </span>
            <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {archetype.matchPercentage}% Fit Match
            </span>
          </div>

          <h1 className="text-slate-900 text-2xl md:text-3xl font-extrabold leading-tight font-sans">
            {archetype.title}
          </h1>
          <p className="text-sm font-semibold text-blue-700 mt-1">
            {archetype.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => onNavigate('career-path')}
            className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs md:text-sm font-bold shadow-xs transition-colors cursor-pointer"
          >
            View Career Roadmap
          </button>
          <button
            onClick={handleShare}
            className="flex-1 md:flex-none px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs md:text-sm font-bold transition-colors cursor-pointer"
          >
            Save to Passport
          </button>
        </div>
      </section>

      {/* 2-Column Responsive Split on Tablet & Laptop/Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column (6 cols on md/lg): Cognitive Profile Breakdown */}
        <div className="md:col-span-6 lg:col-span-6 space-y-6">
          <section className="rounded-3xl p-6 bg-slate-900 text-white space-y-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <span
                    className="material-symbols-outlined text-[26px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    psychology
                  </span>
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-white">Cognitive Competency Matrix</h3>
                  <p className="text-xs text-blue-200">Multidimensional Aptitude Breakdown</p>
                </div>
              </div>

              <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                {archetype.description}
              </p>

              {/* Skill Score Bars */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                {Object.entries(archetype.radarScores).map(([skill, score]) => (
                  <div key={skill} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="capitalize text-slate-300 font-semibold">{skill}</span>
                      <span className="font-mono text-amber-300 font-bold">{score}%</span>
                    </div>
                    <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (6 cols on md/lg): Strengths & Recommended Career Tracks */}
        <div className="md:col-span-6 lg:col-span-6 space-y-6">
          {/* Core Strengths Checklist */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Identified Core Strengths
            </h3>
            <div className="space-y-2.5">
              {archetype.strengths.map((strength, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-3.5 bg-slate-50 border border-slate-100 flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-blue-600 text-[20px] shrink-0">
                    check_circle
                  </span>
                  <span className="text-xs md:text-sm font-semibold text-slate-800">{strength}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Optimal Public Service Career Roles */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Optimal Civil Service Role Alignment
            </h3>
            <div className="space-y-2.5">
              {archetype.recommendedCareers.map((track, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-xs md:text-sm font-bold text-slate-900">{track.service}</h4>
                      <p className="text-xs text-slate-500">{track.role}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 font-mono">{track.fitPercent}% Fit</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
