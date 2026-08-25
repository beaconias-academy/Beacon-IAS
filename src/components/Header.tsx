import React, { useState } from 'react';
import { AppRole, ScreenId, AppNotification } from '../types';
import { ASSETS } from '../data/mockData';

interface HeaderProps {
  currentScreen: ScreenId;
  role: AppRole;
  unreadCount: number;
  notifications: AppNotification[];
  onNavigate: (screen: ScreenId) => void;
  onRoleChange: (role: AppRole) => void;
  onOpenSearch: () => void;
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  role,
  unreadCount,
  notifications,
  onNavigate,
  onRoleChange,
  onOpenSearch,
  onMarkNotificationRead,
  onClearNotifications,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Get clean screen title
  const getTitle = () => {
    switch (currentScreen) {
      case 'home':
      case 'student-dashboard':
        return 'Beacon Dashboard';
      case 'passport':
        return 'Student Passport';
      case 'ai':
        return 'Beacon AI Mentor';
      case 'courses':
        return 'Courses & Lectures';
      case 'mentor':
        return 'Mentorship';
      case 'assessment':
        return 'Aptitude Assessment';
      case 'archetype-result':
        return 'Career Archetype';
      case 'career-path':
        return 'Career Roadmap';
      case 'exam-eligibility':
        return 'Exam Matrix';
      case 'performance-tests':
        return 'Tests & Diagnostics';
      case 'mentor-dashboard':
        return 'Faculty Portal';
      case 'admin-command':
      case 'admin-analytics':
        return 'Command Centre';
      default:
        return 'Beacon IAS';
    }
  };

  const isSubScreen =
    currentScreen === 'career-path' ||
    currentScreen === 'assessment' ||
    currentScreen === 'archetype-result' ||
    currentScreen === 'exam-eligibility' ||
    currentScreen === 'performance-tests';

  const getRoleLabel = () => {
    switch (role) {
      case 'student':
        return 'Student';
      case 'mentor':
        return 'Mentor';
      case 'admin':
        return 'Admin';
      default:
        return 'Student';
    }
  };

  return (
    <header className="sticky top-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs select-none pt-safe-top">
      <div className="h-14 px-3.5 flex items-center justify-between gap-2">
        {/* Left: Brand Logo / Back Button + Screen Title */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {isSubScreen ? (
            <button
              id="header-back-button"
              onClick={() => onNavigate('home')}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-all shrink-0"
              title="Go Back to Dashboard"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center shrink-0 active:scale-95 transition-transform"
            >
              <img
                src={ASSETS.beaconLogo}
                alt="BEACON IAS"
                className="h-8 w-8 rounded-xl object-cover ring-2 ring-amber-400/50 shadow-sm"
              />
            </button>
          )}

          <div className="min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-900 tracking-tight truncate font-sans">
                {getTitle()}
              </span>
              {role !== 'student' && (
                <span className="px-1.5 py-0.2 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider shrink-0">
                  {getRoleLabel()}
                </span>
              )}
            </div>
            {!isSubScreen && (
              <span className="text-[10px] font-medium text-slate-500 truncate -mt-0.5">
                {role === 'student' ? 'UPSC 2026 Aspirant' : role === 'mentor' ? 'Faculty Portal' : 'Admin Console'}
              </span>
            )}
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Quick Search */}
          <button
            id="header-search-btn"
            onClick={onOpenSearch}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
            title="Search"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          {/* Notifications Trigger */}
          <button
            id="header-notifications-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition-all relative"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[15px] h-[15px] px-0.5 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar / Role Dropdown */}
          <div className="relative ml-0.5">
            <button
              id="header-profile-avatar"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="w-8 h-8 rounded-xl overflow-hidden ring-2 ring-blue-500/30 hover:ring-blue-600 transition-all active:scale-95 block shadow-xs"
              title="Account Menu"
            >
              <img
                src={ASSETS.userAvatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>

            {/* Profile / Role Selector Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={ASSETS.userAvatar}
                      alt="User"
                      className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-500/20"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-slate-900 truncate">Abhinav Kumar</p>
                      <p className="text-[10px] text-slate-500 font-mono">BC-2024-8921</p>
                      <span className="inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700">
                        {role === 'student' ? 'Student View' : role === 'mentor' ? 'Faculty Mentor' : 'Institutional Admin'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-1.5 py-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5 py-1">
                    Switch App Role
                  </p>
                  <button
                    onClick={() => {
                      onRoleChange('student');
                      onNavigate('home');
                      setShowProfileMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      role === 'student'
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">school</span>
                      Student Workspace
                    </span>
                    {role === 'student' && (
                      <span className="material-symbols-outlined text-[16px] text-blue-600">check</span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      onRoleChange('mentor');
                      onNavigate('mentor-dashboard');
                      setShowProfileMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      role === 'mentor'
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">psychology</span>
                      Mentor Diagnostics
                    </span>
                    {role === 'mentor' && (
                      <span className="material-symbols-outlined text-[16px] text-blue-600">check</span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      onRoleChange('admin');
                      onNavigate('admin-analytics');
                      setShowProfileMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      role === 'admin'
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                      Institutional Admin
                    </span>
                    {role === 'admin' && (
                      <span className="material-symbols-outlined text-[16px] text-blue-600">check</span>
                    )}
                  </button>
                </div>

                <div className="border-t border-slate-100 px-1.5 pt-1">
                  <button
                    onClick={() => {
                      onNavigate('passport');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px] text-slate-500">badge</span>
                    View Student Passport
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Notification Sheet */}
      {showNotifications && (
        <div className="px-3.5 py-3 bg-white border-b border-slate-200 space-y-2 animate-in slide-in-from-top-2 shadow-lg max-h-80 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 pb-1 border-b border-slate-100">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-blue-600 text-[18px]">notifications_active</span>
              Notifications ({notifications.length})
            </span>
            <button
              onClick={onClearNotifications}
              className="text-blue-600 hover:underline text-[11px] font-medium"
            >
              Clear All
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No new notifications. You're all caught up!
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  onMarkNotificationRead(notif.id);
                  if (notif.actionScreen) {
                    onNavigate(notif.actionScreen);
                    setShowNotifications(false);
                  }
                }}
                className={`p-2.5 rounded-xl text-xs flex items-start gap-2.5 border transition-all cursor-pointer hover:border-blue-400 ${
                  notif.read
                    ? 'bg-slate-50 text-slate-600 border-slate-200/80'
                    : 'bg-blue-50/60 text-slate-900 border-blue-200 shadow-xs'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[18px] mt-0.5 shrink-0 ${
                    notif.type === 'warning'
                      ? 'text-rose-600'
                      : notif.type === 'event'
                      ? 'text-blue-600'
                      : 'text-emerald-600'
                  }`}
                >
                  {notif.type === 'warning' ? 'warning' : notif.type === 'event' ? 'event' : 'info'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-bold text-slate-900 text-xs truncate">{notif.title}</p>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">{notif.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed line-clamp-2">{notif.message}</p>
                  {notif.actionLabel && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-600 mt-1 hover:underline">
                      {notif.actionLabel}
                      <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </header>
  );
};
