import { useState, useEffect } from 'react';
import {
  ArchetypeResult,
  BookedSession,
  MentorTask,
  PlanItem,
  StudentProfile,
  TestAttemptResult,
  AppNotification,
} from '../types';
import {
  ARCHETYPES_DATABASE,
  INITIAL_MENTOR_TASKS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PLANS,
  INITIAL_STUDENT_PROFILE,
} from './mockData';

const STORAGE_KEYS = {
  PLANS: 'beacon_plans_v1',
  MENTOR_TASKS: 'beacon_mentor_tasks_v1',
  PROFILE: 'beacon_student_profile_v1',
  ARCHETYPE: 'beacon_archetype_v1',
  TEST_ATTEMPTS: 'beacon_test_attempts_v1',
  NOTIFICATIONS: 'beacon_notifications_v1',
  BOOKED_SESSIONS: 'beacon_booked_sessions_v1',
  BOOKMARKS: 'beacon_bookmarks_v1',
  READINESS: 'beacon_readiness_score_v1',
  INDICES: 'beacon_indices_v1',
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading localStorage for key ${key}:`, e);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing localStorage for key ${key}:`, e);
  }
}

export function useAppStore() {
  const [plans, setPlansState] = useState<PlanItem[]>(() =>
    getStored(STORAGE_KEYS.PLANS, INITIAL_PLANS)
  );

  const [mentorTasks, setMentorTasksState] = useState<MentorTask[]>(() =>
    getStored(STORAGE_KEYS.MENTOR_TASKS, INITIAL_MENTOR_TASKS)
  );

  const [profile, setProfileState] = useState<StudentProfile>(() =>
    getStored(STORAGE_KEYS.PROFILE, INITIAL_STUDENT_PROFILE)
  );

  const [archetype, setArchetypeState] = useState<ArchetypeResult>(() =>
    getStored(STORAGE_KEYS.ARCHETYPE, ARCHETYPES_DATABASE.strategic)
  );

  const [testAttempts, setTestAttemptsState] = useState<TestAttemptResult[]>(() =>
    getStored(STORAGE_KEYS.TEST_ATTEMPTS, [])
  );

  const [notifications, setNotificationsState] = useState<AppNotification[]>(() =>
    getStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
  );

  const [bookedSessions, setBookedSessionsState] = useState<BookedSession[]>(() =>
    getStored(STORAGE_KEYS.BOOKED_SESSIONS, [
      {
        id: 'session-1',
        mentorId: 'dr-ramesh',
        mentorName: 'Dr. Ramesh Iyer',
        date: 'Today',
        timeSlot: '4:00 PM - 4:45 PM',
        topic: 'GS Paper 2: Constitutional Strategy & Answer Structuring',
        status: 'upcoming',
      },
    ])
  );

  const [bookmarks, setBookmarksState] = useState<string[]>(() =>
    getStored(STORAGE_KEYS.BOOKMARKS, ['indian-polity-ch4'])
  );

  const [readinessScore, setReadinessScoreState] = useState<number>(() =>
    getStored(STORAGE_KEYS.READINESS, 68)
  );

  const [indices, setIndicesState] = useState(() =>
    getStored(STORAGE_KEYS.INDICES, {
      academic: 72,
      competitive: 65,
      competency: 80,
      consistency: 90,
      clarity: 85,
    })
  );

  // Persistence effects
  useEffect(() => setStored(STORAGE_KEYS.PLANS, plans), [plans]);
  useEffect(() => setStored(STORAGE_KEYS.MENTOR_TASKS, mentorTasks), [mentorTasks]);
  useEffect(() => setStored(STORAGE_KEYS.PROFILE, profile), [profile]);
  useEffect(() => setStored(STORAGE_KEYS.ARCHETYPE, archetype), [archetype]);
  useEffect(() => setStored(STORAGE_KEYS.TEST_ATTEMPTS, testAttempts), [testAttempts]);
  useEffect(() => setStored(STORAGE_KEYS.NOTIFICATIONS, notifications), [notifications]);
  useEffect(() => setStored(STORAGE_KEYS.BOOKED_SESSIONS, bookedSessions), [bookedSessions]);
  useEffect(() => setStored(STORAGE_KEYS.BOOKMARKS, bookmarks), [bookmarks]);
  useEffect(() => setStored(STORAGE_KEYS.READINESS, readinessScore), [readinessScore]);
  useEffect(() => setStored(STORAGE_KEYS.INDICES, indices), [indices]);

  // Actions
  const togglePlan = (id: string) => {
    setPlansState((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, completed: !p.completed } : p));
      const completedCount = updated.filter((p) => p.completed).length;
      // dynamically increase consistency index when completing tasks
      setIndicesState((ind) => ({
        ...ind,
        consistency: Math.min(100, 80 + completedCount * 5),
      }));
      return updated;
    });
  };

  const addPlan = (title: string, time: string, category: 'study' | 'quiz' | 'mentor' | 'revision' = 'study') => {
    const newPlan: PlanItem = {
      id: Date.now().toString(),
      title,
      time,
      completed: false,
      category,
    };
    setPlansState((prev) => [newPlan, ...prev]);
  };

  const deletePlan = (id: string) => {
    setPlansState((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleMentorTask = (id: string) => {
    setMentorTasksState((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const addMentorTask = (task: Omit<MentorTask, 'id'>) => {
    const newTask: MentorTask = { ...task, id: Date.now().toString() };
    setMentorTasksState((prev) => [newTask, ...prev]);
  };

  const updateProfile = (updated: Partial<StudentProfile>) => {
    setProfileState((prev) => ({ ...prev, ...updated }));
  };

  const saveArchetype = (result: ArchetypeResult) => {
    setArchetypeState(result);
    setReadinessScoreState((prev) => Math.min(100, Math.max(prev, result.matchPercentage - 10)));
    setIndicesState((prev) => ({
      ...prev,
      clarity: Math.min(100, result.matchPercentage),
    }));
  };

  const recordTestAttempt = (attempt: TestAttemptResult) => {
    setTestAttemptsState((prev) => [attempt, ...prev]);
    // boost readiness & competitive index based on score
    setReadinessScoreState((prev) => {
      const delta = attempt.scorePercentage >= 80 ? 3 : attempt.scorePercentage >= 50 ? 1 : 0;
      return Math.min(100, prev + delta);
    });
    setIndicesState((prev) => ({
      ...prev,
      competitive: Math.min(100, Math.round((prev.competitive + attempt.scorePercentage) / 2)),
      consistency: Math.min(100, prev.consistency + 2),
    }));
  };

  const bookSession = (session: Omit<BookedSession, 'id'>) => {
    const newSession: BookedSession = {
      ...session,
      id: `session-${Date.now()}`,
    };
    setBookedSessionsState((prev) => [newSession, ...prev]);
    // Add to today's plan
    addPlan(`Mentorship Call with ${session.mentorName}`, session.timeSlot.split('-')[0].trim(), 'mentor');
    // Add notification
    addNotification({
      title: 'Mentorship Confirmed',
      message: `Session booked with ${session.mentorName} for ${session.date} (${session.timeSlot}).`,
      type: 'event',
      actionScreen: 'mentor',
      actionLabel: 'View Session',
    });
  };

  const toggleBookmark = (courseId: string) => {
    setBookmarksState((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  const markNotificationRead = (id: string) => {
    setNotificationsState((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotificationsState((prev) => [newNotif, ...prev]);
  };

  const clearNotifications = () => {
    setNotificationsState([]);
  };

  return {
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
  };
}
