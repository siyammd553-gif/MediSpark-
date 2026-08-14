import React, { useState } from 'react';
import { Course, PageView } from '../types';
import { COURSES_DATA } from '../data/mockData';
import { CourseCard } from '../components/CourseCard';
import { CourseDetailsModal } from '../components/CourseDetailsModal';
import { Search, BookOpen, Sparkles, SlidersHorizontal } from 'lucide-react';

interface CoursesPageProps {
  onNavigate: (page: PageView) => void;
  onEnroll: (course: Course) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ onNavigate, onEnroll }) => {
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);

  const batches = ['All', 'HSC 29 Batch', 'HSC 28 Batch'];
  const categories = ['All', 'HSC Academic', 'Medical Admission'];

  const filtered = COURSES_DATA.filter((course) => {
    const matchesBatch = selectedBatch === 'All' || course.targetBatch === selectedBatch;
    const matchesCat = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.targetBatch.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBatch && matchesCat && matchesSearch;
  });

  return (
    <div id="all-courses-page" className="min-h-screen bg-[#090909] text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E50914]/15 border border-[#E50914]/30 text-[#FF3540] text-xs font-black uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Official Programs for HSC 29 & HSC 28 Batches</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-white tracking-tight">
            Biology & Medical Admission Programs
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Curated curriculum by Md. Siyam Talukder: Complete Biology and Comprehensive Medical Admission courses for HSC 29 and HSC 28 batches.
          </p>
        </div>

        {/* Search & Batch / Category Filters */}
        <div className="bg-[#111318] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                id="search-courses-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search HSC 29, Biology, Medical..."
                className="w-full pl-10 pr-4 py-2 bg-[#171922] border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#E50914]"
              />
            </div>

            {/* Batch Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider hidden sm:inline mr-1">
                Batch:
              </span>
              {batches.map((batch) => (
                <button
                  key={batch}
                  id={`courses-page-batch-${batch.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setSelectedBatch(batch)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedBatch === batch
                      ? 'bg-[#E50914] text-white shadow-[0_2px_10px_rgba(229,9,20,0.4)]'
                      : 'bg-[#181b24] text-gray-400 hover:text-white border border-white/5'
                  }`}
                >
                  {batch === 'All' ? 'All Batches' : batch}
                </button>
              ))}
            </div>
          </div>

          {/* Category Secondary Filter */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/5 overflow-x-auto no-scrollbar">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider hidden sm:inline mr-1">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                id={`courses-page-cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
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
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onOpenDetails={(c) => setActiveCourseModal(c)}
              onEnroll={onEnroll}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-[#111318] border border-white/10 rounded-2xl p-6">
            <BookOpen className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No courses match your filter</h3>
            <p className="text-xs text-gray-400 mt-1">Try resetting the batch or search term.</p>
            <button
              onClick={() => {
                setSelectedBatch('All');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-[#E50914] text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Course Details Modal */}
      <CourseDetailsModal
        isOpen={!!activeCourseModal}
        onClose={() => setActiveCourseModal(null)}
        course={activeCourseModal}
        onEnroll={(course) => {
          setActiveCourseModal(null);
          onEnroll(course);
        }}
      />
    </div>
  );
};
