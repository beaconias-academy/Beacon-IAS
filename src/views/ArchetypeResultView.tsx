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
    <div className="flex flex-col w-full pb-24 p-3.5 sm:p-4 space-y-4 animate-in fade-in duration-200">
      {/* Hero Badge Banner */}
      <section className="rounded-2xl p-4 bg-white space-y-2 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
            APTITUDE DIAGNOSTIC RESULT
          </span>
          <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {archetype.matchPercentage}% Fit Match
          </span>
        </div>

        <h1 className="text-slate-900 text-xl font-extrabold leading-tight">
          {archetype.title}
        </h1>
        <p className="text-xs font-semibold text-blue-700">
          {archetype.subtitle}
        </p>
      </section>

      {/* Cognitive Profile Breakdown Card */}
      <section className="rounded-2xl p-4 bg-slate-900 text-white space-y-3.5 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                psychology
              </span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Cognitive Competency Matrix</h3>
              <p className="text-[10px] text-blue-200">Multidimensional Aptitude Breakdown</p>
            </div>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed">
            {archetype.description}
          </p>

          {/* Skill Score Bars */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            {Object.entries(archetype.radarScores).map(([skill, score]) => (
              <div key={skill} className="space-y-0.5">
                <div className="flex justify-between text-[11px]">
                  <span className="capitalize text-slate-300 font-medium">{skill}</span>
                  <span className="font-mono text-amber-300 font-bold">{score}%</span>
                </div>
                <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden">
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

      {/* Core Strengths Checklist */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          Identified Strengths
        </h2>
        <div className="space-y-1.5">
          {archetype.strengths.map((strength, i) => (
            <div
              key={i}
              className="rounded-2xl p-3 bg-white border border-slate-200 flex items-center gap-2.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-blue-600 text-[18px] shrink-0">
                check_circle
              </span>
              <span className="text-xs font-semibold text-slate-800">{strength}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Civil Service Roles */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          Top Service Matches
        </h2>
        <div className="space-y-2">
          {archetype.recommendedCareers.map((career, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-3.5 bg-white border border-slate-200 flex items-center justify-between gap-2 shadow-xs"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">{career.service}</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 text-[9px] font-mono font-bold">
                    {career.fitPercent}% Fit
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">{career.role}</p>
              </div>

              <button
                onClick={() => onNavigate('career-path')}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors shrink-0"
              >
                Roadmap
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Save / Export CTA */}
      <button
        onClick={handleShare}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5"
      >
        <span className="material-symbols-outlined text-[18px]">badge</span>
        Save to Student Passport
      </button>
    </div>
  );
};
