import React, { useState, useEffect } from 'react';
import { ChapterClass } from '../../types';
import { useLearning } from '../../context/LearningContext';
import { useFavorites } from '../../utils/favoriteStorage';
import { 
  X, 
  Play, 
  Pause, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Bookmark, 
  Sparkles, 
  Volume2, 
  Maximize2, 
  RotateCcw,
  FastForward,
  Award,
  ChevronRight
} from 'lucide-react';

interface ClassVideoPlayerModalProps {
  chapterClass: ChapterClass;
  chapterTitle: string;
  courseId?: string;
  segmentId?: string;
  chapterId?: string;
  onClose: () => void;
}

export const ClassVideoPlayerModal: React.FC<ClassVideoPlayerModalProps> = ({
  chapterClass,
  chapterTitle,
  courseId,
  segmentId,
  chapterId,
  onClose
}) => {
  const { markClassCompleted, userState } = useLearning();
  const { favorites, addFavoriteClass, removeFavoriteClass } = useFavorites();
  const isAlreadyCompleted = userState.completedClassIds.includes(chapterClass.id);
  const isFavorited = favorites.classes.some((c) => c.id === chapterClass.id);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentSpeed, setCurrentSpeed] = useState<number>(1);
  const [activeTimestampIndex, setActiveTimestampIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'timeline' | 'highlights' | 'notes'>('timeline');
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const timeline = chapterClass.videoSimulatedTimeline || [
    { time: '00:00', seconds: 0, title: 'Concept Foundations & Background', notes: 'Core definitions and medical importance.' },
    { time: '15:00', seconds: 900, title: 'Detailed Diagrammatic Breakdown', notes: 'Step-by-step structural analysis.' },
    { time: '32:00', seconds: 1920, title: 'Medical Admission Past Solves', notes: 'Trap questions and high-yield mnemonics.' }
  ];

  const handleMarkComplete = () => {
    markClassCompleted(chapterClass.id);
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
    }, 2500);
  };

  // Favourite (Bookmark) — saved under this Student Account via the server
  // dashboard record, so the class appears in the student's Favourites.
  const handleToggleFavorite = () => {
    if (isFavorited) {
      removeFavoriteClass(chapterClass.id);
      return;
    }
    addFavoriteClass({
      id: chapterClass.id,
      title: chapterClass.title,
      courseTitle: chapterTitle,
      subject: 'Biology',
      chapter: chapterTitle,
      mentorName: chapterClass.teacherName,
      duration: chapterClass.duration,
      thumbnail: chapterClass.videoThumbnail,
      videoUrl: chapterClass.videoUrl,
      courseId,
      segmentId,
      chapterId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-y-auto">
      <div 
        id="class-video-player-container"
        className="bg-[#0f1117] border border-white/15 rounded-2xl sm:rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        
        {/* Top Modal Header */}
        <div className="p-4 sm:p-5 bg-[#141622] border-b border-white/10 flex items-center justify-between gap-4">
          <div className="space-y-0.5 truncate">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#E50914] text-white text-[10px] font-black uppercase tracking-wider">
                Lecture 0{chapterClass.classNumber}
              </span>
              <span className="text-xs text-gray-400 font-semibold truncate">
                {chapterTitle}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white truncate">
              {chapterClass.title}
            </h3>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleToggleFavorite}
              title={isFavorited ? 'Remove from Favourites' : 'Save to Favourites'}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isFavorited
                  ? 'bg-amber-400/15 text-amber-300 border-amber-400/40'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border-white/10'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFavorited ? 'fill-amber-300' : ''}`} />
              <span>{isFavorited ? 'Saved' : 'Save'}</span>
            </button>

            {isAlreadyCompleted ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-xl border border-emerald-400/30">
                <CheckCircle2 className="w-4 h-4" />
                <span>Completed</span>
              </span>
            ) : (
              <button
                onClick={handleMarkComplete}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Completed</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0 no-scrollbar">
          
          {/* Left Column (8 cols): Video Player Area & Timeline Jumps */}
          <div className="lg:col-span-8 p-4 sm:p-6 space-y-4 border-b lg:border-b-0 lg:border-r border-white/10">
            
            {/* Interactive Video Player Canvas */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl group">
              <img
                src={chapterClass.videoThumbnail}
                alt={chapterClass.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
              />

              {/* Overlay Player Controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 flex flex-col justify-between p-4">
                
                {/* Top Video Overlay Bar */}
                <div className="flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-2 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-bold">MediSpark HD Class</span>
                  </div>

                  {/* Speed Selector */}
                  <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-lg border border-white/10">
                    {[1, 1.25, 1.5, 2].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setCurrentSpeed(spd)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          currentSpeed === spd
                            ? 'bg-[#E50914] text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Center Big Play/Pause Action */}
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 rounded-full bg-[#E50914]/90 hover:bg-[#E50914] text-white flex items-center justify-center shadow-[0_0_30px_rgba(229,9,20,0.6)] transform hover:scale-110 transition-all"
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7 fill-current" />
                    ) : (
                      <Play className="w-7 h-7 fill-current ml-1" />
                    )}
                  </button>
                </div>

                {/* Bottom Timeline Bar */}
                <div className="space-y-2">
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                    <div 
                      className="h-full bg-[#E50914] rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (activeTimestampIndex + 1) * 25)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">
                        {timeline[activeTimestampIndex]?.time || '00:00'}
                      </span>
                      <span>/</span>
                      <span className="text-gray-400">{chapterClass.duration}</span>
                    </div>

                    <div className="text-[11px] text-gray-300 truncate max-w-[200px]">
                      {timeline[activeTimestampIndex]?.title}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Teacher Details & Bottom Complete Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E50914]/20 border border-[#E50914]/40 flex items-center justify-center text-[#FF3540] font-black text-sm">
                  MD
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {chapterClass.teacherName}
                  </h4>
                  <span className="text-xs text-gray-400">
                    {chapterClass.teacherRole || 'Faculty of Medicine'} • Duration: {chapterClass.duration}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleFavorite}
                  title={isFavorited ? 'Remove from Favourites' : 'Save to Favourites'}
                  className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    isFavorited
                      ? 'bg-amber-400/15 text-amber-300 border-amber-400/40'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border-white/10'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isFavorited ? 'fill-amber-300' : ''}`} />
                  <span>{isFavorited ? 'Saved' : 'Save'}</span>
                </button>

                {!isAlreadyCompleted && (
                  <button
                    onClick={handleMarkComplete}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl shadow transition-all flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Class as Done</span>
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Right Column (4 cols): Interactive Timestamps, NCTB Highlights & Key Notes */}
          <div className="lg:col-span-4 p-4 sm:p-5 space-y-4 bg-[#11131a] flex flex-col h-full">
            
            {/* Sub-Tabs */}
            <div className="flex items-center border-b border-white/10 pb-2 gap-2">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'timeline'
                    ? 'bg-[#E50914] text-white shadow'
                    : 'text-gray-400 hover:text-white bg-white/5'
                }`}
              >
                Timestamps
              </button>
              <button
                onClick={() => setActiveTab('highlights')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'highlights'
                    ? 'bg-[#E50914] text-white shadow'
                    : 'text-gray-400 hover:text-white bg-white/5'
                }`}
              >
                NCTB Points
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'notes'
                    ? 'bg-[#E50914] text-white shadow'
                    : 'text-gray-400 hover:text-white bg-white/5'
                }`}
              >
                Key Notes
              </button>
            </div>

            {/* Tab 1: Interactive Timestamps */}
            {activeTab === 'timeline' && (
              <div className="space-y-2.5 flex-1 overflow-y-auto no-scrollbar">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Interactive Video Jump Points
                </span>
                {timeline.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveTimestampIndex(index)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      activeTimestampIndex === index
                        ? 'bg-[#E50914]/15 border-[#E50914]/50 text-white'
                        : 'bg-white/5 border-white/5 hover:border-white/20 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-[#FF3540] bg-black/40 px-2 py-0.5 rounded">
                        {item.time}
                      </span>
                      {activeTimestampIndex === index && (
                        <span className="text-[10px] font-black text-emerald-400">Playing</span>
                      )}
                    </div>
                    <h5 className="text-xs font-bold text-white mb-0.5">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      {item.notes}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: NCTB Textbook Highlights */}
            {activeTab === 'highlights' && (
              <div className="space-y-2.5 flex-1 overflow-y-auto no-scrollbar">
                <span className="text-[11px] font-bold text-[#FF3540] uppercase tracking-wider block">
                  Abul Hasan & Gazi Ajmal Textbook Lines
                </span>
                {(chapterClass.nctbHighlights && chapterClass.nctbHighlights.length > 0) ? (
                  chapterClass.nctbHighlights.map((point, index) => (
                    <div key={index} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                      <span className="text-[10px] font-black uppercase text-amber-400">
                        High-Yield Point {index + 1}
                      </span>
                      <p className="text-xs text-amber-100 font-medium leading-relaxed">
                        "{point}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-white/5 text-center text-xs text-gray-400">
                    Comprehensive NCTB line highlights available in lecture sheet.
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Key Medical Notes */}
            {activeTab === 'notes' && (
              <div className="space-y-2.5 flex-1 overflow-y-auto no-scrollbar">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Mentor Dr. Siyam's Pointers
                </span>
                {(chapterClass.keyNotes && chapterClass.keyNotes.length > 0) ? (
                  chapterClass.keyNotes.map((note, index) => (
                    <div key={index} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                      <span className="text-[10px] font-black uppercase text-emerald-400">
                        Concept {index + 1}
                      </span>
                      <p className="text-xs text-gray-200 leading-relaxed">
                        {note}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-white/5 text-center text-xs text-gray-400">
                    No custom notes added for this lecture.
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Celebration Popup */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-[#111318] border-2 border-emerald-500 rounded-2xl p-6 shadow-2xl text-center space-y-2 animate-in zoom-in-95 duration-300">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.6)]">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-white">Lecture Completed! 🎉</h4>
            <p className="text-xs text-gray-300">
              Your chapter progress has been updated.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
