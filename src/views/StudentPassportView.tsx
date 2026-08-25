import React, { useState } from 'react';
import { StudentProfile, ArchetypeResult } from '../types';
import { useToast } from '../components/Toast';

interface StudentPassportViewProps {
  profile: StudentProfile;
  archetype: ArchetypeResult;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
}

export const StudentPassportView: React.FC<StudentPassportViewProps> = ({
  profile,
  archetype,
  onUpdateProfile,
}) => {
  const { showToast } = useToast();
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  // Form states for profile editing
  const [editName, setEditName] = useState(profile.name);
  const [editAge, setEditAge] = useState(profile.age);
  const [editLocation, setEditLocation] = useState(profile.location);
  const [editInstitution, setEditInstitution] = useState(profile.institution);
  const [editDegree, setEditDegree] = useState(profile.degree);
  const [editTargetExam, setEditTargetExam] = useState(profile.targetExam);
  const [editOptional, setEditOptional] = useState(profile.optionalSubject);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: editName,
      age: editAge,
      location: editLocation,
      institution: editInstitution,
      degree: editDegree,
      targetExam: editTargetExam,
      optionalSubject: editOptional,
    });
    setShowEditModal(false);
    showToast('Student Passport details updated successfully!', 'success', 'badge');
  };

  const handleExportPassport = () => {
    showToast('Verified Digital Passport exported as PDF!', 'success', 'download');
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-24 md:pb-12 p-3 sm:p-4 md:p-6 lg:p-8 space-y-6 animate-in fade-in duration-200">
      {/* 2-Column Responsive Layout on Desktop/Laptop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols on lg): 3D Flip Passport Card & Export Action */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Verified Digital ID
            </span>
            <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => setIsFlipped(!isFlipped)}>
              Tap Card to Flip ↻
            </span>
          </div>

          {/* 3D Flip Interactive Passport ID Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[260px] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden cursor-pointer transition-all duration-300 active:scale-[0.985] select-none bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 border border-slate-700/80"
          >
            {/* Subtle holographic glow */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {!isFlipped ? (
              /* Front of Passport Card */
              <div className="flex flex-col justify-between h-full min-h-[220px] relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/beacon-logo.png"
                      alt="Beacon IAS"
                      className="w-8 h-8 rounded-xl object-cover ring-1 ring-amber-400 shadow-sm"
                    />
                    <div>
                      <span className="font-extrabold tracking-wider text-xs block leading-tight text-white font-sans">
                        Beacon IAS Passport
                      </span>
                      <span className="text-[9px] text-amber-300 font-mono tracking-widest uppercase">
                        Civil Services Digital ID
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-white/15 px-2.5 py-1 rounded-full font-mono font-bold text-blue-200 border border-white/10">
                    VERIFIED
                  </span>
                </div>

                <div className="flex items-center gap-4 my-2">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-18 h-18 rounded-2xl object-cover ring-2 ring-white/40 shadow-md shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-lg text-white truncate font-sans">{profile.name}</h3>
                    <p className="font-mono text-xs text-blue-200">UID: {profile.idNumber}</p>
                    <p className="text-xs text-slate-300 mt-0.5 truncate">{profile.targetExam}</p>
                    <div className="inline-block mt-1.5 px-2.5 py-0.5 rounded-md bg-white/20 text-[10px] font-bold text-amber-300">
                      Archetype: {archetype.title}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300 border-t border-white/15 pt-3 font-mono">
                  <span className="truncate max-w-[220px]">{profile.institution}</span>
                  <span className="text-emerald-400 font-bold">● ACTIVE ASPIRANT</span>
                </div>
              </div>
            ) : (
              /* Back of Passport Card (QR & Cryptographic Verification) */
              <div className="flex flex-col justify-between h-full min-h-[220px] relative z-10 text-center animate-in zoom-in-95 space-y-3">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-300 font-mono">
                  <span>CRYPTOGRAPHIC VERIFICATION</span>
                  <span className="text-amber-300">Tap to Flip ↻</span>
                </div>

                <div className="my-auto flex flex-col items-center">
                  <div className="w-24 h-24 bg-white p-2 rounded-2xl shadow-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-900 text-6xl">qr_code_2</span>
                  </div>
                  <span className="font-mono text-xs text-blue-200 mt-2">
                    HASH: 8F9A-BC2024-UPSC-VERIFIED
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 font-mono border-t border-white/15 pt-2">
                  Official Credential of Beacon IAS Academy • Bengaluru
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowEditModal(true)}
              className="rounded-2xl bg-white border border-slate-200 shadow-xs p-3.5 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all font-bold text-xs text-slate-800 cursor-pointer"
            >
              <span className="material-symbols-outlined text-blue-600 text-[18px]">edit</span>
              Edit Profile
            </button>

            <button
              onClick={handleExportPassport}
              className="rounded-2xl p-3.5 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export PDF ID
            </button>
          </div>
        </div>

        {/* Right Column (7 cols on lg): Academic Details & Micro Credentials */}
        <div className="lg:col-span-7 space-y-5">
          {/* Verified Academic & Enrolment Details */}
          <section className="rounded-3xl p-6 bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Aspirant Credentials &amp; Enrolment
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block font-mono">Target Exam</span>
                <span className="font-bold text-slate-900 mt-1 block text-sm">{profile.targetExam}</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block font-mono">Optional Subject</span>
                <span className="font-bold text-slate-900 mt-1 block text-sm">{profile.optionalSubject}</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block font-mono">Degree / Major</span>
                <span className="font-bold text-slate-900 mt-1 block text-sm">{profile.degree}</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block font-mono">Institution</span>
                <span className="font-bold text-slate-900 mt-1 block text-sm truncate">{profile.institution}</span>
              </div>
            </div>
          </section>

          {/* Verified Skill Badges */}
          <section className="rounded-3xl p-6 bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Verified Micro-Credentials
            </h3>

            <div className="space-y-3">
              {[
                { title: 'Constitution & Polity Foundations (Art 1-395)', date: 'Issued Feb 2026', icon: 'gavel', color: 'text-blue-600', bg: 'bg-blue-50' },
                { title: '90%+ Consistency Champion (18-Day Streak)', date: 'Issued Active', icon: 'local_fire_department', color: 'text-amber-600', bg: 'bg-amber-50' },
                { title: 'Aptitude Assessment: Strategic Public Leader', date: 'Validated by AI', icon: 'psychology', color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map((badge, idx) => (
                <div key={idx} className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70">
                  <div className={`w-10 h-10 rounded-xl ${badge.bg} ${badge.color} flex items-center justify-center shrink-0`}>
                    <span className="material-symbols-outlined text-[22px]">{badge.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-bold text-slate-900 truncate">{badge.title}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{badge.date}</p>
                  </div>
                  <span className="material-symbols-outlined text-emerald-600 text-xl">verified</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Edit Passport Profile</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target Exam</label>
                  <input
                    type="text"
                    value={editTargetExam}
                    onChange={(e) => setEditTargetExam(e.target.value)}
                    className="w-full bg-slate-50 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Optional Subject</label>
                  <input
                    type="text"
                    value={editOptional}
                    onChange={(e) => setEditOptional(e.target.value)}
                    className="w-full bg-slate-50 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Degree &amp; Year</label>
                <input
                  type="text"
                  value={editDegree}
                  onChange={(e) => setEditDegree(e.target.value)}
                  className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">College / Institution</label>
                <input
                  type="text"
                  value={editInstitution}
                  onChange={(e) => setEditInstitution(e.target.value)}
                  className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
