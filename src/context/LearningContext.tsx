import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  EnrolledCourseData, 
  CourseSegment, 
  Chapter, 
  ChapterClass, 
  ChapterExam, 
  ChapterPDF, 
  UserLearningState, 
  ActiveLearningPosition 
} from '../types';
import { ENROLLED_COURSES_DATA, INITIAL_USER_LEARNING_STATE } from '../data/learningData';

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

  // Computed Progress Helpers
  getCourseProgress: (courseId: string) => { percentage: number; completedChapters: number; totalChapters: number; completedClasses: number; totalClasses: number };
  getSegmentProgress: (courseId: string, segmentId: string) => { percentage: number; completedChapters: number; totalChapters: number };
  getChapterProgress: (courseId: string, segmentId: string, chapterId: string) => { percentage: number; isCompleted: boolean; completedClasses: number; totalClasses: number };
  isChapterUnlocked: (courseId: string, segmentId: string, chapterId: string) => { unlocked: boolean; reason?: string };
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'medispark_student_learning_state_v1';

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coursesData, setCoursesData] = useState<Record<string, EnrolledCourseData>>(ENROLLED_COURSES_DATA);
  const [userState, setUserState] = useState<UserLearningState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved learning state', e);
    }
    return INITIAL_USER_LEARNING_STATE;
  });

  const [activeCourseId, setActiveCourseId] = useState<string>('hsc-28-complete-biology');
  const [activeSegmentId, setActiveSegmentId] = useState<string>('seg-hsc28-01');
  const [activeChapterId, setActiveChapterId] = useState<string>('chap-hsc28-01');
  const [activeTab, setActiveTab] = useState<'classes' | 'exams' | 'pdfs' | 'more'>('classes');
  
  const [activePlayingClass, setActivePlayingClass] = useState<ChapterClass | null>(null);
  const [activeExam, setActiveExam] = useState<ChapterExam | null>(null);
  const [activePdf, setActivePdf] = useState<ChapterPDF | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userState));
    } catch (e) {
      console.error('Error saving learning state', e);
    }
  }, [userState]);

  // Navigate directly to a chapter
  const navigateToChapter = (
    courseId: string, 
    segmentId: string, 
    chapterId: string, 
    tab: 'classes' | 'exams' | 'pdfs' | 'more' = 'classes'
  ) => {
    setActiveCourseId(courseId);
    setActiveSegmentId(segmentId);
    setActiveChapterId(chapterId);
    setActiveTab(tab);

    setUserState(prev => ({
      ...prev,
      lastActivePosition: {
        courseId,
        segmentId,
        chapterId,
        tab,
        lastUpdated: 'Just now'
      }
    }));
  };

  const navigateToCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    const course = coursesData[courseId];
    if (course && course.segments.length > 0) {
      const firstSeg = course.segments[0];
      setActiveSegmentId(firstSeg.id);
      if (firstSeg.chapters.length > 0) {
        setActiveChapterId(firstSeg.chapters[0].id);
      }
    }
  };

  const continueLearning = () => {
    const pos = userState.lastActivePosition || INITIAL_USER_LEARNING_STATE.lastActivePosition;
    setActiveCourseId(pos.courseId);
    setActiveSegmentId(pos.segmentId);
    setActiveChapterId(pos.chapterId);
    setActiveTab(pos.tab || 'classes');
    return pos;
  };

  const markClassCompleted = (classId: string) => {
    setUserState(prev => {
      if (prev.completedClassIds.includes(classId)) return prev;
      return {
        ...prev,
        completedClassIds: [...prev.completedClassIds, classId]
      };
    });
  };

  const recordExamSubmission = (examId: string, score: number, totalMarks: number) => {
    setUserState(prev => {
      const current = prev.completedExamIds[examId];
      const attempts = (current?.attempts || 0) + 1;
      const bestScore = Math.max(current?.bestScore || 0, score);
      return {
        ...prev,
        completedExamIds: {
          ...prev.completedExamIds,
          [examId]: {
            bestScore,
            lastScore: score,
            attempts,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
          }
        }
      };
    });
  };

  const markPdfViewed = (pdfId: string) => {
    setUserState(prev => {
      if (prev.viewedPdfIds.includes(pdfId)) return prev;
      return {
        ...prev,
        viewedPdfIds: [...prev.viewedPdfIds, pdfId]
      };
    });
  };

  const enrollInCourse = (courseId: string) => {
    setUserState(prev => {
      if (prev.enrolledCourseIds.includes(courseId)) return prev;
      return {
        ...prev,
        enrolledCourseIds: [...prev.enrolledCourseIds, courseId]
      };
    });
  };

  // Check if chapter is completed
  const isChapterCompletedCheck = (chapter: Chapter) => {
    const classes = chapter.classes || [];
    if (classes.length === 0) return true;
    const completedCount = classes.filter(c => userState.completedClassIds.includes(c.id)).length;
    return completedCount === classes.length;
  };

  // Chapter Progress
  const getChapterProgress = (courseId: string, segmentId: string, chapterId: string) => {
    const course = coursesData[courseId];
    if (!course) return { percentage: 0, isCompleted: false, completedClasses: 0, totalClasses: 0 };
    const seg = course.segments.find(s => s.id === segmentId);
    if (!seg) return { percentage: 0, isCompleted: false, completedClasses: 0, totalClasses: 0 };
    const chap = seg.chapters.find(c => c.id === chapterId);
    if (!chap) return { percentage: 0, isCompleted: false, completedClasses: 0, totalClasses: 0 };

    const totalClasses = chap.classes.length;
    const completedClasses = chap.classes.filter(c => userState.completedClassIds.includes(c.id)).length;
    
    // Exam bonus
    const totalExams = chap.exams.length;
    const completedExams = chap.exams.filter(e => !!userState.completedExamIds[e.id]).length;

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
    const seg = course.segments.find(s => s.id === segmentId);
    if (!seg) return { percentage: 0, completedChapters: 0, totalChapters: 0 };

    const totalChapters = seg.chapters.length;
    let completedChapters = 0;
    let totalProgressSum = 0;

    seg.chapters.forEach(chap => {
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

    course.segments.forEach(seg => {
      seg.chapters.forEach(chap => {
        totalChapters++;
        totalClasses += chap.classes.length;
        const chapCompletedClasses = chap.classes.filter(c => userState.completedClassIds.includes(c.id)).length;
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
    const segIndex = course.segments.findIndex(s => s.id === segmentId);
    if (segIndex === -1) return { unlocked: true };
    const seg = course.segments[segIndex];
    const chapIndex = seg.chapters.findIndex(c => c.id === chapterId);
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
          reason: chap.unlockCondition || `Complete Chapter 0${prevChap.chapterNumber} (${prevChap.title}) to unlock this chapter.` 
        };
      }
    } else if (segIndex > 0) {
      const prevSeg = course.segments[segIndex - 1];
      const prevSegProg = getSegmentProgress(courseId, prevSeg.id);
      if (prevSegProg.completedChapters < prevSeg.totalChapters) {
        return {
          unlocked: false,
          reason: chap.unlockCondition || `Complete Segment 0${prevSeg.segmentNumber} (${prevSeg.title}) to unlock this chapter.`
        };
      }
    }

    return { unlocked: true };
  };

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
        setActivePlayingClass,
        setActiveExam,
        setActivePdf,
        markClassCompleted,
        recordExamSubmission,
        markPdfViewed,
        enrollInCourse,
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
