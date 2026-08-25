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
    <div className="flex flex-col w-full pb-24 p-3.5 sm:p-4 space-y-4 animate-in fade-in duration-200">
      {/* Faculty Summary Bento Grid */}
      <section className="space-y-2">
        <div className="px-1">
          <h2 className="text-sm font-bold text-slate-900">Faculty Cohort Diagnostics</h2>
          <p className="text-[11px] text-slate-500">Live monitoring for your 45 assigned civil service aspirants</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl p-3.5 bg-slate-900 text-white col-span-2 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Assigned Mentees
              </span>
              <span className="text-3xl font-extrabold text-white mt-1 block">45 Students</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <span className="material-symbols-outlined text-2xl">groups</span>
            </div>
          </div>

          <div className="rounded-2xl p-3 bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">On Track</span>
              <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
            </div>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">32</span>
            <span className="text-[10px] text-emerald-600 font-semibold">71% Cohort Ratio</span>
          </div>

          <div className="rounded-2xl p-3 bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Needs Attention</span>
              <span className="material-symbols-outlined text-amber-500 text-base">warning</span>
            </div>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">10</span>
            <span className="text-[10px] text-amber-600 font-semibold">Minor Drop</span>
          </div>

          <div className="col-span-2 p-3 bg-rose-50 rounded-2xl border border-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-600 text-xl">error</span>
              <div>
                <h4 className="text-xs font-bold text-rose-900">Critical Intervention Needed</h4>
                <p className="text-[11px] text-rose-700">3 students flagged for consecutive score drops</p>
              </div>
            </div>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-rose-200/70 text-rose-900">
              3 Mentees
            </span>
          </div>
        </div>
      </section>

      {/* Priority Interventions List */}
      <section className="space-y-2.5">
        <div className="px-1">
          <h2 className="text-sm font-bold text-slate-900">Priority Student Intervention</h2>
          <p className="text-[11px] text-slate-500">Instant direct action tools</p>
        </div>

        {/* Flagged Student Card */}
        <div className="rounded-2xl p-4 bg-white space-y-3 border-l-4 border-l-rose-500 border-y border-r border-slate-200 shadow-xs">
          <div className="flex items-start gap-3">
            <img
              src={ASSETS.userAvatar}
              alt="Abhinav Kumar"
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-rose-200 shadow-xs shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h3 className="text-xs font-bold text-slate-900 truncate">Abhinav Kumar</h3>
                <span className="px-2 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                  -12% Economy Drop
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">UID: BC-2024-8921 • B.Com 2nd Year</p>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Consistency is excellent (90%), but Macroeconomics mock scores fell from 82% to 70% over 3 tests.
              </p>
            </div>
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
            <button
              onClick={() => setShowTaskModal(true)}
              className="py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">assignment_add</span>
              {remedialAssigned ? 'Remedial Assigned ✓' : 'Assign Remedial'}
            </button>

            <button
              onClick={() => {
                setScheduled(true);
                showToast('1:1 Strategy Review invitation sent to mentee!', 'success', 'event');
              }}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">videocam</span>
              {scheduled ? 'Invitation Sent ✓' : 'Invite to 1:1 Call'}
            </button>
          </div>
        </div>
      </section>

      {/* Assign Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Assign Remedial Task</h3>
                <p className="text-[11px] text-slate-500 font-medium">To: Abhinav Kumar (BC-2024-8921)</p>
              </div>
              <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Task Title</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Due Date</label>
                <input
                  type="text"
                  defaultValue="Tomorrow, 5:00 PM"
                  className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignTask}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Push Task to Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
