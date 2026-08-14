import React, { useState, useMemo } from 'react';
import { PageView } from '../../types';
import { useFavorites, FavoriteClassItem, FavoriteDocumentItem, FavoriteExamResultItem } from '../../utils/favoriteStorage';
import { useLearning } from '../../context/LearningContext';
import { 
  Bookmark, 
  Heart, 
  Trash2, 
  Play, 
  Download, 
  FileText, 
  Video, 
  Trophy, 
  Search, 
  Filter, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  GraduationCap,
  Calendar,
  Layers,
  ArrowRight,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentFavoritesSectionProps {
  onNavigate: (page: PageView) => void;
  onDownloadResource?: (title: string) => void;
}

export const StudentFavoritesSection: React.FC<StudentFavoritesSectionProps> = ({
  onNavigate,
  onDownloadResource
}) => {
  const { 
    favorites, 
    totalCount, 
    removeFavoriteClass, 
    removeFavoriteDocument, 
    removeFavoriteResult,
    addFavoriteClass,
    addFavoriteDocument
  } = useFavorites();

  const { navigateToCourse } = useLearning();

  const [activeTab, setActiveTab] = useState<'all' | 'classes' | 'documents' | 'results'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState<FavoriteExamResultItem | null>(null);

  // Filtered lists
  const filteredClasses = useMemo(() => {
    return (favorites?.classes || []).filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.mentorName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [favorites?.classes, searchQuery]);

  const filteredDocs = useMemo(() => {
    return (favorites?.documents || []).filter(d => 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [favorites?.documents, searchQuery]);

  const filteredResults = useMemo(() => {
    return (favorites?.results || []).filter(r => 
      r.examTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [favorites?.results, searchQuery]);

  const handleDownload = (doc: FavoriteDocumentItem) => {
    if (onDownloadResource) {
      onDownloadResource(doc.title);
    } else {
      alert(`Downloading ${doc.title} (${doc.fileSize})...`);
    }
  };

  const handleWatchClass = (item: FavoriteClassItem) => {
    if (item.courseId) {
      navigateToCourse(item.courseId);
      onNavigate('course-overview');
    } else {
      onNavigate('chapter-learning');
    }
  };

  const handleRemoveClass = (id: string, title: string) => {
    removeFavoriteClass(id);
  };

  const handleRemoveDoc = (id: string, title: string) => {
    removeFavoriteDocument(id);
  };

  const handleRemoveResult = (id: string) => {
    removeFavoriteResult(id);
    if (selectedResult?.id === id) {
      setSelectedResult(null);
    }
  };

  return (
    <div id="student-favorites-section" className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1a1215] via-[#14151e] to-[#0f1017] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.6)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E50914]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E50914]/20 border border-[#E50914]/40 text-[#FF3540] text-xs font-black uppercase">
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>Saved High-Yield Items</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading text-white">
              My Favourites & Saved Vault
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-2xl">
              এখানে আপনার বুকমার্ক করা গুরুত্বপূর্ণ ক্লাস, রিভিশন হ্যান্ডনোট/ডকুমেন্ট এবং পরীক্ষার ফলাফল সংরক্ষিত রয়েছে। পরীক্ষার আগের দ্রুত রিভিশনের জন্য এগুলো এক ক্লিকেই অ্যাক্সেস করুন।
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-[#12141c] border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E50914]/15 text-[#FF3540] flex items-center justify-center font-black text-lg">
                {totalCount}
              </div>
              <div className="text-xs">
                <span className="text-gray-400 block font-medium">Total Saved</span>
                <span className="text-white font-bold">Items in Vault</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All Favorites', count: totalCount, icon: <Bookmark className="w-4 h-4" /> },
            { id: 'classes', label: 'Saved Classes', count: favorites.classes.length, icon: <Video className="w-4 h-4 text-[#FF3540]" /> },
            { id: 'documents', label: 'Saved Documents', count: favorites.documents.length, icon: <FileText className="w-4 h-4 text-blue-400" /> },
            { id: 'results', label: 'Pinned Results', count: favorites.results.length, icon: <Trophy className="w-4 h-4 text-amber-400" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[#E50914] text-white shadow-[0_4px_16px_rgba(229,9,20,0.35)]'
                  : 'bg-[#111318] text-gray-400 hover:text-white hover:bg-[#161822] border border-white/5'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px] md:min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved class, note or result..."
            className="w-full pl-9 pr-4 py-2.5 bg-[#111318] border border-white/10 focus:border-[#E50914] rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Content Rendering based on Active Tab */}

      {/* 1. SAVED CLASSES */}
      {(activeTab === 'all' || activeTab === 'classes') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-[#FF3540]" />
              <h3 className="text-base sm:text-lg font-black font-heading text-white">
                Saved Video Lectures & Masterclasses ({filteredClasses.length})
              </h3>
            </div>
            {activeTab === 'all' && favorites.classes.length > 0 && (
              <button 
                onClick={() => setActiveTab('classes')}
                className="text-xs text-[#FF3540] hover:underline font-bold flex items-center gap-1"
              >
                <span>View All Classes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {filteredClasses.length === 0 ? (
            <div className="p-8 bg-[#111318] border border-white/5 rounded-2xl text-center space-y-3">
              <Video className="w-10 h-10 text-gray-600 mx-auto" />
              <h4 className="text-sm font-bold text-gray-300">কোনো পছন্দের ক্লাস সেভ করা নেই</h4>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                যেকোনো চ্যাপ্টার ভিডিও দেখার সময় Bookmark বাটনে ক্লিক করে এখানে সহজে সেভ করে রাখতে পারেন।
              </p>
              <button
                onClick={() => onNavigate('chapter-learning')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Browse Course Classes</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredClasses.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#111318] border border-white/10 hover:border-[#E50914]/50 rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative h-44 overflow-hidden bg-black/40">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent to-black/40" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-[#E50914] text-white text-[10px] font-black uppercase shadow">
                        {item.subject}
                      </div>

                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleRemoveClass(item.id, item.title)}
                          title="Remove from Favourites"
                          className="p-1.5 rounded-lg bg-black/60 hover:bg-red-500/80 text-white/80 hover:text-white transition-colors backdrop-blur-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Duration Tag */}
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-white text-[11px] font-mono font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#FF3540]" />
                        <span>{item.duration}</span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] text-gray-400 block font-semibold">{item.chapter}</span>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#FF3540] transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-400 font-medium">
                        Mentor: <strong className="text-gray-200">{item.mentorName}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="p-4 pt-0">
                    <button
                      onClick={() => handleWatchClass(item)}
                      className="w-full py-2.5 px-4 bg-[#E50914] hover:bg-[#b8060f] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_2px_10px_rgba(229,9,20,0.3)]"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch Saved Class</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. SAVED DOCUMENTS & REVISION NOTES */}
      {(activeTab === 'all' || activeTab === 'documents') && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <h3 className="text-base sm:text-lg font-black font-heading text-white">
                Saved Notes & Revision Documents ({filteredDocs.length})
              </h3>
            </div>
            {activeTab === 'all' && favorites.documents.length > 0 && (
              <button 
                onClick={() => setActiveTab('documents')}
                className="text-xs text-[#FF3540] hover:underline font-bold flex items-center gap-1"
              >
                <span>View All Documents</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {filteredDocs.length === 0 ? (
            <div className="p-8 bg-[#111318] border border-white/5 rounded-2xl text-center space-y-3">
              <FileText className="w-10 h-10 text-gray-600 mx-auto" />
              <h4 className="text-sm font-bold text-gray-300">কোনো ডকুমেন্টস বা নোট সেভ করা নেই</h4>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                হাই-ইল্ড নেমোনিক শিট ও ফর্মুলা শিট বুকমার্ক করে রাখুন।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-[#111318] border border-white/10 hover:border-blue-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 transition-all group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-blue-500/15 text-blue-400 rounded">
                        {doc.subject} • {doc.category}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveDoc(doc.id, doc.title)}
                        title="Remove Document"
                        className="text-gray-500 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                      {doc.title}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
                      <span>{doc.pages} Pages</span>
                      <span>•</span>
                      <span>{doc.fileSize}</span>
                      <span>•</span>
                      <span className="font-mono text-gray-300">{doc.fileType}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. SAVED / PINNED EXAM RESULTS */}
      {(activeTab === 'all' || activeTab === 'results') && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="text-base sm:text-lg font-black font-heading text-white">
                Pinned Exam Results & Mistake Bookmarks ({filteredResults.length})
              </h3>
            </div>
            {activeTab === 'all' && favorites.results.length > 0 && (
              <button 
                onClick={() => setActiveTab('results')}
                className="text-xs text-[#FF3540] hover:underline font-bold flex items-center gap-1"
              >
                <span>View All Results</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {filteredResults.length === 0 ? (
            <div className="p-8 bg-[#111318] border border-white/5 rounded-2xl text-center space-y-3">
              <Trophy className="w-10 h-10 text-gray-600 mx-auto" />
              <h4 className="text-sm font-bold text-gray-300">কোনো পরীক্ষার রেজাল্ট পিন করা নেই</h4>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                মডেল টেস্ট দেওয়ার পর আপনার গুরুত্বপূর্ণ স্কোরকার্ড পিন করে রাখুন।
              </p>
              <button
                onClick={() => onNavigate('exam')}
                className="px-4 py-2 bg-[#E50914] text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Take Model Test</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResults.map((res) => (
                <div
                  key={res.id}
                  className="bg-[#111318] border border-white/10 hover:border-amber-400/40 rounded-2xl p-5 transition-all space-y-4 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-amber-400/15 text-amber-400 rounded">
                          {res.subject}
                        </span>
                        <span className="text-xs text-gray-400">{res.date}</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-amber-400 transition-colors">
                        {res.examTitle}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveResult(res.id)}
                      title="Unpin Result"
                      className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 py-3 bg-[#151722] rounded-xl px-3 border border-white/5 text-center">
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold">Marks Score</div>
                      <div className="text-sm font-black text-white">{res.score} / {res.totalMarks}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold">Merit Rank</div>
                      <div className="text-sm font-black text-amber-400">#{res.rank}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold">Accuracy</div>
                      <div className="text-sm font-black text-emerald-400">{res.accuracy}%</div>
                    </div>
                  </div>

                  {res.keyWeakness && (
                    <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-300">
                      <strong className="text-red-200 block font-semibold mb-0.5">📌 Pinned Review Point:</strong>
                      {res.keyWeakness}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-gray-400">
                      Penalties: -{res.negativeMarks} Negative Marks
                    </span>
                    <button
                      onClick={() => onNavigate('exam')}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Retake Similar Test</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
