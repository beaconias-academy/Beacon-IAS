import React from 'react';
import { AppRole, ScreenId } from '../types';
import { ASSETS } from '../data/mockData';

interface SidebarProps {
  currentScreen: ScreenId;
  role: AppRole;
  unreadCount: number;
  readinessScore: number;
  profile: any;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate: (screen: ScreenId) => void;
  onRoleChange: (role: AppRole) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  role,
  unreadCount,
  readinessScore,
  profile,
  isCollapsed = false,
  onToggleCollapse,
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
    <aside
      className={`hidden md:flex flex-col shrink-0 bg-slate-900 text-slate-200 border-r border-slate-800 sticky top-0 h-screen select-none z-30 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64 lg:w-72'
      }`}
    >
      {/* Brand Header */}
      <div className={`border-b border-slate-800/80 flex items-center justify-between transition-all ${
        isCollapsed ? 'p-3.5 flex-col gap-2 justify-center' : 'p-4 lg:p-5'
      }`}>
        <button
          onClick={() => onNavigate('home')}
          className={`flex items-center gap-3 text-left group cursor-pointer ${isCollapsed ? 'justify-center w-full' : ''}`}
          title="Beacon IAS Dashboard"
        >
          <img
            src={ASSETS.beaconLogo}
            alt="Beacon IAS"
            className="w-9 h-9 rounded-xl object-cover ring-2 ring-amber-400/50 shadow-md group-hover:scale-105 transition-transform shrink-0"
          />
          {!isCollapsed && (
            <div className="min-w-0 flex-1 animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white font-sans truncate">
                  Beacon IAS
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              </div>
              <span className="text-[11px] text-slate-400 font-medium block truncate">
                Civil Services OS
              </span>
            </div>
          )}
        </button>

        {/* Collapse toggle icon inside sidebar */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isCollapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>
        )}
      </div>

      {/* Role Switcher */}
      <div className={`border-b border-slate-800/60 bg-slate-950/40 transition-all ${
        isCollapsed ? 'p-2 flex flex-col items-center gap-1' : 'px-4 py-3'
      }`}>
        {!isCollapsed ? (
          <>
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
                className={`text-xs font-bold py-1 px-1.5 rounded-lg transition-all text-center truncate cursor-pointer ${
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
                className={`text-xs font-bold py-1 px-1.5 rounded-lg transition-all text-center truncate cursor-pointer ${
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
                className={`text-xs font-bold py-1 px-1.5 rounded-lg transition-all text-center truncate cursor-pointer ${
                  role === 'admin'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
                title="Institutional Admin Mode"
              >
                Admin
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-1.5 items-center w-full">
            <button
              onClick={() => onRoleChange(role === 'student' ? 'mentor' : role === 'mentor' ? 'admin' : 'student')}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
              title={`Role: ${role.toUpperCase()} (Click to switch)`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {role === 'student' ? 'school' : role === 'mentor' ? 'supervisor_account' : 'admin_panel_settings'}
              </span>
            </button>
            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter font-mono">
              {role.slice(0, 3)}
            </span>
          </div>
        )}
      </div>

      {/* Navigation Links (Scrollable) */}
      <div className={`flex-1 overflow-y-auto space-y-5 custom-scrollbar ${
        isCollapsed ? 'p-2' : 'px-3 py-4'
      }`}>
        {/* Beacon AI Highlighted Action Button */}
        <div>
          <button
            id="sidebar-nav-ai"
            onClick={() => onNavigate('ai')}
            className={`w-full rounded-2xl flex items-center transition-all duration-200 group border cursor-pointer ${
              isCollapsed ? 'p-2 justify-center' : 'p-3 justify-between'
            } ${
              currentScreen === 'ai'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400/30 shadow-lg shadow-blue-600/20'
                : 'bg-slate-800/70 hover:bg-slate-800 text-slate-100 border-slate-700/60 hover:border-blue-500/50'
            }`}
            title="Beacon AI Mentor — Instant UPSC Queries"
          >
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center p-1 group-hover:scale-110 transition-transform shrink-0">
                <img
                  src="/beacon-ai.svg"
                  alt="Beacon AI"
                  className="w-full h-full object-contain"
                />
              </div>
              {!isCollapsed && (
                <div className="text-left animate-in fade-in duration-200">
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
              )}
            </div>
            {!isCollapsed && (
              <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:translate-x-0.5 transition-transform">
                chevron_right
              </span>
            )}
          </button>
        </div>

        {/* Section Groups */}
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isCollapsed && (
              <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-2 font-mono truncate">
                {section.title}
              </h3>
            )}
            {section.items.map((item) => {
              const isActive =
                currentScreen === item.id ||
                (item.id === 'home' && currentScreen === 'student-dashboard');

              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all duration-150 group cursor-pointer ${
                    isCollapsed ? 'p-2.5 justify-center' : 'px-3 py-2.5 justify-between'
                  } ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                  title={item.label}
                >
                  <div className={`flex items-center gap-3 truncate ${isCollapsed ? 'justify-center' : ''}`}>
                    <span
                      className={`material-symbols-outlined text-[20px] shrink-0 transition-transform ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                      style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
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
      <div className={`border-t border-slate-800/80 bg-slate-950/60 transition-all ${
        isCollapsed ? 'p-2 flex flex-col items-center' : 'p-3.5'
      }`}>
        {!isCollapsed ? (
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
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
        ) : (
          <div
            className="flex flex-col items-center gap-1 cursor-pointer group"
            onClick={() => onNavigate('passport')}
            title={`${profile?.name || 'Aspirant'} • Readiness: ${readinessScore}%`}
          >
            <div className="relative">
              <img
                src={profile?.avatarUrl || ASSETS.userAvatar}
                alt={profile?.name || 'Aspirant'}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-500/40 shrink-0 group-hover:scale-105 transition-transform"
              />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 text-slate-950 text-[8px] font-extrabold font-mono rounded-full flex items-center justify-center ring-1 ring-slate-900">
                ★
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400">{readinessScore}%</span>
          </div>
        )}
      </div>
    </aside>
  );
};
