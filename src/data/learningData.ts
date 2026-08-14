import { EnrolledCourseData, Question } from '../types';
import { MENTORS_DATA } from './mockData';
import { BOTANY_CHAPTERS, ZOOLOGY_CHAPTERS } from './biologySyllabusData';

export const INITIAL_USER_LEARNING_STATE = {
  enrolledCourseIds: [
    'hsc-28-complete-biology',
    'medical-admission-hsc-28',
    'hsc-biology-2nd-paper',
    'hsc-29-complete-biology'
  ],
  completedClassIds: [
    'botany-c1-cl1',
    'botany-c1-cl2',
    'botany-c2-cl1',
    'zoology-c1-cl1',
    'zoology-c1-cl2'
  ],
  completedExamIds: {
    'exam-botany-01': {
      bestScore: 24,
      lastScore: 24,
      attempts: 1,
      timestamp: '2026-08-12 10:30'
    },
    'exam-zoology-01': {
      bestScore: 22,
      lastScore: 22,
      attempts: 1,
      timestamp: '2026-08-11 15:45'
    }
  },
  viewedPdfIds: [
    'pdf-botany-01-sheet',
    'pdf-botany-01-handwritten'
  ],
  lastActivePosition: {
    courseId: 'hsc-28-complete-biology',
    segmentId: 'seg-botany',
    chapterId: 'chap-botany-01',
    classId: 'botany-c1-cl2',
    tab: 'classes' as const,
    lastUpdated: 'Just now'
  }
};

