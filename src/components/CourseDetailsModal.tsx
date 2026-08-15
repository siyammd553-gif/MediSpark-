import React, { useState } from 'react';
import { Course } from '../types';
import { useCourseImage } from '../utils/courseStorage';
import { useLearning } from '../context/LearningContext';
import { CoursePictureModal } from './CoursePictureModal';
import {
  X,
  Star,
  Users,
  CheckCircle2,
  Clock,
  BookOpen,
  ShieldCheck,
  Check,
  FileText,
  Camera,
  GraduationCap
} from 'lucide-react';

interface CourseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onEnroll: (course: Course) => void;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  isOpen,
  onClose,
  course,
  onEnroll,
}) => {
  if (!isOpen || !course) return null;

  return <CourseDetailsModalInner course={course} isOpen={isOpen} onClose={onClose} onEnroll={onEnroll} />;
};

const CourseDetailsModalInner: React.FC<{
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (course: Course) => void;
}> = ({ course, onClose, onEnroll }) => {
  const { currentImage } = useCourseImage(course);
  const { isCourseEnrolled } = useLearning();
  const isEnrolled = isCourseEnrolled(course.id);
  const [isPictureModalOpen, setIsPictureModalOpen] = useState<boolean>(false);

  const isFreeCourse = course.isFree || (course.price === 0 && (!course.discountPrice || course.discountPrice === 0));
  const hasDiscount = !isFreeCourse && !!course.discountPrice && course.discountPrice < course.price;
  const currentFeeNumber = isFreeCourse ? 0 : (course.discountPrice || course.price);
  const formattedFee = `৳ ${currentFeeNumber.toLocaleString('en-US')}`;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          id="course-modal-backdrop"
          onClick={onClose} 
          className="fixed inset-0 bg-black/85 backdrop-blur-md" 
        />

        <div 
          id="course-details-modal-card"
          className="relative w-full max-w-3xl max-h-[90vh] bg-[#111318] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl z-10 text-white overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        >
          {/* Top Banner Image with Course Picture */}
          <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-[#0d0f14] shrink-0 border-b border-white/10">
            <img
              src={currentImage}
              alt={course.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-[#111318]/60 to-black/40" />

            {/* Close Button */}
            <button
              id="close-course-details-modal"
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-black/60 hover:bg-[#E50914] flex items-center justify-center text-white backdrop-blur-md border border-white/20 transition-all z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Change Picture Button */}
            <button
              id="modal-change-pic-btn"
              onClick={() => setIsPictureModalOpen(true)}
              className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-[#E50914] text-white text-xs font-bold border border-white/20 backdrop-blur-md transition-all z-20"
            >
              <Camera className="w-3.5 h-3.5 text-[#FF3540]" />
              <span>Change Picture</span>
            </button>

            {/* Course Header Info inside Banner */}
            <div className="absolute bottom-4 left-5 right-5 z-10">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 bg-[#E50914] text-white rounded-md shadow-sm">
                  {course.targetBatch}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-black/70 backdrop-blur-md text-gray-200 rounded-md border border-white/10">
                  {course.category}
                </span>
                {course.badge && (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded-md">
                    {course.badge}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-white leading-tight">
                {course.title}
              </h2>
            </div>
          </div>

          {/* Scrollable Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
            {/* Subtitle / Overview */}
            <p className="text-gray-300 leading-relaxed text-xs sm:text-sm">
              {course.subtitle}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#161822] rounded-xl border border-white/5 text-center">
                <div className="text-[10px] text-gray-400 uppercase font-bold">Total Classes</div>
                <div className="text-base font-extrabold text-white">{course.totalClasses}+ Live</div>
              </div>
              <div className="p-3 bg-[#161822] rounded-xl border border-white/5 text-center">
                <div className="text-[10px] text-gray-400 uppercase font-bold">DGHS Model Tests</div>
                <div className="text-base font-extrabold text-[#FF3540]">{course.totalExams}+ Exams</div>
              </div>
              <div className="p-3 bg-[#161822] rounded-xl border border-white/5 text-center">
                <div className="text-[10px] text-gray-400 uppercase font-bold">Course Duration</div>
                <div className="text-base font-extrabold text-white">{course.duration}</div>
              </div>
              <div className="p-3 bg-[#161822] rounded-xl border border-white/5 text-center">
                <div className="text-[10px] text-gray-400 uppercase font-bold">Rating</div>
                <div className="text-base font-extrabold text-amber-400">★ {course.rating.toFixed(1)} / 5.0</div>
              </div>
            </div>

            {/* Mentors / Instructors for this course */}
            {course.mentors && course.mentors.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF3540] flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  <span>Lead Faculty & Course Mentors</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.mentors.map((mentor) => (
                    <div
                      key={mentor.id}
                      className="p-3 bg-[#141620] rounded-xl border border-white/5 flex items-center gap-3"
                    >
                      <img
                        src={mentor.imagePath}
                        alt={mentor.name}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-full object-cover border-2 border-[#E50914]/40 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-white truncate">
                          {mentor.name}
                        </div>
                        <div className="text-[11px] text-gray-400 truncate">
                          {mentor.degree} • {mentor.college}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF3540]">
                What You Will Receive in This Course
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {course.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Curriculum */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF3540]">
                Curriculum Roadmap
              </h3>
              <div className="space-y-2">
                {course.syllabus && course.syllabus.length > 0 ? (
                  course.syllabus.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-[#141620] rounded-xl border border-white/5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-[#FF3540]">
                          Section {idx + 1}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {m.lessons.length} Topics
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        {m.title}
                      </h4>
                      <ul className="pl-4 space-y-1 list-disc text-[11px] text-gray-400">
                        {m.lessons.map((lesson, lIdx) => (
                          <li key={lIdx}>{lesson}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-[#141620] rounded-xl border border-white/5 text-gray-400 text-xs">
                    Comprehensive syllabus covering Botany, Zoology, CQ Solves and DGHS standard Model Tests.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Footer Checkout CTA */}
          <div className="p-4 sm:p-5 bg-[#141620] border-t border-white/10 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Course Fee</span>
              <div className="flex items-baseline gap-2">
                {isFreeCourse ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl sm:text-2xl font-black text-emerald-400">
                      100% FREE
                    </span>
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ৳ 0
                    </span>
                  </div>
                ) : (
                  <>
                    <span className="text-xl sm:text-2xl font-black text-white font-heading">
                      {formattedFee}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-gray-500 line-through">
                        ৳ {course.price.toLocaleString('en-US')}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl"
              >
                Close
              </button>
              <button
                id="modal-enroll-now-btn"
                onClick={() => {
                  onClose();
                  onEnroll(course);
                }}
                className={`px-5 py-2.5 ${
                  isEnrolled
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_4px_16px_rgba(16,185,129,0.4)]'
                    : isFreeCourse
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_4px_16px_rgba(16,185,129,0.4)]'
                      : 'bg-[#E50914] hover:bg-[#b8060f] text-white shadow-[0_4px_16px_rgba(229,9,20,0.4)]'
                } text-xs sm:text-sm font-black rounded-xl transition-all flex items-center gap-1.5`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{isEnrolled ? '✓ Enrolled' : isFreeCourse ? '✓ Enroll Free' : '✓ Enroll Now'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Picture Upload / Change Modal */}
      <CoursePictureModal
        course={course}
        isOpen={isPictureModalOpen}
        onClose={() => setIsPictureModalOpen(false)}
      />
    </>
  );
};
