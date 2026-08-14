import React, { useState } from 'react';
import { Mentor, PageView } from '../types';
import { MENTORS_DATA } from '../data/mockData';
import { MentorCard } from '../components/MentorCard';
import { MentorDetailsModal } from '../components/MentorDetailsModal';
import { MentorSchedulerModal } from '../components/dashboard/MentorSchedulerModal';
import { GraduationCap } from 'lucide-react';

interface MentorsPageProps {
  onNavigate: (page: PageView) => void;
}

export const MentorsPage: React.FC<MentorsPageProps> = ({ onNavigate }) => {
  const [selectedMentorForDetails, setSelectedMentorForDetails] = useState<Mentor | null>(null);
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState<Mentor | null>(null);

  const handleOpenDetails = (mentor: Mentor) => {
    setSelectedMentorForDetails(mentor);
  };

  const handleBookSlot = (mentor: Mentor) => {
    setSelectedMentorForBooking(mentor);
  };

  return (
    <div id="mentors-faculty-page" className="min-h-screen bg-[#090909] text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E50914]/15 border border-[#E50914]/30 text-[#FF3540] text-xs font-black uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Faculty & Mentorship</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-white tracking-tight">
            Meet Our Mentors
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Direct line-by-line guidance, textbook breakdown, and clinical exam strategies led by Md. Siyam Talukder alongside upcoming medical specialists.
          </p>
        </div>

        {/* Mentors Grid: Showing Picture of mentor, Name, Title, and View Details */}
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
    </div>
  );
};
