import React, { useState } from 'react';
import { ScreenId, BookedSession, MentorProfile } from '../types';
import { MENTORS_LIST, ASSETS } from '../data/mockData';
import { useToast } from '../components/Toast';

interface MentorshipViewProps {
  onNavigate: (screen: ScreenId) => void;
  bookedSessions: BookedSession[];
  onBookSession: (session: Omit<BookedSession, 'id'>) => void;
}

export const MentorshipView: React.FC<MentorshipViewProps> = ({
  onNavigate,
  bookedSessions,
  onBookSession,
}) => {
  const { showToast } = useToast();
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [sessionTopic, setSessionTopic] = useState<string>('GS Paper 2 Strategy & Answer Writing');
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [inLiveCall, setInLiveCall] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isCameraOff, setIsCameraOff] = useState<boolean>(false);
  const [callNotes, setCallNotes] = useState<string>(
    '• Focus on introductory constitutional articles.\n• Practice 2 case-study answers per week.\n• Revise Sarkaria Commission recommendations.'
  );

  const handleOpenBooking = (mentor: MentorProfile) => {
    setSelectedMentor(mentor);
    setSelectedSlot(mentor.availableSlots[0]);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor || !selectedSlot) return;

    onBookSession({
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      date: selectedSlot.includes('Today') ? 'Today' : 'Tomorrow',
      timeSlot: selectedSlot,
      topic: sessionTopic,
      status: 'upcoming',
    });

    setShowBookingModal(false);
    showToast(`Session booked with ${selectedMentor.name}!`, 'success', 'event');
  };

  const handleJoinCall = (session: BookedSession) => {
    setInLiveCall(true);
    showToast(`Connected to live session with ${session.mentorName}`, 'info', 'video_call');
  };

  // Live Video Room Overlay
  if (inLiveCall) {
    return (
      <div className="w-full max-w-7xl mx-auto h-[calc(100vh-8rem)] min-h-[600px] bg-slate-950 text-white rounded-3xl overflow-hidden shadow-2xl relative flex flex-col animate-in fade-in duration-200">
        {/* Top Video Status Header */}
        <div className="px-5 py-3.5 bg-slate-900/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <h3 className="text-xs md:text-sm font-bold text-white">Live • Dr. Ramesh Iyer (Former IAS)</h3>
              <span className="text-[10px] text-slate-400 font-mono">1-on-1 UPSC Strategy Review</span>
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-300 border border-white/10">
            ⏱️ 12:44
          </div>
        </div>

        {/* Video Canvas Split Area */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 p-4 min-h-0">
          {/* Main Mentor Feed (7-8 cols on md/lg) */}
          <div className="md:col-span-7 lg:col-span-8 relative bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10">
            <img
              src={ASSETS.mentorAvatar}
              alt="Mentor Feed"
              className="w-full h-full object-cover opacity-90"
            />
            {/* Student PIP Camera */}
            <div className="absolute bottom-4 right-4 w-28 h-36 md:w-36 md:h-48 bg-slate-800 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl">
              {isCameraOff ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 text-xs">
                  <span className="material-symbols-outlined text-2xl">videocam_off</span>
                  <span className="text-[10px] mt-1">Camera Off</span>
                </div>
              ) : (
                <img
                  src={ASSETS.userAvatar}
                  alt="Student Feed"
                  className="w-full h-full object-cover"
                />
              )}
              <span className="absolute bottom-1 left-2 text-[9px] font-bold text-white/90 bg-black/60 px-1.5 py-0.2 rounded">
                You (Abhinav)
              </span>
            </div>
          </div>

          {/* Live Strategy Notes Deck (4-5 cols on md/lg) */}
          <div className="md:col-span-5 lg:col-span-4 bg-slate-900/90 rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
            <div className="space-y-2 flex-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-mono">
                Live Strategy Notes & Action Points
              </label>
              <textarea
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                rows={8}
                className="w-full bg-slate-800/80 p-3 rounded-xl text-xs text-white border border-slate-700 outline-none focus:border-blue-500 custom-scrollbar leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`flex-1 h-11 rounded-xl flex items-center justify-center text-white transition-all active:scale-95 ${
                  isMuted ? 'bg-rose-600' : 'bg-slate-800 hover:bg-slate-700'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                <span className="material-symbols-outlined text-xl">
                  {isMuted ? 'mic_off' : 'mic'}
                </span>
              </button>

              <button
                onClick={() => setIsCameraOff(!isCameraOff)}
                className={`flex-1 h-11 rounded-xl flex items-center justify-center text-white transition-all active:scale-95 ${
                  isCameraOff ? 'bg-rose-600' : 'bg-slate-800 hover:bg-slate-700'
                }`}
                title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
              >
                <span className="material-symbols-outlined text-xl">
                  {isCameraOff ? 'videocam_off' : 'videocam'}
                </span>
              </button>

              <button
                onClick={() => {
                  setInLiveCall(false);
                  showToast('Mentorship call ended. Notes saved to Student Passport.', 'info', 'call_end');
                }}
                className="px-5 h-11 bg-rose-600 hover:bg-rose-700 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">call_end</span>
                End
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-24 md:pb-12 p-3 sm:p-4 md:p-6 lg:p-8 space-y-6 animate-in fade-in duration-200">
      {/* 2-Column Responsive Layout on Tablet & Laptop/Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column (7-8 cols on md/lg): Faculty Mentors Directory */}
        <div className="md:col-span-7 lg:col-span-8 space-y-5">
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-900 font-sans">Available Faculty Mentors</h2>
            <p className="text-xs text-slate-500">Book strategic evaluation calls with civil services officers and subject heads</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MENTORS_LIST.map((mentor) => (
              <div
                key={mentor.id}
                className="rounded-3xl p-5 bg-white border border-slate-200 space-y-4 hover:border-blue-400 hover:shadow-md transition-all shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-xs shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900 font-sans">{mentor.name}</h3>
                        <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100 font-mono">
                          {mentor.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{mentor.experience} • Rating: {mentor.rating}★</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{mentor.bio}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {mentor.availableSlots.length} Slots Available
                  </span>
                  <button
                    onClick={() => handleOpenBooking(mentor)}
                    className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                    Book 1-on-1 Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (4-5 cols on md/lg): Scheduled Calls & Guidelines */}
        <div className="md:col-span-5 lg:col-span-4 space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-slate-900 font-sans">Scheduled Sessions</h3>
              <span className="text-xs font-bold text-blue-600 font-mono">
                {bookedSessions.length} Active
              </span>
            </div>

            {bookedSessions.length === 0 ? (
              <div className="rounded-3xl p-6 bg-white border border-slate-200 shadow-xs text-center text-xs text-slate-400 space-y-2">
                <span className="material-symbols-outlined text-3xl text-slate-300">event_busy</span>
                <p className="font-semibold text-slate-600">No sessions scheduled right now.</p>
                <p className="text-[11px]">Select a faculty mentor on the left to book your strategy review.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookedSessions.map((session) => (
                  <div
                    key={session.id}
                    className="rounded-3xl p-5 bg-white space-y-3 border border-blue-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                          <span className="material-symbols-outlined text-[22px]">video_call</span>
                        </div>
                        <div>
                          <h4 className="text-xs md:text-sm font-bold text-slate-900">{session.mentorName}</h4>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {session.date} • {session.timeSlot}
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        Confirmed
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed">
                      <strong className="text-slate-900">Agenda:</strong> {session.topic}
                    </p>

                    <button
                      onClick={() => handleJoinCall(session)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">videocam</span>
                      Enter Live Mentorship Room
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mentorship Preparation Protocol */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-5 text-white shadow-md space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200 font-mono">
              Session Checklist
            </h4>
            <ul className="text-xs text-blue-100 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>Upload your recent Mains essay draft 2 hours prior.</li>
              <li>Keep your Sectional MCQ diagnostic scorecards open.</li>
              <li>Have 3 specific doubt questions prepared.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedMentor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Book Mentorship Session</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedMentor.name}</p>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Time Slot</label>
                <div className="grid grid-cols-1 gap-1.5">
                  {selectedMentor.availableSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-xl text-xs font-semibold border text-left flex items-center justify-between transition-all cursor-pointer ${
                        selectedSlot === slot
                          ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                          : 'bg-slate-50 border-slate-200 hover:border-blue-300 text-slate-700'
                      }`}
                    >
                      <span>{slot}</span>
                      {selectedSlot === slot && (
                        <span className="material-symbols-outlined text-blue-600 text-base">check</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Session Agenda / Topic</label>
                <input
                  type="text"
                  value={sessionTopic}
                  onChange={(e) => setSessionTopic(e.target.value)}
                  className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
