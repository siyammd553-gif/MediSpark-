import React, { useState } from 'react';
import { Mentor } from '../types';
import { Stethoscope, ArrowRight, Camera, Eye, Sparkles } from 'lucide-react';
import { useMentorImage } from '../utils/mentorStorage';
import { MentorPictureModal } from './MentorPictureModal';

interface MentorCardProps {
  mentor: Mentor;
  onViewDetails: (mentor: Mentor) => void;
}

export const MentorCard: React.FC<MentorCardProps> = ({ mentor, onViewDetails }) => {
  const [imageError, setImageError] = useState(false);
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);
  const { currentImage } = useMentorImage(mentor);

  // Derive a clean title
  const mentorTitle = mentor.isEmpty
    ? mentor.degree || 'Faculty Member'
    : mentor.role
      ? `${mentor.degree ? `${mentor.degree} • ` : ''}${mentor.role}`
      : mentor.degree || mentor.specialty || 'Academic Mentor';

  return (
    <>
      <div
        id={`mentor-card-${mentor.id}`}
        className="bg-[#111318] border border-white/10 hover:border-[#E50914]/60 rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between group hover:shadow-[0_12px_30px_rgba(229,9,20,0.15)] relative overflow-hidden"
      >
        {/* Top subtle highlight */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E50914]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="flex flex-col items-center text-center space-y-4">
          
          {/* 1. Picture of Mentor (Clickable for View Picture / Change Picture) */}
          <div className="relative group/pic">
            <button
              type="button"
              id={`mentor-photo-btn-${mentor.id}`}
              onClick={() => setIsPictureModalOpen(true)}
              title="Click for View Picture / Change Picture options"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gradient-to-b from-[#1c1216] to-[#12131b] border-2 border-white/10 group-hover:border-[#E50914] transition-all shadow-md flex items-center justify-center relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E50914] active:scale-95"
            >
              {!mentor.isEmpty && currentImage && !imageError ? (
                <img
                  src={currentImage}
                  alt={mentor.name}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#141620] text-gray-500 group-hover:text-[#FF3540] transition-colors">
                  <Stethoscope className="w-10 h-10 stroke-[1.5]" />
                </div>
              )}

              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/pic:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white backdrop-blur-[2px]">
                <div className="flex items-center gap-1.5 bg-[#E50914] px-2 py-0.5 rounded-full text-[10px] font-bold shadow">
                  <Eye className="w-3 h-3" />
                  <span>/</span>
                  <Camera className="w-3 h-3" />
                </div>
                <span className="text-[9px] font-semibold text-gray-200">
                  Options
                </span>
              </div>
            </button>
          </div>

          {/* 2. Name & 3. Title */}
          <div className="space-y-1.5 w-full">
            <h3 className="text-base sm:text-lg font-black font-heading text-white group-hover:text-[#FF3540] transition-colors truncate">
              {mentor.name}
            </h3>
            
            {mentor.titles && mentor.titles.length > 0 ? (
              <div className="space-y-0.5 text-center">
                {mentor.titles.map((title, idx) => (
                  <p
                    key={idx}
                    className={`text-xs ${
                      idx === 0
                        ? 'font-bold text-[#FF3540]'
                        : 'text-gray-300 font-medium'
                    } leading-tight`}
                  >
                    {title}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 font-medium line-clamp-1">
                {mentorTitle}
              </p>
            )}
          </div>

        </div>

        {/* 4. Option: View Details */}
        <div className="pt-5 mt-4 border-t border-white/5">
          <button
            id={`view-details-btn-${mentor.id}`}
            onClick={() => onViewDetails(mentor)}
            className="w-full py-2.5 px-4 bg-white/5 hover:bg-[#E50914] text-gray-200 hover:text-white border border-white/10 hover:border-[#E50914] text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm group-hover:bg-[#E50914] group-hover:text-white group-hover:border-[#E50914]"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

      </div>

      {/* Picture Action/Viewer Modal */}
      {isPictureModalOpen && (
        <MentorPictureModal
          mentor={mentor}
          initialMode="menu"
          onClose={() => setIsPictureModalOpen(false)}
        />
      )}
    </>
  );
};

