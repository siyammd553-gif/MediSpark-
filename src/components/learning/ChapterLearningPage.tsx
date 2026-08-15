import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import { PageView, ChapterClass, ChapterExam, ChapterPDF } from '../../types';
import { ChapterSidebarNav } from './ChapterSidebarNav';
import { ClassVideoPlayerModal } from './ClassVideoPlayerModal';
import { ChapterExamSimulatorModal } from './ChapterExamSimulatorModal';
import { ChapterPdfReaderModal } from './ChapterPdfReaderModal';
import { ChapterMoreTab } from './ChapterMoreTab';
import { CourseAccessDenied } from './CourseAccessDenied';
import { 
  ArrowLeft, 
  Menu, 
  Video, 
  FileText, 
  Award, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Clock, 
  Download, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  Layers,
  HelpCircle,
  Eye
} from 'lucide-react';

interface ChapterLearningPageProps {
  onNavigate: (page: PageView) => void;
  isAuthenticated?: boolean;
  onOpenAuth?: () => void;
}

export const ChapterLearningPage: React.FC<ChapterLearningPageProps> = ({ onNavigate, isAuthenticated, onOpenAuth }) => {
  const { 
    coursesData, 
    activeCourseId, 
    activeSegmentId, 
    activeChapterId, 
    activeTab, 
    setActiveTab, 
    navigateToChapter, 
    getChapterProgress,
    userState 
  } = useLearning();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [selectedPlayingClass, setSelectedPlayingClass] = useState<ChapterClass | null>(null);
  const [selectedExam, setSelectedExam] = useState<ChapterExam | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<ChapterPDF | null>(null);

  const course = coursesData[activeCourseId];
  const segment = course?.segments.find(s => s.id === activeSegmentId) || course?.segments[0];
  const chapter = segment?.chapters.find(c => c.id === activeChapterId) || segment?.chapters[0];

  if (!course || !segment || !chapter) {
    // Distinguish a missing/unenrolled course from a bad chapter position.
    if (!course) {
      return <CourseAccessDenied onNavigate={onNavigate} />;
    }
    return (
      <div className="min-h-screen bg-[#090909] text-white flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold">Chapter not found</h2>
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="px-5 py-2.5 bg-[#E50914] text-white rounded-xl text-xs font-bold"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const chapProgress = getChapterProgress(course.courseId, segment.id, chapter.id);

  // Find previous and next chapter for rapid navigation
  let allChaptersInCourse: { segId: string; chap: typeof chapter }[] = [];
  course.segments.forEach(s => {
    s.chapters.forEach(c => {
      allChaptersInCourse.push({ segId: s.id, chap: c });
    });
  });

  const currentIndex = allChaptersInCourse.findIndex(item => item.chap.id === chapter.id);
  const prevChapterItem = currentIndex > 0 ? allChaptersInCourse[currentIndex - 1] : null;
  const nextChapterItem = currentIndex < allChaptersInCourse.length - 1 ? allChaptersInCourse[currentIndex + 1] : null;

  return (
    <div id="medispark-chapter-learning-screen" className="min-h-screen bg-[#090909] text-white flex flex-col">
      
      {/* Top Breadcrumbs & Mobile Sidebar Toggle Bar */}
      <div className="bg-[#10121a] border-b border-white/10 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Breadcrumb path */}
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => onNavigate('dashboard')}
              className="hover:text-white transition-colors shrink-0"
            >
              Dashboard
            </button>
            <span>/</span>
            <button
              onClick={() => onNavigate('dashboard')}
              className="hover:text-white transition-colors shrink-0"
            >
              My Courses
            </button>
            <span>/</span>
            <button
              onClick={() => onNavigate('course-overview')}
              className="hover:text-white transition-colors shrink-0 truncate max-w-[120px] sm:max-w-none"
            >
              {course.title}
            </button>
            <span>/</span>
            <span className="text-gray-300 shrink-0 font-semibold">
              SEGMENT 0{segment.segmentNumber}
            </span>
            <span>/</span>
            <span className="text-[#FF3540] font-bold shrink-0 truncate max-w-[150px] sm:max-w-none">
              Ch {chapter.chapterNumber}: {chapter.title}
            </span>
          </div>

          {/* Mobile Drawer Trigger */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-bold text-white flex items-center gap-1.5 shrink-0"
          >
            <Menu className="w-4 h-4 text-[#FF3540]" />
            <span>Syllabus</span>
          </button>

        </div>
      </div>

      {/* Main Layout: Left Sidebar + Right Learning Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex gap-6 sm:gap-8">
        
        {/* Hierarchical Sidebar Navigation */}
        <ChapterSidebarNav
          onNavigate={onNavigate}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Right Main Learning Section */}
        <main className="flex-1 min-w-0 space-y-6">
          
          {/* Chapter Header Card */}
          <div 
            id="chapter-main-header-banner"
            className="bg-[#111318] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#E50914] text-white text-[10px] font-black uppercase tracking-wider">
                    Chapter 0{chapter.chapterNumber}
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">
                    Segment 0{segment.segmentNumber}: {segment.title}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading text-white">
                  {chapter.title}
                </h1>

                {chapter.subtitle && (
                  <p className="text-xs sm:text-sm text-gray-300 font-medium">
                    {chapter.subtitle}
                  </p>
                )}
              </div>

              {/* Status Pill & Navigation Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {chapProgress.isCompleted ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E50914]/10 border border-[#E50914]/30 text-[#FF3540] text-xs font-bold">
                    <span>{chapProgress.percentage}% Done</span>
                  </div>
                )}

                {/* Prev/Next Chapter Quick Switchers */}
                <div className="flex items-center gap-1">
                  <button
                    disabled={!prevChapterItem}
                    onClick={() => {
                      if (prevChapterItem) {
                        navigateToChapter(course.courseId, prevChapterItem.segId, prevChapterItem.chap.id);
                      }
                    }}
                    title="Previous Chapter"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-gray-300 hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={!nextChapterItem}
                    onClick={() => {
                      if (nextChapterItem) {
                        navigateToChapter(course.courseId, nextChapterItem.segId, nextChapterItem.chap.id);
                      }
                    }}
                    title="Next Chapter"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-gray-300 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-3xl">
              {chapter.description}
            </p>

            {/* 4 Core Learning Navigation Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5">
              {[
                { key: 'classes', label: '1) Class (ক্লাস)', count: chapter.classes.length, icon: Video },
                { key: 'exams', label: '2) Exam (পরীক্ষা)', count: chapter.exams.length, icon: Award },
                { key: 'pdfs', label: '3) Materials (শিট)', count: chapter.pdfs.length, icon: FileText },
                { key: 'more', label: '4) More (রিসোর্স)', count: '+8 Tools', icon: Sparkles }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    id={`chapter-tab-${tab.key}`}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                      isActive
                        ? 'bg-[#E50914] border-[#E50914] text-white shadow-lg shadow-[#E50914]/25 font-bold'
                        : 'bg-[#141620] border-white/5 hover:border-white/20 text-gray-300 hover:text-white font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-xs truncate">{tab.label}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      isActive ? 'bg-black/30 text-white' : 'bg-white/5 text-gray-400'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* TAB 1: CLASSES (VIDEO LECTURES) */}
          {activeTab === 'classes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#E50914]" />
                    <span>Video Lectures & Interactive Classes</span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    Watch textbook line-by-line masterclasses with interactive jump timestamps.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chapter.classes.map((cls) => {
                  const isDone = userState.completedClassIds.includes(cls.id);

                  return (
                    <div
                      key={cls.id}
                      id={`class-card-${cls.id}`}
                      className="bg-[#111318] border border-white/10 hover:border-[#E50914]/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group hover:shadow-xl"
                    >
                      <div>
                        {/* Video Thumbnail */}
                        <div 
                          onClick={() => setSelectedPlayingClass(cls)}
                          className="relative aspect-video bg-black/50 overflow-hidden cursor-pointer"
                        >
                          <img
                            src={cls.videoThumbnail}
                            alt={cls.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent to-black/40" />

                          {/* Play Center Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-[#E50914]/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            </div>
                          </div>

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-black uppercase">
                            Lecture 0{cls.classNumber}
                          </div>

                          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-white text-[11px] font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#FF3540]" />
                            <span>{cls.duration}</span>
                          </div>
                        </div>

                        {/* Card Info */}
                        <div className="p-4 sm:p-5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#FF3540]">
                              {cls.teacherName}
                            </span>
                            {isDone && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Done
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-bold text-white group-hover:text-[#FF3540] transition-colors line-clamp-2">
                            {cls.title}
                          </h4>
                        </div>
                      </div>

                      {/* Card Button */}
                      <div className="p-4 sm:p-5 pt-0">
                        <button
                          onClick={() => setSelectedPlayingClass(cls)}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            isDone
                              ? 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5'
                              : 'bg-[#E50914] hover:bg-[#b8060f] text-white shadow-md'
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{isDone ? 'Rewatch Class' : 'Start Lecture'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: EXAMS (MODEL TESTS) */}
          {activeTab === 'exams' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Chapter Model Tests & DGHS Speed Simulator</span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    Timed MCQ exams with negative marking, instant answers & doctor's solutions.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chapter.exams.map((exam) => {
                  const examRecord = userState.completedExamIds[exam.id];
                  const hasAttempted = !!examRecord;

                  return (
                    <div
                      key={exam.id}
                      id={`exam-card-${exam.id}`}
                      className="p-5 sm:p-6 rounded-2xl bg-[#111318] border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                            Timed Exam
                          </span>

                          {hasAttempted && (
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Best: {examRecord.bestScore} / {exam.totalMarks}
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                          {exam.examTitle}
                        </h4>

                        <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/5 text-center text-xs">
                          <div>
                            <span className="text-gray-400 block text-[10px]">Questions</span>
                            <strong className="text-white">{exam.totalQuestions}</strong>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[10px]">Marks</span>
                            <strong className="text-white">{exam.totalMarks}</strong>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[10px]">Duration</span>
                            <strong className="text-white">{exam.durationMinutes} min</strong>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (!isAuthenticated) {
                            onOpenAuth?.();
                            return;
                          }
                          setSelectedExam(exam);
                        }}
                        className="w-full py-2.5 px-4 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/40 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>{hasAttempted ? 'Retake Exam / Review' : 'Start Model Test'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: PDFS (LECTURE SHEETS & NOTES) */}
          {activeTab === 'pdfs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#E50914]" />
                    <span>Lecture Sheets, Handwritten Notes & Question Banks</span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    High-resolution digital handouts and 10-year MBBS/BDS solves.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chapter.pdfs.map((pdf) => {
                  const isViewed = userState.viewedPdfIds.includes(pdf.id);

                  return (
                    <div
                      key={pdf.id}
                      id={`pdf-card-${pdf.id}`}
                      className="p-5 rounded-2xl bg-[#111318] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-3 group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px] font-bold">
                            {pdf.type}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {pdf.pages} Pages • {pdf.fileSize}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white group-hover:text-[#FF3540] transition-colors line-clamp-1">
                          {pdf.title}
                        </h4>

                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                          {pdf.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => setSelectedPdf(pdf)}
                          className="flex-1 py-2 px-3 bg-[#E50914]/15 hover:bg-[#E50914] text-[#FF3540] hover:text-white border border-[#E50914]/30 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Read Online</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: MORE (NOTES, FLASHCARDS, CQ, MCQ, FORUM, SUGGESTIONS) */}
          {activeTab === 'more' && (
            <ChapterMoreTab chapter={chapter} />
          )}

        </main>

      </div>

      {/* MODAL 1: In-platform Video Player */}
      {selectedPlayingClass && (
        <ClassVideoPlayerModal
          chapterClass={selectedPlayingClass}
          chapterTitle={chapter.title}
          courseId={course.courseId}
          segmentId={segment.id}
          chapterId={chapter.id}
          onClose={() => setSelectedPlayingClass(null)}
        />
      )}

      {/* MODAL 2: In-platform Exam Simulator */}
      {selectedExam && (
        <ChapterExamSimulatorModal
          exam={selectedExam}
          chapterTitle={chapter.title}
          courseId={course.courseId}
          chapterId={chapter.id}
          negativeMarking={course.negativeMarking ?? 0}
          onClose={() => setSelectedExam(null)}
        />
      )}

      {/* MODAL 3: In-platform PDF Reader */}
      {selectedPdf && (
        <ChapterPdfReaderModal
          pdf={selectedPdf}
          chapterTitle={chapter.title}
          onClose={() => setSelectedPdf(null)}
        />
      )}

    </div>
  );
};
