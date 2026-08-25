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
    <div className="w-full max-w-7xl mx-auto pb-24 md:pb-12 p-3 sm:p-4 md:p-6 lg:p-8 space-y-6 animate-in fade-in duration-200">
      {/* Batch Filters & Broadcast Header */}
      <section className="rounded-3xl p-5 md:p-6 bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base md:text-lg font-bold text-slate-900 font-sans">
            Institutional Command Centre & Analytics
          </h2>
          <p className="text-xs text-slate-500">Real-time civil services training performance across degree cohorts</p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="bg-slate-50 text-xs font-bold text-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 outline-none"
          >
            <option>Batch 2026</option>
            <option>Batch 2025</option>
            <option>Batch 2024</option>
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-slate-50 text-xs font-bold text-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 outline-none"
          >
            <option>Degree • 2nd Year</option>
            <option>Degree • 1st Year</option>
            <option>Degree • Final Year</option>
          </select>

          <button
            onClick={() => setShowBroadcastModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">campaign</span>
            Broadcast Alert
          </button>

          <button
            onClick={() => {
              setExportSuccess(true);
              showToast('Institutional Analytics PDF report generated!', 'success', 'download');
              setTimeout(() => setExportSuccess(false), 3000);
            }}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              {exportSuccess ? 'check' : 'download'}
            </span>
            {exportSuccess ? 'Exported!' : 'Export PDF'}
          </button>
        </div>
      </section>

      {/* KPI Bento Grid (4 Columns) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-3xl p-5 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Enrolled Aspirants
          </span>
          <p className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">1,248</p>
          <span className="text-xs text-emerald-600 font-bold mt-1">
            ↑ 18% vs Last Semester
          </span>
        </div>

        <div className="rounded-3xl p-5 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Avg Beacon Index
          </span>
          <p className="text-3xl font-extrabold text-blue-600 mt-2 font-mono">74.2</p>
          <span className="text-xs text-emerald-600 font-bold mt-1">
            +4.8 Pts Benchmark Gain
          </span>
        </div>

        <div className="rounded-3xl p-5 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Test Participation
          </span>
          <p className="text-3xl font-extrabold text-indigo-600 mt-2 font-mono">88.4%</p>
          <span className="text-xs text-slate-500 mt-1">1,103 Active Students</span>
        </div>

        <div className="rounded-3xl p-5 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Mentorship Coverage
          </span>
          <p className="text-3xl font-extrabold text-purple-600 mt-2 font-mono">92%</p>
          <span className="text-xs text-purple-700 font-bold mt-1">414 Sessions Completed</span>
        </div>
      </section>

      {/* 2-Column Grid: Cohort Readiness Distribution & Department Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* Cohort Readiness Distribution Chart (7 cols on md/lg) */}
        <section className="md:col-span-7 lg:col-span-7 rounded-3xl p-6 bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
            Cohort Readiness Distribution ({selectedBatch})
          </h3>

          <div className="space-y-4 pt-1">
            <div>
              <div className="flex justify-between text-xs md:text-sm font-bold text-slate-900 mb-1.5">
                <span>Tier 1: High Exam Readiness (&gt;80%)</span>
                <span className="text-emerald-700 font-mono">342 Students (27%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '27%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs md:text-sm font-bold text-slate-900 mb-1.5">
                <span>Tier 2: Moderate Trajectory (60-80%)</span>
                <span className="text-blue-700 font-mono">684 Students (55%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '55%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs md:text-sm font-bold text-slate-900 mb-1.5">
                <span>Tier 3: In Need of Remedial Drills (&lt;60%)</span>
                <span className="text-amber-700 font-mono">222 Students (18%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '18%' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Academic Stream Breakdown (5 cols on md/lg) */}
        <section className="md:col-span-5 lg:col-span-5 rounded-3xl p-6 bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
            Departmental Participation
          </h3>

          <div className="space-y-3">
            {[
              { dept: 'Commerce & Economics (B.Com/BBA)', students: 480, score: '76.4%' },
              { dept: 'Humanities & Social Sciences (BA)', students: 390, score: '78.1%' },
              { dept: 'Science & Engineering (B.Sc/B.Tech)', students: 378, score: '71.8%' },
            ].map((d, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{d.dept}</h4>
                  <span className="text-[11px] text-slate-500 font-mono">{d.students} Enrolled</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-blue-600 font-mono">{d.score}</span>
                  <span className="text-[10px] text-slate-400 block">Avg Readiness</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Broadcast Announcement Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Broadcast Announcement</h3>
                <p className="text-xs text-slate-500 font-medium">To: {selectedBatch} ({selectedYear})</p>
              </div>
              <button onClick={() => setShowBroadcastModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Alert Title</label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Message Content</label>
                <textarea
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs font-medium border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Send Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
