import React, { useState } from 'react';
import { AppRole, ScreenId } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { ToastProvider } from './components/Toast';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { useAppStore } from './data/store';

// Screen Views
import { StudentDashboardView } from './views/StudentDashboardView';
import { AssessmentView } from './views/AssessmentView';
import { ArchetypeResultView } from './views/ArchetypeResultView';
import { CareerPathView } from './views/CareerPathView';
import { ExamEligibilityView } from './views/ExamEligibilityView';
import { StudentPassportView } from './views/StudentPassportView';
import { CoursesView } from './views/CoursesView';
import { PerformanceTestsView } from './views/PerformanceTestsView';
import { MentorshipView } from './views/MentorshipView';
import { MentorDashboardView } from './views/MentorDashboardView';
import { InstitutionalAdminView } from './views/InstitutionalAdminView';
import { AiAssistantView } from './views/AiAssistantView';

export function AppContent() {
  const [role, setRole] = useState<AppRole>('student');
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Persistent Global Store
  const {
    plans,
    mentorTasks,
    profile,
    archetype,
    testAttempts,
    notifications,
    bookedSessions,
    bookmarks,
    readinessScore,
    indices,
    togglePlan,
    addPlan,
    deletePlan,
    toggleMentorTask,
    addMentorTask,
    updateProfile,
    saveArchetype,
    recordTestAttempt,
    bookSession,
    toggleBookmark,
    markNotificationRead,
    addNotification,
    clearNotifications,
  } = useAppStore();

  const handleRoleChange = (newRole: AppRole) => {
    setRole(newRole);
    if (newRole === 'student') {
      setCurrentScreen('home');
    } else if (newRole === 'mentor') {
      setCurrentScreen('mentor-dashboard');
    } else if (newRole === 'admin') {
      setCurrentScreen('admin-analytics');
    }
  };

  const handleNavigate = (screen: ScreenId) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainEl = document.getElementById('app-main-content');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
      case 'student-dashboard':
        return (
          <StudentDashboardView
            onNavigate={handleNavigate}
            plans={plans}
            profile={profile}
            readinessScore={readinessScore}
            indices={indices}
            onTogglePlan={togglePlan}
            onAddPlan={addPlan}
            onDeletePlan={deletePlan}
          />
        );
      case 'assessment':
        return (
          <AssessmentView
            onNavigate={handleNavigate}
            onSaveArchetype={saveArchetype}
          />
        );
      case 'archetype-result':
        return (
          <ArchetypeResultView
            onNavigate={handleNavigate}
            archetype={archetype}
          />
        );
      case 'career-path':
        return <CareerPathView onNavigate={handleNavigate} />;
      case 'exam-eligibility':
        return <ExamEligibilityView onNavigate={handleNavigate} />;
      case 'passport':
        return (
          <StudentPassportView
            profile={profile}
            archetype={archetype}
            onUpdateProfile={updateProfile}
          />
        );
      case 'courses':
        return (
          <CoursesView
            onNavigate={handleNavigate}
            bookmarks={bookmarks}
            onToggleBookmark={toggleBookmark}
          />
        );
      case 'performance-tests':
        return (
          <PerformanceTestsView
            onNavigate={handleNavigate}
            testAttempts={testAttempts}
            onRecordTestAttempt={recordTestAttempt}
          />
        );
      case 'mentor':
        return (
          <MentorshipView
            onNavigate={handleNavigate}
            bookedSessions={bookedSessions}
            onBookSession={bookSession}
          />
        );
      case 'mentor-dashboard':
        return (
          <MentorDashboardView
            onNavigate={handleNavigate}
            onAddMentorTask={addMentorTask}
          />
        );
      case 'admin-analytics':
      case 'admin-command':
        return (
          <InstitutionalAdminView
            onNavigate={handleNavigate}
            onAddNotification={addNotification}
          />
        );
      case 'ai':
        return <AiAssistantView />;
      default:
        return (
          <StudentDashboardView
            onNavigate={handleNavigate}
            plans={plans}
            profile={profile}
            readinessScore={readinessScore}
            indices={indices}
            onTogglePlan={togglePlan}
            onAddPlan={addPlan}
            onDeletePlan={deletePlan}
          />
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-900 flex selection:bg-blue-100 selection:text-blue-900">
      {/* Tablet & Desktop Sidebar */}
      <Sidebar
        currentScreen={currentScreen}
        role={role}
        unreadCount={unreadNotificationsCount}
        readinessScore={readinessScore}
        profile={profile}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        onNavigate={handleNavigate}
        onRoleChange={handleRoleChange}
      />

      {/* Main Viewport Container (Adaptive: Mobile centered app on phone, Full-width responsive canvas on tablet/laptop) */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen bg-slate-50 relative">
        {/* Top App Header */}
        <Header
          currentScreen={currentScreen}
          role={role}
          unreadCount={unreadNotificationsCount}
          notifications={notifications}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
          onNavigate={handleNavigate}
          onRoleChange={handleRoleChange}
          onOpenSearch={() => setIsSearchOpen(true)}
          onMarkNotificationRead={markNotificationRead}
          onClearNotifications={clearNotifications}
        />

        {/* Dynamic Screen View */}
        <main
          className="flex-1 w-full flex flex-col overflow-y-auto custom-scrollbar relative"
          id="app-main-content"
        >
          {renderCurrentScreen()}
        </main>

        {/* Global Search Overlay Modal */}
        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onNavigate={handleNavigate}
        />

        {/* Bottom Mobile Navigation */}
        <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
      </div>
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
