import React, { useState, useEffect } from 'react';
import { ScreenId } from '../types';
import { ASSETS } from '../data/mockData';
import { useToast } from '../components/Toast';

interface CoursesViewProps {
  onNavigate: (screen: ScreenId) => void;
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  onNavigate,
  bookmarks,
  onToggleBookmark,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'CLASSES' | 'MATERIALS' | 'TESTS' | 'ASSIGNMENTS'>('CLASSES');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentTimeSecs, setCurrentTimeSecs] = useState<number>(765); // 12:45
  const totalDurationSecs = 1710; // 28:30
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(3);
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState<boolean>(false);
  const [assignmentSubmitted, setAssignmentSubmitted] = useState<boolean>(false);

  const courseId = 'indian-polity-ch4';
  const isBookmarked = bookmarks.includes(courseId);

  // Playback timer simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeSecs((prev) => {
          if (prev >= totalDurationSecs) {
            setIsPlaying(false);
            return totalDurationSecs;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const chapters = [
    { title: 'Historical Underpinnings (1773-1947)', duration: '32:10', completed: true, subject: 'Polity' },
    { title: 'Making of the Constitution & Preamble', duration: '26:45', completed: true, subject: 'Polity' },
    { title: 'Fundamental Rights & Judicial Review', duration: '44:20', completed: true, subject: 'Polity' },
    { title: 'Salient Features & Federal Structure', duration: '28:30', completed: false, subject: 'Polity' },
    { title: 'Emergency Provisions & Constitutional Crises', duration: '35:15', completed: false, subject: 'Polity' },
  ];

  const handleSpeedToggle = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
    showToast(`Speed set to ${speeds[nextIdx]}x`, 'info');
  };

  const handleBookmarkToggle = () => {
    onToggleBookmark(courseId);
    showToast(
      isBookmarked ? 'Removed from Bookmarks' : 'Lecture saved to Bookmarks',
      'success',
      'bookmark'
    );
  };

  const progressPercent = Math.round((currentTimeSecs / totalDurationSecs) * 100);

  return (
    <div className="w-full max-w-7xl mx-auto pb-24 md:pb-12 p-3 sm:p-4 md:p-6 lg:p-8 animate-in fade-in duration-200">
      {/* 2-Column Responsive Grid on Laptop/Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Main Video + Tabs Column (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Video Player Container */}
          <div className="w-full aspect-video bg-slate-950 rounded-2xl md:rounded-3xl relative overflow-hidden shadow-lg group">
            {/* Beacon IAS Video Watermark (Top Left) */}
            <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 bg-black/75 backdrop-blur-md rounded-full border border-amber-400/40 z-20 shadow-md">
              <img src="/beacon-logo.png" alt="Beacon IAS" className="w-4 h-4 rounded-full object-cover" />
              <span className="text-[9px] font-extrabold text-amber-400 tracking-widest uppercase">
                BEACON IAS
              </span>
            </div>

            {/* Top Right Actions: Speed & Bookmark */}
            <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-20">
              <button
                onClick={handleSpeedToggle}
                className="px-2.5 py-1 rounded-xl bg-black/75 hover:bg-black/90 text-white text-xs font-mono font-bold border border-white/20 active:scale-95 transition-all backdrop-blur-md"
              >
                {playbackSpeed}x
              </button>
              <button
                onClick={handleBookmarkToggle}
                className="w-8 h-8 rounded-xl bg-black/75 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 active:scale-95 transition-all backdrop-blur-md"
                title="Bookmark"
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={isBookmarked ? { fontVariationSettings: "'FILL' 1", color: '#FBBF24' } : {}}
                >
                  {isBookmarked ? 'bookmark' : 'bookmark_border'}
                </span>
              </button>
            </div>

            {/* Background Image / Video Feed */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${ASSETS.courseVideoThumb}')` }}
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/40 to-black/30" />

              {/* Central Play/Pause button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center shadow-2xl active:scale-90 transition-all border border-white/30 backdrop-blur-xs cursor-pointer"
                >
                  <span
                    className="material-symbols-outlined text-4xl ml-0.5"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>
              </div>

              {/* Bottom Video Controls & Scrub bar */}
              <div className="absolute bottom-0 inset-x-0 p-4 text-white bg-gradient-to-t from-black/95 via-black/60 to-transparent">
                <div className="flex items-center justify-between text-xs mb-2 font-medium">
                  <span className="font-bold text-xs md:text-sm truncate max-w-md">
                    {chapters[activeChapterIndex]?.title || 'Indian Polity Chapter 4'}
                  </span>
                  <span className="font-mono text-xs text-slate-300">
                    {formatTime(currentTimeSecs)} / {formatTime(totalDurationSecs)}
                  </span>
                </div>

                {/* Interactive Progress Scrubber */}
                <div
                  className="w-full bg-white/20 h-2 rounded-full overflow-hidden cursor-pointer hover:h-2.5 transition-all relative"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const pct = clickX / rect.width;
                    setCurrentTimeSecs(Math.round(pct * totalDurationSecs));
                  }}
                >
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lecture Meta Card */}
          <div className="rounded-3xl p-5 md:p-6 flex flex-col gap-2 bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[10px] md:text-xs font-extrabold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 uppercase tracking-wider border border-blue-100">
                GS PAPER 2 • CONSTITUTION & GOVERNANCE
              </span>
              <span className="text-xs font-mono text-slate-500 font-semibold">Faculty: Dr. Ramesh Iyer (Retd. IAS)</span>
            </div>
            <h2 className="text-slate-900 text-lg md:text-xl font-bold font-sans">
              Federal Structure &amp; Inter-State Relations (Art. 245-293)
            </h2>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Comprehensive analysis of Union-State legislative relations, Sarkaria &amp; Punchhi Commission recommendations, GST Council fiscal dynamics, and landmark Supreme Court verdicts.
            </p>
          </div>

          {/* Segmented Tab Navigation */}
          <div className="space-y-4">
            <div className="flex bg-slate-200/80 p-1 rounded-2xl gap-1 overflow-x-auto custom-scrollbar">
              {[
                { id: 'CLASSES' as const, label: 'Course Chapters', icon: 'menu_book' },
                { id: 'MATERIALS' as const, label: 'Notes & PDF', icon: 'description' },
                { id: 'TESTS' as const, label: 'MCQ Quiz Drill', icon: 'quiz' },
                { id: 'ASSIGNMENTS' as const, label: 'Mains Task', icon: 'edit_note' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab 1: Chapters & Lectures List (On Mobile/Tablet when tab selected) */}
            {activeTab === 'CLASSES' && (
              <div className="space-y-2.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1 font-mono">
                  <span>Course Modules (5 Chapters)</span>
                  <span className="text-blue-600">3/5 Completed (60%)</span>
                </div>

                {chapters.map((chap, idx) => {
                  const isActive = activeChapterIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setActiveChapterIndex(idx);
                        setCurrentTimeSecs(0);
                        setIsPlaying(true);
                        showToast(`Now Playing: Chapter ${idx + 1}`, 'info', 'play_circle');
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                        isActive
                          ? 'bg-blue-50/90 border-blue-500 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                          chap.completed
                            ? 'bg-emerald-100 text-emerald-700'
                            : isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {chap.completed ? (
                          <span className="material-symbols-outlined text-[20px]">check</span>
                        ) : (
                          idx + 1
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`text-xs md:text-sm font-semibold truncate ${isActive ? 'text-blue-900 font-bold' : 'text-slate-900'}`}>
                          {chap.title}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-mono">{chap.duration}</span>
                          <span>•</span>
                          <span>{chap.subject}</span>
                        </div>
                      </div>

                      <button className={`p-2 rounded-xl transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                        <span className="material-symbols-outlined text-[24px]">
                          {isActive && isPlaying ? 'pause_circle' : 'play_circle'}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 2: Materials & PDF */}
            {activeTab === 'MATERIALS' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="rounded-3xl p-5 md:p-6 bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-3xl">picture_as_pdf</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Official UPSC Chapter Handbook</h4>
                        <p className="text-xs text-slate-500 font-mono">PDF • 34 Pages • 4.8 MB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPdfModal(true)}
                      className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
                    >
                      Preview Notes
                    </button>
                  </div>

                  <div className="text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                    <p className="font-bold text-slate-900 text-xs">Key Constitutional Provisions & Case Law:</p>
                    <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                      <li>Article 246 (Seventh Schedule &amp; Three Legislative Lists)</li>
                      <li>Article 263 (Inter-State Council Framework & Cooperative Federalism)</li>
                      <li>S.R. Bommai vs. Union of India (1994) Basic Structure Verdict</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      showToast('High-Yield Revision PDF downloaded!', 'success', 'download');
                    }}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-bold rounded-2xl shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Download Complete Handbook PDF
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: Sectional Tests */}
            {activeTab === 'TESTS' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="rounded-3xl p-5 md:p-6 bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                        DIAGNOSTIC TEST
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1.5">Chapter 4 Sectional MCQ Drill</h4>
                      <p className="text-xs text-slate-500 mt-0.5">15 High-Yield Questions • 15 Mins</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-600">82% Avg Score</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('performance-tests')}
                    className="w-full py-3 bg-slate-900 hover:bg-blue-600 text-white text-xs md:text-sm font-bold rounded-2xl shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">play_circle</span>
                    Launch Sectional Test Simulator
                  </button>
                </div>
              </div>
            )}

            {/* Tab 4: Assignments */}
            {activeTab === 'ASSIGNMENTS' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="rounded-3xl p-5 md:p-6 bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 border border-purple-200">
                      MAINS 250-WORD ESSAY
                    </span>
                    <span className="text-xs font-mono text-rose-600 font-bold">Due in 2 Days</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      "Examine the evolving dynamics of fiscal federalism in India in light of recent Finance Commission awards and GST Council decisions."
                    </h4>
                    <p className="text-xs text-slate-500 mt-1.5">GS Paper 2 • 15 Marks • Submit handwritten PDF or typed draft for mentor evaluation.</p>
                  </div>

                  {assignmentSubmitted ? (
                    <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs md:text-sm flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-emerald-600 text-xl">check_circle</span>
                      <span>Answer submitted! Dr. Ramesh Iyer's review is currently pending.</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAssignmentModal(true)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-bold rounded-2xl shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">upload_file</span>
                      Submit Mains Answer Draft
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Column (4 cols on lg): Playlist & Faculty Widget */}
        <div className="hidden lg:block lg:col-span-4 space-y-5">
          {/* Chapter Playlist Box */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-sans">
                Full Module Playlist
              </h3>
              <span className="text-xs font-mono font-semibold text-blue-600">5 Chapters</span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar pr-1">
              {chapters.map((chap, idx) => {
                const isActive = activeChapterIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveChapterIndex(idx);
                      setCurrentTimeSecs(0);
                      setIsPlaying(true);
                      showToast(`Now Playing: Chapter ${idx + 1}`, 'info', 'play_circle');
                    }}
                    className={`w-full p-3 rounded-2xl border transition-all text-left flex items-center gap-3 ${
                      isActive
                        ? 'bg-blue-50 border-blue-500 shadow-2xs'
                        : 'bg-slate-50/70 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        chap.completed
                          ? 'bg-emerald-100 text-emerald-700'
                          : isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {chap.completed ? (
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${isActive ? 'text-blue-900' : 'text-slate-800'}`}>
                        {chap.title}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400">{chap.duration}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Instructor Bio & Direct Mentorship */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={ASSETS.mentorAvatar}
                alt="Faculty"
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-400/40 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate">Dr. Ramesh Iyer</h4>
                <p className="text-[10px] text-amber-300 font-semibold">Former IAS Officer &amp; GS2 Lead</p>
                <span className="text-[10px] text-slate-400 font-mono">Office Hours: 4 PM - 7 PM</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('mentor')}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">calendar_month</span>
              Book 1-on-1 Doubt Session
            </button>
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-rose-600">picture_as_pdf</span>
                <span className="text-xs md:text-sm font-bold text-slate-900 truncate">Indian Polity Chapter 4 Handbook</span>
              </div>
              <button
                onClick={() => setShowPdfModal(false)}
                className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-5 overflow-y-auto space-y-3 text-xs md:text-sm text-slate-700 flex-1">
              <h3 className="text-sm font-bold text-slate-900">Summary of Key Articles:</h3>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 leading-relaxed">
                <p><strong>Article 245:</strong> Extent of laws made by Parliament and by the Legislatures of States.</p>
                <p><strong>Article 246:</strong> Subject-matter of laws made by Parliament and State Legislatures (Union, State, Concurrent Lists).</p>
                <p><strong>Article 248:</strong> Residuary powers of legislation reside exclusively with the Union Parliament.</p>
                <p><strong>Article 262:</strong> Adjudication of disputes relating to waters of inter-State rivers or river valleys.</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setShowPdfModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  showToast('Handbook downloaded!', 'success', 'download');
                  setShowPdfModal(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mains Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Submit Mains Answer</h3>
              <button onClick={() => setShowAssignmentModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-blue-500 cursor-pointer bg-slate-50">
              <span className="material-symbols-outlined text-4xl text-blue-600 mb-2">cloud_upload</span>
              <p className="text-xs font-bold text-slate-800">Upload Handwritten PDF or Image</p>
              <p className="text-[10px] text-slate-400 mt-1">Supports PDF, JPG, PNG (Max 15MB)</p>
            </div>
            <button
              onClick={() => {
                setAssignmentSubmitted(true);
                setShowAssignmentModal(false);
                showToast('Mains answer uploaded for mentor evaluation!', 'success', 'check_circle');
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-xs transition-colors"
            >
              Confirm Submission
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
