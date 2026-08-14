import React, { useState } from 'react';
import { PageView, StudentProfile } from '../../types';
import { StudyStreakTracker } from './StudyStreakTracker';
import { 
  User, 
  Camera, 
  Edit3, 
  Copy, 
  Check, 
  Building2, 
  Phone, 
  Mail, 
  Hash, 
  GraduationCap, 
  Stethoscope, 
  Award, 
  Calendar, 
  Trophy, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Target,
  Share2,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentProfileSectionProps {
  profile: StudentProfile;
  onNavigate: (page: PageView) => void;
  onOpenPictureModal: () => void;
  onOpenEditModal: () => void;
}

export const StudentProfileSection: React.FC<StudentProfileSectionProps> = ({
  profile,
  onNavigate,
  onOpenPictureModal,
  onOpenEditModal,
}) => {
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(profile.id);
    setCopiedId(true);
    confetti({ particleCount: 15, spread: 30, origin: { y: 0.8 } });
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div id="dashboard-student-profile-tab-content" className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-200">
      
      {/* 1. Main Student Digital Identity Card */}
      <div 
        id="student-digital-id-card"
        className="bg-gradient-to-r from-[#171216] via-[#12141a] to-[#0d0e12] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden space-y-6"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E50914]/10 blur-3xl pointer-events-none" />

        {/* Card Header Tag */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-white">
              Official MediSpark Digital Student Card
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E50914]/15 border border-[#E50914]/30 text-[#FF3540] text-xs font-black uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Student</span>
            </span>
          </div>
        </div>

        {/* Two-Column Grid: Left Profile Picture + Name, Right 4 Information Fields */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Picture & Name */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center space-y-3 md:border-r border-white/10 md:pr-6">
            <div className="relative group/avatar">
              <button
                type="button"
                id="student-profile-tab-avatar-btn"
                onClick={onOpenPictureModal}
                title="Click to View or Change Picture"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-gradient-to-b from-[#1c1216] to-[#12131b] border-2 border-[#E50914] shadow-[0_0_25px_rgba(229,9,20,0.35)] transition-all cursor-pointer relative focus:outline-none focus:ring-2 focus:ring-[#E50914] active:scale-95 flex items-center justify-center"
              >
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover/avatar:scale-105"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1">
                  <div className="flex items-center gap-1 bg-[#E50914] px-3 py-1 rounded-full text-xs font-bold shadow">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Change Picture</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Name */}
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight">
                {profile.name}
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {profile.batch} Aspirant
              </p>
            </div>

            {/* Quick Change Picture Trigger Button */}
            <button
              onClick={onOpenPictureModal}
              className="text-xs font-bold text-[#FF3540] hover:text-white flex items-center gap-1 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Change Photo</span>
            </button>
          </div>

          {/* Right Column: 4 Information Fields */}
          <div className="md:col-span-8 space-y-2.5 text-xs sm:text-sm">
            <div className="flex flex-col space-y-2.5">
              
              {/* Student ID */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Hash className="w-4 h-4 text-[#FF3540]" />
                  <span className="font-semibold">Student ID:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono font-bold tracking-wider">{profile.id}</span>
                  <button
                    onClick={handleCopyId}
                    className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
                    title="Copy Student ID"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Batch */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold">Batch:</span>
                </div>
                <span className="text-white font-bold">{profile.batch}</span>
              </div>

              {/* Institution */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400 shrink-0">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold">Institution:</span>
                </div>
                <span className="text-white font-semibold truncate ml-2">{profile.college}</span>
              </div>

              {/* Contact Phone & Email */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400 shrink-0">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">Contact Phone:</span>
                </div>
                <span className="text-white font-medium ml-2">{profile.phone}</span>
              </div>

            </div>
          </div>

        </div>

        {/* Card Footer: Edit Profile Button & Dream Medical College */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Stethoscope className="w-4 h-4 text-[#FF3540]" />
            <span className="text-gray-400">Target Medical College:</span>
            <span className="font-bold text-white">{profile.targetMedicalCollege || 'Dhaka Medical College (DMC)'}</span>
          </div>

          <button
            id="edit-student-profile-tab-btn"
            onClick={onOpenEditModal}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#b8060f] text-white text-xs sm:text-sm font-extrabold transition-all shadow-[0_4px_16px_rgba(229,9,20,0.4)] flex items-center justify-center gap-2"
          >
            <Edit3 className="w-4 h-4 text-white" />
            <span>Edit Profile Information</span>
          </button>
        </div>

      </div>

      {/* 2. Academic Milestones & Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 sm:p-5 rounded-2xl bg-[#111318] border border-white/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-bold uppercase">DGHS Merit Rank</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-heading">
            #{profile.rank}
          </div>
          <div className="text-[11px] text-gray-400">
            Top {profile.meritPercentile}% of {profile.totalStudents.toLocaleString()} students
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#111318] border border-white/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-bold uppercase">Study Streak</span>
            <Flame className="w-4 h-4 text-[#FF3540] animate-bounce" />
          </div>
          <div className="text-2xl font-black text-white font-heading">
            {profile.streakDays} Days
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Active streak today
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#111318] border border-white/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-bold uppercase">Classes Watched</span>
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-heading">
            {profile.completedClasses} / {profile.totalClasses}
          </div>
          <div className="text-[11px] text-gray-400">
            {Math.round((profile.completedClasses / profile.totalClasses) * 100)}% Course Completed
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#111318] border border-white/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-bold uppercase">Average Score</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-heading">
            {profile.overallScore}%
          </div>
          <div className="text-[11px] text-gray-400">
            Consistent High-Yield Accuracy
          </div>
        </div>

      </div>

      {/* 3. Daily Study Streak Tracker */}
      <StudyStreakTracker profile={profile} />

    </div>
  );
};
