import React, { useState } from 'react';
import { Mentor, PageView } from '../../types';
import { MENTORS_DATA } from '../../data/mockData';
import { MentorCard } from '../MentorCard';
import { MentorDetailsModal } from '../MentorDetailsModal';
import { MentorSchedulerModal } from '../dashboard/MentorSchedulerModal';
import { GraduationCap } from 'lucide-react';

interface MentorSectionProps {
  onNavigate: (page: PageView) => void;
  onSelectMentor?: (mentor: Mentor) => void;
}

export const MentorSection: React.FC<MentorSectionProps> = ({ onNavigate }) => {
  const [selectedMentorForDetails, setSelectedMentorForDetails] = useState<Mentor | null>(null);
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState<Mentor | null>(null);

  const handleOpenDetails = (mentor: Mentor) => {
    setSelectedMentorForDetails(mentor);
  };

  const handleBookSlot = (mentor: Mentor) => {
    setSelectedMentorForBooking(mentor);
  };

  return (
    <section 
      id="mentor-teacher-section"
      className="py-14 sm:py-20 bg-[#0d0e12] border-t border-b border-white/5 relative overflow-hidden"
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#E50914]/10 blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-950/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E50914]/10 border border-[#E50914]/30 text-[#FF3540] text-xs font-extrabold uppercase tracking-widest mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Meet Our Mentors</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-heading text-white tracking-tight">
            Meet Our Mentors
          </h2>
        </div>

        {/* Mentor Cards Grid (Showing Picture of mentor, Name, Title, and View Details option) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {MENTORS_DATA.map((mentor) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              onViewDetails={handleOpenDetails}
            />
          ))}
        </div>

      </div>

      {/* Mentor Details Modal */}
      {selectedMentorForDetails && (
        <MentorDetailsModal
          mentor={selectedMentorForDetails}
          onClose={() => setSelectedMentorForDetails(null)}
          onNavigate={onNavigate}
          onBookSlot={handleBookSlot}
        />
      )}

      {/* Mentor 1-on-1 Scheduler Modal */}
      {selectedMentorForBooking && (
        <MentorSchedulerModal
          isOpen={!!selectedMentorForBooking}
          onClose={() => setSelectedMentorForBooking(null)}
          selectedMentor={selectedMentorForBooking}
        />
      )}
    </section>
  );
};
