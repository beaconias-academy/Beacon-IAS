import React, { useState } from 'react';
import { ScreenId } from '../types';
import { EXAMS_DATA } from '../data/mockData';

interface ExamEligibilityViewProps {
  onNavigate: (screen: ScreenId) => void;
}

export const ExamEligibilityView: React.FC<ExamEligibilityViewProps> = ({ onNavigate }) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'UPSC' | 'KPSC' | 'Banking' | 'Defence'>('All');
  const [expandedExamId, setExpandedExamId] = useState<string>('upsc-cse');

  const filters: ('All' | 'UPSC' | 'KPSC' | 'Banking' | 'Defence')[] = [
    'All',
    'UPSC',
    'KPSC',
    'Banking',
    'Defence',
  ];

  const filteredExams = EXAMS_DATA.filter((exam) => {
    if (selectedFilter === 'All') return true;
    return exam.category === selectedFilter;
  });

  const toggleExpand = (id: string) => {
    setExpandedExamId((prev) => (prev === id ? '' : id));
  };

  return (
    <div className="flex flex-col w-full pb-24 p-3.5 sm:p-4 space-y-4 animate-in fade-in duration-200">
      {/* Category Filter Chips */}
      <section className="space-y-2">
        <div className="px-1">
          <h2 className="text-sm font-bold text-slate-900">Civil Services &amp; Govt Exam Matrix</h2>
          <p className="text-[11px] text-slate-500">Real-time age, attempt limits, and degree eligibility calculator</p>
        </div>

        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {filters.map((filter) => {
            const isSelected = selectedFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </section>

      {/* Exam Cards List */}
      <section className="space-y-3">
        {filteredExams.map((exam) => {
          const isExpanded = expandedExamId === exam.id;

          let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          let badgeIcon = 'check_circle';
          if (exam.status === 'future-eligible') {
            badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
            badgeIcon = 'schedule';
          } else if (exam.status === 'not-eligible') {
            badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
            badgeIcon = 'cancel';
          }

          return (
            <div
              key={exam.id}
              className="rounded-2xl overflow-hidden bg-white shadow-xs border border-slate-200 transition-all"
            >
              <div
                className="p-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                onClick={() => toggleExpand(exam.id)}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider border ${badgeColor}`}
                      >
                        <span className="material-symbols-outlined text-[13px]">{badgeIcon}</span>
                        {exam.statusText}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{exam.category}</span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {exam.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{exam.organization}</p>
                  </div>

                  <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    <span
                      className={`material-symbols-outlined text-base transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                </div>

                {exam.notice && (
                  <div
                    className={`mt-2.5 flex items-start gap-2 p-2.5 rounded-xl text-xs ${
                      exam.status === 'not-eligible'
                        ? 'bg-rose-50 text-rose-800 border border-rose-100'
                        : 'bg-amber-50 text-amber-800 border border-amber-100'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base shrink-0 mt-0.5">
                      {exam.status === 'not-eligible' ? 'warning' : 'info'}
                    </span>
                    <p className="leading-relaxed text-[11px]">{exam.notice}</p>
                  </div>
                )}
              </div>

              {/* Expanded Content for Detailed Readiness / Pattern */}
              {isExpanded && exam.pattern && (
                <div className="bg-slate-50 border-t border-slate-100 p-4 space-y-3 animate-in fade-in duration-150">
                  {exam.readinessPercent !== undefined && (
                    <div>
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-xs font-bold text-slate-700">
                          Syllabus Readiness Alignment
                        </span>
                        <span className="text-xs font-bold text-blue-600 font-mono">
                          {exam.readinessPercent}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{ width: `${exam.readinessPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Examination Stages</span>
                      <div className="space-y-1">
                        {exam.pattern.map((st) => (
                          <div key={st.stage} className="flex items-center justify-between text-[11px] bg-slate-50 px-2 py-1 rounded-lg">
                            <span className="font-bold text-slate-800">Stage {st.stage}: {st.name}</span>
                            <span className="font-mono text-blue-600 font-semibold">{st.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => onNavigate('career-path')}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors text-center"
                    >
                      View Roadmap
                    </button>
                    <button
                      onClick={() => onNavigate('performance-tests')}
                      className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors text-center"
                    >
                      Sectional Tests
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
};
