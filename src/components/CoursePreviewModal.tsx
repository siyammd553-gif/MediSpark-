import React, { useState, useEffect, useRef } from 'react';
import { Course, CoursePreviewLesson, Question } from '../types';
import { COURSE_PREVIEW_LESSONS, DEFAULT_PREVIEW_LESSON } from '../data/previewData';
import { 
  X, Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize2, 
  CheckCircle2, XCircle, AlertCircle, BookOpen, Sparkles, HelpCircle, 
  FileText, Award, ArrowRight, ShieldCheck, ChevronRight, Share2, Download
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CoursePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  course?: Course | null;
  onEnroll: (course: Course) => void;
}

export const CoursePreviewModal: React.FC<CoursePreviewModalProps> = ({
  isOpen,
  onClose,
  course,
  onEnroll,
}) => {
  // Select active preview lesson based on passed course ID or fallback
  const courseId = course?.id || 'medical-admission-hsc-28';
  const [activeLessonId, setActiveLessonId] = useState<string>(
    COURSE_PREVIEW_LESSONS[courseId] ? courseId : 'medical-admission-hsc-28'
  );

  useEffect(() => {
    if (course?.id && COURSE_PREVIEW_LESSONS[course.id]) {
      setActiveLessonId(course.id);
    }
  }, [course]);

  const activeLesson: CoursePreviewLesson = COURSE_PREVIEW_LESSONS[activeLessonId] || DEFAULT_PREVIEW_LESSON;

  // Video Player state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentSeconds, setCurrentSeconds] = useState<number>(195); // Starts around 0.8s cardiac cycle
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'video' | 'nctb' | 'mnemonics' | 'quiz' | 'summary'>('video');

  // Quiz state
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Total duration in seconds (18m 45s ~ 1125s)
  const totalDurationSeconds = 1125;

  // Video timer simulation
  useEffect(() => {
    let interval: any = null;
    if (isOpen && isPlaying) {
      interval = setInterval(() => {
        setCurrentSeconds((prev) => {
          if (prev >= totalDurationSeconds) {
            setIsPlaying(false);
            return totalDurationSeconds;
          }
          return prev + playbackRate;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, isPlaying, playbackRate]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSeconds(Number(e.target.value));
  };

  const handleJumpToTime = (seconds: number) => {
    setCurrentSeconds(seconds);
    setIsPlaying(true);
    setActiveTab('video');
  };

  const handleQuizAnswer = (qId: string, optionIdx: number) => {
    if (isQuizSubmitted) return;
    setSelectedQuizAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx,
    }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    activeLesson.quiz.forEach((q) => {
      const ans = selectedQuizAnswers[q.id];
      if (ans === q.correctAnswerIndex) {
        score += 1;
      } else if (ans !== undefined) {
        score -= 0.25; // DGHS negative marking
      }
    });
    setQuizScore(Math.max(0, score));
    setIsQuizSubmitted(true);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  const handleResetQuiz = () => {
    setSelectedQuizAnswers({});
    setIsQuizSubmitted(false);
    setQuizScore(0);
  };

  const copyNotesToClipboard = () => {
    const text = `MediSpark Free Preview Lesson - ${activeLesson.lessonTitle}\nInstructor: ${activeLesson.instructorName} (${activeLesson.instructorTitle})\n\nKey Takeaways:\n${activeLesson.summaryNotes.join('\n')}\n\nStudy more at https://medispark.edu.bd`;
    navigator.clipboard.writeText(text);
    setCopiedNotification('Copied high-yield summary to clipboard!');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  // Find active timeline section based on current timestamp
  const currentTimelineSegment = [...activeLesson.videoSimulatedTimeline]
    .reverse()
    .find((item) => currentSeconds >= item.seconds) || activeLesson.videoSimulatedTimeline[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        id="course-preview-backdrop"
        onClick={onClose} 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" 
      />

      {/* Main Preview Modal Window */}
      <div 
        id="course-preview-modal"
        className="relative w-full max-w-5xl bg-[#111318] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl z-10 text-white overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200"
      >
        {/* Modal Top Header Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#1c1317] via-[#141622] to-[#111318] border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E50914] text-white text-[11px] font-black uppercase tracking-wider shadow-[0_2px_10px_rgba(229,9,20,0.4)]">
              <Sparkles className="w-3 h-3" />
              <span>Free Lesson Preview</span>
            </span>
            
            {/* Quick switcher between sample preview lessons */}
            <div className="hidden md:flex items-center gap-1.5 bg-[#0a0b0e] p-1 rounded-xl border border-white/5">
              {Object.keys(COURSE_PREVIEW_LESSONS).map((key) => {
                const item = COURSE_PREVIEW_LESSONS[key];
                const isActive = activeLessonId === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveLessonId(key);
                      setCurrentSeconds(0);
                      setIsPlaying(true);
                      handleResetQuiz();
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#E50914] text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {item.subject}: {item.lessonTitle.slice(0, 20)}...
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white shrink-0 transition-colors"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content Grid (Video Player on Top/Left, Interactive Tabs on Right/Bottom) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Column: Video & Media Player (7 cols) */}
          <div className="lg:col-span-7 bg-[#0b0c0f] p-4 sm:p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
            
            {/* Interactive Video Stage */}
            <div className="relative aspect-video bg-[#151720] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-between group select-none">
              
              {/* Simulated Lecture Visual Canvas */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#12141d] to-[#0a0b0f] flex flex-col p-5 justify-between">
                
                {/* Top Video Watermark & Live ECG Indicator */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-[#E50914] animate-ping" />
                    <span className="text-[11px] font-black tracking-wider text-white">
                      MEDISPARK MASTERCLASS
                    </span>
                  </div>

                  <div className="text-[11px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg backdrop-blur-md">
                    NCTB Chapter 4 Line Analysis
                  </div>
                </div>

                {/* Center Dynamic Lecture Board / Diagram Overlay */}
                <div className="my-auto text-center space-y-3 z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-gray-200 border border-white/10">
                    <span>Current Topic:</span>
                    <strong className="text-white">{currentTimelineSegment.title}</strong>
                  </div>

                  {/* Medical Visual Representation Simulation */}
                  <div className="max-w-md mx-auto p-4 bg-black/70 backdrop-blur-md rounded-2xl border border-white/10 space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-black text-[#FF3540]">
                        Clinical Concept Board
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {formatTime(currentSeconds)} / {formatTime(totalDurationSeconds)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-100 leading-snug">
                      {currentTimelineSegment.notes}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        DGHS Tested
                      </span>
                      <span className="text-[10px] text-gray-400">
                        Negative Marking Focus: -0.25
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Instructor Card Overlay */}
                <div className="flex items-center justify-between z-10 pt-2">
                  <div className="flex items-center gap-2.5 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#E50914] shrink-0 border border-white/20">
                      <img
                        src={activeLesson.instructorImage}
                        alt={activeLesson.instructorName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-white">{activeLesson.instructorName}</div>
                      <div className="text-[10px] text-[#FF3540]">{activeLesson.instructorTitle}</div>
                    </div>
                  </div>

                  <div className="text-xs font-mono text-gray-300 bg-black/60 px-2.5 py-1 rounded-lg border border-white/10">
                    {formatTime(currentSeconds)}
                  </div>
                </div>

                {/* Ambient ECG Pulse Line in Video Background */}
                <svg
                  className="absolute bottom-6 left-0 right-0 w-full h-20 opacity-15 pointer-events-none"
                  viewBox="0 0 1000 100"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,50 L100,50 L120,20 L140,80 L160,50 L400,50 L420,10 L440,90 L460,50 L800,50 L820,30 L840,70 L860,50 L1000,50"
                    stroke="#E50914"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Video Bottom Control Bar Overlay */}
              <div className="z-20 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col gap-2">
                
                {/* Scrubbing Range Slider with Chapter Markers */}
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min="0"
                    max={totalDurationSeconds}
                    value={currentSeconds}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#E50914]"
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-8 h-8 rounded-full bg-[#E50914] hover:bg-[#b8060f] flex items-center justify-center text-white shadow-lg transition-transform active:scale-95"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                    </button>

                    <button
                      onClick={() => setCurrentSeconds((prev) => Math.max(0, prev - 10))}
                      className="p-1.5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white"
                      title="Rewind 10s"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setCurrentSeconds((prev) => Math.min(totalDurationSeconds, prev + 10))}
                      className="p-1.5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white"
                      title="Forward 10s"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>

                    <span className="text-[11px] font-mono text-gray-300">
                      {formatTime(currentSeconds)} / {formatTime(totalDurationSeconds)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Playback speed selector */}
                    <div className="flex items-center bg-white/10 rounded-lg p-0.5 text-[10px] font-bold">
                      {[1, 1.25, 1.5, 2].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => setPlaybackRate(rate)}
                          className={`px-1.5 py-0.5 rounded ${
                            playbackRate === rate ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Lesson Title & Quick Details */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF3540] bg-[#FF3540]/10 px-2 py-0.5 rounded">
                  {activeLesson.moduleTitle}
                </span>
                <span className="text-xs text-gray-400">
                  Duration: <strong className="text-white">{activeLesson.duration}</strong>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black font-heading text-white">
                {activeLesson.lessonTitle}
              </h2>
              <p className="text-xs text-gray-300">
                Course: <strong className="text-white">{activeLesson.courseTitle}</strong>
              </p>
            </div>

            {/* Interactive Timeline Jump Points */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="text-xs font-bold text-gray-300 block mb-2">
                📌 Key Timestamps in this Masterclass:
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {activeLesson.videoSimulatedTimeline.map((tl, idx) => {
                  const isActive = currentSeconds >= tl.seconds && 
                    (idx === activeLesson.videoSimulatedTimeline.length - 1 || currentSeconds < activeLesson.videoSimulatedTimeline[idx + 1].seconds);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleJumpToTime(tl.seconds)}
                      className={`w-full p-2 rounded-xl text-left text-xs flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-[#E50914]/20 border border-[#E50914]/40 text-white font-bold'
                          : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-[10px] text-[#FF3540] shrink-0 font-semibold">
                          {tl.time}
                        </span>
                        <span className="truncate">{tl.title}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-50" />
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Tabs (Notes, Quiz, Mnemonics, Summary) (5 cols) */}
          <div className="lg:col-span-5 bg-[#111318] p-4 sm:p-5 flex flex-col justify-between">
            
            <div>
              {/* Tab Navigation Header */}
              <div className="flex items-center gap-1 border-b border-white/10 pb-3 mb-4 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveTab('video')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTab === 'video'
                      ? 'bg-[#E50914] text-white shadow-md'
                      : 'text-gray-400 hover:text-white bg-white/5'
                  }`}
                >
                  <Play className="w-3 h-3" />
                  <span>Timeline</span>
                </button>

                <button
                  onClick={() => setActiveTab('nctb')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTab === 'nctb'
                      ? 'bg-[#E50914] text-white shadow-md'
                      : 'text-gray-400 hover:text-white bg-white/5'
                  }`}
                >
                  <BookOpen className="w-3 h-3" />
                  <span>NCTB Lines</span>
                </button>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTab === 'quiz'
                      ? 'bg-[#E50914] text-white shadow-md'
                      : 'text-gray-400 hover:text-white bg-white/5'
                  }`}
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Practice Quiz ({activeLesson.quiz.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('summary')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTab === 'summary'
                      ? 'bg-[#E50914] text-white shadow-md'
                      : 'text-gray-400 hover:text-white bg-white/5'
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  <span>Cheat Sheet</span>
                </button>
              </div>

              {/* TAB 1: Video Timeline Overview */}
              {activeTab === 'video' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-[#171922] rounded-xl border border-white/5">
                    <h4 className="text-xs font-black uppercase text-[#FF3540] mb-1">
                      Teaching Philosophy & Style
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      At MediSpark, we do not read slides. Every topic is mapped directly to the official NCTB textbooks (Gazi Ajmal, Abul Hasan, Hazari-Nag) with 3D anatomical logic and past 15-year DGHS medical admission question trends.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-gray-300">
                      Why Students Love This Lecture:
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="p-2.5 bg-white/5 rounded-xl text-xs text-gray-300 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                        <span>Instant option elimination technique for 0.8s cardiac questions</span>
                      </div>
                      <div className="p-2.5 bg-white/5 rounded-xl text-xs text-gray-300 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                        <span>Avoid the most frequent negative mark trap (-0.25) in Heart Valves</span>
                      </div>
                      <div className="p-2.5 bg-white/5 rounded-xl text-xs text-gray-300 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                        <span>Memory mnemonics crafted by DMC & ShSMC medical toppers</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: NCTB High-Yield Textbook Lines */}
              {activeTab === 'nctb' && (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  <div className="text-xs text-gray-400">
                    Exact lines and footnotes from official board textbooks mapped by Dr. Siyam:
                  </div>
                  {activeLesson.nctbHighlights.map((hl, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-[#171922] rounded-xl border border-white/5 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-[#FF3540]">{hl.book}</span>
                        <span className="text-gray-400">{hl.page}</span>
                      </div>
                      <p className="font-semibold text-gray-200 leading-snug">
                        "{hl.highYieldPoint}"
                      </p>
                      {hl.isException && (
                        <span className="inline-block text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                          ⚠ High-Frequency Medical Trap
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: Diagnostic Mini Quiz */}
              {activeTab === 'quiz' && (
                <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-300">
                      Rapid 60-Second Concept Quiz:
                    </span>
                    {isQuizSubmitted && (
                      <span className="text-xs font-extrabold text-[#FF3540] bg-[#FF3540]/10 px-2.5 py-0.5 rounded-lg">
                        Score: {quizScore} / {activeLesson.quiz.length} Marks
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {activeLesson.quiz.map((q, qIdx) => {
                      const selected = selectedQuizAnswers[q.id];
                      return (
                        <div
                          key={q.id}
                          className="p-3.5 bg-[#171922] rounded-xl border border-white/5 space-y-2 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-white leading-snug">
                              Q{qIdx + 1}. {q.question}
                            </span>
                            {q.medicalAdmissionYear && (
                              <span className="text-[10px] text-amber-400 shrink-0 font-medium">
                                {q.medicalAdmissionYear}
                              </span>
                            )}
                          </div>

                          <div className="space-y-1.5 pt-1">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = selected === optIdx;
                              const isCorrect = isQuizSubmitted && q.correctAnswerIndex === optIdx;
                              const isWrong = isQuizSubmitted && isSelected && !isCorrect;

                              let btnClass = 'bg-[#10121a] text-gray-300 border-white/5 hover:border-white/20';
                              if (isSelected && !isQuizSubmitted) {
                                btnClass = 'bg-[#E50914]/20 border-[#E50914] text-white font-bold';
                              }
                              if (isCorrect) {
                                btnClass = 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold';
                              }
                              if (isWrong) {
                                btnClass = 'bg-red-950/40 border-red-500 text-red-300 line-through';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleQuizAnswer(q.id, optIdx)}
                                  disabled={isQuizSubmitted}
                                  className={`w-full p-2 rounded-lg text-left text-xs border transition-all flex items-center justify-between ${btnClass}`}
                                >
                                  <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                                  {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                                  {isWrong && <XCircle className="w-3.5 h-3.5 text-red-400" />}
                                </button>
                              );
                            })}
                          </div>

                          {isQuizSubmitted && (
                            <div className="p-2.5 bg-black/40 rounded-lg text-[11px] text-gray-300 border-l-2 border-[#E50914]">
                              <strong className="text-white">Explanation: </strong>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    {!isQuizSubmitted ? (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(selectedQuizAnswers).length === 0}
                        className="w-full py-2.5 bg-[#E50914] hover:bg-[#b8060f] text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
                      >
                        Check Answers & Apply DGHS Marking
                      </button>
                    ) : (
                      <button
                        onClick={handleResetQuiz}
                        className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all"
                      >
                        Retake Practice Quiz
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: Summary Cheat Sheet */}
              {activeTab === 'summary' && (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-300">
                      High-Yield Cheat Sheet Notes:
                    </span>
                    <button
                      onClick={copyNotesToClipboard}
                      className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-[10px] font-bold text-white rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Copy Notes</span>
                    </button>
                  </div>

                  {copiedNotification && (
                    <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg text-center font-bold">
                      {copiedNotification}
                    </div>
                  )}

                  <div className="space-y-2">
                    {activeLesson.summaryNotes.map((note, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-[#171922] rounded-xl border border-white/5 text-xs text-gray-200 flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] shrink-0 mt-1.5" />
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-amber-400/10 border border-amber-400/20 rounded-xl text-xs text-amber-200">
                    💡 <strong>Pro Tip from Dr. Siyam:</strong> Revise these 5 points immediately before your central model tests to score full marks in Zoology Paper 2.
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Enrollment CTA Box */}
            <div className="mt-5 p-4 bg-gradient-to-br from-[#1d1217] via-[#161822] to-[#12131b] rounded-2xl border border-[#E50914]/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold">
                    Full Access Package
                  </div>
                  <div className="text-sm font-black text-white">
                    Unlock all 120+ Live Masterclasses
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-white">
                    ৳{course?.discountPrice || 2999}
                  </span>
                </div>
              </div>

              <button
                id="preview-enroll-now-cta"
                onClick={() => {
                  onClose();
                  if (course) {
                    onEnroll(course);
                  }
                }}
                className="w-full py-2.5 bg-[#E50914] hover:bg-[#b8060f] text-white text-xs font-extrabold rounded-xl shadow-[0_4px_16px_rgba(229,9,20,0.4)] transition-all flex items-center justify-center gap-1.5"
              >
                <span>Enroll in Full Course with bKash / Nagad</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
