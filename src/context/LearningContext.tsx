import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { 
  EnrolledCourseData, 
  Chapter, 
  ChapterClass, 
  ChapterExam, 
  ChapterPDF, 
  UserLearningState, 
  ActiveLearningPosition,
  RecentlyViewedItem,
  MockResult
} from '../types';
import { ENROLLED_COURSES_DATA } from '../data/learningData';
import { useAuth } from './AuthContext';

interface LearningContextType {
  userState: UserLearningState;
  coursesData: Record<string, EnrolledCourseData>;
  activeCourseId: string;
  activeSegmentId: string;
  activeChapterId: string;
  activeTab: 'classes' | 'exams' | 'pdfs' | 'more';
  activePlayingClass: ChapterClass | null;
  activeExam: ChapterExam | null;
  activePdf: ChapterPDF | null;
  
  // Navigation setters
  setActiveCourseId: (courseId: string) => void;
  setActiveSegmentId: (segmentId: string) => void;
  setActiveChapterId: (chapterId: string) => void;
  setActiveTab: (tab: 'classes' | 'exams' | 'pdfs' | 'more') => void;
  navigateToChapter: (courseId: string, segmentId: string, chapterId: string, tab?: 'classes' | 'exams' | 'pdfs' | 'more') => void;
  navigateToCourse: (courseId: string) => void;
  continueLearning: () => { courseId: string; segmentId: string; chapterId: string; classId?: string };
  
  // Modals & Active Viewers
  setActivePlayingClass: (c: ChapterClass | null) => void;
  setActiveExam: (e: ChapterExam | null) => void;
  setActivePdf: (p: ChapterPDF | null) => void;

  // Actions & Progress
  markClassCompleted: (classId: string) => void;
  recordExamSubmission: (examId: string, score: number, totalMarks: number) => void;
  markPdfViewed: (pdfId: string) => void;
  enrollInCourse: (courseId: string) => void;
  isCourseEnrolled: (courseId: string) => boolean;

  // Computed Progress Helpers
  getCourseProgress: (courseId: string) => { percentage: number; completedChapters: number; totalChapters: number; completedClasses: number; totalClasses: number };
  getSegmentProgress: (courseId: string, segmentId: string) => { percentage: number; completedChapters: number; totalChapters: number };
  getChapterProgress: (courseId: string, segmentId: string, chapterId: string) => { percentage: number; isCompleted: boolean; completedClasses: number; totalClasses: number };
  isChapterUnlocked: (courseId: string, segmentId: string, chapterId: string) => { unlocked: boolean; reason?: string };
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

const EMPTY_POSITION: ActiveLearningPosition = { courseId: '', segmentId: '', chapterId: '' };

const RECENTLY_VIEWED_MAX = 20;

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { accountId, dashboard, updateDashboard } = useAuth();

  const [activeCourseId, setActiveCourseId] = useState<string>('hsc-28-complete-biology');
  const [activeSegmentId, setActiveSegmentId] = useState<string>('seg-hsc28-01');
  const [activeChapterId, setActiveChapterId] = useState<string>('chap-hsc28-01');
  const [activeTab, setActiveTab] = useState<'classes' | 'exams' | 'pdfs' | 'more'>('classes');

  const [activePlayingClass, setActivePlayingClass] = useState<ChapterClass | null>(null);
  const [activeExam, setActiveExam] = useState<ChapterExam | null>(null);
  const [activePdf, setActivePdf] = useState<ChapterPDF | null>(null);

  // The authenticated student's learning state is derived from their own
  // server-backed dashboard record (keyed by Account ID). No hardcoded seeding.
  const userState: UserLearningState = {
    enrolledCourseIds: dashboard?.enrolledCourseIds ?? [],
    completedClassIds: dashboard?.completedClassIds ?? [],
    completedExamIds: dashboard?.completedExamIds ?? {},
    viewedPdfIds: dashboard?.viewedPdfIds ?? [],
    lastActivePosition: dashboard?.lastActivePosition ?? EMPTY_POSITION,
  };

