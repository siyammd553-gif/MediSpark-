export type PageView = 
  | 'home'
  | 'courses'
  | 'exam'
  | 'qna'
  | 'dashboard'
  | 'course-details'
  | 'course-overview'
  | 'chapter-learning'
  | 'results'
  | 'rank-predictor'
  | 'resources'
  | 'ai-tutor'
  | 'mentors'
  | 'about'
  | 'contact'
  | 'faq';

// ==========================================
// Q&A AND DOUBT CLEARANCE SYSTEM TYPES
// ==========================================

export interface QnAAnswer {
  id: string;
  authorName: string;
  authorRole: 'Mentor' | 'Doctor' | 'MediSpark AI' | 'Student';
  authorAvatar?: string;
  isVerifiedMentor?: boolean;
  content: string;
  createdAt: string;
  upvotes: number;
  bookReference?: string;
}

export interface QnAQuestion {
  id: string;
  title: string;
  description: string;
  subject: 'Botany' | 'Zoology' | 'Chemistry' | 'Physics' | 'English' | 'General Knowledge';
  batch: string; // 'HSC 29' | 'HSC 28' | 'Medical Admission'
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  createdAt: string;
  upvotes: number;
  userUpvoted?: boolean;
  tags: string[];
  bookReference?: string;
  imageAttachment?: string;
  isResolved?: boolean;
  answers: QnAAnswer[];
}

// ==========================================
// COURSE LEARNING HIERARCHY SYSTEM TYPES
// ==========================================

export interface ChapterClass {
  id: string;
  classNumber: number;
  title: string;
  teacherName: string;
  teacherRole?: string;
  duration: string; // e.g. "45 min"
  videoThumbnail: string;
  videoUrl?: string;
  isCompleted?: boolean;
  videoSimulatedTimeline?: {
    time: string;
    seconds: number;
    title: string;
    notes: string;
  }[];
  nctbHighlights?: string[];
  keyNotes?: string[];
}

export interface ChapterExam {
  id: string;
  examTitle: string;
  totalQuestions: number;
  totalMarks: number;
  durationMinutes: number;
  isCompleted?: boolean;
  bestScore?: number;
  lastAttemptScore?: number;
  lastAttemptDate?: string;
  questions: Question[];
}

export interface ChapterPDF {
  id: string;
  title: string;
  type: string;
  fileSize: string;
  pages?: number;
  pagesCount?: number;
  description?: string;
  isViewed?: boolean;
  downloadUrl?: string;
  previewUrl?: string;
  previewPages?: string[];
  contentSummary?: string[];
}

export interface FlashcardItem {
  id: string;
  category?: string;
  front: string;
  back: string;
  mnemonic?: string;
  highYield?: boolean;
}

export interface CQPracticeItem {
  id: string;
  chapter?: string;
  scenario?: string;
  stem?: string;
  diagramUrl?: string;
  questionA?: string;
  questionB?: string;
  questionC?: string;
  questionD?: string;
  questions?: {
    label: 'ক' | 'খ' | 'গ' | 'ঘ' | 'A' | 'B' | 'C' | 'D';
    mark: number;
    question: string;
    answer: string;
    keyPoints?: string[];
  }[];
}

export interface BoardQuestionItem {
  id?: string;
  year?: string;
  boardAndYear?: string;
  question: string;
  solution?: string;
  topic?: string;
}

export interface DiscussionThread {
  id: string;
  user?: string;
  author?: string;
  role?: string;
  avatar?: string;
  timestamp: string;
  message?: string;
  question?: string;
  replies?: {
    id: string;
    author: string;
    role: string;
    avatar: string;
    timestamp: string;
    content: string;
    isMentor?: boolean;
  }[];
}

export interface ChapterMoreResource {
  importantNotes: any[];
  mcqPractice: any[];
  cqPractice: any[];
  boardQuestions: any[];
  flashcards: any[];
  importantTopics: any[];
  discussions: any[];
  suggestions: any[];
  announcements: any[];
}

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle?: string;
  description: string;
  isLocked?: boolean;
  unlockCondition?: string;
  isCompleted?: boolean;
  classesCount: number;
  examsCount: number;
  pdfsCount: number;
  classes: ChapterClass[];
  exams: ChapterExam[];
  pdfs: ChapterPDF[];
  more: ChapterMoreResource;
}

export interface CourseSegment {
  id: string;
  segmentNumber: number;
  title: string;
  subtitle?: string;
  description?: string;
  isLocked?: boolean;
  unlockCondition?: string;
  chapters: Chapter[];
}

