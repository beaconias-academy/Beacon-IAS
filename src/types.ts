export type AppRole = 'student' | 'mentor' | 'admin';

export type ScreenId =
  | 'home'
  | 'student-dashboard'
  | 'passport'
  | 'ai'
  | 'courses'
  | 'mentor'
  | 'assessment'
  | 'archetype-result'
  | 'career-path'
  | 'exam-eligibility'
  | 'performance-tests'
  | 'mentor-dashboard'
  | 'admin-command'
  | 'admin-analytics';

export interface PlanItem {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  category?: 'study' | 'quiz' | 'mentor' | 'revision';
}

export interface MentorTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  isUrgent?: boolean;
  completed: boolean;
  assignedBy?: string;
}

export interface AssessmentOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  traits: {
    strategic?: number;
    analytical?: number;
    action?: number;
    diplomatic?: number;
    leadership?: number;
  };
}

export interface AssessmentQuestion {
  id: number;
  question: string;
  category: string;
  options: AssessmentOption[];
}

export interface ArchetypeResult {
  id: string;
  title: string;
  subtitle: string;
  matchPercentage: number;
  description: string;
  strengths: string[];
  recommendedCareers: {
    service: string;
    role: string;
    fitPercent: number;
  }[];
  radarScores: {
    leadership: number;
    policy: number;
    execution: number;
    ethics: number;
    analysis: number;
  };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subject: string;
  articleRef?: string;
}

export interface MockTest {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  questions: QuizQuestion[];
  isLocked?: boolean;
}

export interface TestAttemptResult {
  testId: string;
  testTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  completedAt: string;
  subjectBreakdown: { [subject: string]: { correct: number; total: number } };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  quickAction?: string;
}

export interface ExamInfo {
  id: string;
  name: string;
  organization: string;
  status: 'eligible' | 'future-eligible' | 'not-eligible';
  statusText: string;
  category: 'UPSC' | 'KPSC' | 'Banking' | 'Defence';
  readinessPercent?: number;
  readinessNote?: string;
  pattern?: { stage: number; name: string; type: string }[];
  syllabus?: string[];
  notice?: string;
}

export interface MentorProfile {
  id: string;
  name: string;
  role: string;
  experience: string;
  rating: number;
  studentsCount: number;
  avatar: string;
  specialization: string[];
  bio: string;
  availableSlots: string[];
}

export interface BookedSession {
  id: string;
  mentorId: string;
  mentorName: string;
  date: string;
  timeSlot: string;
  topic: string;
  status: 'upcoming' | 'completed' | 'in-progress';
}

export interface StudentProfile {
  name: string;
  idNumber: string;
  avatarUrl: string;
  age: string;
  location: string;
  languages: string[];
  institution: string;
  degree: string;
  aggregateScore: string;
  targetExam: string;
  primaryInterest: string;
  optionalSubject: string;
  certifications: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'warning' | 'info' | 'success' | 'event';
  read: boolean;
  actionScreen?: ScreenId;
  actionLabel?: string;
}