  // Only the courses this authenticated student has actually enrolled in are
  // exposed. This keeps every student's course/class/material content isolated
  // to their own account — a course not in their enrollment is never reachable.
  const coursesData: Record<string, EnrolledCourseData> = useMemo(() => {
    const enrolled: Record<string, EnrolledCourseData> = {};
    for (const courseId of userState.enrolledCourseIds) {
      const course = ENROLLED_COURSES_DATA[courseId];
      if (course) enrolled[courseId] = course;
    }
    return enrolled;
  }, [userState.enrolledCourseIds]);

  const isCourseEnrolled = useCallback(
    (courseId: string) => userState.enrolledCourseIds.includes(courseId),
    [userState.enrolledCourseIds]
  );

  const trackRecentlyViewed = useCallback(
    (item: Omit<RecentlyViewedItem, 'viewedAt'>) => {
      if (!accountId) return;
      const current = dashboard?.recentlyViewed ?? [];
      const entry: RecentlyViewedItem = { ...item, viewedAt: new Date().toISOString() };
      const deduped = current.filter((r) => r.id !== entry.id);
      updateDashboard({
        recentlyViewed: [entry, ...deduped].slice(0, RECENTLY_VIEWED_MAX),
      });
    },
    [accountId, dashboard?.recentlyViewed, updateDashboard]
  );

  // Navigate directly to a chapter
  const navigateToChapter = useCallback(
    (
      courseId: string,
      segmentId: string,
      chapterId: string,
      tab: 'classes' | 'exams' | 'pdfs' | 'more' = 'classes'
    ) => {
      setActiveCourseId(courseId);
      setActiveSegmentId(segmentId);
      setActiveChapterId(chapterId);
      setActiveTab(tab);

      const lastActivePosition: ActiveLearningPosition = {
        courseId,
        segmentId,
        chapterId,
        tab,
        lastUpdated: 'Just now',
      };
      if (accountId) {
        updateDashboard({ lastActivePosition });
        trackRecentlyViewed({ id: chapterId, type: 'chapter', courseId, chapterId, title: chapterId });
      }
    },
    [accountId, updateDashboard, trackRecentlyViewed]
  );

  const navigateToCourse = useCallback(
    (courseId: string) => {
      setActiveCourseId(courseId);
      const course = coursesData[courseId];
      if (course && course.segments.length > 0) {
        const firstSeg = course.segments[0];
        setActiveSegmentId(firstSeg.id);
        if (firstSeg.chapters.length > 0) {
          const firstChap = firstSeg.chapters[0];
          setActiveChapterId(firstChap.id);
          if (accountId) {
            trackRecentlyViewed({
              id: firstChap.id,
              type: 'chapter',
              courseId,
              chapterId: firstChap.id,
              title: firstChap.title,
            });
          }
        }
      }
    },
    [accountId, coursesData, trackRecentlyViewed]
  );

  const continueLearning = () => {
    let pos = dashboard?.lastActivePosition || EMPTY_POSITION;
    const enrolledIds = userState.enrolledCourseIds;
    if (!pos.courseId || !coursesData[pos.courseId]) {
      const firstId = enrolledIds[0];
      const firstCourse = firstId ? coursesData[firstId] : undefined;
      if (firstCourse) {
        const firstSeg = firstCourse.segments[0];
        const firstChap = firstSeg?.chapters[0];
        pos = {
          courseId: firstId,
          segmentId: firstSeg?.id || '',
          chapterId: firstChap?.id || '',
          classId: firstChap?.classes[0]?.id,
          tab: 'classes' as const,
        };
      }
    }
    setActiveCourseId(pos.courseId);
    setActiveSegmentId(pos.segmentId);
    setActiveChapterId(pos.chapterId);
    setActiveTab(pos.tab || 'classes');
    return pos;
  };

  const markClassCompleted = useCallback(
    (classId: string) => {
      if (!accountId) return;
      const current = dashboard?.completedClassIds ?? [];
      if (current.includes(classId)) return;
      updateDashboard({ completedClassIds: [...current, classId] });
    },
    [accountId, dashboard?.completedClassIds, updateDashboard]
  );

