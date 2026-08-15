// Server-side access to the shared MediSpark course catalog.
// The catalog is the source of truth for which courses can be
// enrolled / purchased / assigned, and which chapters, classes,
// exams and materials belong to each course.
export {
  COURSE_CATALOG,
  getCourseMeta,
  getCourseChapterIds,
  getCourseSegmentIds,
  getCourseExamIds,
  getCoursePdfIds,
  getCourseClassIds,
  isValidExamForCourse,
  isExamForChapter,
  isValidChapterForCourse,
  isValidSegmentForCourse,
  getCourseFee,
} from '../src/data/courseCatalog';
export type { CourseCatalogEntry, EnrollmentSource } from '../src/data/courseCatalog';