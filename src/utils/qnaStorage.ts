import { useState, useEffect } from 'react';
import { QnAQuestion, QnAAnswer } from '../types';
import { INITIAL_QNA_QUESTIONS } from '../data/qnaData';

const QNA_STORAGE_KEY = 'medispark_qna_questions_v1';
const QNA_EVENT = 'medispark_qna_updated';

export function getStoredQnAQuestions(): QnAQuestion[] {
  try {
    const raw = localStorage.getItem(QNA_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(QNA_STORAGE_KEY, JSON.stringify(INITIAL_QNA_QUESTIONS));
      return INITIAL_QNA_QUESTIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load Q&A data', e);
    return INITIAL_QNA_QUESTIONS;
  }
}

export function saveQnAQuestions(questions: QnAQuestion[]) {
  try {
    localStorage.setItem(QNA_STORAGE_KEY, JSON.stringify(questions));
    window.dispatchEvent(new CustomEvent(QNA_EVENT, { detail: questions }));
  } catch (e) {
    console.error('Failed to save Q&A data', e);
  }
}

export function addQnAQuestion(newQuestion: Omit<QnAQuestion, 'id' | 'createdAt' | 'upvotes' | 'answers'> & { aiAutoSolve?: boolean }): QnAQuestion {
  const current = getStoredQnAQuestions();
  
  const createdQuestion: QnAQuestion = {
    id: `qna-${Date.now()}`,
    title: newQuestion.title,
    description: newQuestion.description,
    subject: newQuestion.subject,
    batch: newQuestion.batch,
    authorName: newQuestion.authorName || 'Current Student',
    authorRole: newQuestion.authorRole || 'HSC Aspirant',
    authorAvatar: newQuestion.authorAvatar,
    createdAt: 'Just now',
    upvotes: 1,
    userUpvoted: true,
    tags: newQuestion.tags || [newQuestion.subject, newQuestion.batch],
    bookReference: newQuestion.bookReference,
    imageAttachment: newQuestion.imageAttachment,
    isResolved: newQuestion.aiAutoSolve ? true : false,
    answers: []
  };

  if (newQuestion.aiAutoSolve) {
    createdQuestion.answers.push({
      id: `ans-ai-${Date.now()}`,
      authorName: 'MediSpark AI Doubt Solver',
      authorRole: 'MediSpark AI',
      content: `Here is the instant diagnostic breakdown for your doubt:\n\n📖 **Core Concept (${newQuestion.subject})**:
Your question on "${newQuestion.title}" relates to key NCTB curriculum objectives for ${newQuestion.batch}.

💡 **Explanation**:
${newQuestion.description.length > 20 ? newQuestion.description : newQuestion.title} is examined frequently in board Creative Questions (CQ) and Medical Admission MCQs. 

✅ **Key Takeaway**:
Always remember to correlate textbook definitions from Abul Hasan / Gazi Ajmal and check past 10-year DGHS Question banks. Md. Siyam Talukder or our medical faculty will also review this thread!`,
      createdAt: 'Just now',
      upvotes: 1
    });
  }

  const updated = [createdQuestion, ...current];
  saveQnAQuestions(updated);
  return createdQuestion;
}

export function addQnAAnswer(questionId: string, answerText: string, authorName = 'Student', authorRole: QnAAnswer['authorRole'] = 'Student') {
  const current = getStoredQnAQuestions();
  const updated = current.map((q) => {
    if (q.id === questionId) {
      const newAns: QnAAnswer = {
        id: `ans-${Date.now()}`,
        authorName,
        authorRole,
        content: answerText,
        createdAt: 'Just now',
        upvotes: 0
      };
      return {
        ...q,
        isResolved: true,
        answers: [...q.answers, newAns]
      };
    }
    return q;
  });
  saveQnAQuestions(updated);
}

export function toggleQuestionUpvote(questionId: string) {
  const current = getStoredQnAQuestions();
  const updated = current.map((q) => {
    if (q.id === questionId) {
      const isUpvoted = !!q.userUpvoted;
      return {
        ...q,
        userUpvoted: !isUpvoted,
        upvotes: isUpvoted ? Math.max(0, q.upvotes - 1) : q.upvotes + 1
      };
    }
    return q;
  });
  saveQnAQuestions(updated);
}

export function useQnAData() {
  const [questions, setQuestions] = useState<QnAQuestion[]>(() => getStoredQnAQuestions());

  useEffect(() => {
    const handleUpdate = () => {
      setQuestions(getStoredQnAQuestions());
    };

    window.addEventListener(QNA_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(QNA_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    questions,
    postQuestion: addQnAQuestion,
    postAnswer: addQnAAnswer,
    upvoteQuestion: toggleQuestionUpvote
  };
}
