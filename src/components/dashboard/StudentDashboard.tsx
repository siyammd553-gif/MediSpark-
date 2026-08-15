import React, { useState } from 'react';
import { PageView } from '../../types';
import { StudentProfileSection } from './StudentProfileSection';
import { MyEnrolledCoursesSection } from './MyEnrolledCoursesSection';
import { ExamResultAndLeaderboardSection } from './ExamResultAndLeaderboardSection';
import { StudentFavoritesSection } from './StudentFavoritesSection';
import { MentorSchedulerModal } from './MentorSchedulerModal';
import { StudentPictureModal } from './StudentPictureModal';
import { StudentProfileEditModal } from './StudentProfileEditModal';
import { useStudentProfile } from '../../utils/studentStorage';
import { useFavorites } from '../../utils/favoriteStorage';
import { useAuth } from '../../context/AuthContext';
import { 
  User,
  GraduationCap, 
  Trophy, 
  Bookmark, 
  Flame,
  ShieldCheck,
  Camera,
  Edit3
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (page: PageView) => void;
  onDownloadResource: (title: string) => void;
}

export type DashboardTab = 'student-profile' | 'my-courses' | 'exam-result' | 'favourites';

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigate,
  onDownloadResource,
}) => {
  const { profile, updateProfile } = useStudentProfile();
  const { totalCount: totalFavorites } = useFavorites();
  const { accountId, studentId, role, isAuthenticated } = useAuth();
  
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Dashboard 4 core segments as requested:
  // 1. Student Profile
  // 2. My Enrolled Course
  // 3. Exam Result
  // 4. Favourite
  const [activeTab, setActiveTab] = useState<DashboardTab>('student-profile');
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);

  const dashboardTabs: {
    id: DashboardTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    { 
      id: 'student-profile', 
      label: 'Student Profile', 
      icon: <User className="w-4 h-4 text-emerald-400" />, 
      badge: 'ID Card' 
    },
    { 
      id: 'my-courses', 
      label: 'My Enrolled Course', 
      icon: <GraduationCap className="w-4 h-4 text-[#FF3540]" />, 
      badge: 'Active' 
    },
    { 
      id: 'exam-result', 
      label: 'Exam Result', 
      icon: <Trophy className="w-4 h-4 text-amber-400" />, 
      badge: 'DGHS Scores' 
    },
    { 
      id: 'favourites', 
      label: 'Favourite', 
      icon: <Bookmark className="w-4 h-4 text-[#FF3540] fill-current" />, 
      badge: `${totalFavorites} Saved` 
    },
  ];

  return (
    <div id="medispark-student-dashboard-page" className="min-h-screen bg-[#090909] text-white py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Top Mini Header Strip: Quick Identity & Streak Status */}
        <div className="bg-[#111318] border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <button
              onClick={() => setIsPictureModalOpen(true)}
              className="relative group shrink-0 w-12 h-12 rounded-xl overflow-hidden border-2 border-[#E50914] shadow-md focus:outline-none"
              title="Change Profile Picture"
            >
              <img
                src={profile.avatar}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black font-heading text-white truncate">
                  {profile.name}
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#E50914]/20 border border-[#E50914]/40 text-[#FF3540] rounded-md hidden sm:inline">
                  {profile.batch}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                ID: <span className="text-gray-300 font-semibold">{studentId || profile.id}</span> • Account:{' '}
                <span className="text-gray-300 font-semibold">{accountId || 'MSP-…'}</span> • {profile.college}
                {isAuthenticated && role && (
                  <span className="ml-2 text-[10px] font-black uppercase px-2 py-0.5 bg-blue-500/20 border border-blue-500/40 text-blue-300 rounded-md">
                    {role}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171922] border border-white/5 text-xs text-amber-300">
              <Flame className="w-4 h-4 text-[#FF3540] animate-pulse" />
              <span className="font-extrabold">{profile.streakDays} Day Streak</span>
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-200 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#FF3540]" />
              <span>Edit Info</span>
            </button>
          </div>
        </div>

        {/* Dashboard 4 Segments Navigation Bar */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
          {dashboardTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`student-dashboard-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-[#E50914] text-white shadow-[0_4px_20px_rgba(229,9,20,0.45)] scale-[1.02]'
                    : 'bg-[#12141a] text-gray-400 hover:text-white hover:bg-[#181b24] border border-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Segment 1: Student Profile */}
        {activeTab === 'student-profile' && (
          <StudentProfileSection
            profile={profile}
            onNavigate={onNavigate}
            onOpenPictureModal={() => setIsPictureModalOpen(true)}
            onOpenEditModal={() => setIsEditModalOpen(true)}
          />
        )}

        {/* Segment 2: My Enrolled Course */}
        {activeTab === 'my-courses' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <MyEnrolledCoursesSection onNavigate={onNavigate} />
          </div>
        )}

        {/* Segment 3: Exam Result */}
        {activeTab === 'exam-result' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <ExamResultAndLeaderboardSection 
              profile={profile} 
              onNavigate={onNavigate} 
            />
          </div>
        )}

        {/* Segment 4: Favourite */}
        {activeTab === 'favourites' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <StudentFavoritesSection 
              onNavigate={onNavigate}
              onDownloadResource={onDownloadResource}
            />
          </div>
        )}

      </div>

      {/* 1-on-1 Scheduler Modal */}
      <MentorSchedulerModal
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
      />

      {/* Student Profile Photo Modal (View / Upload / Change) */}
      {isPictureModalOpen && (
        <StudentPictureModal
          profile={profile}
          initialMode="menu"
          onClose={() => setIsPictureModalOpen(false)}
          onAvatarUpdated={(newUrl) => {
            updateProfile({ avatar: newUrl });
          }}
        />
      )}

      {/* Student Profile Info Edit Modal */}
      {isEditModalOpen && (
        <StudentProfileEditModal
          initialProfile={profile}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updated) => {
            updateProfile(updated);
          }}
        />
      )}
    </div>
  );
};
