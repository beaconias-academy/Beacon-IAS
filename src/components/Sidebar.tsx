import React from 'react';
import { AppRole, ScreenId } from '../types';
import { ASSETS } from '../data/mockData';

interface SidebarProps {
  currentScreen: ScreenId;
  role: AppRole;
  unreadCount: number;
  readinessScore: number;
  profile: any;
  onNavigate: (screen: ScreenId) => void;
  onRoleChange: (role: AppRole) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  role,
  unreadCount,
  readinessScore,
  profile,
  onNavigate,
  onRoleChange,
}) => {
  const navSections = [
    {
      title: 'CORE WORKSPACE',
      items: [
        { id: 'home' as ScreenId, label: 'Dashboard', icon: 'grid_view', badge: null },
        { id: 'courses' as ScreenId, label: 'Courses & Lectures', icon: 'play_lesson', badge: '12 Lectures' },
        { id: 'performance-tests' as ScreenId, label: 'Tests & Diagnostics', icon: 'assignment', badge: 'New Mock' },
        {
          id: role === 'mentor' ? ('mentor-dashboard' as ScreenId) : ('mentor' as ScreenId),
          label: role === 'mentor' ? 'Faculty Portal' : 'Mentorship',
          icon: 'forum',
          badge: null,
        },
      ],
    },
    {
      title: 'STRATEGY & ANALYSIS',
      items: [
        { id: 'assessment' as ScreenId, label: 'Diagnostic Assessment', icon: 'psychology', badge: null },
        { id: 'career-path' as ScreenId, label: 'Career Roadmap', icon: 'map', badge: null },
        { id: 'exam-eligibility' as ScreenId, label: 'Exam Matrix', icon: 'fact_check', badge: null },
        { id: 'passport' as ScreenId, label: 'Student Passport', icon: 'badge', badge: 'Verified' },
        ...(role === 'admin'
          ? [{ id: 'admin-analytics' as ScreenId, label: 'Command Centre', icon: 'admin_panel_settings', badge: 'Admin' }]
          : []),
      ],
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 bg-slate-900 text-slate-200 border-r border-slate-800 sticky top-0 h-screen select-none z-30 transition-all">
      {/* Brand Header */}
      <div className="p-4 lg:p-5 border-b border-slate-800/80 flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left group"
        >
          <img
            src={ASSETS.beaconLogo}
            alt="BEACON IAS"
            className="w-9 h-9 rounded-xl object-cover ring-2 ring-amber-400/50 shadow-md group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white font-sans">
                BEACON IAS
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Civil Services OS
            </span>
          </div>
        </button>
      </div>

      {/* Role Switcher Pills */}
      <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-950/40">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Active Mode
          </span>
          <span className="text-[10px] font-mono font-semibold text-blue-400 capitalize">
            {role}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onRoleChange('student')}
            className={`text-xs font-bold py-1 px-1.5 rounded-lg transition-all text-center truncate ${
              role === 'student'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Student Mode"
          >
            Student
          </button>
          <button
            onClick={() => onRoleChange('mentor')}
            className={`text-xs font-bold py-1 px-1.5 rounded-lg transition-all text-center truncate ${
              role === 'mentor'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Faculty / Mentor Mode"
          >
            Faculty
          </button>
          <button
            onClick={() => onRoleChange('admin')}
            className={`text-xs font-bold py-1 px-1.5 rounded-lg transition-all text-center truncate ${
              role === 'admin'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Institutional Admin Mode"
          >
            Admin
          </button>
        </div>
      </div>

      {/* Navigation Links (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {/* Beacon AI Highlighted Action Button */}
        <div>
          <button
            id="sidebar-nav-ai"
            onClick={() => onNavigate('ai')}
            className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all duration-200 group border ${
              currentScreen === 'ai'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400/30 shadow-lg shadow-blue-600/20'
                : 'bg-slate-800/70 hover:bg-slate-800 text-slate-100 border-slate-700/60 hover:border-blue-500/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center p-1 group-hover:scale-110 transition-transform">
                <img
                  src="/beacon-ai.svg"
                  alt="Beacon AI"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                  Beacon AI Mentor
                  <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[9px] font-extrabold uppercase">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  Instant UPSC Queries
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </button>
        </div>

        {/* Section Groups */}
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-2 font-mono">
              {section.title}
            </h3>
            {section.items.map((item) => {
              const isActive =
                currentScreen === item.id ||
                (item.id === 'home' && currentScreen === 'student-dashboard');

              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span
                      className={`material-symbols-outlined text-[20px] transition-transform ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                      style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Aspirant Status Card */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/60">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={profile?.avatarUrl || ASSETS.userAvatar}
              alt={profile?.name || 'Aspirant'}
              className="w-9 h-9 rounded-xl object-cover ring-1 ring-blue-500/30 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">
                {profile?.name || 'Abhinav Sharma'}
              </h4>
              <p className="text-[10px] text-slate-400 font-medium truncate">
                {profile?.targetExam || 'UPSC CSE 2026'}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-400 font-mono block">Readiness</span>
            <span className="text-xs font-bold text-amber-400 font-mono">
              {readinessScore}%
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
