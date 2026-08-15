import React, { useState, useMemo } from 'react';
import { useLearning } from '../../context/LearningContext';
import { PageView, Chapter, ChapterClass, ChapterExam, ChapterPDF } from '../../types';
import { ClassVideoPlayerModal } from './ClassVideoPlayerModal';
import { ChapterExamSimulatorModal } from './ChapterExamSimulatorModal';
import { ChapterPdfReaderModal } from './ChapterPdfReaderModal';
import { CourseAccessDenied } from './CourseAccessDenied';
import { 
  ChevronDown, 
  ChevronRight, 
  Play, 
  CheckCircle2, 
  Lock, 
  BookOpen, 
  FileText, 
  Video, 
  Award, 
  ArrowLeft, 
  Clock, 
  GraduationCap, 
  Sparkles,
  Layers,
  Leaf,
  Dna,
  Eye,
  Download,
  HelpCircle,
  BarChart2,
  Check,
  Search
} from 'lucide-react';

interface CourseOverviewViewProps {
  onNavigate: (page: PageView) => void;
}

export const CourseOverviewView: React.FC<CourseOverviewViewProps> = ({ onNavigate }) => {
  const { 
    coursesData, 
    activeCourseId, 
    navigateToChapter, 
    setActiveTab,
    getCourseProgress, 
    getSegmentProgress, 
    getChapterProgress,
    isChapterUnlocked,
    userState
  } = useLearning();

  const course = coursesData[activeCourseId];
  const courseProgress = course
    ? getCourseProgress(course.courseId)
    : { percentage: 0, completedChapters: 0, totalChapters: 0, completedClasses: 0, totalClasses: 0 };

  const isBiologyCourse = course
    ? course.courseId.toLowerCase().includes('biology') || course.title.toLowerCase().includes('biology')
    : false;

  // Branch Selection: Botany or Zoology (default to Botany for biology courses)
  const [selectedBranch, setSelectedBranch] = useState<'Botany' | 'Zoology'>('Botany');

  // Category Mode: 1) Class, 2) Exam, 3) Materials, or 4) All Chapters
  const [selectedMode, setSelectedMode] = useState<'classes' | 'exams' | 'materials' | 'all'>('classes');

  // Modals for instant launch from Chapter 1-12 list
  const [activePlayingClass, setActivePlayingClass] = useState<ChapterClass | null>(null);
  const [activeExam, setActiveExam] = useState<ChapterExam | null>(null);
  const [activePdf, setActivePdf] = useState<ChapterPDF | null>(null);
  const [lockedModalInfo, setLockedModalInfo] = useState<string | null>(null);

  // Search/Filter within chapters 1-12
  const [searchQuery, setSearchQuery] = useState('');

  // Find the segment for the selected branch
  const currentSegment = useMemo(() => {
    if (!course) return undefined;
    if (!isBiologyCourse) return course.segments[0];
    return course.segments.find(s => 
      selectedBranch === 'Botany' 
        ? (s.id.includes('botany') || s.title.toLowerCase().includes('botany') || s.segmentNumber === 1)
        : (s.id.includes('zoology') || s.title.toLowerCase().includes('zoology') || s.segmentNumber === 2)
    ) || course.segments[0];
  }, [course, isBiologyCourse, selectedBranch]);

  // List of all 12 chapters for active branch
  const chaptersList: Chapter[] = useMemo(() => {
    if (!currentSegment) return [];
    if (!searchQuery.trim()) return currentSegment.chapters;
    const q = searchQuery.toLowerCase();
    return currentSegment.chapters.filter(ch => 
      ch.title.toLowerCase().includes(q) || 
      (ch.subtitle && ch.subtitle.toLowerCase().includes(q)) ||
      ch.chapterNumber.toString().includes(q)
    );
  }, [currentSegment, searchQuery]);

  // Navigate to full Chapter Learning page with specific tab
  const handleOpenChapter = (chapterId: string, tab: 'classes' | 'exams' | 'pdfs' | 'more' = 'classes') => {
    if (!currentSegment) return;
    const lockCheck = isChapterUnlocked(course.courseId, currentSegment.id, chapterId);
    if (!lockCheck.unlocked) {
      setLockedModalInfo(lockCheck.reason || 'This chapter is locked. Complete previous chapters to unlock.');
      return;
    }
    navigateToChapter(course.courseId, currentSegment.id, chapterId);
    setActiveTab(tab);
    onNavigate('chapter-learning');
  };

  // Access check: this student has not enrolled in the active course.
  if (!course) {
    return <CourseAccessDenied onNavigate={onNavigate} />;
  }

  return (
    <div id="medispark-course-overview-page" className="min-h-screen bg-[#090909] text-white py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Top Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 font-medium overflow-x-auto pb-1 no-scrollbar">
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="hover:text-white transition-colors flex items-center gap-1.5 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <span>/</span>
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="hover:text-white transition-colors shrink-0"
          >
            My Enrolled Course
          </button>
          <span>/</span>
          <span className="text-[#FF3540] font-bold truncate max-w-[200px] sm:max-w-none">
            {course.title}
          </span>
          {isBiologyCourse && (
            <>
              <span>/</span>
              <span className={`font-bold shrink-0 ${selectedBranch === 'Botany' ? 'text-emerald-400' : 'text-blue-400'}`}>
                {selectedBranch === 'Botany' ? '1) Botany (উদ্ভিদবিজ্ঞান)' : '2) Zoology (প্রাণিবিজ্ঞান)'}
              </span>
            </>
          )}
        </div>

        {/* Course Banner Hero Card */}
        <div 
          id="course-overview-hero-card"
          className="bg-gradient-to-r from-[#171216] via-[#12141a] to-[#0c0d12] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E50914]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Left Column (8 cols): Title, Description, Instructor */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E50914]/15 border border-[#E50914]/30 text-[#FF3540] text-xs font-black uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>NCTB & Medical Admission Integrated Curriculum</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading text-white tracking-tight">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
                {course.description}
              </p>

              {/* Instructor Information */}
              <div className="flex items-center gap-3.5 pt-2">
                <img
                  src={course.mentorAvatar}
                  alt={course.mentorName}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-[#E50914]"
                />
                <div>
                  <span className="text-[10px] font-black uppercase text-[#FF3540] tracking-wider block">
                    Lead Mentor
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    {course.mentorName}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {course.mentorDegree}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column (4 cols): Course Progress Card */}
            <div className="lg:col-span-4 bg-[#111318]/90 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Overall Syllabus Progress
                </span>
                <span className="text-base font-black text-[#FF3540]">
                  {courseProgress.percentage}%
                </span>
              </div>

              <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-[#E50914] to-[#FF3540] rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, courseProgress.percentage)}%` }}
                />
              </div>

              <div className="text-xs text-gray-400 flex items-center justify-between pt-1">
                <span>Total 12-Chapter Papers:</span>
                <strong className="text-white">Botany (1-12) & Zoology (1-12)</strong>
              </div>

              <div className="text-xs text-gray-400 flex items-center justify-between">
                <span>Completed Lectures:</span>
                <strong className="text-white">{userState.completedClassIds.length} Lectures Watched</strong>
              </div>

              <button
                id="course-overview-continue-btn"
                onClick={() => {
                  if (currentSegment && currentSegment.chapters[0]) {
                    handleOpenChapter(currentSegment.chapters[0].id, 'classes');
                  }
                }}
                className="w-full py-3 bg-[#E50914] hover:bg-[#b8060f] text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-[0_4px_20px_rgba(229,9,20,0.4)] transition-all flex items-center justify-center gap-2 group"
              >
                <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                <span>Resume Learning ({selectedBranch})</span>
                <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

          {/* 4 Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10">
            <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Branches</span>
              <span className="text-base sm:text-lg font-black text-white">Botany & Zoology</span>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Total Chapters</span>
              <span className="text-base sm:text-lg font-black text-white">24 Chapters (12+12)</span>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Video Classes</span>
              <span className="text-base sm:text-lg font-black text-white">88+ High-Yield Lectures</span>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Study Materials</span>
              <span className="text-base sm:text-lg font-black text-[#FF3540]">96+ Master PDFs</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* STEP 1: BRANCH SELECTION (1. Botany  2. Zoology) */}
        {/* ======================================================== */}
        {isBiologyCourse && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#E50914] text-white text-xs flex items-center justify-center font-bold">1</span>
                  Select Biology Subject / Branch
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Choose between Botany (উদ্ভিদবিজ্ঞান) and Zoology (প্রাণিবিজ্ঞান) to view Chapter 1-12
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* 1) Botany Card */}
              <button
                id="branch-select-botany"
                onClick={() => setSelectedBranch('Botany')}
                className={`p-5 sm:p-6 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden flex items-start gap-4 ${
                  selectedBranch === 'Botany'
                    ? 'bg-gradient-to-br from-[#0e1f18] to-[#12161b] border-emerald-500 shadow-[0_8px_30px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500'
                    : 'bg-[#111318] border-white/10 hover:border-emerald-500/40 hover:bg-[#12171a]'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
                  selectedBranch === 'Botany' ? 'bg-emerald-500/20 text-emerald-400 scale-105' : 'bg-white/5 text-gray-400'
                }`}>
                  <Leaf className="w-7 h-7" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                      Branch 01 • Biology Paper 1
                    </span>
                    {selectedBranch === 'Botany' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-black flex items-center gap-1">
                        <Check className="w-3 h-3" /> Selected
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    Botany (উদ্ভিদবিজ্ঞান)
                  </h3>
                  <p className="text-xs text-gray-400">
                    Complete 12 Chapters (Ch 01–12): Cell Structure, Physiology, Plant Diversity & Biotechnology
                  </p>
                  <div className="pt-2 flex items-center gap-3 text-[11px] text-gray-400 font-medium">
                    <span className="text-emerald-400 font-bold">12 Chapters</span>
                    <span>•</span>
                    <span>44 Classes</span>
                    <span>•</span>
                    <span>12 Exams</span>
                    <span>•</span>
                    <span>48 PDFs</span>
                  </div>
                </div>
              </button>

              {/* 2) Zoology Card */}
              <button
                id="branch-select-zoology"
                onClick={() => setSelectedBranch('Zoology')}
                className={`p-5 sm:p-6 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden flex items-start gap-4 ${
                  selectedBranch === 'Zoology'
                    ? 'bg-gradient-to-br from-[#0e1628] to-[#12161b] border-blue-500 shadow-[0_8px_30px_rgba(59,130,246,0.2)] ring-1 ring-blue-500'
                    : 'bg-[#111318] border-white/10 hover:border-blue-500/40 hover:bg-[#12171a]'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
                  selectedBranch === 'Zoology' ? 'bg-blue-500/20 text-blue-400 scale-105' : 'bg-white/5 text-gray-400'
                }`}>
                  <Dna className="w-7 h-7" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">
                      Branch 02 • Biology Paper 2
                    </span>
                    {selectedBranch === 'Zoology' && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500 text-black text-[10px] font-black flex items-center gap-1">
                        <Check className="w-3 h-3" /> Selected
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    Zoology (প্রাণিবিজ্ঞান)
                  </h3>
                  <p className="text-xs text-gray-400">
                    Complete 12 Chapters (Ch 01–12): Animal Diversity, Human Physiology Systems, Genetics & Evolution
                  </p>
                  <div className="pt-2 flex items-center gap-3 text-[11px] text-gray-400 font-medium">
                    <span className="text-blue-400 font-bold">12 Chapters</span>
                    <span>•</span>
                    <span>44 Classes</span>
                    <span>•</span>
                    <span>12 Exams</span>
                    <span>•</span>
                    <span>48 PDFs</span>
                  </div>
                </div>
              </button>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: MODE SELECTOR: 1) Class 2) Exam 3) Materials */}
        {/* ======================================================== */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#E50914] text-white text-xs flex items-center justify-center font-bold">2</span>
                {selectedBranch} — Chapter 1 to 12 Breakdown
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Select your preferred mode to explore all 12 chapters of {selectedBranch}
              </p>
            </div>

            {/* 3 Main Flow Navigation Pills */}
            <div className="inline-flex p-1 rounded-xl bg-[#141620] border border-white/10 shrink-0 overflow-x-auto no-scrollbar">
              <button
                id="mode-tab-classes"
                onClick={() => setSelectedMode('classes')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  selectedMode === 'classes'
                    ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>1) Class (ক্লাস)</span>
              </button>

              <button
                id="mode-tab-exams"
                onClick={() => setSelectedMode('exams')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  selectedMode === 'exams'
                    ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>2) Exam (পরীক্ষা)</span>
              </button>

              <button
                id="mode-tab-materials"
                onClick={() => setSelectedMode('materials')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  selectedMode === 'materials'
                    ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>3) Materials (শিট)</span>
              </button>

              <button
                id="mode-tab-all"
                onClick={() => setSelectedMode('all')}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  selectedMode === 'all'
                    ? 'bg-white/20 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Info</span>
              </button>
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${selectedBranch} Chapter 1–12 (e.g. Cell, Genetics, Heart)...`}
              className="w-full pl-10 pr-4 py-2 bg-[#12141c] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* ======================================================== */}
          {/* STEP 3: CHAPTER 1 TO 12 CARDS GRID */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {chaptersList.map((chapter) => {
              const chapProgress = getChapterProgress(course.courseId, currentSegment?.id || '', chapter.id);
              const lockCheck = isChapterUnlocked(course.courseId, currentSegment?.id || '', chapter.id);
              const isLocked = !lockCheck.unlocked;

              return (
                <div
                  key={chapter.id}
                  id={`chapter-card-${chapter.id}`}
                  className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between group ${
                    isLocked
                      ? 'bg-[#111318]/50 border-white/5 opacity-75'
                      : chapProgress.isCompleted
                      ? 'bg-[#11161d] border-emerald-500/30 hover:border-emerald-500 hover:shadow-[0_8px_24px_rgba(16,185,129,0.15)]'
                      : 'bg-[#111318] border-white/10 hover:border-[#E50914]/50 hover:bg-[#141620] hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                  }`}
                >
                  <div className="space-y-3">
                    
                    {/* Chapter Header Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider ${
                        selectedBranch === 'Botany' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                      }`}>
                        Chapter {chapter.chapterNumber < 10 ? '0' + chapter.chapterNumber : chapter.chapterNumber} of 12
                      </span>

                      {isLocked ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      ) : chapProgress.isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-gray-400">
                          {chapProgress.percentage}% Progress
                        </span>
                      )}
                    </div>

                    {/* Chapter Titles (Bangla & English) */}
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-[#FF3540] transition-colors line-clamp-1">
                        {chapter.title}
                      </h3>
                      {chapter.subtitle && (
                        <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                          {chapter.subtitle}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {chapter.description}
                    </p>

                    {/* Mode Specific Dynamic Content */}
                    {selectedMode === 'classes' && (
                      <div className="bg-black/40 rounded-xl p-3 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 font-medium flex items-center gap-1.5">
                            <Video className="w-3.5 h-3.5 text-[#FF3540]" />
                            {chapter.classes.length > 0 ? `${chapter.classes.length} High-Yield Classes` : `${chapter.classesCount} Classes`}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {chapter.classes[0]?.duration || '50 min average'}
                          </span>
                        </div>
                        {chapter.classes[0] && (
                          <p className="text-[11px] text-gray-300 truncate">
                            ▶ Class 1: {chapter.classes[0].title}
                          </p>
                        )}
                      </div>
                    )}

                    {selectedMode === 'exams' && (
                      <div className="bg-black/40 rounded-xl p-3 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 font-medium flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-amber-400" />
                            {chapter.exams.length > 0 ? chapter.exams[0].examTitle : 'Chapter MCQ Model Test'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-gray-400 pt-0.5">
                          <span>25 Questions (20 Min)</span>
                          <span className="text-amber-400 font-bold">-0.25 Negative Marking</span>
                        </div>
                      </div>
                    )}

                    {selectedMode === 'materials' && (
                      <div className="bg-black/40 rounded-xl p-3 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 font-medium flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-emerald-400" />
                            {chapter.pdfs.length} PDF Study Materials
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[10px] text-gray-400">
                          <span className="truncate">✓ Master Lecture Sheet</span>
                          <span className="truncate">✓ Handwritten Notes</span>
                          <span className="truncate">✓ 250+ Practice MCQs</span>
                          <span className="truncate">✓ 10-Yr Solves</span>
                        </div>
                      </div>
                    )}

                    {selectedMode === 'all' && (
                      <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                        <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                          <span className="text-[10px] text-gray-500 block">Classes</span>
                          <span className="text-xs font-bold text-white">{chapter.classesCount}</span>
                        </div>
                        <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                          <span className="text-[10px] text-gray-500 block">Exams</span>
                          <span className="text-xs font-bold text-white">{chapter.examsCount}</span>
                        </div>
                        <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                          <span className="text-[10px] text-gray-500 block">PDFs</span>
                          <span className="text-xs font-bold text-[#FF3540]">{chapter.pdfsCount}</span>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Chapter Card Action Buttons based on active mode */}
                  <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    
                    {selectedMode === 'classes' && (
                      <div className="w-full flex items-center gap-2">
                        {chapter.classes[0] && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePlayingClass(chapter.classes[0]);
                            }}
                            className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Quick Play</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenChapter(chapter.id, 'classes')}
                          className="flex-1 py-2 bg-[#E50914] hover:bg-[#b8060f] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                        >
                          <span>Open Chapter</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {selectedMode === 'exams' && (
                      <div className="w-full flex items-center gap-2">
                        {chapter.exams[0] && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveExam(chapter.exams[0]);
                            }}
                            className="flex-1 py-2 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Start Test</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenChapter(chapter.id, 'exams')}
                          className="flex-1 py-2 bg-[#E50914] hover:bg-[#b8060f] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                        >
                          <span>Exam Hub</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {selectedMode === 'materials' && (
                      <div className="w-full flex items-center gap-2">
                        {chapter.pdfs[0] && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePdf(chapter.pdfs[0]);
                            }}
                            className="flex-1 py-2 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Read PDF</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenChapter(chapter.id, 'pdfs')}
                          className="flex-1 py-2 bg-[#E50914] hover:bg-[#b8060f] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                        >
                          <span>All Sheets</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {selectedMode === 'all' && (
                      <button
                        onClick={() => handleOpenChapter(chapter.id, 'classes')}
                        className="w-full py-2 bg-[#E50914] hover:bg-[#b8060f] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                      >
                        <span>Enter Chapter Workspace</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Instant Video Player Modal */}
      {activePlayingClass && (
        <ClassVideoPlayerModal
          selectedClass={activePlayingClass}
          onClose={() => setActivePlayingClass(null)}
        />
      )}

      {/* Instant Exam Simulator Modal */}
      {activeExam && (
        <ChapterExamSimulatorModal
          exam={activeExam}
          onClose={() => setActiveExam(null)}
        />
      )}

      {/* Instant PDF Reader Modal */}
      {activePdf && (
        <ChapterPdfReaderModal
          pdf={activePdf}
          onClose={() => setActivePdf(null)}
        />
      )}

      {/* Locked Chapter Modal */}
      {lockedModalInfo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161822] border border-amber-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Chapter Locked</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {lockedModalInfo}
              </p>
            </div>

            <button
              onClick={() => setLockedModalInfo(null)}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Understand & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
