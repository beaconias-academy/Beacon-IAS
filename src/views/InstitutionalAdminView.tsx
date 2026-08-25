import React, { useState } from 'react';
import { ScreenId } from '../types';
import { useToast } from '../components/Toast';

interface InstitutionalAdminViewProps {
  onNavigate: (screen: ScreenId) => void;
  onAddNotification?: (notif: any) => void;
}

export const InstitutionalAdminView: React.FC<InstitutionalAdminViewProps> = ({
  onNavigate,
  onAddNotification,
}) => {
  const { showToast } = useToast();
  const [selectedBatch, setSelectedBatch] = useState('Batch 2026');
  const [selectedYear, setSelectedYear] = useState('Degree • 2nd Year');
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('Special KPSC & UPSC Mock Registration Open');
  const [broadcastMsg, setBroadcastMsg] = useState('Registrations for the state-wide mock prelims close this Sunday. All enrolled degree students must register.');

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddNotification) {
      onAddNotification({
        title: broadcastTitle,
        message: broadcastMsg,
        type: 'info',
        actionScreen: 'performance-tests',
        actionLabel: 'Register for Mock',
      });
    }
    setShowBroadcastModal(false);
    showToast('Broadcast notification pushed to entire Batch 2026!', 'success', 'campaign');
  };

  return (
    <div className="flex flex-col w-full pb-24 p-3.5 sm:p-4 space-y-4 animate-in fade-in duration-200">
      {/* Batch Filters & Broadcast CTA */}
      <section className="rounded-2xl p-3.5 bg-white border border-slate-200 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900">Cohort Filter</span>
          <button
            onClick={() => {
              setExportSuccess(true);
              showToast('Institutional Analytics PDF report generated!', 'success', 'download');
              setTimeout(() => setExportSuccess(false), 3000);
            }}
            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">
              {exportSuccess ? 'check' : 'download'}
            </span>
            {exportSuccess ? 'Exported!' : 'Export PDF'}
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="bg-slate-50 text-xs font-bold text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 outline-none"
          >
            <option>Batch 2026</option>
            <option>Batch 2025</option>
            <option>Batch 2024</option>
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-slate-50 text-xs font-bold text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 outline-none"
          >
            <option>Degree • 2nd Year</option>
            <option>Degree • 1st Year</option>
            <option>Degree • Final Year</option>
          </select>
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors shrink-0 flex items-center gap-1 shadow-xs"
          >
            <span className="material-symbols-outlined text-[15px]">campaign</span>
            Broadcast Alert
          </button>
        </div>
      </section>

      {/* KPI Bento Grid */}
      <section className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl p-3.5 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Enrolled Aspirants
          </span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">1,248</p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1">
            ↑ 18% vs Last Semester
          </span>
        </div>

        <div className="rounded-2xl p-3.5 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Avg Beacon Index
          </span>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">74.2</p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1">
            +4.8 Pts Benchmark Gain
          </span>
        </div>

        <div className="rounded-2xl p-3.5 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Test Participation
          </span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">88.4%</p>
          <span className="text-[10px] text-slate-400 mt-1">1,103 Active Test Takers</span>
        </div>

        <div className="rounded-2xl p-3.5 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Mentorship Rate
          </span>
          <p className="text-2xl font-extrabold text-purple-600 mt-1">92%</p>
          <span className="text-[10px] text-purple-700 font-bold mt-1">414 Sessions Booked</span>
        </div>
      </section>

      {/* Cohort Readiness Distribution Chart */}
      <section className="rounded-2xl p-4 bg-white border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Cohort Readiness Distribution ({selectedBatch})
        </h3>

        <div className="space-y-2.5">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-900 mb-1">
              <span>Tier 1: High Exam Readiness (&gt;80%)</span>
              <span className="text-emerald-700 font-mono">342 Students (27%)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '27%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-900 mb-1">
              <span>Tier 2: Moderate Trajectory (60-80%)</span>
              <span className="text-blue-700 font-mono">684 Students (55%)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '55%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-900 mb-1">
              <span>Tier 3: In Need of Remedial Drills (&lt;60%)</span>
              <span className="text-amber-700 font-mono">222 Students (18%)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '18%' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Broadcast Announcement Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Broadcast Announcement</h3>
                <p className="text-[11px] text-slate-500 font-medium">To: {selectedBatch} ({selectedYear})</p>
              </div>
              <button onClick={() => setShowBroadcastModal(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Alert Title</label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full bg-slate-50 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Message Content</label>
                <textarea
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 px-3.5 py-2 rounded-xl text-xs font-medium border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Send to All Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
