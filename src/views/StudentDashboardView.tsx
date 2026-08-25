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
    <div className="flex flex-col w-full pb-24 space-y-4 p-4 animate-in fade-in duration-200">
      {/* Aspirant Profile Hero Banner */}
      <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative w-14 h-14 shrink-0">
              <img
                alt={profile.name}
                className="w-full h-full object-cover rounded-2xl shadow-sm ring-2 ring-blue-500/20"
                src={profile.avatarUrl}
              />
              <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                <span
                  className="material-symbols-outlined text-[12px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 border border-blue-100">
                  BEACON ASPIRANT
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-semibold truncate">
                  {profile.idNumber}
                </span>
              </div>
              <h1 className="text-slate-900 text-lg font-bold leading-tight truncate">
                {profile.name}
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                <span className="truncate flex items-center gap-1 font-medium text-slate-700">
                  <span className="material-symbols-outlined text-[15px] text-blue-600">flag</span>
                  {profile.targetExam}
                </span>
                <span className="text-slate-300">•</span>
                <span className="truncate flex items-center gap-1 text-slate-500">
                  <span className="material-symbols-outlined text-[15px] text-slate-400">school</span>
                  {profile.degree}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shadow-2xs">
              <span>🔥</span>
              <span>18d Streak</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium mt-1 font-mono">284d to Prelims</span>
          </div>
        </div>
      </section>

      {/* Career Readiness Score Card (Guaranteed Vibrant Blue Background) */}
      <section
        className="rounded-3xl p-5 text-white shadow-md relative overflow-hidden"
        style={{
          backgroundColor: '#1d4ed8',
          backgroundImage: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #1e3a8a 100%)',
        }}
      >
        <div className="absolute top-0 right-0 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-100 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-amber-300">analytics</span>
              AI Trajectory Forecast
            </span>
            <span className="text-xs font-bold text-amber-300 bg-black/30 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-amber-300/30">
              Target: 2026
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 my-2">
            <div className="flex-1">
              <h2 className="text-lg font-bold leading-tight text-white">Career Readiness Score</h2>
              <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                {readinessScore >= 80
                  ? 'Outstanding performance! In top tier for UPSC Prelims.'
                  : readinessScore >= 65
                  ? 'Strong consistency! Economy focus will push score to 80+.'
                  : 'Complete pending revision modules to increase readiness.'}
              </p>

              <div className="flex items-center gap-2 mt-3.5">
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
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
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
                <span className="font-extrabold text-2xl leading-none text-white">{readinessScore}</span>
                <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mt-0.5">/ 100</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Bento Grid (4 Columns) */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          Quick Access
        </h2>
        <div className="grid grid-cols-4 gap-2.5">
          <button
            id="quick-action-my-career"
            onClick={() => onNavigate('career-path')}
            className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs active:scale-95 transition-all flex flex-col items-center gap-1.5 text-center group"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px]">map</span>
            </div>
            <span className="text-xs font-bold text-slate-700 leading-tight">
              Roadmap
            </span>
          </button>

          <button
            id="quick-action-ai-assistant"
            onClick={() => onNavigate('ai')}
            className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs active:scale-95 transition-all flex flex-col items-center gap-1.5 text-center group"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors p-1.5">
              <img
                src="/beacon-ai.svg"
                alt="Beacon AI"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs font-bold text-slate-700 leading-tight">
              Beacon AI
            </span>
          </button>

          <button
            id="quick-action-courses"
            onClick={() => onNavigate('courses')}
            className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs hover:border-emerald-400 hover:shadow-xs active:scale-95 transition-all flex flex-col items-center gap-1.5 text-center group"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-2xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px]">play_lesson</span>
            </div>
            <span className="text-xs font-bold text-slate-700 leading-tight">
              Lectures
            </span>
          </button>

          <button
            id="quick-action-tests"
            onClick={() => onNavigate('performance-tests')}
            className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs hover:border-amber-400 hover:shadow-xs active:scale-95 transition-all flex flex-col items-center gap-1.5 text-center group"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-2xs group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px]">assignment</span>
            </div>
            <span className="text-xs font-bold text-slate-700 leading-tight">
              Tests
            </span>
          </button>
        </div>
      </section>

      {/* Beacon Student Competency Index */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Beacon Student Index</h2>
            <p className="text-xs text-slate-500">Real-time competency matrix</p>
          </div>
          <button
            onClick={() => onNavigate('passport')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
          >
            Passport <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Academic */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-600">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
                <span className="material-symbols-outlined text-[18px]">menu_book</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Academic</span>
            </div>
            <div className="flex items-baseline justify-between mt-2.5">
              <span className="text-2xl font-bold text-slate-900">{indices.academic}</span>
              <span className="text-xs font-mono text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1.5">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${indices.academic}%` }} />
            </div>
          </div>

          {/* Competitive */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-600">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700">
                <span className="material-symbols-outlined text-[18px]">emoji_events</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Competitive</span>
            </div>
            <div className="flex items-baseline justify-between mt-2.5">
              <span className="text-2xl font-bold text-slate-900">{indices.competitive}</span>
              <span className="text-xs font-mono text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1.5">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${indices.competitive}%` }} />
            </div>
          </div>

          {/* Competency */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-600">
              <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
                <span className="material-symbols-outlined text-[18px]">psychology</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Competency</span>
            </div>
            <div className="flex items-baseline justify-between mt-2.5">
              <span className="text-2xl font-bold text-slate-900">{indices.competency}</span>
              <span className="text-xs font-mono text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1.5">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: `${indices.competency}%` }} />
            </div>
          </div>

          {/* Consistency */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-600">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <span className="material-symbols-outlined text-[18px]">trending_up</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Consistency</span>
            </div>
            <div className="flex items-baseline justify-between mt-2.5">
              <span className="text-2xl font-bold text-slate-900">{indices.consistency}</span>
              <span className="text-xs font-mono text-emerald-600 font-bold">Top 5%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1.5">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${indices.consistency}%` }} />
            </div>
          </div>

          {/* Career Clarity Full-Width Card */}
          <div className="col-span-2 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
                  <span className="material-symbols-outlined text-[18px]">explore</span>
                </div>
                <span className="text-xs font-bold text-slate-900">Public Service Fit &amp; Career Clarity</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-900">{indices.clarity}</span>
                <span className="text-xs font-mono text-slate-400">/ 100</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2.5">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${indices.clarity}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* Performance Remediation Alert */}
      <section className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 shadow-2xs">
        <span className="material-symbols-outlined text-rose-600 mt-0.5 text-2xl shrink-0">crisis_alert</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h3 className="text-xs font-bold text-rose-900">Performance Drop Alert</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-200/70 text-rose-800">
              -12% Economy
            </span>
          </div>
          <p className="text-xs text-rose-800/90 mt-1 leading-relaxed">
            Your accuracy in Macroeconomics has dropped over the last 3 tests.
          </p>
          <button
            onClick={() => onNavigate('performance-tests')}
            className="mt-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">play_circle</span>
            Start 10-Min Remedial Quiz
          </button>
        </div>
      </section>

      {/* Today's Schedule & Interactive Checklist */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">Today's Schedule</h2>
            <span className="text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full">
              {completedCount}/{plans.length} Done ({progressPercent}%)
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="text-blue-600 hover:bg-blue-50 px-2.5 py-1 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold border border-blue-200"
              title="Add New Goal"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              Add Goal
            </button>
            <button
              onClick={() => setShowAllPlans(!showAllPlans)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showAllPlans ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {plans.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                item.completed
                  ? 'bg-slate-50/80 border-slate-200 text-slate-400'
                  : 'bg-white border-slate-200 shadow-2xs hover:border-blue-300'
              }`}
            >
              {/* Checkbox button */}
              <button
                onClick={() => handleToggle(item)}
                className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 active:scale-90 ${
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
                  className={`text-xs font-semibold truncate transition-colors ${
                    item.completed ? 'line-through text-slate-400' : 'text-slate-900'
                  }`}
                >
                  {item.title}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1 font-mono">
                    <span className="material-symbols-outlined text-[13px]">schedule</span>
                    {item.time}
                  </span>
                  {item.category && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold capitalize text-[9px]">
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

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Add Study Goal</h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Goal / Topic Name
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

              <div className="grid grid-cols-2 gap-2">
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

              <div className="pt-2 flex gap-2">
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