  const recordExamSubmission = useCallback(
    (examId: string, score: number, totalMarks: number) => {
      if (!accountId) return;
      const current = dashboard?.completedExamIds ?? {};
      const prev = current[examId];
      const next: UserLearningState['completedExamIds'] = {
        ...current,
        [examId]: {
          bestScore: Math.max(prev?.bestScore || 0, score),
          lastScore: score,
          attempts: (prev?.attempts || 0) + 1,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        },
      };
      updateDashboard({ completedExamIds: next });

      // Record a per-student exam result on the dashboard (deduped by exam id).
      let examTitle = 'Chapter Model Test';
      let courseTitle = 'Chapter Exam';
      for (const course of Object.values(coursesData)) {
        for (const seg of course.segments) {
          for (const chap of seg.chapters) {
            const exam = chap.exams.find((e) => e.id === examId);
            if (exam) {
              examTitle = exam.examTitle;
              courseTitle = course.title;
              break;
            }
          }
        }
      }
      const existingResults = dashboard?.examResults ?? [];
      const accuracy = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
      const nextResults = existingResults.filter((r) => r.id !== examId);
      const newResult: MockResult = {
        id: examId,
        examTitle,
        subject: courseTitle,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        score,
        totalMarks,
        negativeMarks: 0,
        accuracy,
        rank: 0,
        totalParticipants: 0,
        subjectBreakdown: [],
      };
      updateDashboard({ examResults: [newResult, ...nextResults] });
    },
    [accountId, dashboard?.completedExamIds, dashboard?.examResults, coursesData, updateDashboard]
  );

  const markPdfViewed = useCallback(
    (pdfId: string) => {
      if (!accountId) return;
      const current = dashboard?.viewedPdfIds ?? [];
      if (current.includes(pdfId)) return;
      updateDashboard({ viewedPdfIds: [...current, pdfId] });
    },
    [accountId, dashboard?.viewedPdfIds, updateDashboard]
  );

  const enrollInCourse = useCallback(
    (courseId: string) => {
      if (!accountId) return;
      const current = dashboard?.enrolledCourseIds ?? [];
      if (current.includes(courseId)) return;
      updateDashboard({ enrolledCourseIds: [...current, courseId] });
    },
    [accountId, dashboard?.enrolledCourseIds, updateDashboard]
  );

  // Check if chapter is completed
  const isChapterCompletedCheck = (chapter: Chapter) => {
    const classes = chapter.classes || [];
    if (classes.length === 0) return true;
    const completedCount = classes.filter((c) => userState.completedClassIds.includes(c.id)).length;
    return completedCount === classes.length;
  };

  // Chapter Progress
  const getChapterProgress = (courseId: string, segmentId: string, chapterId: string) => {
    const course = coursesData[courseId];
    if (!course) return { percentage: 0, isCompleted: false, completedClasses: 0, totalClasses: 0 };
    const seg = course.segments.find((s) => s.id === segmentId);
    if (!seg) return { percentage: 0, isCompleted: false, completedClasses: 0, totalClasses: 0 };
    const chap = seg.chapters.find((c) => c.id === chapterId);
    if (!chap) return { percentage: 0, isCompleted: false, completedClasses: 0, totalClasses: 0 };

    const totalClasses = chap.classes.length;
    const completedClasses = chap.classes.filter((c) => userState.completedClassIds.includes(c.id)).length;

    // Exam bonus
    const totalExams = chap.exams.length;
    const completedExams = chap.exams.filter((e) => !!userState.completedExamIds[e.id]).length;

    let percentage = 0;
    if (totalClasses > 0) {
      percentage = Math.round((completedClasses / totalClasses) * 100);
    } else {
      percentage = 100;
    }

    const isCompleted = totalClasses > 0 ? completedClasses === totalClasses : true;

    return { percentage, isCompleted, completedClasses, totalClasses };
  };

  // Segment Progress
  const getSegmentProgress = (courseId: string, segmentId: string) => {
    const course = coursesData[courseId];
    if (!course) return { percentage: 0, completedChapters: 0, totalChapters: 0 };
    const seg = course.segments.find((s) => s.id === segmentId);
    if (!seg) return { percentage: 0, completedChapters: 0, totalChapters: 0 };

    const totalChapters = seg.chapters.length;
    let completedChapters = 0;
    let totalProgressSum = 0;

    seg.chapters.forEach((chap) => {
      const prog = getChapterProgress(courseId, segmentId, chap.id);
      totalProgressSum += prog.percentage;
      if (prog.isCompleted) {
        completedChapters++;
      }
    });

    const percentage = totalChapters > 0 ? Math.round(totalProgressSum / totalChapters) : 0;
    return { percentage, completedChapters, totalChapters };
  };

