import React, { useState } from 'react';
import { ScreenId, PlanItem } from '../types';
import { useToast } from '../components/Toast';

interface StudentDashboardViewProps {
  onNavigate: (screen: ScreenId) => void;
  plans: PlanItem[];
  profile: any;
  readinessScore: number;
  indices: { academic: number; competitive: number; competency: number; consistency: number; clarity: number };
  onTogglePlan: (id: string) => void;
  onAddPlan: (title: string, time: string, category: 'study' | 'quiz' | 'mentor' | 'revision') => void;
  onDeletePlan: (id: string) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  onNavigate,
  plans,
  profile,
  readinessScore,
  indices,
  onTogglePlan,
  onAddPlan,
  onDeletePlan,
}) => {
  const { showToast } = useToast();
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('03:00 PM');
  const [newCategory, setNewCategory] = useState<'study' | 'quiz' | 'mentor' | 'revision'>('study');

  const handleToggle = (item: PlanItem) => {
    onTogglePlan(item.id);
    if (!item.completed) {
      showToast(`Completed: ${item.title} (+5 Consistency)`, 'success', 'task_alt');
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddPlan(newTitle.trim(), newTime, newCategory);
    showToast("New goal added to today's schedule", 'info', 'add_task');
    setNewTitle('');
    setShowAddTaskModal(false);
  };

  const completedCount = plans.filter((p) => p.completed).length;
  const progressPercent = plans.length > 0 ? Math.round((completedCount / plans.length) * 100) : 0;

  return (
    <div className="w-full max-w-7xl mx-auto pb-24 md:pb-12 p-3 sm:p-4 md:p-6 lg:p-8 space-y-6 animate-in fade-in duration-200">
      {/* Top Section: Aspirant Hero Banner & Readiness Score (2 Column on Tablet & Laptop screens) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 lg:gap-6 items-stretch">
        {/* Aspirant Profile Hero Banner (7 cols on md/lg) */}
        <section className="md:col-span-7 lg:col-span-7 bg-white rounded-3xl p-5 md:p-6 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0">
                <img
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-2xl md:rounded-3xl shadow-sm ring-4 ring-blue-500/20"
                  src={profile.avatarUrl}
                />
                <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-[10px] md:text-xs font-extrabold text-blue-700 uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200">
                    BEACON ASPIRANT
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-semibold truncate">
                    {profile.idNumber}
                  </span>
                </div>
                <h1 className="text-slate-900 text-xl md:text-2xl font-extrabold leading-tight truncate font-sans">
                  {profile.name}
                </h1>
                <div className="flex items-center gap-3 text-xs md:text-sm text-slate-600 mt-1.5 flex-wrap">
                  <span className="truncate flex items-center gap-1 font-semibold text-slate-800">
                    <span className="material-symbols-outlined text-[17px] text-blue-600">flag</span>
                    {profile.targetExam}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="truncate flex items-center gap-1 text-slate-500 font-medium">
                    <span className="material-symbols-outlined text-[17px] text-slate-400">school</span>
                    {profile.degree}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs md:text-sm font-bold shadow-2xs">
                <span>🔥</span>
                <span>18d Streak</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium mt-1.5 font-mono">
                284d to Prelims 2026
              </span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-600">
                Syllabus Tracker: <strong className="text-slate-900 font-bold">64% GS Papers Covered</strong>
              </span>
            </div>
            <button
              onClick={() => onNavigate('passport')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
            >
              Verified Passport
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
        </section>

        {/* Career Readiness Score Card (5 cols on md/lg) */}
        <section
          className="md:col-span-5 lg:col-span-5 rounded-3xl p-5 md:p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between"
          style={{
            backgroundColor: '#1d4ed8',
            backgroundImage: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #1e3a8a 100%)',
          }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-blue-100 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-amber-300">analytics</span>
                AI Trajectory Forecast
              </span>
              <span className="text-xs font-bold text-amber-300 bg-black/30 backdrop-blur-xs px-3 py-1 rounded-full border border-amber-300/30">
                Target: 2026
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 my-2">
              <div className="flex-1">
                <h2 className="text-xl font-bold leading-tight text-white">Career Readiness</h2>
                <p className="text-xs md:text-sm text-blue-100 mt-1.5 leading-relaxed">
                  {readinessScore >= 80
                    ? 'Outstanding performance! In top tier for UPSC Prelims.'
                    : readinessScore >= 65
                    ? 'Strong consistency! Economy focus will push score to 80+.'
                    : 'Complete pending revision modules to increase readiness.'}
                </p>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => onNavigate('assessment')}
                    className="bg-white hover:bg-blue-50 text-blue-900 text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px] text-blue-700">psychology</span>
                    Assessment
                  </button>
                  <button
                    onClick={() => onNavigate('career-path')}
                    className="bg-blue-950/60 hover:bg-blue-950 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-white/20 active:scale-95 transition-all flex items-center gap-1"
                  >
                    Roadmap
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Circular Gauge */}
              <div className="relative w-28 h-28 md:w-32 md:h-32 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-white/20"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="38"
                    stroke="rgba(255, 255, 255, 0.25)"
                    strokeWidth="8"
                  />
                  <circle
                    className="text-amber-400 transition-all duration-1000 ease-out"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="38"
                    stroke="#fbbf24"
                    strokeDasharray="238.7"
                    strokeDashoffset={238.7 - (238.7 * readinessScore) / 100}
                    strokeLinecap="round"
                    strokeWidth="8"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="font-extrabold text-2xl md:text-3xl leading-none text-white">{readinessScore}</span>
                  <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mt-0.5">/ 100</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Quick Action Bento Grid (4 Columns) */}
      <section className="space-y-2.5">
        <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider px-1 font-mono">
          Quick Access Hub
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          <button
            id="quick-action-my-career"
            onClick={() => onNavigate('career-path')}
            className="bg-white rounded-2xl md:rounded-3xl p-4 border border-slate-200 shadow-2xs hover:border-blue-500 hover:shadow-md active:scale-95 transition-all flex flex-col items-center gap-2 text-center group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[24px]">map</span>
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 leading-tight block">
                Career Roadmap
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Milestones & Plan
              </span>
            </div>
          </button>

          <button
            id="quick-action-ai-assistant"
            onClick={() => onNavigate('ai')}
            className="bg-white rounded-2xl md:rounded-3xl p-4 border border-slate-200 shadow-2xs hover:border-blue-500 hover:shadow-md active:scale-95 transition-all flex flex-col items-center gap-2 text-center group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors p-2">
              <img
                src="/beacon-ai.svg"
                alt="Beacon AI"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 leading-tight block">
                Beacon AI Mentor
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Instant Explanations
              </span>
            </div>
          </button>

          <button
            id="quick-action-courses"
            onClick={() => onNavigate('courses')}
            className="bg-white rounded-2xl md:rounded-3xl p-4 border border-slate-200 shadow-2xs hover:border-emerald-500 hover:shadow-md active:scale-95 transition-all flex flex-col items-center gap-2 text-center group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-2xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[24px]">play_lesson</span>
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 leading-tight block">
                Lectures & Notes
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                GS 1 to 4 Modules
              </span>
            </div>
          </button>

          <button
            id="quick-action-tests"
            onClick={() => onNavigate('performance-tests')}
            className="bg-white rounded-2xl md:rounded-3xl p-4 border border-slate-200 shadow-2xs hover:border-amber-500 hover:shadow-md active:scale-95 transition-all flex flex-col items-center gap-2 text-center group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-2xs group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[24px]">assignment</span>
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 leading-tight block">
                Mock Tests
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Timed Diagnostics
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* Main 2-Column Split: Competency & Tasks on Left (7-8 cols) + Alerts & Schedule Widgets on Right (4-5 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* Left Column: Competency Index + Today's Schedule */}
        <div className="md:col-span-7 lg:col-span-8 space-y-6">
          {/* Beacon Student Competency Index */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-sans">
                  Beacon Student Competency Index
                </h2>
                <p className="text-xs text-slate-500">Real-time analytical and psychological matrix</p>
              </div>
              <button
                onClick={() => onNavigate('passport')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
              >
                Full Passport <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {/* Academic */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-600">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
                    <span className="material-symbols-outlined text-[18px]">menu_book</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Academic</span>
                </div>
                <div className="flex items-baseline justify-between mt-3">
                  <span className="text-2xl font-extrabold text-slate-900">{indices.academic}</span>
                  <span className="text-xs font-mono text-slate-400">/ 100</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${indices.academic}%` }} />
                </div>
              </div>

              {/* Competitive */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-600">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700">
                    <span className="material-symbols-outlined text-[18px]">emoji_events</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Competitive</span>
                </div>
                <div className="flex items-baseline justify-between mt-3">
                  <span className="text-2xl font-extrabold text-slate-900">{indices.competitive}</span>
                  <span className="text-xs font-mono text-slate-400">/ 100</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${indices.competitive}%` }} />
                </div>
              </div>

              {/* Competency */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-600">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
                    <span className="material-symbols-outlined text-[18px]">psychology</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Competency</span>
                </div>
                <div className="flex items-baseline justify-between mt-3">
                  <span className="text-2xl font-extrabold text-slate-900">{indices.competency}</span>
                  <span className="text-xs font-mono text-slate-400">/ 100</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: `${indices.competency}%` }} />
                </div>
              </div>

              {/* Consistency */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-600">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                    <span className="material-symbols-outlined text-[18px]">trending_up</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Consistency</span>
                </div>
                <div className="flex items-baseline justify-between mt-3">
                  <span className="text-2xl font-extrabold text-slate-900">{indices.consistency}</span>
                  <span className="text-xs font-mono text-emerald-600 font-bold">Top 5%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${indices.consistency}%` }} />
                </div>
              </div>

              {/* Career Clarity Full-Width Card */}
              <div className="col-span-2 md:col-span-4 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
                      <span className="material-symbols-outlined text-[18px]">explore</span>
                    </div>
                    <span className="text-xs md:text-sm font-bold text-slate-900">
                      Public Service Role Fit & Career Clarity
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-extrabold text-slate-900">{indices.clarity}</span>
                    <span className="text-xs font-mono text-slate-400">/ 100</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${indices.clarity}%` }} />
                </div>
              </div>
            </div>
          </section>

          {/* Today's Schedule & Interactive Checklist */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-slate-900 font-sans">Today's Schedule & Target Goals</h2>
                <span className="text-xs font-bold px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                  {completedCount}/{plans.length} Done ({progressPercent}%)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold border border-blue-200"
                  title="Add New Goal"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  Add Goal
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plans.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                    item.completed
                      ? 'bg-slate-50/90 border-slate-200 text-slate-400'
                      : 'bg-white border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs'
                  }`}
                >
                  {/* Checkbox button */}
                  <button
                    onClick={() => handleToggle(item)}
                    className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 active:scale-90 ${
                      item.completed
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                        : 'border-slate-300 hover:border-blue-500 bg-white'
                    }`}
                    title={item.completed ? 'Mark incomplete' : 'Mark completed'}
                  >
                    {item.completed && (
                      <span className="material-symbols-outlined text-white text-[16px]">check</span>
                    )}
                  </button>

                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => handleToggle(item)}
                  >
                    <p
                      className={`text-xs md:text-sm font-semibold truncate transition-colors ${
                        item.completed ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        {item.time}
                      </span>
                      {item.category && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold capitalize text-[10px]">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onDeletePlan(item.id);
                      showToast('Goal removed from today schedule', 'info');
                    }}
                    className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                    title="Delete item"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (4-5 cols): Alerts & Diagnostic Cards */}
        <div className="md:col-span-5 lg:col-span-4 space-y-4">
          {/* Performance Drop Remediation Alert */}
          <section className="p-4 md:p-5 rounded-3xl bg-rose-50 border border-rose-200 flex items-start gap-3.5 shadow-2xs">
            <span className="material-symbols-outlined text-rose-600 mt-0.5 text-2xl shrink-0">crisis_alert</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wide">Performance Drop Alert</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-200/80 text-rose-900 font-mono">
                  -12% Economy
                </span>
              </div>
              <p className="text-xs text-rose-800/90 mt-1.5 leading-relaxed">
                Your accuracy in Macroeconomics has dropped over the last 3 tests.
              </p>
              <button
                onClick={() => onNavigate('performance-tests')}
                className="mt-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">play_circle</span>
                Start 10-Min Remedial Quiz
              </button>
            </div>
          </section>

          {/* Quick Mentorship Banner */}
          <section className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-600 text-[20px]">psychology</span>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Next Faculty Session
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                Confirmed
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                RI
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 truncate">Dr. Ramesh Iyer (Retd. IAS)</h4>
                <p className="text-[11px] text-slate-500 truncate">GS Paper 2 Ethics & Case Studies</p>
                <span className="text-[10px] font-mono text-blue-600 font-semibold">Tomorrow • 05:00 PM</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('mentor')}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
            >
              Mentorship Portal
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </section>

          {/* Beacon AI Quick Prompts Card */}
          <section className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-5 text-white shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <img src="/beacon-ai.svg" alt="Beacon AI" className="w-5 h-5 object-contain brightness-200" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Ask Beacon AI Assistant
              </h3>
            </div>
            <p className="text-xs text-blue-100 leading-relaxed">
              Stuck on a constitutional article, economic formula, or Mains answer structure?
            </p>
            <div className="space-y-1.5">
              <button
                onClick={() => onNavigate('ai')}
                className="w-full text-left p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-all border border-white/10 flex items-center justify-between"
              >
                <span className="truncate">"Analyze Basic Structure Doctrine cases"</span>
                <span className="material-symbols-outlined text-[14px] text-blue-300">send</span>
              </button>
              <button
                onClick={() => onNavigate('ai')}
                className="w-full text-left p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-all border border-white/10 flex items-center justify-between"
              >
                <span className="truncate">"Evaluate my Ethics GS4 Answer draft"</span>
                <span className="material-symbols-outlined text-[14px] text-blue-300">send</span>
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add Study Target Goal</h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Goal / Topic Description
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., NCERT Polity Ch 4 Revision"
                  className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-900 border border-slate-200 focus:border-blue-600 focus:bg-white outline-none transition-all"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target Time</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="03:00 PM"
                    className="w-full bg-slate-50 px-3 py-2 rounded-xl text-xs font-semibold text-slate-900 border border-slate-200 focus:border-blue-600 focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 px-3 py-2 rounded-xl text-xs font-semibold text-slate-900 border border-slate-200 focus:border-blue-600 outline-none"
                  >
                    <option value="study">Study</option>
                    <option value="quiz">Quiz</option>
                    <option value="mentor">Mentorship</option>
                    <option value="revision">Revision</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
