import React, { useState, useEffect, useRef } from 'react';
import { ChapterExam, Question, ExamAttempt, ExamType } from '../../types';
import { useLearning } from '../../context/LearningContext';
import { examApi, notifyExamAttemptsUpdated, beaconSubmitExam } from '../../utils/examApi';
import { 
  X, 
  Clock, 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RotateCcw, 
  ChevronRight,
  BookOpen,
  Check,
  Lock,
  Info
} from 'lucide-react';

interface ChapterExamSimulatorModalProps {
  exam: ChapterExam;
  chapterTitle: string;
  courseId: string;
  chapterId: string;
  negativeMarking: number; // 0.25 for Medical Admission exams, 0 for HSC exams
  onClose: () => void;
}

export const ChapterExamSimulatorModal: React.FC<ChapterExamSimulatorModalProps> = ({
  exam,
  chapterTitle,
  courseId,
  chapterId,
  negativeMarking,
  onClose
}) => {
  const { recordExamSubmission } = useLearning();

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
  const totalSeconds = exam.durationMinutes * 60;
  const examType: ExamType = negativeMarking > 0 ? 'medical' : 'hsc';
  const subject = (questions[0]?.subject as string) || 'Biology';
  const negLabel = negativeMarking > 0 ? `-${negativeMarking.toFixed(2)}` : 'No Negative';

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalSeconds);
  const [result, setResult] = useState<ExamAttempt | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Refs keep latest values visible to timers / event handlers.
  const secondsRef = useRef<number>(totalSeconds);
  const answersRef = useRef<Record<number, number>>({});
  const submittedRef = useRef<boolean>(false);
  const isSubmittedRef = useRef<boolean>(false);
  const startedRef = useRef<boolean>(false);

  useEffect(() => {
    answersRef.current = selectedAnswers;
  }, [selectedAnswers]);
  useEffect(() => {
    isSubmittedRef.current = isSubmitted;
  }, [isSubmitted]);

  const buildStartPayload = () => ({
    examId: exam.id,
    examTitle: exam.examTitle,
    courseId,
    chapterId,
    chapterTitle,
    subject,
    examType,
    negativePerWrong: negativeMarking,
    totalQuestions,
    totalMarks: exam.totalMarks || totalQuestions,
    durationMinutes: exam.durationMinutes,
    questions,
  });

  // Register the active exam session server-side (belongs to the authenticated student).
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    examApi
      .start(buildStartPayload())
      .then((res) => {
        if (res.previousFinalized) {
          setNotice(`A previously interrupted exam (${res.previousFinalized.examTitle}) was auto-submitted and cannot be recovered.`);
        }
      })
      .catch((e) => {
        console.error('Failed to start exam session', e);
        setNotice('Could not register this exam session. Please check your connection.');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer countdown → auto-submit on expiry (interrupted exam is submitted).
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      secondsRef.current = Math.max(0, secondsRef.current - 1);
      setSecondsRemaining(secondsRef.current);
      if (secondsRef.current <= 0) {
        clearInterval(interval);
        void handleSubmit('autosubmitted');
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted]);

  // Debounced live-sync of answers so a cross-device login can auto-submit them.
  useEffect(() => {
    if (isSubmitted) return;
    if (Object.keys(selectedAnswers).length === 0) return;
    const t = setTimeout(() => {
      examApi.sync(selectedAnswers).catch(() => {});
    }, 800);
    return () => clearTimeout(t);
  }, [selectedAnswers, isSubmitted]);

  // Heartbeat sync every 15s (keeps the server snapshot fresh).
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      if (Object.keys(answersRef.current).length > 0) {
        examApi.sync(answersRef.current).catch(() => {});
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  // Interrupted exam (tab switch, close, refresh): auto-submit attempted answers.
  useEffect(() => {
    const fire = () => {
      if (submittedRef.current || isSubmittedRef.current) return;
      submittedRef.current = true;
      beaconSubmitExam(totalSeconds - secondsRef.current);
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') fire();
    };
    window.addEventListener('beforeunload', fire);
    window.addEventListener('pagehide', fire);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('beforeunload', fire);
      window.removeEventListener('pagehide', fire);
      document.removeEventListener('visibilitychange', onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTimer = (value: number) => {
    const mins = Math.floor(value / 60);
    const secs = value % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    // One answer per question — the selected answer cannot be changed.
    if (selectedAnswers[currentQuestionIndex] !== undefined) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleSubmit = async (status: 'completed' | 'autosubmitted' = 'completed') => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    const elapsed = totalSeconds - secondsRef.current;
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;
    questions.forEach((q, idx) => {
      const selected = answersRef.current[idx];
      if (selected === undefined) {
        unattemptedCount++;
      } else if (selected === q.correctAnswerIndex) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    // Local fallback scoring (the server remains the authoritative source).
    const negativeDeduction = Number((wrongCount * negativeMarking).toFixed(2));
    const finalScore = Math.max(0, Number((correctCount - negativeDeduction).toFixed(2)));

    try {
      const res = await examApi.submit(elapsed, status);
      setResult(res.attempt);
      recordExamSubmission(exam.id, res.attempt.finalScore, res.attempt.totalMarks || totalQuestions);
      notifyExamAttemptsUpdated();
    } catch (e) {
      console.error('Failed to record exam attempt', e);
      setNotice('Your result could not be saved to your account. Please check your connection.');
      recordExamSubmission(exam.id, finalScore, totalQuestions);
    } finally {
      setIsSubmitted(true);
    }
  };

  const handleClose = () => {
    if (!submittedRef.current) {
      void handleSubmit('autosubmitted').finally(onClose);
    } else {
      onClose();
    }
  };

  const handleRetake = () => {
    submittedRef.current = false;
    setSelectedAnswers({});
    answersRef.current = {};
    setCurrentQuestionIndex(0);
    setSecondsRemaining(totalSeconds);
    secondsRef.current = totalSeconds;
    setResult(null);
    setIsSubmitted(false);
    setNotice(null);
    examApi
      .start(buildStartPayload())
      .then((res) => {
        if (res.previousFinalized) {
          setNotice(`A previously interrupted exam (${res.previousFinalized.examTitle}) was auto-submitted and cannot be recovered.`);
        }
      })
      .catch((e) => {
        console.error('Failed to restart exam session', e);
        setNotice('Could not register this exam session. Please check your connection.');
      });
  };

  // Results derived from the server-recorded attempt when available.
  const correctCount = result?.correctCount ?? 0;
  const wrongCount = result?.wrongCount ?? 0;
  const unattemptedCount = result?.unattemptedCount ?? 0;
  const negativeDeduction = result?.negativeDeduction ?? 0;
  const finalScore = result?.finalScore ?? 0;
  const scorePercentage = result?.accuracy ?? (totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0);
  const currentQ = questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

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
              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                examType === 'medical'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              }`}>
                {examType === 'medical' ? `Negative -${negativeMarking.toFixed(2)}` : 'HSC · No Negative'}
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
                Score: {finalScore} / {result?.totalMarks || totalQuestions}
              </span>
            )}

            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 no-scrollbar">
          
          {/* Notice (e.g. auto-submitted previous interrupted exam) */}
          {notice && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-semibold animate-in fade-in">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{notice}</span>
            </div>
          )}

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
                  {result?.status === 'autosubmitted' && (
                    <p className="text-[11px] text-amber-400 font-bold mt-1">
                      Auto-submitted (interrupted) — this attempt cannot be recovered.
                    </p>
                  )}
                </div>

                {/* Score Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Score</span>
                    <span className="text-lg sm:text-xl font-black text-white">{finalScore} / {result?.totalMarks || totalQuestions}</span>
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

                {/* Negative marking summary */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold ${
                  negativeMarking > 0
                    ? 'bg-red-500/10 text-red-300 border border-red-500/30'
                    : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                }`}>
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>
                    {negativeMarking > 0
                      ? `Negative Marking Deduction: -${negativeDeduction.toFixed(2)} (${negativeMarking.toFixed(2)} per wrong answer)`
                      : 'HSC Exam — No Negative Marking Applied'}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={handleRetake}
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

              {/* Detailed Solutions & Explanations List (answer script after submission) */}
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
                              <XCircle className="w-3.5 h-3.5" /> Incorrect ({negLabel})
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

                        {/* Explanation Box (kept after submission) */}
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
              
              {/* Exam Rules + Progress Indicator */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <Lock className="w-3.5 h-3.5 text-[#FF3540]" />
                  <span>
                    Answers lock once selected — you cannot go back to a previous question.
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-bold text-gray-300">
                    {answeredCount} / {totalQuestions} Answered
                  </span>
                  <div className="w-28 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-[#E50914] to-[#FF3540] rounded-full transition-all duration-300"
                      style={{ width: `${totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0}%` }}
                    />
                  </div>
                </div>
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

                {/* 4 Interactive MCQ Options (locked once answered) */}
                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((option, optIdx) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                    const isLocked = selectedAnswers[currentQuestionIndex] !== undefined;

                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`p-3.5 sm:p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#E50914]/20 border-[#E50914] text-white shadow-md'
                            : isLocked
                            ? 'bg-black/30 border-white/5 text-gray-500 cursor-not-allowed'
                            : 'bg-white/5 border-white/5 hover:border-white/20 text-gray-300 hover:text-white cursor-pointer'
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

                        {isSelected ? (
                          <Lock className="w-4 h-4 text-[#FF3540] shrink-0" />
                        ) : (
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#E50914] bg-[#E50914]' : 'border-gray-500'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Nav Buttons (forward-only navigation) */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <div className="text-[11px] text-gray-500 font-medium">
                  {currentQuestionIndex > 0 && (
                    <span>Locked — earlier questions cannot be revisited.</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => void handleSubmit('completed')}
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
                      onClick={() => void handleSubmit('completed')}
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