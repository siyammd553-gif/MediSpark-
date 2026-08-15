import React, { useState } from 'react';
import { PageView, StudentProfile, ExamAttempt } from '../../types';
import { LeaderboardView } from './LeaderboardView';
import { useFavorites } from '../../utils/favoriteStorage';
import { useExamAttempts, useLeaderboard } from '../../utils/examApi';
import { 
  Trophy, 
  BarChart2, 
  Play, 
  TrendingUp, 
  Bookmark, 
  FileQuestion
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExamResultAndLeaderboardSectionProps {
  profile: StudentProfile;
  onNavigate: (page: PageView) => void;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return iso || '—';
  }
}

function attemptToDisplayResult(attempt: ExamAttempt, rank: number | null, totalParticipants: number) {
  return {
    id: attempt.id,
    examTitle: attempt.examTitle,
    subject: attempt.examType === 'medical' ? 'Medical Admission' : `HSC · ${attempt.subject}`,
    date: formatDate(attempt.submittedAt),
    score: attempt.finalScore,
    totalMarks: attempt.totalMarks,
    negativeMarks: attempt.negativeDeduction,
    accuracy: attempt.accuracy,
    rank: rank ?? 0,
    totalParticipants,
    subjectBreakdown: [
      { subject: attempt.subject, score: attempt.finalScore, total: attempt.totalMarks },
    ],
    isAutosubmitted: attempt.status === 'autosubmitted',
    submittedInSeconds: attempt.submittedInSeconds,
  };
}

