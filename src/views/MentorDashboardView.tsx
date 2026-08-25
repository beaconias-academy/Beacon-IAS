import React, { useState } from 'react';
import { ScreenId } from '../types';
import { ASSETS } from '../data/mockData';
import { useToast } from '../components/Toast';

interface MentorDashboardViewProps {
  onNavigate: (screen: ScreenId) => void;
  onAddMentorTask?: (task: any) => void;
}

export const MentorDashboardView: React.FC<MentorDashboardViewProps> = ({
  onNavigate,
  onAddMentorTask,
}) => {
  const { showToast } = useToast();
  const [scheduled, setScheduled] = useState(false);
  const [remedialAssigned, setRemedialAssigned] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('Attempt 15-Minute Monetary Policy Remedial Test');

  const handleAssignTask = () => {
    if (onAddMentorTask) {
      onAddMentorTask({
        title: taskTitle,
        description: 'Mandatory remedial test assigned by Mentor Dr. Ramesh Iyer.',
        dueDate: 'Due Tomorrow, 5:00 PM',
        isUrgent: true,
        completed: false,
        assignedBy: 'Dr. Ramesh Iyer',
      });
    }
    setRemedialAssigned(true);
    setShowTaskModal(false);
    showToast('Remedial goal pushed directly to student plan!', 'success', 'send');
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-24 md:pb-12 p-3 sm:p-4 md:p-6 lg:p-8 space-y-6 animate-in fade-in duration-200">
      {/* Faculty Summary Bento Grid (4 Columns) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1 flex-wrap gap-2">
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-900 font-sans">Faculty Cohort Diagnostics</h2>
            <p className="text-xs text-slate-500">Live monitoring for your 45 assigned civil services aspirants</p>
          </div>
          <span className="text-xs font-mono text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
            Faculty: Dr. Ramesh Iyer (Retd. IAS)
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-3xl p-5 bg-slate-900 text-white shadow-sm flex items-center justify-between col-span-2 md:col-span-1">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                Assigned Mentees
              </span>
              <span className="text-3xl font-extrabold text-white mt-1 block font-mono">45</span>
              <span className="text-[10px] text-blue-300 font-semibold">Active Cohort</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <span className="material-symbols-outlined text-2xl">groups</span>
            </div>
          </div>

          <div className="rounded-3xl p-5 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono">On Track</span>
              <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
            </div>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 block font-mono">32</span>
            <span className="text-xs text-emerald-600 font-bold">71% Cohort Ratio</span>
          </div>

          <div className="rounded-3xl p-5 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Needs Attention</span>
              <span className="material-symbols-outlined text-amber-500 text-base">warning</span>
            </div>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 block font-mono">10</span>
            <span className="text-xs text-amber-600 font-bold">Minor Drop</span>
          </div>

          <div className="rounded-3xl p-5 bg-rose-50 border border-rose-200 shadow-xs flex flex-col justify-between col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-rose-700">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Critical Drop</span>
              <span className="material-symbols-outlined text-rose-600 text-base">error</span>
            </div>
            <span className="text-3xl font-extrabold text-rose-900 mt-1 block font-mono">3</span>
            <span className="text-xs text-rose-800 font-bold">Action Required</span>
          </div>
        </div>
      </section>

      {/* 2-Column Responsive Layout on Desktop/Laptop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols on lg): Priority Student Interventions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="px-1">
            <h3 className="text-sm md:text-base font-bold text-slate-900 font-sans">Priority Student Interventions</h3>
            <p className="text-xs text-slate-500">Mentees with flagged consistency drops requiring faculty guidance</p>
          </div>

          {/* Flagged Student Card */}
          <div className="rounded-3xl p-5 md:p-6 bg-white space-y-4 border-l-4 border-l-rose-500 border-y border-r border-slate-200 shadow-sm">
            <div className="flex items-start gap-3.5">
              <img
                src={ASSETS.userAvatar}
                alt="Abhinav Kumar"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-rose-200 shadow-xs shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <h4 className="text-sm font-bold text-slate-900 truncate">Abhinav Kumar</h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold font-mono">
                    -12% Economy Drop
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">UID: BC-2024-8921 • B.Com 2nd Year</p>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Consistency index is high (90%), but Macroeconomics diagnostic scores fell from 82% to 70% over the last 3 test attempts.
                </p>
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowTaskModal(true)}
                className="py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-blue-200"
              >
                <span className="material-symbols-outlined text-[18px]">assignment_add</span>
                {remedialAssigned ? 'Remedial Assigned ✓' : 'Assign Remedial Goal'}
              </button>

              <button
                onClick={() => {
                  setScheduled(true);
                  showToast('1:1 Strategy Review invitation sent to mentee!', 'success', 'event');
                }}
                className="py-2.5 px-4 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">videocam</span>
                {scheduled ? 'Invitation Sent ✓' : 'Invite to 1:1 Video Call'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols on lg): Mentorship Schedule & Faculty Quick Actions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-sans">
              Upcoming Mentorship Schedule
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Abhinav Kumar</h4>
                  <p className="text-[11px] text-slate-500">GS2 Ethics & Case Studies</p>
                  <span className="text-[10px] font-mono text-blue-600 font-semibold">Tomorrow • 05:00 PM</span>
                </div>
                <button
                  onClick={() => onNavigate('mentor')}
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Join Room
                </button>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Priya Nair</h4>
                  <p className="text-[11px] text-slate-500">History Optional Revision</p>
                  <span className="text-[10px] font-mono text-slate-400 font-semibold">Thu • 06:30 PM</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  Scheduled
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Assign Remedial Goal</h3>
                <p className="text-xs text-slate-500 font-medium">To: Abhinav Kumar (BC-2024-8921)</p>
              </div>
              <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Goal / Task Title</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Due Date</label>
                <input
                  type="text"
                  defaultValue="Tomorrow, 5:00 PM"
                  className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2.5">
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignTask}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Push to Student Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
