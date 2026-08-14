import React, { useState } from 'react';
import { Mentor, PageView } from '../types';
import { 
  X, 
  Stethoscope, 
  GraduationCap, 
  Award, 
  Users, 
  Clock, 
  BookOpen, 
  Video, 
  Sparkles, 
  Quote,
  ChevronRight,
  ShieldCheck,
  Camera,
  Eye
} from 'lucide-react';
import { useMentorImage } from '../utils/mentorStorage';
import { MentorPictureModal } from './MentorPictureModal';

interface MentorDetailsModalProps {
  mentor: Mentor | null;
  onClose: () => void;
  onNavigate?: (page: PageView) => void;
  onBookSlot?: (mentor: Mentor) => void;
}

export const MentorDetailsModal: React.FC<MentorDetailsModalProps> = ({
  mentor,
  onClose,
  onNavigate,
  onBookSlot
}) => {
  if (!mentor) return null;

  const [imageError, setImageError] = useState(false);
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);
  const { currentImage } = useMentorImage(mentor);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div 
          className="bg-[#111318] border border-white/10 rounded-2xl sm:rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Modal Top Bar */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#141620]">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#E50914]/15 border border-[#E50914]/30 text-[#FF3540] text-[10px] font-black uppercase tracking-wider">
                {mentor.role || 'Faculty Profile'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar">
            
            {/* Header section with photo, name & degrees */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <button
                type="button"
                onClick={() => setIsPictureModalOpen(true)}
                title="Click to View Picture or Change Picture"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gradient-to-b from-[#1c1216] to-[#12131b] border-2 border-[#E50914] shadow-lg shrink-0 flex items-center justify-center relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              >
                {!mentor.isEmpty && currentImage && !imageError ? (
                  <img
                    src={currentImage}
                    alt={mentor.name}
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#141620] text-gray-400">
                    <Stethoscope className="w-12 h-12 text-[#FF3540]" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white">
                  <Eye className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Options</span>
                </div>
              </button>

              <div className="space-y-1.5 flex-1">
                <h2 className="text-xl sm:text-2xl font-black font-heading text-white">
                  {mentor.name}
                </h2>
                <p className="text-sm font-bold text-[#FF3540]">
                  {mentor.degree}
                </p>
                {mentor.titles && mentor.titles.length > 1 && (
                  <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start pt-0.5">
                    {mentor.titles.slice(1).map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs font-semibold text-gray-300">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {mentor.college && (
                  <p className="text-xs text-gray-300 flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                    <GraduationCap className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>{mentor.college}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Quick Credential Highlights */}
            {!mentor.isEmpty && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center sm:text-left">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">Students Mentored</span>
                  <span className="text-sm sm:text-base font-extrabold text-white">
                    {mentor.studentsMentored ? `${mentor.studentsMentored.toLocaleString()}+` : '18,500+'}
                  </span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center sm:text-left">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">Experience</span>
                  <span className="text-sm sm:text-base font-extrabold text-white">
                    {mentor.experienceYears ? `${mentor.experienceYears}+ Years` : '6+ Years'}
                  </span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 col-span-2 sm:col-span-1 text-center sm:text-left">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">Specialty</span>
                  <span className="text-sm sm:text-base font-extrabold text-[#FF3540]">
                    Biology 360°
                  </span>
                </div>
              </div>
            )}

            {/* Bio / Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                About the Mentor
              </h4>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-[#141620] p-4 rounded-xl border border-white/5">
                {mentor.bio}
              </p>
            </div>

            {/* Quote if present */}
            {mentor.quote && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#1b1216] to-[#12141e] border border-[#E50914]/20 flex items-start gap-3">
                <Quote className="w-5 h-5 text-[#FF3540] shrink-0 mt-0.5" />
                <p className="text-xs text-gray-200 italic leading-relaxed">
                  "{mentor.quote}"
                </p>
              </div>
            )}

          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-[#141620] flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 transition-colors"
            >
              Close
            </button>
            
            {!mentor.isEmpty && (
              <>
                {onBookSlot && (
                  <button
                    onClick={() => {
                      onClose();
                      onBookSlot(mentor);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5 border border-white/10"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Book 1-on-1 Slot</span>
                  </button>
                )}
                {onNavigate && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigate('courses');
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#b8060f] text-xs font-bold text-white shadow-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>View Batches & Classes</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}
          </div>

        </div>
      </div>

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

