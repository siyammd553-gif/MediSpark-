import React, { useState, useEffect } from 'react';
import { ChapterExam, Question } from '../../types';
import { useLearning } from '../../context/LearningContext';
import { 
  X, 
  Clock, 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  Check,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface ChapterExamSimulatorModalProps {
  exam: ChapterExam;
  chapterTitle: string;
  onClose: () => void;
}

export const ChapterExamSimulatorModal: React.FC<ChapterExamSimulatorModalProps> = ({
  exam,
  chapterTitle,
  onClose
}) => {
  const { recordExamSubmission, userState } = useLearning();

  // If questions array is empty, provide high-yield default questions
  const questions: Question[] = (exam.questions && exam.questions.length > 0) ? exam.questions : [
    {
      id: 'd-q1',
      subject: 'Biology',
      chapter: chapterTitle,
      question: 'কোষের কোন অঙ্গাণুকে "কোষের ট্রাফিক পুলিশ" বা প্যাকেজিং কেন্দ্র বলা হয়?',
      options: ['মাইটোকন্ড্রিয়া', 'রাইবোসোম', 'গলগি বডি', 'লাইসোসোম'],
      correctAnswerIndex: 2,
      explanation: 'গলগি বডি ক্ষরণ এবং প্রোটিন প্যাকেজিং নিয়ন্ত্রণ করে বলে একে কোষের ট্রাফিক পুলিশ বলা হয়।',
      difficulty: 'Easy'
    },
    {
      id: 'd-q2',
      subject: 'Biology',
      chapter: chapterTitle,
      question: 'ফ্লুইড মোজাইক মডেল অনুযায়ী মেমব্রেনের ফসফোলিপিড অণুর লেজ কোন প্রকৃতির?',
      options: ['হাইড্রোফিলিক (পানিগ্রাহী)', 'হাইড্রোফোবিক (পানি-বিদ্বেষী)', 'পোলার', 'চার্জড'],
      correctAnswerIndex: 1,
      explanation: 'ফ্যাটি অ্যাসিডের নন-পোলার শিকল পানি-বিদ্বেষী বা হাইড্রোফোবিক হয়ে ভেতরে সুরক্ষিত থাকে।',
      difficulty: 'Medium'
    }
  ];

  const totalQuestions = questions.length;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(exam.durationMinutes * 60);
  const [showReviewList, setShowReviewList] = useState<boolean>(false);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const score = correctCount;
    recordExamSubmission(exam.id, score, totalQuestions);
  };

  // Results calculation
  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;

  if (isSubmitted) {
    questions.forEach((q, idx) => {
      const selected = selectedAnswers[idx];
      if (selected === undefined) {
        unattemptedCount++;
      } else if (selected === q.correctAnswerIndex) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });
  }

  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-y-auto">
      <div 
        id="exam-simulator-modal-container"
        className="bg-[#0f1117] border border-white/15 rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#141622] border-b border-white/10 flex items-center justify-between gap-4">
          <div className="space-y-0.5 truncate">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-[#E50914] text-white text-[10px] font-black uppercase tracking-wider">
                Exam Simulator
              </span>
              <span className="text-xs text-gray-400 truncate">
                {chapterTitle}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white truncate">
              {exam.examTitle}
            </h3>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {!isSubmitted ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold shadow-inner">
                <Clock className="w-4 h-4" />
                <span>{formatTimer(secondsRemaining)}</span>
              </div>
            ) : (
              <span className="text-xs font-black text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-xl border border-emerald-400/30">
                Score: {correctCount} / {totalQuestions}
              </span>
            )}

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 no-scrollbar">
          
          {/* If Result View is Active */}
          {isSubmitted ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Scorecard Hero Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#171216] via-[#12141a] to-[#0c0d12] border border-white/10 text-center space-y-4 shadow-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E50914]/20 border-2 border-[#E50914] text-[#FF3540] mx-auto shadow-[0_0_25px_rgba(229,9,20,0.5)]">
                  <Award className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Test Completed!
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Accuracy & Score Analysis for {exam.examTitle}
                  </p>
                </div>

                {/* Score Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Score</span>
                    <span className="text-lg sm:text-xl font-black text-white">{correctCount} / {totalQuestions}</span>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                    <span className="text-[10px] text-emerald-400 uppercase font-bold block">Correct</span>
                    <span className="text-lg sm:text-xl font-black text-emerald-400">{correctCount}</span>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                    <span className="text-[10px] text-red-400 uppercase font-bold block">Wrong</span>
                    <span className="text-lg sm:text-xl font-black text-red-400">{wrongCount}</span>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                    <span className="text-[10px] text-amber-400 uppercase font-bold block">Accuracy</span>
                    <span className="text-lg sm:text-xl font-black text-amber-400">{scorePercentage}%</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedAnswers({});
                      setIsSubmitted(false);
                      setSecondsRemaining(exam.durationMinutes * 60);
                      setCurrentQuestionIndex(0);
                    }}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Exam</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-[#E50914] hover:bg-[#b8060f] text-white text-xs font-extrabold rounded-xl shadow transition-colors"
                  >
                    Return to Chapter
                  </button>
                </div>
              </div>

              {/* Detailed Solutions & Explanations List */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#E50914]" />
                  <span>Question-by-Question Solution & Medical Notes</span>
                </h4>

                <div className="space-y-4">
                  {questions.map((q, idx) => {
                    const selected = selectedAnswers[idx];
                    const isCorrect = selected === q.correctAnswerIndex;
                    const isSkipped = selected === undefined;

                    return (
                      <div
                        key={q.id}
                        className={`p-4 sm:p-5 rounded-2xl border ${
                          isCorrect
                            ? 'bg-[#101915] border-emerald-500/30'
                            : isSkipped
                            ? 'bg-[#181615] border-amber-500/30'
                            : 'bg-[#1a1215] border-red-500/30'
                        } space-y-3`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-gray-400">
                            Question {idx + 1} of {totalQuestions}
                          </span>
                          {isCorrect ? (
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+1.00)
                            </span>
                          ) : isSkipped ? (
                            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" /> Skipped (0.00)
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> Incorrect (-0.25)
                            </span>
                          )}
                        </div>

                        <h5 className="text-sm font-bold text-white leading-relaxed">
                          {q.question}
                        </h5>

                        {/* Options List */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt, optIdx) => {
                            const isThisCorrect = optIdx === q.correctAnswerIndex;
                            const isThisChosen = selected === optIdx;

                            return (
                              <div
                                key={optIdx}
                                className={`p-2.5 rounded-xl text-xs font-medium border flex items-center justify-between gap-2 ${
                                  isThisCorrect
                                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold'
                                    : isThisChosen
                                    ? 'bg-red-500/20 border-red-500 text-red-200 line-through'
                                    : 'bg-black/30 border-white/5 text-gray-400'
                                }`}
                              >
                                <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                                {isThisCorrect && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation Box */}
                        {q.explanation && (
                          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 space-y-1">
                            <span className="font-bold text-[#FF3540] block">Doctor's Explanation & Reference:</span>
                            <p className="leading-relaxed">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            /* Active Test Taking View */
            <div className="space-y-6">
              
              {/* Question Navigation Palette */}
              <div className="flex items-center gap-1.5 flex-wrap p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[11px] font-bold text-gray-400 mr-2">Jump to:</span>
                {questions.map((_, idx) => {
                  const isCurrent = currentQuestionIndex === idx;
                  const isAnswered = selectedAnswers[idx] !== undefined;

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-[#E50914] text-white shadow'
                          : isAnswered
                          ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                          : 'bg-black/40 text-gray-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Active Question Box */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#141620] border border-white/10 space-y-5 shadow-lg">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="font-bold text-[#FF3540] uppercase">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </span>
                  {currentQ.difficulty && (
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[11px] text-gray-300">
                      Difficulty: {currentQ.difficulty}
                    </span>
                  )}
                </div>

                <h4 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {currentQ.question}
                </h4>

                {/* 4 Interactive MCQ Options */}
                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((option, optIdx) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;

                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#E50914]/20 border-[#E50914] text-white shadow-md'
                            : 'bg-white/5 border-white/5 hover:border-white/20 text-gray-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isSelected ? 'bg-[#E50914] text-white' : 'bg-black/50 text-gray-400'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="text-xs sm:text-sm font-medium">
                            {option}
                          </span>
                        </div>

                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#E50914] bg-[#E50914]' : 'border-gray-500'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Nav Buttons */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold text-white transition-colors flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSubmit}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow transition-all"
                  >
                    Submit Exam
                  </button>

                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                      className="px-4 py-2 rounded-xl bg-[#E50914] hover:bg-[#b8060f] text-white text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-all"
                    >
                      Finish Test
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