export const ExamResultAndLeaderboardSection: React.FC<ExamResultAndLeaderboardSectionProps> = ({
  profile,
  onNavigate
}) => {
  const [subView, setSubView] = useState<'all' | 'results' | 'leaderboard'>('all');
  const { favorites, addFavoriteResult, removeFavoriteResult } = useFavorites();
  const { attempts, isLoading: attemptsLoading } = useExamAttempts();
  const { leaderboard } = useLeaderboard();
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => (favorites?.results || []).map(r => r.id));

  const totalParticipants = leaderboard?.entries.length || 0;
  const myRank = leaderboard?.myRank ?? null;
  const displayResults = attempts.map((attempt) =>
    attemptToDisplayResult(attempt, myRank, totalParticipants)
  );

  const avgAccuracy = displayResults.length > 0
    ? Math.round(displayResults.reduce((sum, r) => sum + (r.accuracy || 0), 0) / displayResults.length)
    : profile.overallScore;
  const avgNegative = displayResults.length > 0
    ? Number((displayResults.reduce((sum, r) => sum + (r.negativeMarks || 0), 0) / displayResults.length).toFixed(2))
    : 0;

  const togglePinResult = (res: any) => {
    const isPinned = (favorites?.results || []).some(r => r.id === res.id || r.examTitle === res.examTitle);
    if (isPinned) {
      removeFavoriteResult(res.id);
      setPinnedIds(prev => prev.filter(id => id !== res.id));
    } else {
      addFavoriteResult({
        id: res.id,
        examTitle: res.examTitle,
        subject: res.subject,
        score: res.score,
        totalMarks: res.totalMarks,
        negativeMarks: res.negativeMarks,
        rank: res.rank,
        totalParticipants: res.totalParticipants,
        date: res.date,
        accuracy: Math.round((res.score / res.totalMarks) * 100),
        keyWeakness: res.isAutosubmitted ? 'Auto-submitted (interrupted) attempt' : `Focus review on ${res.subjectBreakdown?.[0]?.subject || 'key concepts'}`
      });
      setPinnedIds(prev => [...prev, res.id]);
      confetti({ particleCount: 25, spread: 40, origin: { y: 0.8 } });
    }
  };

  const renderResultCard = (res: any) => {
    const isPinned = (favorites?.results || []).some(r => r.id === res.id || r.examTitle === res.examTitle);
    return (
      <div
        key={res.id}
        className="p-5 bg-[#111318] border border-white/10 rounded-2xl hover:border-[#E50914]/40 transition-all space-y-4 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#E50914]/20 text-[#FF3540] rounded">
                {res.subject}
              </span>
              <span className="text-xs text-gray-400 font-semibold">{res.date}</span>
              {res.isAutosubmitted && (
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-amber-500/15 text-amber-400 rounded border border-amber-500/30">
                  Auto
                </span>
              )}
            </div>
            <h4 className="text-sm sm:text-base font-extrabold text-white">
              {res.examTitle}
            </h4>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-lg sm:text-xl font-black text-white">{res.score} / {res.totalMarks}</div>
              <div className="text-[11px] text-[#FF3540] font-bold">
                {res.negativeMarks > 0 ? `Negative: -${res.negativeMarks}` : 'No Negative Marking'}
              </div>
            </div>

            <div className="px-3 py-1.5 bg-amber-400/10 border border-amber-400/20 text-amber-400 rounded-xl text-center">
              <div className="text-[10px] font-bold uppercase">Rank</div>
              <div className="text-xs sm:text-sm font-black">
                {res.rank > 0 ? `#${res.rank} / ${res.totalParticipants}` : '—'}
              </div>
            </div>

            <button
              type="button"
              onClick={() => togglePinResult(res)}
              title={isPinned ? "Saved to Favourites" : "Save to Favourites"}
              className={`p-2 rounded-xl border transition-all ${
                isPinned
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Subject breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-white/5">
          {(res.subjectBreakdown || []).map((sb: any, idx: number) => (
            <div key={idx} className="p-2 bg-[#0a0b0e] rounded-xl border border-white/5 text-center">
              <div className="text-[10px] text-gray-400 font-semibold truncate">{sb.subject}</div>
              <div className="text-xs font-extrabold text-white mt-0.5">{sb.score} / {sb.total}</div>
            </div>
          ))}
          <div className="p-2 bg-[#0a0b0e] rounded-xl border border-white/5 text-center">
            <div className="text-[10px] text-gray-400 font-semibold">Accuracy</div>
            <div className="text-xs font-extrabold text-emerald-400 mt-0.5">{res.accuracy}%</div>
          </div>
        </div>
      </div>
    );
  };

  const EmptyState = () => (
    <div className="p-8 sm:p-10 bg-[#111318] border border-white/10 rounded-2xl text-center space-y-4 shadow-md">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center">
        <FileQuestion className="w-8 h-8 text-[#FF3540]" />
      </div>
      <div>
        <h3 className="text-base sm:text-lg font-black font-heading text-white">No Exam Attempts Yet</h3>
        <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-md mx-auto">
          Take a chapter model test from your enrolled course to record your first attempt under your student account.
        </p>
      </div>
      <button
        onClick={() => onNavigate('exam')}
        className="px-5 py-2.5 bg-[#E50914] hover:bg-[#b8060f] text-white text-xs font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2"
      >
        <Play className="w-3.5 h-3.5 fill-current" />
        Take Your First Model Test
      </button>
    </div>
  );

  return (
    <div id="exam-result-and-leaderboard-section" className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#191118] via-[#131520] to-[#0e1017] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.6)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase">
              <Trophy className="w-3.5 h-3.5" />
              <span>National Merit & Performance Center</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading text-white">
              Exam Result & Leaderboard
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-2xl">
              সেন্ট্রাল ও চ্যাপ্টারভিত্তিক মডেল টেস্টের বিস্তারিত ফলাফল, নেগেটিভ মার্কিং বিশ্লেষণ এবং অল-বাংলাদেশ ন্যাশনাল মেরিট পজিশন পর্যবেক্ষণ করুন।
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('exam')}
              className="px-5 py-3 bg-[#E50914] hover:bg-[#b8060f] text-white text-xs sm:text-sm font-bold rounded-xl shadow-[0_4px_16px_rgba(229,9,20,0.4)] transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Take New Model Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111318] border border-white/10 rounded-2xl p-4 sm:p-5">
          <span className="text-xs text-gray-400 font-medium block">Average Accuracy</span>
          <div className="text-2xl font-black text-white mt-1">{avgAccuracy}%</div>
          <span className="text-[11px] text-emerald-400 font-bold">
            {displayResults.length > 0 ? `${displayResults.length} Attempt(s) Recorded` : 'No attempts yet'}
          </span>
        </div>

        <div className="bg-[#111318] border border-white/10 rounded-2xl p-4 sm:p-5">
          <span className="text-xs text-gray-400 font-medium block">National Merit Rank</span>
          <div className="text-2xl font-black text-amber-400 mt-1">#{myRank ?? profile.rank}</div>
          <span className="text-[11px] text-gray-400 font-medium">
            Out of {totalParticipants || profile.totalStudents} Aspirants
          </span>
        </div>

        <div className="bg-[#111318] border border-white/10 rounded-2xl p-4 sm:p-5">
          <span className="text-xs text-gray-400 font-medium block">Model Tests Completed</span>
          <div className="text-2xl font-black text-white mt-1">{displayResults.length} Exams</div>
          <span className="text-[11px] text-[#FF3540] font-bold">
            {attemptsLoading ? 'Loading...' : 'Tied to your student account'}
          </span>
        </div>

        <div className="bg-[#111318] border border-white/10 rounded-2xl p-4 sm:p-5">
          <span className="text-xs text-gray-400 font-medium block">Negative Mark Penalty</span>
          <div className="text-2xl font-black text-white mt-1">{avgNegative > 0 ? `-${avgNegative}` : '0'} Avg</div>
          <span className="text-[11px] text-blue-400 font-bold">Strict DGHS Rules</span>
        </div>
      </div>

      {/* 3. Section View Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        {[
          { id: 'all', label: 'All-in-One View', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'results', label: 'Detailed Exam Results', icon: <BarChart2 className="w-4 h-4 text-[#FF3540]" /> },
          { id: 'leaderboard', label: 'National Leaderboard', icon: <Trophy className="w-4 h-4 text-amber-400" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubView(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              subView === tab.id
                ? 'bg-[#E50914] text-white shadow-md'
                : 'bg-[#111318] text-gray-400 hover:text-white hover:bg-[#161822] border border-white/5'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 4. Content Area */}
      {subView === 'all' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (7 cols): Exam Results */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#E50914]" />
                <h3 className="text-base sm:text-lg font-black font-heading text-white">
                  My Model Test Scorecards
                </h3>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                {displayResults.length} Tests Recorded
              </span>
            </div>

            {displayResults.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-4">
                {displayResults.map(renderResultCard)}
              </div>
            )}
          </div>

          {/* Right Column (5 cols): Leaderboard View */}
          <div className="lg:col-span-5 space-y-4">
            <LeaderboardView />
          </div>

        </div>
      )}

      {/* Standalone Detailed Results Sub-view */}
      {subView === 'results' && (
        <div className="space-y-4">
          <div className="bg-[#111318] border border-white/10 rounded-2xl p-5 sm:p-7 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-black font-heading text-white">
                  Medical Admission Mock Exam Results
                </h3>
                <p className="text-xs text-gray-400">Detailed scorecards, negative mark penalties & merit standing</p>
              </div>
              <button
                onClick={() => onNavigate('exam')}
                className="px-4 py-2 bg-[#E50914] text-white text-xs font-bold rounded-xl shadow-md"
              >
                Take Next Model Test →
              </button>
            </div>

            {displayResults.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-4">
                {displayResults.map(renderResultCard)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Standalone National Leaderboard Sub-view */}
      {subView === 'leaderboard' && (
        <LeaderboardView />
      )}

    </div>
  );
};