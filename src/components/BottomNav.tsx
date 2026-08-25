import React from 'react';
import { ScreenId } from '../types';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const getActiveTab = (): 'home' | 'passport' | 'ai' | 'courses' | 'mentor' => {
    if (currentScreen === 'passport') return 'passport';
    if (currentScreen === 'ai') return 'ai';
    if (currentScreen === 'courses') return 'courses';
    if (currentScreen === 'mentor' || currentScreen === 'mentor-dashboard') return 'mentor';
    return 'home';
  };

  const activeTab = getActiveTab();

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: 'grid_view', activeIcon: 'grid_view', screen: 'home' as ScreenId },
    { id: 'courses' as const, label: 'Courses', icon: 'play_lesson', activeIcon: 'play_lesson', screen: 'courses' as ScreenId },
    { id: 'ai' as const, label: 'Beacon AI', icon: 'smart_toy', activeIcon: 'smart_toy', screen: 'ai' as ScreenId, isSpecial: true },
    { id: 'mentor' as const, label: 'Mentor', icon: 'forum', activeIcon: 'forum', screen: 'mentor' as ScreenId },
    { id: 'passport' as const, label: 'Passport', icon: 'badge', activeIcon: 'badge', screen: 'passport' as ScreenId },
  ];

  return (
    <nav
      className="sticky bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md pb-safe border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] select-none"
      id="bottom-navigation-bar"
    >
      <div className="w-full flex justify-around items-center h-16 px-1.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                id="bottom-nav-ai"
                onClick={() => onNavigate(item.screen)}
                className="relative -top-3 flex flex-col items-center group focus:outline-none"
                title="Beacon AI Civil Services Mentor"
              >
                {/* Elevated Glowing Action Button */}
                <div
                  className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 p-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-blue-500/30 scale-105 ring-4 ring-blue-100'
                      : 'bg-slate-900 hover:bg-blue-700 shadow-slate-900/20 active:scale-95'
                  }`}
                >
                  <img
                    src="/beacon-ai.svg"
                    alt="Beacon AI"
                    className="w-8 h-8 object-contain drop-shadow-sm"
                  />
                </div>
                <span
                  className={`text-[10px] font-bold mt-1 tracking-tight transition-colors ${
                    isActive ? 'text-blue-600 font-extrabold' : 'text-slate-600'
                  }`}
                >
                  Beacon AI
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onNavigate(item.screen)}
              className={`flex flex-col items-center justify-center min-w-[56px] h-12 py-1 px-2 rounded-xl transition-all duration-150 active:scale-90 ${
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <span
                  className={`material-symbols-outlined text-[22px] transition-transform duration-200 ${
                    isActive ? 'scale-110' : ''
                  }`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {isActive ? item.activeIcon : item.icon}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600" />
                )}
              </div>
              <span className={`text-[10px] leading-tight mt-0.5 tracking-tight font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
