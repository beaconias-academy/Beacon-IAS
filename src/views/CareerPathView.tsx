import React, { useState } from 'react';
import { ScreenId } from '../types';

interface CareerPathViewProps {
  onNavigate: (screen: ScreenId) => void;
}

export const CareerPathView: React.FC<CareerPathViewProps> = ({ onNavigate }) => {
  const [expandedNodes, setExpandedNodes] = useState<{ [id: string]: boolean }>({
    'node-2': true,
    'node-3': true,
  });

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const milestones = [
    {
      id: 'node-1',
      stage: 'Phase 1 • Foundation',
      title: 'Graduation & Baseline Aptitude',
      status: 'completed' as const,
      statusLabel: 'Completed',
      icon: 'school',
      description: 'Undergraduate degree with 85% foundational completion. Core reading habits & NCERT basics established.',
      deliverables: [
        'NCERT History, Polity & Geography (Class 6-12)',
        'Daily The Hindu / Indian Express Newspaper Routine',
        'Beacon Archetype & Aptitude Baseline Assessment',
      ],
    },
    {
      id: 'node-2',
      stage: 'Phase 2 • Current Focus',
      title: 'GS Core Syllabus & Current Affairs',
      status: 'in-progress' as const,
      statusLabel: 'Active Stage',
      icon: 'menu_book',
      description: 'In-depth coverage of Indian Constitution, Macroeconomics, Modern History, and Environment.',
      deliverables: [
        'Polity (Laxmikanth & Constitution of India)',
        'Macroeconomics & Union Budget 2026',
        'Sectional Mock Drills (Min 75% accuracy target)',
      ],
    },
    {
      id: 'node-3',
      stage: 'Phase 3 • Milestone',
      title: 'UPSC Prelims Mock Simulation Benchmark',
      status: 'upcoming' as const,
      statusLabel: 'Target: Oct 2025',
      icon: 'assignment_turned_in',
      description: 'Full-length 100-question GS Paper 1 + CSAT qualifying tests under strict exam conditions.',
      deliverables: [
        '10 Full-Length All-India Mock Tests',
        'CSAT Speed & Elimination Strategy Drills',
        'Diagnostic Error Log & Remedial Quizzes',
      ],
    },
    {
      id: 'node-4',
      stage: 'Phase 4 • Specialization',
      title: 'Mains 250-Word Answer Writing & Optional',
      status: 'upcoming' as const,
      statusLabel: 'Target: Jan 2026',
      icon: 'history_edu',
      description: 'Master structured answer presentation, introduction-body-conclusion format, and Optional Paper mastery.',
      deliverables: [
        'Daily 2 Questions Mains Practice evaluated by Mentors',
        'Optional Subject Paper 1 & Paper 2 Comprehensive Coverage',
        'Ethics & Integrity (GS Paper 4) Case Study Strategy',
      ],
    },
    {
      id: 'node-5',
      stage: 'Phase 5 • Culmination',
      title: 'Interview Personality Test & IAS Cadre',
      status: 'upcoming' as const,
      statusLabel: 'Final Goal: 2026',
      icon: 'verified',
      description: 'UPSC DAF (Detailed Application Form) analysis, mock interviews with retired diplomats & IAS officers.',
      deliverables: [
        'DAF Profile & State-Specific Issue Preparation',
        'Mock Interview Panels with Officers',
        'Final Merit List Allocation',
      ],
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto pb-24 md:pb-12 p-3 sm:p-4 md:p-6 lg:p-8 space-y-6 animate-in fade-in duration-200">
      {/* Overview Banner */}
      <section
        className="rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        style={{
          backgroundColor: '#1d4ed8',
          backgroundImage: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #1e3a8a 100%)',
        }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block mb-1 font-mono">
            CAREER TRAJECTORY ROADMAP
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold leading-tight font-sans">UPSC Civil Services 2026 Roadmap</h1>
          <p className="text-xs md:text-sm text-blue-100 mt-2 leading-relaxed">
            Personalized 5-phase milestone blueprint synchronized with your degree and current Beacon Competency Index.
          </p>
        </div>

        <button
          onClick={() => onNavigate('assessment')}
          className="relative z-10 px-5 py-2.5 bg-white hover:bg-blue-50 text-blue-900 text-xs md:text-sm font-bold rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          Retake Assessment
        </button>
      </section>

      {/* Responsive Connected Timeline */}
      <section className="relative space-y-5">
        {milestones.map((m, idx) => {
          const isExpanded = !!expandedNodes[m.id];
          const isCompleted = m.status === 'completed';
          const isInProgress = m.status === 'in-progress';
          const isLast = idx === milestones.length - 1;

          return (
            <div key={m.id} className="relative flex items-start gap-4 group">
              {/* Connecting vertical line */}
              {!isLast && (
                <div
                  className={`absolute left-[21px] top-12 bottom-[-20px] w-[3px] z-0 transition-colors ${
                    isCompleted ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                />
              )}

              {/* Node Icon */}
              <div className="relative z-10 shrink-0">
                {isInProgress && (
                  <div className="absolute -inset-2 bg-blue-400 rounded-2xl animate-pulse-ring opacity-50" />
                )}
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm shadow-xs transition-all ${
                    isCompleted
                      ? 'bg-blue-600 text-white'
                      : isInProgress
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {isCompleted ? 'check' : m.icon}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div
                onClick={() => toggleNode(m.id)}
                className={`flex-1 rounded-3xl p-5 md:p-6 bg-white border border-slate-200 cursor-pointer transition-all shadow-xs ${
                  isInProgress
                    ? 'border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/30'
                    : 'hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                    {m.stage}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isInProgress
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {m.statusLabel}
                  </span>
                </div>

                <h3 className="text-sm md:text-base font-bold text-slate-900 leading-snug font-sans">{m.title}</h3>
                <p className="text-xs md:text-sm text-slate-600 mt-1.5 leading-relaxed">{m.description}</p>

                {/* Expandable Deliverables */}
                {isExpanded && (
                  <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2 animate-in fade-in duration-150">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                      Phase Deliverables &amp; Targets:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      {m.deliverables.map((d, dIdx) => (
                        <div
                          key={dIdx}
                          className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 font-medium"
                        >
                          <span
                            className={`material-symbols-outlined text-[18px] shrink-0 ${
                              isCompleted ? 'text-emerald-600' : isInProgress ? 'text-blue-600' : 'text-slate-400'
                            }`}
                          >
                            {isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span className="leading-snug">{d}</span>
                        </div>
                      ))}
                    </div>
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
