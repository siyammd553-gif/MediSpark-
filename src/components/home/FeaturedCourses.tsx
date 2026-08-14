import React, { useState } from 'react';
import { Course, PageView } from '../../types';
import { COURSES_DATA } from '../../data/mockData';
import { CourseCard } from '../CourseCard';
import { CourseDetailsModal } from '../CourseDetailsModal';
import { BookOpen, ArrowRight } from 'lucide-react';

interface FeaturedCoursesProps {
  onNavigate: (page: PageView) => void;
  onSelectCourse: (course: Course) => void;
}

export const FeaturedCourses: React.FC<FeaturedCoursesProps> = ({
  onNavigate,
  onSelectCourse,
}) => {
  const [selectedBatch, setSelectedBatch] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);

  const batches = ['All', 'HSC 29 Batch', 'HSC 28 Batch'];
  const categories = ['All', 'HSC Academic', 'Medical Admission'];

  const filteredCourses = COURSES_DATA.filter((c) => {
    const matchesBatch = selectedBatch === 'All' || c.targetBatch === selectedBatch;
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesBatch && matchesCat;
  });

  const handleOpenDetails = (course: Course) => {
    setActiveCourseModal(course);
  };

  const handleEnroll = (course: Course) => {
    onSelectCourse(course);
  };

  return (
    <section 
      id="programs-courses-section"
      className="py-14 sm:py-20 bg-[#090909] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E50914]/10 border border-[#E50914]/30 text-[#FF3540] text-xs font-extrabold uppercase tracking-widest mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>HSC 29 & HSC 28 Programs</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-white tracking-tight">
              Featured Biology & Medical Programs
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-1.5 max-w-xl">
              Specialized academic & medical admission programs crafted by Md. Siyam Talukder for HSC 29 and HSC 28 batches.
            </p>
          </div>

          <button
            id="view-all-courses-header-btn"
            onClick={() => onNavigate('courses')}
            className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2 hover:border-[#E50914]/60"
          >
            <span>View All Programs</span>
            <ArrowRight className="w-4 h-4 text-[#E50914]" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-8 border-b border-white/5">
          {/* Batch Selector */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider hidden sm:inline mr-1">
              Batch:
            </span>
            {batches.map((batch) => (
              <button
                key={batch}
                id={`batch-filter-${batch.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setSelectedBatch(batch)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  selectedBatch === batch
                    ? 'bg-[#E50914] text-white shadow-[0_4px_16px_rgba(229,9,20,0.4)]'
                    : 'bg-[#14161f] text-gray-400 hover:text-white hover:bg-[#1a1d28] border border-white/5'
                }`}
              >
                {batch === 'All' ? 'All Batches' : batch}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`cat-filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-white/15 text-white border border-white/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat === 'All' ? 'All Categories' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid with Standardized Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-7">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onOpenDetails={handleOpenDetails}
              onEnroll={handleEnroll}
            />
          ))}
        </div>

      </div>

      {/* Course Details Modal */}
      <CourseDetailsModal
        isOpen={!!activeCourseModal}
        onClose={() => setActiveCourseModal(null)}
        course={activeCourseModal}
        onEnroll={(course) => {
          setActiveCourseModal(null);
          handleEnroll(course);
        }}
      />
    </section>
  );
};
