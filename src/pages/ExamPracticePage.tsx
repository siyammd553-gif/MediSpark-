import React, { useState, useEffect } from 'react';
import { PageView, Question } from '../types';
import { MOCK_QUESTIONS } from '../data/mockData';
import { Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw, Trophy, ArrowRight, ArrowLeft, BarChart2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExamPracticePageProps {
  onNavigate: (page: PageView) => void;
}

export const ExamPracticePage: React.FC<ExamPracticePageProps> = ({ onNavigate }) => {
  const [questions] = useState<Question[]>(MOCK_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(300); // 5 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreData, setScoreData] = useState<{
    correctCount: number;
    wrongCount: number;
    unansweredCount: number;
    rawScore: number;
    negativeDeduction: number;
    finalScore: number;
    accuracy: number;
  } | null>(null);

  // Timer effect
  useEffect(() => {
    if (isSubmitted || timeLeftSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted, timeLeftSeconds]);

  const handleSelectOption = (qId: string, optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: optIndex,
    }));
  };

  const handleClearOption = (qId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
  };

  const handleSubmitExam = () => {
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      if (selected === undefined) {
        unanswered++;
      } else if (selected === q.correctAnswerIndex) {
        correct++;
      } else {
        wrong++;
      }
    });

    const negative = wrong * 0.25;
    const final = Math.max(0, correct * 1.0 - negative);
    const attempted = correct + wrong;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

    setScoreData({
      correctCount: correct,
      wrongCount: wrong,
      unansweredCount: unanswered,
      rawScore: correct,
      negativeDeduction: negative,
      finalScore: Number(final.toFixed(2)),
      accuracy,
    });

    setIsSubmitted(true);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
  };

  const handleRestartExam = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setTimeLeftSeconds(300);
    setIsSubmitted(false);
    setScoreData(null);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];

  return (
    <div id="medispark-exam-page" className="min-h-screen bg-[#090909] text-white py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-[#111318] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 bg-[#E50914] text-white rounded">
                DGHS Standard
              </span>
              <span className="text-xs text-gray-400">Negative Marking: -0.25 per error</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black font-heading text-white mt-1">
              Medical Admission Rapid Model Test — 01
            </h1>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {!isSubmitted && (
              <div className={`px-4 py-2 rounded-xl flex items-center gap-2 font-mono font-bold text-sm border ${
                timeLeftSeconds < 60
                  ? 'bg-red-500/20 text-red-400 border-red-500 animate-pulse'
                  : 'bg-[#161822] text-white border-white/10'
              }`}>
                <Clock className="w-4 h-4 text-[#FF3540]" />
                <span>{formatTime(timeLeftSeconds)}</span>
              </div>
            )}

            {!isSubmitted ? (
              <button
                id="submit-exam-btn"
                onClick={handleSubmitExam}
                className="px-5 py-2 bg-[#E50914] hover:bg-[#b8060f] text-white text-xs sm:text-sm font-bold rounded-xl shadow-[0_2px_12px_rgba(229,9,20,0.4)] transition-all"
              >
                Submit Exam
              </button>
            ) : (
              <button
                onClick={handleRestartExam}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake Test</span>
              </button>
            )}
          </div>
        </div>

        {/* Scorecard Results View after Submission */}
        {isSubmitted && scoreData && (
          <div className="bg-gradient-to-r from-[#171216] via-[#12141a] to-[#0d0e12] border border-[#E50914]/40 rounded-2xl p-6 sm:p-8 shadow-2xl animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs font-bold uppercase text-[#FF3540]">Exam Completed</span>
                <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
                  Your Diagnostic Scorecard
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Evaluated with DGHS negative marking rules (-0.25 for incorrect responses).
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-4 bg-[#0a0b0e] rounded-2xl border border-white/10 text-center">
                  <div className="text-xs text-gray-400">Final Merit Score</div>
                  <div className="text-3xl font-black text-[#FF3540]">
                    {scoreData.finalScore} <span className="text-sm text-gray-400 font-normal">/ {questions.length}</span>
                  </div>
                </div>
                <div className="p-4 bg-[#0a0b0e] rounded-2xl border border-white/10 text-center">
                  <div className="text-xs text-gray-400">Estimated Zone</div>
                  <div className="text-sm font-black text-amber-400">
                    {scoreData.finalScore >= 7 ? 'DMC / ShSMC Zone' : scoreData.finalScore >= 5 ? 'Govt. Medical' : 'Needs Practice'}
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
              <div className="p-3 bg-[#161822] rounded-xl border border-white/5 text-center">
                <div className="text-xs text-emerald-400 font-bold">✓ Correct (+1.0)</div>
                <div className="text-xl font-extrabold text-white mt-1">{scoreData.correctCount}</div>
              </div>
              <div className="p-3 bg-[#161822] rounded-xl border border-white/5 text-center">
                <div className="text-xs text-[#FF3540] font-bold">✗ Incorrect (-0.25)</div>
                <div className="text-xl font-extrabold text-[#FF3540] mt-1">{scoreData.wrongCount} (-{scoreData.negativeDeduction})</div>
              </div>
              <div className="p-3 bg-[#161822] rounded-xl border border-white/5 text-center">
                <div className="text-xs text-gray-400 font-bold">Unanswered</div>
                <div className="text-xl font-extrabold text-gray-300 mt-1">{scoreData.unansweredCount}</div>
              </div>
              <div className="p-3 bg-[#161822] rounded-xl border border-white/5 text-center">
                <div className="text-xs text-blue-400 font-bold">Accuracy Rate</div>
                <div className="text-xl font-extrabold text-white mt-1">{scoreData.accuracy}%</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => onNavigate('rank-predictor')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Calculate Full Medical Rank with GPA →</span>
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-5 py-2.5 bg-[#E50914] hover:bg-[#b8060f] text-white text-xs font-bold rounded-xl shadow-md"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Question Solving Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Question Card (8 cols) */}
          <div className="lg:col-span-8 bg-[#111318] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col justify-between min-h-[460px]">
            <div>
              {/* Question Meta */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-[#FF3540] bg-[#E50914]/15 px-2.5 py-0.5 rounded">
                    {currentQ.subject}
                  </span>
                  <span className="text-xs text-gray-400">{currentQ.chapter}</span>
                </div>
                <span className="text-xs font-extrabold text-gray-400">
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed mb-6">
                {currentQ.question}
              </h3>

              {/* Options Grid */}
              <div className="space-y-3">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentQ.id] === idx;
                  const isCorrect = currentQ.correctAnswerIndex === idx;

                  let optStyle = 'bg-[#161822] border-white/5 text-gray-200 hover:border-white/20';

                  if (isSubmitted) {
                    if (isCorrect) {
                      optStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optStyle = 'bg-[#E50914]/20 border-[#E50914] text-[#FF3540] line-through font-bold';
                    }
                  } else if (isSelected) {
                    optStyle = 'bg-[#E50914]/20 border-[#E50914] text-white font-bold shadow-[0_0_15px_rgba(229,9,20,0.25)]';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(currentQ.id, idx)}
                      disabled={isSubmitted}
                      className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${optStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-black/40 text-gray-400 font-bold text-xs flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {isSubmitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {isSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-[#FF3540] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* High-yield Explanation (Shown after submission) */}
              {isSubmitted && (
                <div className="mt-6 p-4 rounded-xl bg-[#0a0b0e] border border-white/10 space-y-2 animate-in fade-in">
                  <div className="text-xs font-black uppercase text-[#FF3540] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>MediSpark Solution & Clinical Reference</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Nav Controls */}
            <div className="pt-6 border-t border-white/5 flex items-center justify-between gap-3 mt-6">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {!isSubmitted && selectedAnswers[currentQ.id] !== undefined && (
                <button
                  onClick={() => handleClearOption(currentQ.id)}
                  className="text-xs text-gray-400 hover:text-[#FF3540] underline"
                >
                  Clear Selection
                </button>
              )}

              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                disabled={currentIndex === questions.length - 1}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Question Palette (4 cols) */}
          <div className="lg:col-span-4 bg-[#111318] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-lg h-fit space-y-4">
            <h4 className="text-sm font-black font-heading text-white">
              Question Palette ({Object.keys(selectedAnswers).length}/{questions.length} Answered)
            </h4>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = currentIndex === idx;
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const isCorrect = isSubmitted && selectedAnswers[q.id] === q.correctAnswerIndex;
                const isWrong = isSubmitted && isAnswered && !isCorrect;

                let btnClass = 'bg-[#161822] text-gray-400 border-white/5';

                if (isSubmitted) {
                  if (isCorrect) btnClass = 'bg-emerald-500 text-white font-bold';
                  else if (isWrong) btnClass = 'bg-[#E50914] text-white font-bold';
                  else btnClass = 'bg-white/5 text-gray-500';
                } else if (isAnswered) {
                  btnClass = 'bg-[#E50914] text-white font-bold';
                }

                if (isCurrent) {
                  btnClass += ' ring-2 ring-white';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-xl border text-xs font-bold transition-all flex items-center justify-center ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#E50914]" />
                <span>Answered Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#161822] border border-white/10" />
                <span>Not Answered</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