export const ENROLLED_COURSES_DATA: Record<string, EnrolledCourseData> = {
  'hsc-28-complete-biology': {
    courseId: 'hsc-28-complete-biology',
    title: 'Complete Biology Course for HSC 28 Batch',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80',
    description: '100% Free Complete Botany & Zoology syllabus for HSC 28 batch with line-by-line textbook breakdown (Abul Hasan & Gazi Ajmal), CQ creative mastery & medical pre-foundation.',
    mentorName: 'Md. Siyam Talukder',
    mentorDegree: 'MBBS, Shaheed Suhrawardy Medical College (ShSMC)',
    mentorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    totalSegments: 2,
    totalChapters: 24,
    totalClasses: 88,
    totalExams: 30,
    totalPdfs: 96,
    completedChaptersCount: 3,
    progressPercentage: 68,
    segments: [
      {
        id: 'seg-botany',
        segmentNumber: 1,
        title: 'Botany (উদ্ভিদবিজ্ঞান - 1st Paper)',
        subtitle: 'Complete 12 Chapters: Cell Structure, Cell Division, Physiology, Reproduction & Biotechnology (Abul Hasan Sir)',
        chapters: BOTANY_CHAPTERS
      },
      {
        id: 'seg-zoology',
        segmentNumber: 2,
        title: 'Zoology (প্রাণিবিজ্ঞান - 2nd Paper)',
        subtitle: 'Complete 12 Chapters: Animal Diversity, Human Physiology Systems, Genetics & Immunity (Gazi Ajmal Sir)',
        chapters: ZOOLOGY_CHAPTERS
      }
    ]
  },

  'hsc-29-complete-biology': {
    courseId: 'hsc-29-complete-biology',
    title: 'Complete Biology Course for HSC 29 Batch',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80',
    description: '100% Free Complete Botany & Zoology syllabus for HSC 29 batch with line-by-line textbook analysis (Abul Hasan & Gazi Ajmal), CQ creative solving & early medical foundation.',
    mentorName: 'Md. Siyam Talukder',
    mentorDegree: 'MBBS, Shaheed Suhrawardy Medical College (ShSMC)',
    mentorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    totalSegments: 2,
    totalChapters: 24,
    totalClasses: 88,
    totalExams: 30,
    totalPdfs: 96,
    completedChaptersCount: 1,
    progressPercentage: 25,
    segments: [
      {
        id: 'seg-botany',
        segmentNumber: 1,
        title: 'Botany (উদ্ভিদবিজ্ঞান - 1st Paper)',
        subtitle: 'Complete 12 Chapters: Cell Biology, Plant Physiology & Biotechnology (Abul Hasan Sir)',
        chapters: BOTANY_CHAPTERS
      },
      {
        id: 'seg-zoology',
        segmentNumber: 2,
        title: 'Zoology (প্রাণিবিজ্ঞান - 2nd Paper)',
        subtitle: 'Complete 12 Chapters: Animal Diversity & Human Physiology (Gazi Ajmal Sir)',
        chapters: ZOOLOGY_CHAPTERS
      }
    ]
  },

  'hsc-biology-2nd-paper': {
    courseId: 'hsc-biology-2nd-paper',
    title: 'HSC Biology 2nd Paper (Zoology Mastery)',
    thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1000&q=80',
    description: 'Complete 12 chapters Zoology syllabus for HSC Board GPA 5.00 and Medical Admission pre-foundation by Dr. Siyam Talukder.',
    mentorName: 'Md. Siyam Talukder',
    mentorDegree: 'MBBS, Shaheed Suhrawardy Medical College (ShSMC)',
    mentorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    totalSegments: 1,
    totalChapters: 12,
    totalClasses: 44,
    totalExams: 12,
    totalPdfs: 48,
    completedChaptersCount: 2,
    progressPercentage: 54,
    segments: [
      {
        id: 'seg-zoology',
        segmentNumber: 1,
        title: 'Zoology (প্রাণিবিজ্ঞান - 2nd Paper)',
        subtitle: 'Complete 12 Chapters: Animal Diversity & Human Physiology (Gazi Ajmal Sir)',
        chapters: ZOOLOGY_CHAPTERS
      }
    ]
  },

  'medical-admission-hsc-28': {
    courseId: 'medical-admission-hsc-28',
    title: 'Medical Admission Course For HSC 28 Batch',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80',
    description: 'The definitive end-to-end medical admission preparation program covering Biology, Chemistry, Physics, English & General Knowledge with 85 DGHS Standard Central Model Tests.',
    mentorName: 'Md. Siyam Talukder',
    mentorDegree: 'MBBS, Shaheed Suhrawardy Medical College (ShSMC)',
    mentorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    totalSegments: 2,
    totalChapters: 24,
    totalClasses: 88,
    totalExams: 85,
    totalPdfs: 96,
    completedChaptersCount: 2,
    progressPercentage: 45,
    segments: [
      {
        id: 'seg-botany',
        segmentNumber: 1,
        title: 'Botany (উদ্ভিদবিজ্ঞান - 1st Paper)',
        subtitle: '12 Chapters: DGHS Line-by-Line Medical Model Tests & Past 20-Year Solves',
        chapters: BOTANY_CHAPTERS
      },
      {
        id: 'seg-zoology',
        segmentNumber: 2,
        title: 'Zoology (প্রাণিবিজ্ঞান - 2nd Paper)',
        subtitle: '12 Chapters: DGHS Line-by-Line Medical Model Tests & Past 20-Year Solves',
        chapters: ZOOLOGY_CHAPTERS
      }
    ]
  },

  'medical-admission-hsc-29': {
    courseId: 'medical-admission-hsc-29',
    title: 'Medical Admission Course For HSC 29 Batch',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80',
    description: 'The premier 2-Year Long Integrated Medical Admission Program for HSC 29 Batch covering Biology, Chemistry, Physics, English & General Knowledge with 95 DGHS Central Model Tests.',
    mentorName: 'Md. Siyam Talukder',
    mentorDegree: 'MBBS, Shaheed Suhrawardy Medical College (ShSMC)',
    mentorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    totalSegments: 2,
    totalChapters: 24,
    totalClasses: 88,
    totalExams: 95,
    totalPdfs: 96,
    completedChaptersCount: 1,
    progressPercentage: 20,
    segments: [
      {
        id: 'seg-botany',
        segmentNumber: 1,
        title: 'Botany (উদ্ভিদবিজ্ঞান - 1st Paper)',
        subtitle: '12 Chapters: Complete Line-by-Line Medical Foundation for HSC 29',
        chapters: BOTANY_CHAPTERS
      },
      {
        id: 'seg-zoology',
        segmentNumber: 2,
        title: 'Zoology (প্রাণিবিজ্ঞান - 2nd Paper)',
        subtitle: '12 Chapters: Complete Line-by-Line Medical Foundation for HSC 29',
        chapters: ZOOLOGY_CHAPTERS
      }
    ]
  }
};
