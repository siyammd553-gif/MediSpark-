import React from 'react';
import { useLearning } from '../../context/LearningContext';
import { PageView } from '../../types';
import { 
  GraduationCap, 
  BookOpen, 
  Play, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  FileText, 
  Award,
  Layers,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface MyEnrolledCoursesSectionProps {
  onNavigate: (page: PageView) => void;
}

export const MyEnrolledCoursesSection: React.FC<MyEnrolledCoursesSectionProps> = ({ onNavigate }) => {
  const { 
    coursesData, 
    userState, 
    navigateToCourse, 
    navigateToChapter, 
    continueLearning, 
    getCourseProgress 
  } = useLearning();

  const enrolledCourses = (userState?.enrolledCourseIds || [])
    .map(id => coursesData[id])
    .filter(Boolean);

  const lastPos = userState.lastActivePosition;
  const lastCourse = lastPos ? coursesData[lastPos.courseId] : null;
  const lastSegment = lastCourse?.segments.find(s => s.id === lastPos.segmentId);
  const lastChapter = lastSegment?.chapters.find(c => c.id === lastPos.chapterId);
  const lastClass = lastChapter?.classes.find(c => c.id === lastPos.classId);

  const handleContinue = () => {
    const pos = continueLearning();
    onNavigate('chapter-learning');
  };

  const handleCourseClick = (courseId: string) => {
    navigateToCourse(courseId);
    onNavigate('course-overview');
  };

  const handleContinueCourse = (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation();
    const course = coursesData[courseId];
    if (!course) return;

    // Find first uncompleted or first chapter
    let targetSegId = course.segments[0]?.id;
    let targetChapId = course.segments[0]?.chapters[0]?.id;

    for (const seg of course.segments) {
      for (const chap of seg.chapters) {
        const hasUnfinishedClass = chap.classes.some(c => !userState.completedClassIds.includes(c.id));
        if (hasUnfinishedClass && !chap.isLocked) {
          targetSegId = seg.id;
          targetChapId = chap.id;
          break;
        }
      }
    }

    if (targetSegId && targetChapId) {
      navigateToChapter(courseId, targetSegId, targetChapId);
      onNavigate('chapter-learning');
    } else {
      navigateToCourse(courseId);
      onNavigate('course-overview');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Continue Learning Banner */}
      {lastCourse && lastSegment && lastChapter && (
        <div 
          id="continue-learning-hero-banner"
          className="bg-gradient-to-r from-[#1b1115] via-[#14151f] to-[#10121a] border border-[#E50914]/40 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_12px_40px_rgba(229,9,20,0.15)] relative overflow-hidden group transition-all"
        >
          {/* Subtle Ambient Red Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#E50914]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E50914]/20 border border-[#E50914]/40 text-[#FF3540] text-xs font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
                <span>Continue Learning</span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black font-heading text-white group-hover:text-[#FF3540] transition-colors">
                  {lastCourse.title}
                </h3>
                
                {/* Hierarchical Breadcrumb Position */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs sm:text-sm text-gray-300 font-medium">
                  <span className="text-[#FF3540] font-bold">
                    SEGMENT 0{lastSegment.segmentNumber}
                  </span>
                  <span className="text-gray-600">→</span>
                  <span className="text-white font-semibold">
                    Chapter 0{lastChapter.chapterNumber}: {lastChapter.title}
                  </span>
                  {lastClass && (
                    <>
                      <span className="text-gray-600">→</span>
                      <span className="text-amber-300">Class 0{lastClass.classNumber}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="continue-learning-btn"
                onClick={handleContinue}
                className="px-6 py-3 bg-[#E50914] hover:bg-[#b8060f] text-white text-sm font-extrabold rounded-xl shadow-[0_4px_20px_rgba(229,9,20,0.4)] hover:shadow-[0_6px_24px_rgba(229,9,20,0.6)] transition-all flex items-center gap-2 group/btn shrink-0"
              >
                <Play className="w-4 h-4 fill-current group-hover/btn:scale-110 transition-transform" />
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. My Enrolled Courses Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#E50914]" />
            <h2 className="text-xl sm:text-2xl font-black font-heading text-white">
              My Enrolled Courses
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Track chapterwise syllabus progress, watch classes, and take chapter model tests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-semibold">
            {enrolledCourses.length} Active Courses
          </span>
        </div>
      </div>

      {/* 3. Enrolled Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {enrolledCourses.map((course) => {
          const progress = getCourseProgress(course.courseId);

          return (
            <div
              key={course.courseId}
              id={`enrolled-course-card-${course.courseId}`}
              onClick={() => handleCourseClick(course.courseId)}
              className="bg-[#111318] border border-white/10 hover:border-[#E50914]/50 rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col justify-between cursor-pointer hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)]"
            >
              <div>
                {/* Course Thumbnail & Mentor Badge */}
                <div className="relative h-44 overflow-hidden bg-black/40">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent to-black/40" />

                  {/* Progress Pill on Top Right */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-white text-xs font-black flex items-center gap-1.5 shadow">
                    <TrendingUp className="w-3.5 h-3.5 text-[#FF3540]" />
                    <span>{progress.percentage}% Completed</span>
                  </div>

                  {/* Mentor Info on Bottom Left of Image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                    <img
                      src={course.mentorAvatar}
                      alt={course.mentorName}
                      className="w-7 h-7 rounded-full object-cover border border-[#E50914]"
                    />
                    <div className="truncate">
                      <span className="text-[11px] font-bold text-white block truncate drop-shadow-md">
                        {course.mentorName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-white group-hover:text-[#FF3540] transition-colors line-clamp-1">
                    {course.title}
                  </h3>

                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Stats Counters */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/5 text-center">
                    <div className="bg-white/5 rounded-lg p-1.5">
                      <span className="text-[10px] text-gray-400 block font-medium">Segments</span>
                      <span className="text-xs font-bold text-white">{course.totalSegments}</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-1.5">
                      <span className="text-[10px] text-gray-400 block font-medium">Classes</span>
                      <span className="text-xs font-bold text-white">{course.totalClasses}</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-1.5">
                      <span className="text-[10px] text-gray-400 block font-medium">Exams</span>
                      <span className="text-xs font-bold text-white">{course.totalExams}</span>
                    </div>
                  </div>

                  {/* Progress Bar & Chapter Counts */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-medium">
                        <strong className="text-white">{progress.completedChapters}</strong> / {progress.totalChapters} Chapters Completed
                      </span>
                      <span className="text-[#FF3540] font-extrabold">
                        {progress.percentage}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-[#E50914] to-[#FF3540] rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(5, progress.percentage)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={(e) => handleContinueCourse(e, course.courseId)}
                  className="w-full py-2.5 px-4 bg-[#E50914]/15 hover:bg-[#E50914] text-[#FF3540] hover:text-white border border-[#E50914]/30 hover:border-transparent text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 group/act shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Continue Learning</span>
                  <ChevronRight className="w-4 h-4 group-hover/act:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
