import React, { useState } from 'react';
import { Chapter, ChapterMoreResource, DiscussionThread } from '../../types';
import { 
  Sparkles, 
  Lightbulb, 
  HelpCircle, 
  FileText, 
  Layers, 
  CheckCircle2, 
  RotateCw, 
  Send, 
  MessageSquare, 
  Bell, 
  Award, 
  Flame,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Check
} from 'lucide-react';

interface ChapterMoreTabProps {
  chapter: Chapter;
}

export const ChapterMoreTab: React.FC<ChapterMoreTabProps> = ({ chapter }) => {
  const [activeSection, setActiveSection] = useState<
    'notes' | 'mcq' | 'cq' | 'board' | 'flashcards' | 'topics' | 'forum' | 'suggestions'
  >('notes');

  const moreData: ChapterMoreResource = chapter.more || {
    importantNotes: [],
    mcqPractice: [],
    cqPractice: [],
    boardQuestions: [],
    flashcards: [],
    importantTopics: [],
    discussions: [],
    suggestions: [],
    announcements: []
  };

  // Flashcards state
  const [flippedCardIds, setFlippedCardIds] = useState<Record<string, boolean>>({});
  const [revealedMcqIds, setRevealedMcqIds] = useState<Record<string, boolean>>({});
  const [expandedCqIds, setExpandedCqIds] = useState<Record<string, boolean>>({ 'cq-1': true });

  // Forum state
  const [discussions, setDiscussions] = useState<DiscussionThread[]>(moreData.discussions || []);
  const [newQuestionText, setNewQuestionText] = useState<string>('');

  const handleFlipCard = (id: string) => {
    setFlippedCardIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleToggleMcqReveal = (id: string) => {
    setRevealedMcqIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newThread: DiscussionThread = {
      id: `disc-${Date.now()}`,
      author: 'You (Student)',
      role: 'HSC Candidate',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      timestamp: 'Just now',
      question: newQuestionText,
      replies: [
        {
          id: `rep-${Date.now()}`,
          author: 'MediSpark Academic Team',
          role: 'Mentor Support',
          avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80',
          timestamp: 'Moments ago',
          content: 'Thank you for your question! Dr. Siyam Talukder or an academic mentor will review and answer this shortly with line-by-line textbook references.',
          isMentor: true
        }
      ]
    };

    setDiscussions([newThread, ...discussions]);
    setNewQuestionText('');
  };

  return (
    <div className="space-y-6">
      
      {/* 8 Category Sub-Navigation Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[
          { key: 'notes', label: 'Important Notes', icon: Lightbulb, count: moreData.importantNotes.length },
          { key: 'mcq', label: 'MCQ Practice', icon: HelpCircle, count: moreData.mcqPractice.length },
          { key: 'cq', label: 'CQ Practice (সৃজনশীল)', icon: FileText, count: moreData.cqPractice.length },
          { key: 'board', label: 'Board Questions', icon: Award, count: moreData.boardQuestions.length },
          { key: 'flashcards', label: 'Flashcards', icon: Layers, count: moreData.flashcards.length },
          { key: 'topics', label: 'High-Yield Topics', icon: Flame, count: moreData.importantTopics.length },
          { key: 'forum', label: 'Q&A Discussions', icon: MessageSquare, count: discussions.length },
          { key: 'suggestions', label: 'Teacher Suggestions', icon: Sparkles, count: moreData.suggestions.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/25'
                  : 'bg-[#141620] text-gray-400 hover:text-white hover:bg-white/5 border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-gray-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 1. Important Notes View */}
      {activeSection === 'notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>High-Yield Revision Summaries & Medical Traps</span>
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moreData.importantNotes.map((note) => (
              <div
                key={note.id}
                className="p-5 rounded-2xl bg-[#13151f] border border-white/10 space-y-2.5 shadow-md"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                    High Yield
                  </span>
                  <Bookmark className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <h5 className="text-sm font-bold text-white leading-snug">
                  {note.title}
                </h5>
                <p className="text-xs text-gray-300 whitespace-pre-line leading-relaxed">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. MCQ Practice View */}
      {activeSection === 'mcq' && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#E50914]" />
            <span>Chapterwise MCQ Instant Solve & Medical Analysis</span>
          </h4>

          <div className="space-y-4">
            {moreData.mcqPractice.map((q, idx) => {
              const isRevealed = !!revealedMcqIds[q.id];

              return (
                <div key={q.id} className="p-5 rounded-2xl bg-[#13151f] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="font-bold text-[#FF3540]">MCQ #{idx + 1}</span>
                    <button
                      onClick={() => handleToggleMcqReveal(q.id)}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 underline"
                    >
                      {isRevealed ? 'Hide Explanation' : 'Reveal Solution'}
                    </button>
                  </div>

                  <h5 className="text-sm font-bold text-white">
                    {q.question}
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correctAnswerIndex;

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-xl text-xs font-medium border ${
                            isRevealed && isCorrect
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold'
                              : 'bg-black/30 border-white/5 text-gray-300'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}. {opt}
                        </div>
                      );
                    })}
                  </div>

                  {isRevealed && q.explanation && (
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 space-y-1 animate-in fade-in duration-200">
                      <span className="font-bold text-emerald-400 block">Explanation:</span>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. CQ Practice View (সৃজনশীল) */}
      {activeSection === 'cq' && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#E50914]" />
            <span>Creative Questions (CQ) with Model Answers (ক, খ, গ, ঘ)</span>
          </h4>

          <div className="space-y-4">
            {moreData.cqPractice.map((cq) => (
              <div key={cq.id} className="p-5 sm:p-6 rounded-2xl bg-[#13151f] border border-white/10 space-y-4">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <span className="text-[10px] font-black uppercase text-[#FF3540] tracking-wider block">
                    উদ্দীপক (Stem)
                  </span>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                    {cq.stem}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {cq.questions.map((subQ, sIdx) => (
                    <div key={sIdx} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-400">
                          ({subQ.label}) [{subQ.mark} Marks] {subQ.question}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line pl-2 border-l-2 border-emerald-500/50">
                        {subQ.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Past Board Questions */}
      {activeSection === 'board' && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Past Board & Admission Solves</span>
          </h4>

          <div className="space-y-3">
            {moreData.boardQuestions.map((bq) => (
              <div key={bq.id} className="p-5 rounded-2xl bg-[#13151f] border border-white/10 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-white/10 text-white text-[10px] font-bold">
                    {bq.boardAndYear}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    Topic: {bq.topic}
                  </span>
                </div>
                <h5 className="text-xs sm:text-sm font-bold text-white">
                  {bq.question}
                </h5>
                <p className="text-xs text-gray-300 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                  <strong className="text-emerald-400 block mb-1">Model Solution:</strong>
                  {bq.solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Interactive 3D Flashcards */}
      {activeSection === 'flashcards' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#E50914]" />
              <span>Interactive Memory Flashcards (Click to Flip)</span>
            </h4>
            <span className="text-xs text-gray-400">
              {moreData.flashcards.length} Cards
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moreData.flashcards.map((card) => {
              const isFlipped = !!flippedCardIds[card.id];

              return (
                <div
                  key={card.id}
                  onClick={() => handleFlipCard(card.id)}
                  className={`min-h-[190px] p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between select-none ${
                    isFlipped
                      ? 'bg-gradient-to-br from-[#1b151f] to-[#121622] border-emerald-500/50 shadow-xl'
                      : 'bg-gradient-to-br from-[#15131a] to-[#111318] border-white/10 hover:border-[#E50914]/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-gray-400 uppercase tracking-wider">
                      {card.category}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <RotateCw className="w-3 h-3" />
                      {isFlipped ? 'Answer' : 'Question'}
                    </span>
                  </div>

                  <div className="py-2">
                    {isFlipped ? (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-white whitespace-pre-line leading-relaxed">
                          {card.back}
                        </p>
                        {card.mnemonic && (
                          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-medium">
                            💡 Mnemonic: {card.mnemonic}
                          </div>
                        )}
                      </div>
                    ) : (
                      <h4 className="text-sm font-black text-white leading-snug">
                        {card.front}
                      </h4>
                    )}
                  </div>

                  <div className="text-[10px] text-gray-500 text-center font-medium">
                    {isFlipped ? 'Click to show front' : 'Click to flip and reveal answer'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. High-Yield Topics & Advice */}
      {activeSection === 'topics' && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#E50914]" />
            <span>High-Yield Topic Priority Rating & Probabilities</span>
          </h4>

          <div className="space-y-3">
            {moreData.importantTopics.map((top, idx) => (
              <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-[#13151f] border border-white/10 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-amber-400">
                    {top.importance} Priority
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                    {top.examProbability}
                  </span>
                </div>
                <h5 className="text-sm font-bold text-white">
                  {top.title}
                </h5>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {top.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Q&A Discussions Forum */}
      {activeSection === 'forum' && (
        <div className="space-y-5">
          
          {/* Ask Question Box */}
          <form onSubmit={handlePostQuestion} className="p-4 sm:p-5 rounded-2xl bg-[#141620] border border-white/10 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5 text-[#E50914]" />
              <span>Ask Chapter Doubt to Dr. Siyam & Faculty</span>
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Ask any confusion about this chapter's lecture, textbook line or MCQ..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#E50914]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#E50914] hover:bg-[#b8060f] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </div>
          </form>

          {/* Threads List */}
          <div className="space-y-4">
            {discussions.map((disc) => (
              <div key={disc.id} className="p-5 rounded-2xl bg-[#13151f] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={disc.avatar}
                    alt={disc.author}
                    className="w-8 h-8 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-white">{disc.author}</h5>
                    <span className="text-[10px] text-gray-400">{disc.role} • {disc.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium pl-2 border-l-2 border-[#E50914]">
                  {disc.question}
                </p>

                {/* Replies */}
                <div className="space-y-2 pl-4 pt-1">
                  {disc.replies.map((rep) => (
                    <div key={rep.id} className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={rep.avatar}
                          alt={rep.author}
                          className="w-6 h-6 rounded-full object-cover border border-[#E50914]"
                        />
                        <span className="text-xs font-bold text-white">{rep.author}</span>
                        {rep.isMentor && (
                          <span className="px-1.5 py-0.2 rounded bg-[#E50914] text-white text-[9px] font-black uppercase">
                            Mentor
                          </span>
                        )}
                        <span className="text-[10px] text-gray-500 ml-auto">{rep.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {rep.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 8. Teacher's Suggestions & Announcements */}
      {activeSection === 'suggestions' && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E50914]" />
            <span>Mentor's Final Advice & Live Session Announcements</span>
          </h4>

          <div className="space-y-3">
            {moreData.suggestions.map((sug) => (
              <div key={sug.id} className="p-5 rounded-2xl bg-gradient-to-r from-[#171216] to-[#11131a] border border-[#E50914]/30 space-y-2">
                <span className="text-[10px] font-black uppercase text-[#FF3540]">
                  {sug.author} • {sug.date}
                </span>
                <h5 className="text-sm font-bold text-white">
                  {sug.title}
                </h5>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {sug.text}
                </p>
              </div>
            ))}

            {moreData.announcements.map((ann, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-[10px] font-bold text-amber-400">
                  Announcement • {ann.date}
                </span>
                <h5 className="text-sm font-bold text-white">
                  {ann.title}
                </h5>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {ann.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
