import { BOTANY_CHAPTERS, ZOOLOGY_CHAPTERS } from './biologySyllabusData';

// =============================================================
// SHARED COURSE CATALOG (client + server source of truth)
// -------------------------------------------------------------
// This is the authoritative, machine-readable course catalog used
// by BOTH the frontend and the backend for enrollment/purchase/
// assignment access control. It is derived from the existing
// MediSpark course configuration (learningData + biologySyllabus)
// so chapter/subject/class/exam/material counts always match the
// learning UI. It imports nothing that pulls in client assets.
// =============================================================

export type EnrollmentSource = 'enrolled' | 'purchased' | 'assigned';

export interface CourseCatalogSegment {
  id: string;
  segmentNumber: number;
  title: string;
  chapters: { id: string; chapterNumber: number }[];
}

export interface CourseCatalogEntry {
  courseId: string;
  title: string;
  category: string;
  targetBatch: string;
  price: number;
  discountPrice: number;
  isFree: boolean;
  segments: CourseCatalogSegment[];
}

const toCatalogSegments = (
  segments: {
    id: string;
    segmentNumber: number;
    title: string;
    chapters: { id: string; chapterNumber: number }[];
  }[]
): CourseCatalogSegment[] =>
  segments.map((seg) => ({
    id: seg.id,
    segmentNumber: seg.segmentNumber,
    title: seg.title,
    chapters: seg.chapters.map((ch) => ({ id: ch.id, chapterNumber: ch.chapterNumber })),
  }));

const BOTANY_SEGMENT: CourseCatalogSegment = {
  id: 'seg-botany',
  segmentNumber: 1,
  title: 'Botany (উদ্ভিদবিজ্ঞান - 1st Paper)',
  chapters: BOTANY_CHAPTERS.map((ch) => ({ id: ch.id, chapterNumber: ch.chapterNumber })),
};

const ZOOLOGY_SEGMENT: CourseCatalogSegment = {
  id: 'seg-zoology',
  segmentNumber: 2,
  title: 'Zoology (প্রাণিবিজ্ঞান - 2nd Paper)',
  chapters: ZOOLOGY_CHAPTERS.map((ch) => ({ id: ch.id, chapterNumber: ch.chapterNumber })),
};

const ZOOLOGY_ONLY_SEGMENT: CourseCatalogSegment = {
  ...ZOOLOGY_SEGMENT,
  segmentNumber: 1,
};

export const COURSE_CATALOG: CourseCatalogEntry[] = [
  {
    courseId: 'hsc-28-complete-biology',
    title: 'Complete Biology Course for HSC 28 Batch',
    category: 'HSC Academic',
    targetBatch: 'HSC 28 Batch',
    price: 0,
    discountPrice: 0,
    isFree: true,
    segments: toCatalogSegments([
      { id: 'seg-botany', segmentNumber: 1, title: 'Botany', chapters: BOTANY_CHAPTERS },
      { id: 'seg-zoology', segmentNumber: 2, title: 'Zoology', chapters: ZOOLOGY_CHAPTERS },
    ]),
  },
  {
    courseId: 'hsc-29-complete-biology',
    title: 'Complete Biology Course for HSC 29 Batch',
    category: 'HSC Academic',
    targetBatch: 'HSC 29 Batch',
    price: 0,
    discountPrice: 0,
    isFree: true,
    segments: toCatalogSegments([
      { id: 'seg-botany', segmentNumber: 1, title: 'Botany', chapters: BOTANY_CHAPTERS },
      { id: 'seg-zoology', segmentNumber: 2, title: 'Zoology', chapters: ZOOLOGY_CHAPTERS },
    ]),
  },
  {
    courseId: 'hsc-biology-2nd-paper',
    title: 'HSC Biology 2nd Paper (Zoology Mastery)',
    category: 'HSC Academic',
    targetBatch: 'HSC 28 & 29 Batch',
    price: 0,
    discountPrice: 0,
    isFree: true,
    segments: toCatalogSegments([
      { id: 'seg-zoology', segmentNumber: 1, title: 'Zoology', chapters: ZOOLOGY_CHAPTERS },
    ]),
  },
  {
    courseId: 'medical-admission-hsc-28',
    title: 'Medical Admission Course For HSC 28 Batch',
    category: 'Medical Admission',
    targetBatch: 'HSC 28 Batch',
    price: 9500,
    discountPrice: 6500,
    isFree: false,
    segments: toCatalogSegments([
      { id: 'seg-botany', segmentNumber: 1, title: 'Botany', chapters: BOTANY_CHAPTERS },
      { id: 'seg-zoology', segmentNumber: 2, title: 'Zoology', chapters: ZOOLOGY_CHAPTERS },
    ]),
  },
  {
    courseId: 'medical-admission-hsc-29',
    title: 'Medical Admission Course For HSC 29 Batch',
    category: 'Medical Admission',
    targetBatch: 'HSC 29 Batch',
    price: 11000,
    discountPrice: 7200,
    isFree: false,
    segments: toCatalogSegments([
      { id: 'seg-botany', segmentNumber: 1, title: 'Botany', chapters: BOTANY_CHAPTERS },
      { id: 'seg-zoology', segmentNumber: 2, title: 'Zoology', chapters: ZOOLOGY_CHAPTERS },
    ]),
  },
];

