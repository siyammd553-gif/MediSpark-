import React, { useState } from 'react';
import { PageView, QnAQuestion } from '../types';
import { useQnAData } from '../utils/qnaStorage';
import { useStudentProfile } from '../utils/studentStorage';
import {
  MessageSquare,
  Search,
  PlusCircle,
  ThumbsUp,
  CheckCircle2,
  Sparkles,
  Award,
  GraduationCap,
  BookOpen,
  Filter,
  Send,
  HelpCircle,
  X,
  Share2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Bot,
  User,
  Check
} from 'lucide-react';

interface QnAPageProps {
  onNavigate: (page: PageView) => void;
}

export const QnAPage: React.FC<QnAPageProps> = ({ onNavigate }) => {
  const { questions, postQuestion, postAnswer, upvoteQuestion } = useQnAData();
  const { profile } = useStudentProfile();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedBatch, setSelectedBatch] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Answered' | 'Unresolved'>('All');

  // Modal State
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSubject, setNewSubject] = useState<QnAQuestion['subject']>('Botany');
  const [newBatch, setNewBatch] = useState('HSC 29');
  const [newBookRef, setNewBookRef] = useState('');
  const [aiAutoSolve, setAiAutoSolve] = useState(true);

  // Reply Box State per question
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [expandedThreads, setExpandedThreads] = useState<Record<string, boolean>>({
    'qna-1': true,
    'qna-2': true,
  });

  const subjects = [
    'All',
    'Botany',
    'Zoology',
    'Chemistry',
    'Physics',
    'English',
    'General Knowledge',
  ];

  const batches = ['All', 'HSC 29', 'HSC 28', 'Medical Admission'];

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSubject = selectedSubject === 'All' || q.subject === selectedSubject;
    const matchesBatch = selectedBatch === 'All' || q.batch.includes(selectedBatch) || (selectedBatch === 'HSC 29' && q.batch === 'HSC 29') || (selectedBatch === 'HSC 28' && q.batch === 'HSC 28');
    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Answered'
        ? q.answers.length > 0
        : q.answers.length === 0;

    return matchesSearch && matchesSubject && matchesBatch && matchesStatus;
  });

  const handleToggleExpand = (id: string) => {
    setExpandedThreads((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    postQuestion({
      title: newTitle.trim(),
      description: newDescription.trim(),
      subject: newSubject,
      batch: newBatch,
      authorName: profile.name || 'Student Aspirant',
      authorRole: `${newBatch} Aspirant • MediSpark`,
      authorAvatar: profile.avatar || undefined,
      tags: [newSubject, newBatch, 'Textbook Doubt'],
      bookReference: newBookRef.trim() || undefined,
      aiAutoSolve: aiAutoSolve,
    });

    setNewTitle('');
    setNewDescription('');
    setNewBookRef('');
    setIsAskModalOpen(false);
  };

  const handleSendReply = (questionId: string) => {
    if (!replyText.trim()) return;
    postAnswer(questionId, replyText.trim(), profile.name || 'Student Aspirant', 'Student');
    setReplyText('');
    setActiveReplyId(null);
    setExpandedThreads((prev) => ({ ...prev, [questionId]: true }));
  };

  return (
    <div id="qna-main-page" className="min-h-screen bg-[#090909] text-white py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E50914]/15 border border-[#E50914]/30 text-[#FF3540] text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MediSpark Live Doubt Clearance & Q&A</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-heading text-white tracking-tight">
              Medical & Academic Q&A
            </h1>
            <p className="text-gray-400 text-sm sm:text-base mt-1 max-w-2xl leading-relaxed">
              Ask doubts, get instant AI textbook citations (Abul Hasan & Gazi Ajmal), and verified explanations from Md. Siyam Talukder & medical faculty.
            </p>
          </div>

          <button
            id="ask-doubt-top-btn"
            onClick={() => setIsAskModalOpen(true)}
            className="self-start md:self-auto px-5 py-3 rounded-xl bg-[#E50914] hover:bg-[#b8060f] text-white text-sm font-black transition-all flex items-center gap-2 shadow-[0_4px_20px_rgba(229,9,20,0.4)] active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Ask a Doubt</span>
          </button>
        </div>

        {/* Search & Subject Bar */}
        <div className="bg-[#111318] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                id="search-qna-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, Abul Hasan page, or question..."
                className="w-full pl-10 pr-4 py-2 bg-[#171922] border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#E50914]"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
              {(['All', 'Answered', 'Unresolved'] as const).map((st) => (
                <button
                  key={st}
                  id={`status-filter-${st.toLowerCase()}`}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-[#E50914] text-white shadow-[0_2px_10px_rgba(229,9,20,0.4)]'
                      : 'bg-[#181b24] text-gray-400 hover:text-white border border-white/5'
                  }`}
                >
                  {st === 'All' ? 'All Threads' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Filter Pills */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/5 overflow-x-auto no-scrollbar">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider hidden sm:inline mr-1">
              Subject:
            </span>
            {subjects.map((subj) => (
              <button
                key={subj}
                id={`subj-filter-${subj.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setSelectedSubject(subj)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSubject === subj
                    ? 'bg-white/15 text-white border border-white/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>

        {/* Questions Stream */}
        <div className="space-y-5">
          {filteredQuestions.map((q) => {
            const isExpanded = expandedThreads[q.id] ?? false;
            return (
              <div
                key={q.id}
                id={`qna-card-${q.id}`}
                className="bg-[#111318] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-md transition-all hover:border-white/20 space-y-4"
              >
                {/* Question Top Info */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#E50914]/20 border border-[#E50914]/40 text-[#FF3540] text-xs font-extrabold uppercase">
                      {q.subject}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-gray-300 text-[11px] font-bold">
                      {q.batch}
                    </span>
                    {q.bookReference && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-medium hidden sm:inline">
                        📖 {q.bookReference}
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-gray-400">{q.createdAt}</span>
                </div>

                {/* Question Title & Description */}
                <div>
                  <h2 className="text-lg sm:text-xl font-black font-heading text-white leading-snug">
                    {q.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed whitespace-pre-line">
                    {q.description}
                  </p>
                </div>

                {/* Author & Tag strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2.5">
                    {q.authorAvatar ? (
                      <img
                        src={q.authorAvatar}
                        alt={q.authorName}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover border border-white/20"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className="text-xs">
                      <span className="font-bold text-white">{q.authorName}</span>
                      <span className="text-gray-400 text-[11px] ml-1.5">• {q.authorRole}</span>
                    </div>
                  </div>

                  {/* Actions: Upvote & Reply Toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      id={`upvote-qna-${q.id}`}
                      onClick={() => upvoteQuestion(q.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        q.userUpvoted
                          ? 'bg-[#E50914]/20 border border-[#E50914] text-[#FF3540]'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{q.upvotes}</span>
                    </button>

                    <button
                      id={`toggle-replies-${q.id}`}
                      onClick={() => handleToggleExpand(q.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold border border-white/10 transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#FF3540]" />
                      <span>{q.answers.length} Answers</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Answers Section (Collapsible) */}
                {isExpanded && (
                  <div className="pt-4 space-y-3 border-t border-white/5">
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Answers & Solutions ({q.answers.length})
                    </div>

                    {q.answers.length === 0 ? (
                      <div className="p-4 rounded-xl bg-[#141620] border border-white/5 text-center text-xs text-gray-400">
                        No answers yet. Be the first to share an explanation or ask MediSpark AI!
                      </div>
                    ) : (
                      q.answers.map((ans) => {
                        const isMentor = ans.authorRole === 'Mentor' || ans.isVerifiedMentor;
                        const isAI = ans.authorRole === 'MediSpark AI';

                        return (
                          <div
                            key={ans.id}
                            className={`p-4 rounded-xl space-y-2 border ${
                              isMentor
                                ? 'bg-gradient-to-br from-[#1a1215] via-[#141620] to-[#12141c] border-[#E50914]/40 shadow-sm'
                                : isAI
                                ? 'bg-[#121622] border-blue-500/30'
                                : 'bg-[#141620] border-white/5'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                {isAI ? (
                                  <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                                    <Bot className="w-3.5 h-3.5" />
                                  </div>
                                ) : ans.authorAvatar ? (
                                  <img
                                    src={ans.authorAvatar}
                                    alt={ans.authorName}
                                    referrerPolicy="no-referrer"
                                    className="w-6 h-6 rounded-full object-cover border border-white/20"
                                  />
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                                    {ans.authorName.charAt(0)}
                                  </div>
                                )}
                                <span className="text-xs font-bold text-white">
                                  {ans.authorName}
                                </span>
                                {isMentor && (
                                  <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.2 bg-[#E50914] text-white rounded-full">
                                    <Award className="w-2.5 h-2.5" /> Verified Faculty
                                  </span>
                                )}
                                {isAI && (
                                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.2 bg-blue-500/20 border border-blue-500/40 text-blue-300 rounded-full">
                                    AI Doubt Solver
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-gray-400">{ans.createdAt}</span>
                            </div>

                            <div className="text-xs sm:text-sm text-gray-200 leading-relaxed whitespace-pre-line">
                              {ans.content}
                            </div>
                          </div>
                        );
                      })
                    )}

                    {/* Quick Reply Form */}
                    <div className="pt-2">
                      {activeReplyId === q.id ? (
                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your explanation or note here..."
                            className="w-full p-3 bg-[#171922] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#E50914]"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveReplyId(null);
                                setReplyText('');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 text-xs hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSendReply(q.id)}
                              className="px-4 py-1.5 rounded-lg bg-[#E50914] text-white text-xs font-bold flex items-center gap-1.5"
                            >
                              <Send className="w-3 h-3" />
                              <span>Post Answer</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveReplyId(q.id)}
                          className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-semibold text-left border border-white/5 transition-colors"
                        >
                          Write a solution or comment...
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredQuestions.length === 0 && (
            <div className="text-center py-16 bg-[#111318] border border-white/10 rounded-2xl p-6">
              <HelpCircle className="w-10 h-10 text-gray-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No questions found</h3>
              <p className="text-xs text-gray-400 mt-1">
                Be the first to post a biology or medical doubt!
              </p>
              <button
                onClick={() => setIsAskModalOpen(true)}
                className="mt-4 px-4 py-2 bg-[#E50914] text-white text-xs font-bold rounded-xl"
              >
                Ask a Doubt Now
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Ask Question Modal */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            id="ask-modal-backdrop"
            onClick={() => setIsAskModalOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          <div className="relative w-full max-w-2xl bg-[#111318] border border-white/10 rounded-2xl shadow-2xl z-10 text-white overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-5 bg-gradient-to-r from-[#1a1215] to-[#111318] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E50914]/20 border border-[#E50914]/40 flex items-center justify-center text-[#FF3540]">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    Ask a Medical / Academic Doubt
                  </h3>
                  <p className="text-xs text-gray-400">
                    Get answers from Siyam Talukder & MediSpark AI
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAskModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="p-5 sm:p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Question Title / Topic *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., মাইটোকন্ড্রিয়ার বহিঃঝিল্লি ও অন্তঃঝিল্লির এনজাইম বণ্টন"
                  className="w-full p-3 bg-[#171922] border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Subject *
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as any)}
                    className="w-full p-3 bg-[#171922] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#E50914]"
                  >
                    <option value="Botany">Botany (উদ্ভিদবিজ্ঞান)</option>
                    <option value="Zoology">Zoology (প্রাণিবিজ্ঞান)</option>
                    <option value="Chemistry">Chemistry (রসায়ন)</option>
                    <option value="Physics">Physics (পদার্থবিজ্ঞান)</option>
                    <option value="English">English</option>
                    <option value="General Knowledge">General Knowledge (সাধারণ জ্ঞান)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Batch *
                  </label>
                  <select
                    value={newBatch}
                    onChange={(e) => setNewBatch(e.target.value)}
                    className="w-full p-3 bg-[#171922] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#E50914]"
                  >
                    <option value="HSC 29">HSC 29 Batch</option>
                    <option value="HSC 28">HSC 28 Batch</option>
                    <option value="Medical Admission">Medical Admission</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Textbook Citation / Reference (Optional)
                </label>
                <input
                  type="text"
                  value={newBookRef}
                  onChange={(e) => setNewBookRef(e.target.value)}
                  placeholder="e.g., ড. আবুল হাসান — উদ্ভিদবিজ্ঞান (অধ্যায় ১, পৃষ্ঠা ৩৩)"
                  className="w-full p-3 bg-[#171922] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Detailed Explanation / MCQ Context *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe your confusion clearly. Mention options or page details if applicable..."
                  className="w-full p-3 bg-[#171922] border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#E50914]"
                />
              </div>

              {/* Instant AI Solver Toggle */}
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Bot className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-xs font-bold text-white">
                      Instant AI Diagnosis & Solution
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Receive an immediate textbook breakdown right away
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={aiAutoSolve}
                  onChange={(e) => setAiAutoSolve(e.target.checked)}
                  className="w-4 h-4 accent-[#E50914] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAskModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="submit-doubt-btn"
                  type="submit"
                  className="px-6 py-2 bg-[#E50914] hover:bg-[#b8060f] text-white text-xs font-black rounded-xl shadow-[0_4px_16px_rgba(229,9,20,0.4)] flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Question</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