export interface EnrolledCourseData {
  courseId: string;
  title: string;
  thumbnail: string;
  description: string;
  mentorName: string;
  mentorDegree: string;
  mentorAvatar: string;
  totalSegments: number;
  totalChapters: number;
  totalClasses: number;
  totalExams: number;
  totalPdfs: number;
  completedChaptersCount: number;
  progressPercentage: number;
  segments: CourseSegment[];
}

export interface ActiveLearningPosition {
  courseId: string;
  segmentId: string;
  chapterId: string;
  classId?: string;
  tab?: 'classes' | 'exams' | 'pdfs' | 'more';
  lastUpdated?: string;
}

export interface UserLearningState {
  enrolledCourseIds: string[];
  completedClassIds: string[];
  completedExamIds: Record<string, { bestScore: number; lastScore: number; attempts: number; timestamp: string }>;
  viewedPdfIds: string[];
  lastActivePosition: ActiveLearningPosition;
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  batch: string; // e.g. "HSC 2025" | "Medical Aspirant"
  college: string;
  targetMedicalCollege: string; // e.g. "Dhaka Medical College (DMC)"
  enrolledCoursesCount: number;
  streakDays: number;
  streakActiveToday: boolean;
  weeklyStreak: { day: string; studied: boolean; hours: number }[];
  todayStudyTarget: {
    targetMinutes: number;
    completedMinutes: number;
    topics: { id: string; title: string; subject: string; done: boolean }[];
  };
  rank: number;
  totalStudents: number;
  overallScore: number;
  meritPercentile: number;
  completedClasses: number;
  totalClasses: number;
  upcomingLiveClasses: UpcomingClass[];
  recentMockResults: MockResult[];
  weakTopics: WeakTopic[];
  notifications: NotificationItem[];
}

export interface UpcomingClass {
  id: string;
  title: string;
  subject: 'Biology' | 'Chemistry' | 'Physics' | 'English & GK';
  mentorName: string;
  mentorDegree: string;
  time: string;
  date: string;
  isLiveNow?: boolean;
  joinLink?: string;
}

export interface MockResult {
  id: string;
  examTitle: string;
  subject: string;
  date: string;
  score: number;
  totalMarks: number;
  negativeMarks: number;
  accuracy: number;
  rank: number;
  totalParticipants: number;
  subjectBreakdown: {
    subject: string;
    score: number;
    total: number;
  }[];
}

export interface WeakTopic {
  id: string;
  subject: 'Biology' | 'Chemistry' | 'Physics' | 'English & GK';
  topicName: string;
  chapter: string;
  accuracy: number; // e.g. 42%
  suggestedAction: string;
  recommendedLessonId: string;
  recommendedLessonTitle: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  thumbnail?: string;
  category: 'HSC Academic' | 'Medical Admission' | 'Biology Masterclass' | 'Model Test Series' | 'Rapid Revision';
  targetBatch: string;
  level: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  totalClasses: number;
  totalExams: number;
  duration: string;
  badge?: string;
  isFree?: boolean;
  featured?: boolean;
  mentors: Mentor[];
  syllabus: {
    title: string;
    lessons: string[];
  }[];
  features: string[];
}

export interface Mentor {
  id: string;
  name: string;
  degree: string;
  college: string;
  role: string;
  specialty: string;
  experienceYears: number;
  studentsMentored: number;
  bio: string;
  imagePath: string;
  quote?: string;
  badge?: string;
  featured?: boolean;
  isEmpty?: boolean;
  titles?: string[];
}

export interface Question {
  id: string;
  subject: 'Biology' | 'Chemistry' | 'Physics' | 'English & GK';
  chapter: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  medicalAdmissionYear?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  college: string;
  target: string;
  score: number;
  streak: number;
  badge?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'live' | 'exam' | 'result' | 'announcement';
}

export interface DownloadableResource {
  id: string;
  title: string;
  subject: string;
  category: 'Lecture Sheet' | 'Mnemonic Handbook' | 'Question Bank' | 'Formula Sheet';
  fileSize: string;
  pages: number;
  downloadCount: number;
  fileType: 'PDF' | 'ZIP';
  badge?: string;
}

export interface CoursePreviewLesson {
  id: string;
  courseId: string;
  courseTitle: string;
  moduleTitle: string;
  lessonTitle: string;
  subject: 'Biology' | 'Chemistry' | 'Physics' | 'English & GK';
  instructorName: string;
  instructorTitle: string;
  instructorImage: string;
  duration: string;
  videoPoster: string;
  videoSimulatedTimeline: {
    time: string;
    seconds: number;
    title: string;
    notes: string;
  }[];
  nctbHighlights: {
    book: string;
    chapter: string;
    page: string;
    highYieldPoint: string;
    isException?: boolean;
  }[];
  mnemonics: {
    title: string;
    phrase: string;
    explanation: string;
  }[];
  quiz: Question[];
  summaryNotes: string[];
}

