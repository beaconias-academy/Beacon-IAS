import React, { useState, useMemo } from 'react';
import { ScreenId } from '../types';

interface SearchResultItem {
  id: string;
  title: string;
  category: 'Screen' | 'Exam' | 'Course' | 'Mentor' | 'Topic';
  subtitle: string;
  icon: string;
  screen: ScreenId;
}

const SEARCH_DATABASE: SearchResultItem[] = [
  // Screens & Tools
  { id: 'tool-assess', title: 'Career Archetype Assessment', category: 'Screen', subtitle: 'Identify your civil service aptitude', icon: 'psychology', screen: 'assessment' },
  { id: 'tool-path', title: 'Dynamic Career Roadmap', category: 'Screen', subtitle: 'Visual milestones to IAS/IPS/IFS', icon: 'map', screen: 'career-path' },
  { id: 'tool-passport', title: 'Student Passport & Digital ID', category: 'Screen', subtitle: 'Verified credentials, badges & QR code', icon: 'badge', screen: 'passport' },
  { id: 'tool-tests', title: 'Performance & Mock Tests', category: 'Screen', subtitle: 'Daily quiz, sectional mock & remedial exams', icon: 'assignment', screen: 'performance-tests' },
  { id: 'tool-ai', title: 'Beacon AI Study Mentor', category: 'Screen', subtitle: 'Ask doubts, generate mindmaps & flashcards', icon: 'smart_toy', screen: 'ai' },
  { id: 'tool-mentor', title: '1-on-1 Mentorship Booking', category: 'Screen', subtitle: 'Book strategy review calls with officers', icon: 'supervisor_account', screen: 'mentor' },
  { id: 'tool-courses', title: 'Course Lecture Player', category: 'Screen', subtitle: 'Video classes, PDF notes & assignments', icon: 'play_lesson', screen: 'courses' },
  { id: 'tool-eligibility', title: 'Exam Eligibility Matrix', category: 'Screen', subtitle: 'UPSC, KPSC, RBI age and degree criteria', icon: 'fact_check', screen: 'exam-eligibility' },

  // Exams
  { id: 'exam-upsc', title: 'UPSC Civil Services Exam', category: 'Exam', subtitle: 'IAS, IPS, IFS • 3-Stage Selection', icon: 'account_balance', screen: 'exam-eligibility' },
  { id: 'exam-kpsc', title: 'KPSC Karnataka Administrative Service', category: 'Exam', subtitle: 'Karnataka Gazetted Probationers', icon: 'school', screen: 'exam-eligibility' },
  { id: 'exam-rbi', title: 'RBI Grade B Officer', category: 'Exam', subtitle: 'Reserve Bank of India Direct Recruitment', icon: 'payments', screen: 'exam-eligibility' },
  { id: 'exam-ssc', title: 'SSC Combined Graduate Level (CGL)', category: 'Exam', subtitle: 'Central Ministry & Auditor Posts', icon: 'description', screen: 'exam-eligibility' },

  // Courses & Topics
  { id: 'course-polity', title: 'Indian Constitution & Salient Features', category: 'Course', subtitle: 'Articles 1-395, Basic Structure Doctrine', icon: 'menu_book', screen: 'courses' },
  { id: 'course-emergency', title: 'Emergency Provisions (Art 352-360)', category: 'Course', subtitle: 'National Emergency & President\'s Rule', icon: 'warning', screen: 'courses' },
  { id: 'course-economy', title: 'Monetary Policy & Inflation Dynamics', category: 'Course', subtitle: 'RBI MPC, CRR, Repo Rate, CPI-C', icon: 'trending_up', screen: 'courses' },
  { id: 'course-geography', title: 'Physical Geography & River Systems', category: 'Course', subtitle: 'Himalayan drainage & Peninsular plateau', icon: 'public', screen: 'courses' },

  // Mentors
  { id: 'mentor-ramesh', title: 'Dr. Ramesh Iyer (Former IAS)', category: 'Mentor', subtitle: 'Polity & GS Paper 2 Strategy Mentor', icon: 'person', screen: 'mentor' },
  { id: 'mentor-sarah', title: 'Sarah Jenkins (CSAT Director)', category: 'Mentor', subtitle: 'Aptitude & Logical Elimination Expert', icon: 'person', screen: 'mentor' },
  { id: 'mentor-marcus', title: 'Marcus Chen (Economy Analyst)', category: 'Mentor', subtitle: 'Macroeconomics & Budget Specialist', icon: 'person', screen: 'mentor' },
];

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredResults = useMemo(() => {
    let list = SEARCH_DATABASE;
    if (selectedCategory !== 'All') {
      list = list.filter((item) => item.category === selectedCategory);
    }
    if (!query.trim()) return list.slice(0, 8);
    const q = query.toLowerCase();
    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query, selectedCategory]);

  if (!isOpen) return null;

  const categories = ['All', 'Screen', 'Exam', 'Course', 'Mentor'];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-3 sm:p-4 pt-10 sm:pt-16 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="p-3.5 border-b border-slate-100 flex items-center gap-2.5 bg-slate-50">
          <img
            src="/beacon-logo.png"
            alt="Beacon IAS"
            className="w-7 h-7 rounded-xl object-cover ring-1 ring-amber-400/50 shrink-0"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exams, courses, mentors, articles..."
            className="flex-1 bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-700 px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-xl bg-slate-200/70 hover:bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="px-3.5 py-2 bg-white border-b border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? 'All Items' : `${cat}s`}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-2.5 overflow-y-auto space-y-1 flex-1 custom-scrollbar">
          <div className="px-2 py-1 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>{query ? `Matching Results (${filteredResults.length})` : 'Recommended Destinations'}</span>
            {!query && <span className="text-blue-600">Quick Access</span>}
          </div>

          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-1 text-slate-300">search_off</span>
              <p className="text-xs font-medium">No results found for "{query}"</p>
              <p className="text-[11px] mt-1 text-blue-600 font-semibold">Try searching "Polity", "UPSC", "Mock", or "Beacon AI"</p>
            </div>
          ) : (
            filteredResults.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.screen);
                  onClose();
                }}
                className="w-full text-left p-2.5 rounded-2xl hover:bg-blue-50/70 border border-transparent hover:border-blue-200 flex items-center gap-3 transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-xs text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </p>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-800">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-blue-600 text-base transition-colors shrink-0">
                  arrow_forward
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
