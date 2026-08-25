import React, { useState } from 'react';
import { ScreenId } from '../types';

interface CareerPathViewProps {
  onNavigate: (screen: ScreenId) => void;
}

export const CareerPathView: React.FC<CareerPathViewProps> = ({ onNavigate }) => {
  const [expandedNodes, setExpandedNodes] = useState<{ [id: string]: boolean }>({
    'node-2': true,
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
    <div className="flex flex-col w-full pb-24 p-3.5 sm:p-4 space-y-4 animate-in fade-in duration-200">
      {/* Overview Banner */}
      <section
        className="rounded-2xl p-4 text-white shadow-md relative overflow-hidden"
        style={{
          backgroundColor: '#1d4ed8',
          backgroundImage: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #1e3a8a 100%)',
        }}
      >
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block mb-1">
            CAREER TRAJECTORY ROADMAP
          </span>
          <h2 className="text-lg font-extrabold leading-tight">UPSC Civil Services 2026</h2>
          <p className="text-xs text-blue-100 mt-1 leading-relaxed">
            Personalized milestone blueprint synchronized with your degree and current Beacon Index competencies.
          </p>
        </div>
      </section>

      {/* Responsive Connected Timeline */}
      <section className="relative space-y-4">
        {milestones.map((m, idx) => {
          const isExpanded = !!expandedNodes[m.id];
          const isCompleted = m.status === 'completed';
          const isInProgress = m.status === 'in-progress';
          const isLast = idx === milestones.length - 1;

          return (
            <div key={m.id} className="relative flex items-start gap-3 group">
              {/* Connecting vertical line */}
              {!isLast && (
                <div
                  className={`absolute left-[18px] top-10 bottom-[-16px] w-[2px] z-0 transition-colors ${
                    isCompleted ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                />
              )}

              {/* Node Icon */}
              <div className="relative z-10 shrink-0">
                {isInProgress && (
                  <div className="absolute -inset-1.5 bg-blue-400 rounded-2xl animate-pulse-ring opacity-50" />
                )}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow-xs transition-all ${
                    isCompleted
                      ? 'bg-blue-600 text-white'
                      : isInProgress
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : 'bg-white border border-slate-300 text-slate-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isCompleted ? 'check' : m.icon}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div
                onClick={() => toggleNode(m.id)}
                className={`flex-1 rounded-2xl p-3.5 bg-white border border-slate-200 cursor-pointer transition-all shadow-xs ${
                  isInProgress
                    ? 'border-blue-500 shadow-blue-500/10 ring-1 ring-blue-500/20'
                    : 'hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {m.stage}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700'
                        : isInProgress
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {m.statusLabel}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 leading-snug">{m.title}</h3>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{m.description}</p>

                {/* Expandable Deliverables */}
                {isExpanded && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5 animate-in fade-in duration-150">
                    <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      Core Milestones:
                    </p>
                    <ul className="space-y-1">
                      {m.deliverables.map((d, dIdx) => (
                        <li
                          key={dIdx}
                          className="flex items-center gap-2 text-[11px] text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100"
                        >
                          <span
                            className={`material-symbols-outlined text-[14px] ${
                              isCompleted ? 'text-emerald-600' : isInProgress ? 'text-blue-600' : 'text-slate-300'
                            }`}
                          >
                            {isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
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
