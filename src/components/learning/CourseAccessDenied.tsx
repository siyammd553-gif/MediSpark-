import React from 'react';
import { PageView } from '../../types';
import { Lock, BookOpen, ArrowRight } from 'lucide-react';

interface CourseAccessDeniedProps {
  onNavigate: (page: PageView) => void;
  title?: string;
}

// Shown whenever a student (or guest) tries to open course content they have
// not enrolled in. Access is always checked against the authenticated
// student's own enrollment list before any class/exam/material is rendered.
export const CourseAccessDenied: React.FC<CourseAccessDeniedProps> = ({
  onNavigate,
  title = 'Course content is restricted to enrolled students.',
}) => {
  return (
    <div id="course-access-denied" className="min-h-screen bg-[#090909] text-white flex items-center justify-center p-6">
      <div className="bg-[#111318] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="w-14 h-14 rounded-2xl bg-[#E50914]/15 text-[#FF3540] flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg sm:text-xl font-black text-white">Not Enrolled in this Course</h2>
          <p className="text-xs text-gray-400 leading-relaxed">{title}</p>
          <p className="text-[11px] text-gray-500">
            Enroll first — your enrolled courses are tied to your student account only.
          </p>
        </div>

        <div className="pt-2 grid grid-cols-1 gap-2.5">
          <button
            onClick={() => onNavigate('courses')}
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#E50914] hover:bg-[#b8060f] text-white text-sm font-bold rounded-xl shadow-[0_4px_20px_rgba(229,9,20,0.4)] transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse All Courses</span>
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-bold rounded-xl border border-white/10 transition-colors"
          >
            <span>Back to My Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};