  // Course Progress
  const getCourseProgress = (courseId: string) => {
    const course = coursesData[courseId];
    if (!course) return { percentage: 0, completedChapters: 0, totalChapters: 0, completedClasses: 0, totalClasses: 0 };

    let totalChapters = 0;
    let completedChapters = 0;
    let totalClasses = 0;
    let completedClasses = 0;
    let totalProgressSum = 0;

    course.segments.forEach((seg) => {
      seg.chapters.forEach((chap) => {
        totalChapters++;
        totalClasses += chap.classes.length;
        const chapCompletedClasses = chap.classes.filter((c) => userState.completedClassIds.includes(c.id)).length;
        completedClasses += chapCompletedClasses;

        const prog = getChapterProgress(courseId, seg.id, chap.id);
        totalProgressSum += prog.percentage;
        if (prog.isCompleted) {
          completedChapters++;
        }
      });
    });

    const percentage = totalChapters > 0 ? Math.round(totalProgressSum / totalChapters) : 0;
    return { percentage, completedChapters, totalChapters, completedClasses, totalClasses };
  };

  // Lock logic
  const isChapterUnlocked = (courseId: string, segmentId: string, chapterId: string): { unlocked: boolean; reason?: string } => {
    const course = coursesData[courseId];
    if (!course) return { unlocked: true };
    const segIndex = course.segments.findIndex((s) => s.id === segmentId);
    if (segIndex === -1) return { unlocked: true };
    const seg = course.segments[segIndex];
    const chapIndex = seg.chapters.findIndex((c) => c.id === chapterId);
    if (chapIndex === -1) return { unlocked: true };
    const chap = seg.chapters[chapIndex];

    if (!chap.isLocked) return { unlocked: true };

    // If explicit unlock condition, check if previous chapter is completed
    if (chapIndex > 0) {
      const prevChap = seg.chapters[chapIndex - 1];
      const prevProg = getChapterProgress(courseId, segmentId, prevChap.id);
      if (!prevProg.isCompleted) {
        return {
          unlocked: false,
          reason: chap.unlockCondition || `Complete Chapter 0${prevChap.chapterNumber} (${prevChap.title}) to unlock this chapter.`,
        };
      }
    } else if (segIndex > 0) {
      const prevSeg = course.segments[segIndex - 1];
      const prevSegProg = getSegmentProgress(courseId, prevSeg.id);
      if (prevSegProg.completedChapters < prevSeg.chapters.length) {
        return {
          unlocked: false,
          reason: chap.unlockCondition || `Complete Segment 0${prevSeg.segmentNumber} (${prevSeg.title}) to unlock this chapter.`,
        };
      }
    }

    return { unlocked: true };
  };

  const handleSetActivePlayingClass = useCallback(
    (c: ChapterClass | null) => {
      setActivePlayingClass(c);
      if (c && accountId) {
        const course = coursesData[activeCourseId];
        const title = course ? `${course.title} — ${c.title}` : c.title;
        trackRecentlyViewed({ id: c.id, type: 'class', courseId: activeCourseId, chapterId: activeChapterId, classId: c.id, title });
      }
    },
    [accountId, coursesData, activeCourseId, activeChapterId, trackRecentlyViewed]
  );

  return (
    <LearningContext.Provider
      value={{
        userState,
        coursesData,
        activeCourseId,
        activeSegmentId,
        activeChapterId,
        activeTab,
        activePlayingClass,
        activeExam,
        activePdf,
        setActiveCourseId,
        setActiveSegmentId,
        setActiveChapterId,
        setActiveTab,
        navigateToChapter,
        navigateToCourse,
        continueLearning,
        setActivePlayingClass: handleSetActivePlayingClass,
        setActiveExam,
        setActivePdf,
        markClassCompleted,
        recordExamSubmission,
        markPdfViewed,
        enrollInCourse,
        isCourseEnrolled,
        getCourseProgress,
        getSegmentProgress,
        getChapterProgress,
        isChapterUnlocked
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};