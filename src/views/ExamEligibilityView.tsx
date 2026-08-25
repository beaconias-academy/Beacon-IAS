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
    <div className="w-full max-w-7xl mx-auto pb-24 md:pb-12 p-3 sm:p-4 md:p-6 lg:p-8 space-y-6 animate-in fade-in duration-200">
      {/* Category Filter Chips & Header */}
      <section className="rounded-3xl p-5 md:p-6 bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base md:text-lg font-bold text-slate-900 font-sans">
            Civil Services &amp; Government Exam Matrix
          </h2>
          <p className="text-xs text-slate-500">Real-time age limits, attempt quotas, and degree eligibility calculator</p>
        </div>

        <div className="flex gap-2 overflow-x-auto custom-scrollbar w-full md:w-auto">
          {filters.map((filter) => {
            const isSelected = selectedFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </section>

      {/* Exam Cards Grid (2-column on md/lg) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              className="rounded-3xl overflow-hidden bg-white shadow-xs border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div
                className="p-5 md:p-6 cursor-pointer space-y-3"
                onClick={() => toggleExpand(exam.id)}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border font-mono ${badgeColor}`}
                      >
                        <span className="material-symbols-outlined text-[14px]">{badgeIcon}</span>
                        {exam.statusText}
                      </span>
                      <span className="text-xs text-slate-400 font-mono font-semibold">{exam.category}</span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 leading-snug font-sans">
                      {exam.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{exam.organization}</p>
                  </div>

                  <button className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <span className="material-symbols-outlined text-lg">
                      {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                </div>

                {exam.readinessNote && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed">
                    {exam.readinessNote}
                  </p>
                )}

                {isExpanded && (
                  <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-150 text-xs">
                    {exam.pattern && (
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">Exam Selection Pattern:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                          {exam.pattern.map((p) => (
                            <div key={p.stage} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                              <span className="font-bold text-slate-900 block">{p.name}</span>
                              <span className="text-[11px] text-slate-500 font-mono">{p.type}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {exam.syllabus && (
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">Key Syllabus Topics:</span>
                        <p className="text-slate-700 font-medium mt-0.5">{exam.syllabus.join(' • ')}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};
