import React, { useState } from 'react';
import { Course } from '../types';
import { useCourseImage } from '../utils/courseStorage';
import { CoursePictureModal } from './CoursePictureModal';
import {
  Camera,
  Check,
  CheckCircle2,
  FileText,
  Sparkles,
  BookOpen,
  Users,
  Star,
  GraduationCap,
  PlayCircle,
  ShieldCheck,
  Info
} from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onOpenDetails: (course: Course) => void;
  onEnroll: (course: Course) => void;
  onPreviewLesson?: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onOpenDetails,
  onEnroll,
  onPreviewLesson,
}) => {
  const { currentImage, isCustom } = useCourseImage(course);
  const [isPictureModalOpen, setIsPictureModalOpen] = useState<boolean>(false);

  // Format fee display
  const isFreeCourse = course.isFree || (course.price === 0 && (!course.discountPrice || course.discountPrice === 0));
  const hasDiscount = !isFreeCourse && !!course.discountPrice && course.discountPrice < course.price;
  const currentFeeNumber = isFreeCourse ? 0 : (course.discountPrice || course.price);
  const formattedFee = `৳ ${currentFeeNumber.toLocaleString('en-US')}`;

  return (
    <>
      <div
        id={`course-card-${course.id}`}
        className="group flex flex-col bg-[#12141c] border border-white/10 hover:border-[#E50914]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(229,9,20,0.18)] hover:-translate-y-1"
      >
        {/* =========================================
            1. COURSE PICTURE (Consistent 16:9 Aspect)
           ========================================= */}
        <div className="relative aspect-video w-full overflow-hidden bg-[#0d0f14]">
          <img
            src={currentImage}
            alt={course.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80';
            }}
          />

          {/* Dark gradient overlay for text clarity */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#12141c] via-transparent to-black/40 pointer-events-none" />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10 pointer-events-none">
            <span className="px-2.5 py-1 rounded-lg bg-[#E50914] text-white text-[11px] font-black tracking-wide uppercase shadow-md">
              {course.targetBatch}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-gray-200 text-[10px] font-bold">
              {course.category}
            </span>
          </div>

          {/* Upload / Change Picture Button */}
          <div className="absolute top-3 right-3 z-10">
            <button
              id={`upload-pic-btn-${course.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsPictureModalOpen(true);
              }}
              title="Upload / Change Course Picture"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/80 hover:bg-[#E50914] text-white text-[11px] font-bold border border-white/20 hover:border-[#E50914] backdrop-blur-md transition-all shadow-lg hover:scale-105"
            >
              <Camera className="w-3.5 h-3.5 text-[#FF3540] group-hover:text-white" />
              <span className="hidden sm:inline">
                {isCustom ? 'Edit Picture' : 'Upload Pic'}
              </span>
            </button>
          </div>

          {/* Subtle Bottom Thumbnail Info (Class & Exam counts) */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-gray-300 z-10 pointer-events-none">
            <span className="flex items-center gap-1 font-semibold bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10">
              <BookOpen className="w-3 h-3 text-[#FF3540]" />
              {course.totalClasses}+ Classes
            </span>
            <span className="flex items-center gap-1 font-semibold bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              {course.rating.toFixed(1)} ({course.enrolledCount.toLocaleString()}+ students)
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
          <div className="space-y-3">
            {/* =========================================
                2. COURSE NAME (Prominent Heading Style)
               ========================================= */}
            <h3
              id={`course-title-${course.id}`}
              onClick={() => onOpenDetails(course)}
              className="text-lg sm:text-xl font-black font-heading text-white group-hover:text-[#FF3540] transition-colors leading-snug cursor-pointer line-clamp-2"
            >
              {course.title}
            </h3>

            {/* Course Subtitle / Description */}
            <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 leading-relaxed">
              {course.subtitle}
            </p>

            {/* Mentor line */}
            {course.mentors && course.mentors.length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                <img
                  src={course.mentors[0].imagePath}
                  alt={course.mentors[0].name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover border border-white/20 shrink-0"
                />
                <span className="text-xs text-gray-300 font-medium truncate">
                  Instructor: <strong className="text-white">{course.mentors[0].name}</strong> ({course.mentors[0].degree.split(',')[0]})
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-3 border-t border-white/5">
            {/* =========================================
                3. COURSE FEE (Visually Noticeable)
               ========================================= */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Course Fee:
              </span>

              {isFreeCourse ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl font-black text-emerald-400 tracking-tight">
                    100% FREE
                  </span>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ৳ 0
                  </span>
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight">
                    {formattedFee}
                  </span>
                  {hasDiscount && (
                    <span className="text-xs text-gray-500 line-through font-semibold">
                      ৳ {course.price.toLocaleString('en-US')}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* ====================================================
                4 & 5. BUTTONS: [ Details ]   [ ✓ Enroll ]
               ==================================================== */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Details Button */}
              <button
                id={`details-btn-${course.id}`}
                type="button"
                onClick={() => onOpenDetails(course)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#1a1d28] hover:bg-[#232736] text-white text-xs sm:text-sm font-bold border border-white/10 hover:border-white/25 transition-all shadow-sm active:scale-[0.98]"
              >
                <Info className="w-4 h-4 text-gray-300" />
                <span>Details</span>
              </button>

              {/* Prominent Enroll Button with Checkmark Icon */}
              <button
                id={`enroll-btn-${course.id}`}
                type="button"
                onClick={() => onEnroll(course)}
                className={`w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all shadow-[0_4px_16px_rgba(229,9,20,0.35)] hover:shadow-[0_6px_20px_rgba(229,9,20,0.5)] active:scale-[0.98] ${
                  isFreeCourse
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_4px_16px_rgba(16,185,129,0.35)]'
                    : 'bg-[#E50914] hover:bg-[#b8060f] text-white'
                }`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{isFreeCourse ? '✓ Enroll Free' : '✓ Enroll'}</span>
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
