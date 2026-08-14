import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import { PageView } from '../../types';
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Play, 
  Lock, 
  GraduationCap, 
  BookOpen, 
  ArrowLeft,
  Layers,
  TrendingUp,
  X
} from 'lucide-react';

interface ChapterSidebarNavProps {
  onNavigate: (page: PageView) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const ChapterSidebarNav: React.FC<ChapterSidebarNavProps> = ({ 
  onNavigate,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const { 
    coursesData, 
    activeCourseId, 
    activeSegmentId, 
    activeChapterId, 
    navigateToChapter, 
    getCourseProgress, 
    getChapterProgress,
    isChapterUnlocked 
  } = useLearning();

  const course = coursesData[activeCourseId] || coursesData['hsc-28-complete-biology'];
  const courseProgress = getCourseProgress(course.courseId);

  // Keep all segments expanded in sidebar for easy navigation
  const [expandedSegments, setExpandedSegments] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    course.segments.forEach(s => {
      init[s.id] = true;
    });
    return init;
  });

  const toggleSegment = (segId: string) => {
    setExpandedSegments(prev => ({
      ...prev,
      [segId]: !prev[segId]
    }));
  };

  const handleSelectChapter = (segId: string, chapId: string) => {
    const lockCheck = isChapterUnlocked(course.courseId, segId, chapId);
    if (!lockCheck.unlocked) {
      alert(lockCheck.reason || 'This chapter is locked. Please complete previous chapters first.');
      return;
    }
    navigateToChapter(course.courseId, segId, chapId);
    if (onCloseMobile) onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-[#111318] text-white">
      
      {/* Top Course Header inside Sidebar */}
      <div className="p-4 sm:p-5 border-b border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('course-overview')}
            className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 font-semibold group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Course Overview</span>
          </button>

          {onCloseMobile && (
            <button 
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-gray-400 hover:text-white rounded-lg bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div>
          <span className="text-[10px] font-black uppercase text-[#FF3540] tracking-wider block mb-0.5">
            Syllabus Navigation
          </span>
          <h3 className="text-sm font-bold text-white line-clamp-1">
            {course.title}
          </h3>
        </div>

        {/* Course Progress Indicator */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-400">Course Progress</span>
            <span className="text-[#FF3540] font-black">{courseProgress.percentage}%</span>
          </div>
          <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-[#E50914] to-[#FF3540] rounded-full transition-all"
              style={{ width: `${Math.max(5, courseProgress.percentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Segments and Chapters Tree Hierarchy */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 no-scrollbar">
        {course.segments.map((segment) => {
          const isExpanded = !!expandedSegments[segment.id];
          const isCurrentSegment = activeSegmentId === segment.id;

          return (
            <div
              key={segment.id}
              className={`rounded-xl border transition-all ${
                isCurrentSegment
                  ? 'border-[#E50914]/40 bg-[#161822]'
                  : 'border-white/5 bg-[#13151f]'
              }`}
            >
              {/* Segment Tree Node */}
              <div
                onClick={() => toggleSegment(segment.id)}
                className="p-3 cursor-pointer flex items-center justify-between gap-2 hover:bg-white/5 rounded-xl transition-colors select-none"
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="w-5 h-5 rounded bg-[#E50914]/20 text-[#FF3540] flex items-center justify-center text-[10px] font-black shrink-0">
                    0{segment.segmentNumber}
                  </div>
                  <span className="text-xs font-bold text-white truncate">
                    {segment.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 text-gray-400">
                  <span className="text-[10px] text-gray-400">
                    {segment.chapters.length} chap
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>

              {/* Chapters Tree Leaves */}
              {isExpanded && (
                <div className="pl-3 pr-2 pb-2 space-y-1 border-t border-white/5 pt-1.5">
                  {segment.chapters.map((chapter) => {
                    const isActive = activeChapterId === chapter.id && activeSegmentId === segment.id;
                    const chapProg = getChapterProgress(course.courseId, segment.id, chapter.id);
                    const lockCheck = isChapterUnlocked(course.courseId, segment.id, chapter.id);
                    const isLocked = !lockCheck.unlocked;

                    return (
                      <button
                        key={chapter.id}
                        onClick={() => handleSelectChapter(segment.id, chapter.id)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-center justify-between gap-2 group ${
                          isActive
                            ? 'bg-[#E50914] text-white font-bold shadow-md'
                            : isLocked
                            ? 'text-gray-500 hover:text-gray-400 hover:bg-white/5 opacity-70'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {/* Tree Branch Symbol */}
                          <span className={`text-[10px] font-mono shrink-0 ${isActive ? 'text-white' : 'text-gray-600'}`}>
                            ├─
                          </span>

                          <span className="truncate">
                            Ch {chapter.chapterNumber}: {chapter.title}
                          </span>
                        </div>

                        <div className="shrink-0 flex items-center gap-1">
                          {isLocked ? (
                            <Lock className="w-3.5 h-3.5 text-amber-500/80" />
                          ) : chapProg.isCompleted ? (
                            <CheckCircle2 className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                          ) : isActive ? (
                            <Play className="w-3 h-3 fill-current text-white" />
                          ) : (
                            <span className="text-[10px] text-gray-400 font-medium">
                              {chapProg.percentage}%
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent Column) */}
      <aside className="hidden lg:block w-80 shrink-0 border-r border-white/10 sticky top-20 h-[calc(100vh-5rem)] overflow-hidden rounded-2xl shadow-xl">
        {content}
      </aside>

      {/* Mobile Drawer (Collapsible) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
          />
          <div className="relative w-80 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
