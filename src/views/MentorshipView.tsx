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
    '• Focus on introductory constitutional articles.\n• Practice 2 case-study answers per week.'
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
      <div className="flex flex-col w-full h-[calc(100vh-8rem)] sm:h-[800px] bg-slate-950 text-white relative overflow-hidden animate-in fade-in duration-200">
        {/* Mentor Video Canvas */}
        <div className="relative flex-1 bg-slate-900 flex items-center justify-center overflow-hidden">
          <img
            src={ASSETS.mentorAvatar}
            alt="Mentor Feed"
            className="w-full h-full object-cover opacity-85"
          />

          {/* Top Status Bar */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-white">Live • Dr. Ramesh Iyer (Former IAS)</span>
            </div>

            <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-mono font-bold text-amber-300 border border-white/10">
              12:44
            </div>
          </div>

          {/* Student PIP Camera */}
          <div className="absolute bottom-4 right-4 w-28 h-36 bg-slate-800 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl">
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
            <span className="absolute bottom-1 left-2 text-[9px] font-bold text-white/90 bg-black/50 px-1.5 py-0.2 rounded">
              You
            </span>
          </div>
        </div>

        {/* Live Call Control Deck & Notes */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3 shrink-0">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Live Strategy Notes
            </label>
            <textarea
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
              rows={2}
              className="w-full bg-slate-800/80 px-3 py-2 rounded-xl text-xs text-white border border-slate-700 outline-none focus:border-blue-500 custom-scrollbar"
            />
          </div>

          <div className="flex items-center justify-around">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all active:scale-90 ${
                isMuted ? 'bg-rose-600' : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              <span className="material-symbols-outlined text-2xl">
                {isMuted ? 'mic_off' : 'mic'}
              </span>
            </button>

            <button
              onClick={() => setIsCameraOff(!isCameraOff)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all active:scale-90 ${
                isCameraOff ? 'bg-rose-600' : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
            >
              <span className="material-symbols-outlined text-2xl">
                {isCameraOff ? 'videocam_off' : 'videocam'}
              </span>
            </button>

            <button
              onClick={() => {
                setInLiveCall(false);
                showToast('Mentorship call ended. Notes saved to Student Passport.', 'info', 'call_end');
              }}
              className="px-6 h-12 bg-rose-600 hover:bg-rose-700 rounded-2xl text-white font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-xl">call_end</span>
              End Call
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-24 p-3.5 sm:p-4 space-y-4 animate-in fade-in duration-200">
      {/* Scheduled Calls */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-900">Scheduled 1-on-1 Sessions</h2>
          <span className="text-xs font-bold text-blue-600">
            {bookedSessions.length} Active
          </span>
        </div>

        {bookedSessions.length === 0 ? (
          <div className="rounded-2xl p-6 bg-white border border-slate-200 shadow-xs text-center text-xs text-slate-400 space-y-1">
            <span className="material-symbols-outlined text-3xl text-slate-300">event_busy</span>
            <p className="font-semibold text-slate-600">No sessions scheduled right now.</p>
            <p className="text-[11px]">Select a faculty mentor below to book your strategy review.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {bookedSessions.map((session) => (
              <div
                key={session.id}
                className="rounded-2xl p-4 bg-white space-y-3 border border-blue-200 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[22px]">video_call</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{session.mentorName}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {session.date} • {session.timeSlot}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    Confirmed
                  </span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <strong className="text-slate-900">Agenda:</strong> {session.topic}
                </p>

                <button
                  onClick={() => handleJoinCall(session)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">videocam</span>
                  Enter Live Mentorship Room
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Available Mentors Directory */}
      <section className="space-y-2.5">
        <div className="px-1">
          <h2 className="text-sm font-bold text-slate-900">Available Faculty Mentors</h2>
          <p className="text-[11px] text-slate-500">Book strategic evaluation calls with civil service officers</p>
        </div>

        <div className="space-y-3">
          {MENTORS_LIST.map((mentor) => (
            <div
              key={mentor.id}
              className="rounded-2xl p-4 bg-white border border-slate-200 space-y-3 hover:border-blue-300 transition-all shadow-xs"
            >
              <div className="flex items-start gap-3">
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-xs shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-xs font-bold text-slate-900">{mentor.name}</h3>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700">
                      {mentor.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-1">{mentor.experience} • Rating: {mentor.rating}★</p>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{mentor.bio}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {mentor.availableSlots.length} Slots Available
                </span>
                <button
                  onClick={() => handleOpenBooking(mentor)}
                  className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                  Book Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && selectedMentor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Book Mentorship Call</h3>
                <p className="text-[11px] text-slate-500 font-medium">{selectedMentor.name}</p>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Time Slot</label>
                <div className="grid grid-cols-1 gap-1.5">
                  {selectedMentor.availableSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border text-left flex items-center justify-between transition-all ${
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
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Session Agenda / Topic</label>
                <input
                  type="text"
                  value={sessionTopic}
                  onChange={(e) => setSessionTopic(e.target.value)}
                  className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
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