export function getCourseMeta(courseId: string): CourseCatalogEntry | undefined {
  return COURSE_CATALOG.find((c) => c.courseId === courseId);
}

export function getCourseChapterIds(courseId: string): Set<string> {
  const meta = getCourseMeta(courseId);
  const ids = new Set<string>();
  meta?.segments.forEach((seg) => seg.chapters.forEach((ch) => ids.add(ch.id)));
  return ids;
}

export function getCourseSegmentIds(courseId: string): Set<string> {
  const meta = getCourseMeta(courseId);
  return new Set(meta?.segments.map((s) => s.id) || []);
}

export function getCourseExamIds(courseId: string): Set<string> {
  const meta = getCourseMeta(courseId);
  const ids = new Set<string>();
  meta?.segments.forEach((seg) =>
    seg.chapters.forEach((ch) => ids.add(`exam-${ch.id.replace(/^chap-/, '')}`))
  );
  return ids;
}

export function getCoursePdfIds(courseId: string): Set<string> {
  const meta = getCourseMeta(courseId);
  const ids = new Set<string>();
  meta?.segments.forEach((seg) =>
    seg.chapters.forEach((ch) => {
      const base = ch.id.replace(/^chap-/, '');
      ids.add(`pdf-${base}-sheet`);
      ids.add(`pdf-${base}-handwritten`);
      ids.add(`pdf-${base}-mcqbank`);
      ids.add(`pdf-${base}-board`);
    })
  );
  return ids;
}

export function getCourseClassIds(courseId: string): Set<string> {
  const meta = getCourseMeta(courseId);
  const ids = new Set<string>();
  meta?.segments.forEach((seg) =>
    seg.chapters.forEach((ch) => {
      const chapter = [...BOTANY_CHAPTERS, ...ZOOLOGY_CHAPTERS].find((c) => c.id === ch.id);
      chapter?.classes.forEach((cls) => ids.add(cls.id));
    })
  );
  return ids;
}

export function isValidExamForCourse(examId: string, courseId: string): boolean {
  return getCourseExamIds(courseId).has(examId);
}

// An exam id matches a chapter when they share the same syllabus base
// (e.g. exam-botany-01 <-> chap-botany-01).
export function isExamForChapter(examId: string, chapterId: string): boolean {
  if (!chapterId || !examId) return false;
  return examId === `exam-${chapterId.replace(/^chap-/, '')}`;
}

export function isValidChapterForCourse(chapterId: string, courseId: string): boolean {
  return getCourseChapterIds(courseId).has(chapterId);
}

export function isValidSegmentForCourse(segmentId: string, courseId: string): boolean {
  return getCourseSegmentIds(courseId).has(segmentId);
}

// Effective payable amount (discount price wins when it is lower).
export function getCourseFee(courseId: string): { amount: number; isFree: boolean; price: number; discountPrice: number } {
  const meta = getCourseMeta(courseId);
  if (!meta) return { amount: 0, isFree: true, price: 0, discountPrice: 0 };
  const amount = meta.discountPrice > 0 && meta.discountPrice < meta.price ? meta.discountPrice : meta.price;
  return { amount, isFree: meta.isFree, price: meta.price, discountPrice: meta.discountPrice };
}