import React from 'react';
import { PageView } from '../types';
import { MediSparkLogo } from './MediSparkLogo';
import { useTheme } from '../context/ThemeContext';
import { useStudentProfile } from '../utils/studentStorage';
import { 
  Home, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  BrainCircuit, 
  Sparkles, 
  FolderDown, 
  BarChart3, 
  LayoutDashboard, 
  LogIn, 
  X, 
  Phone, 
  Award,
  CalendarCheck,
  Sun,
  Moon,
  User,
  MessageSquareQuote
} from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
  userStreak: number;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
  onOpenAuth,
  isLoggedIn,
  userStreak,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { profile } = useStudentProfile();

  if (!isOpen) return null;

  const navItems: { label: string; page: PageView; icon: React.ReactNode; badge?: string }[] = [
    { label: 'Home', page: 'home', icon: <Home className="w-5 h-5" /> },
    { label: 'Courses & Programs', page: 'courses', icon: <BookOpen className="w-5 h-5" />, badge: 'HSC & Med' },
    { label: 'Exams & DGHS Model Tests', page: 'exam', icon: <CheckCircle2 className="w-5 h-5" />, badge: '100 MCQs' },
    { label: 'Q&A & Doubt Clearance', page: 'qna', icon: <MessageSquareQuote className="w-5 h-5" />, badge: 'Live / AI' },
    { label: 'Student Dashboard', page: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, badge: 'Live Tracker' },
    { label: 'Top Mentors', page: 'mentors', icon: <Users className="w-5 h-5" />, badge: 'MBBS/BUET' },
    { label: 'Rank Predictor', page: 'rank-predictor', icon: <BarChart3 className="w-5 h-5" /> },
    { label: 'Study Resources & Notes', page: 'resources', icon: <FolderDown className="w-5 h-5" /> },
    { label: 'Contact Support', page: 'contact', icon: <Phone className="w-5 h-5" /> },
  ];

  const handleItemClick = (page: PageView) => {
    onNavigate(page);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        id="drawer-backdrop"
        onClick={onClose} 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
      />

      {/* Drawer Container */}
      <div 
        id="navigation-drawer-panel"
        className="relative ml-auto w-full max-w-sm bg-[#0e1015] border-l border-white/10 shadow-2xl flex flex-col h-full z-10 text-white overflow-y-auto animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#111318]">
          <MediSparkLogo onClick={() => { onNavigate('home'); onClose(); }} />
          <button 
            id="close-drawer-btn"
            onClick={onClose}
            aria-label="Close drawer"
            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Quick Status Banner & Theme Switch */}
        <div className="p-4 bg-gradient-to-r from-[#171922] to-[#12141a] border-b border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[#E50914]/20 border border-[#E50914]/40 flex items-center justify-center text-[#E50914] font-bold shrink-0">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>AH</span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{profile.name}</p>
                <p className="text-xs text-gray-400 truncate max-w-[130px]">{profile.batch}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-[#E50914]/15 border border-[#E50914]/30 px-2.5 py-1 rounded-full text-xs font-bold text-[#FF3540]">
              <span>🔥</span>
              <span>{userStreak}d Streak</span>
            </div>
          </div>

          {/* Theme Switch Bar in Drawer */}
          <div className="flex items-center justify-between bg-black/40 p-2 rounded-xl border border-white/5">
            <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-sky-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              <span>Interface Theme: <strong className="capitalize">{theme} (#111318)</strong></span>
            </span>
            <button
              id="drawer-theme-toggle-btn"
              onClick={toggleTheme}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
            >
              {theme === 'dark' ? 'Switch Light' : 'Switch Dark'}
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-4 flex-1 space-y-1.5 overflow-y-auto">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1">
            Platform Navigation
          </div>
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                id={`drawer-link-${item.page}`}
                onClick={() => handleItemClick(item.page)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#E50914] text-white shadow-[0_4px_16px_rgba(229,9,20,0.35)]'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-[#E50914]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#E50914]/10 text-[#FF3540] border border-[#E50914]/20'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-[#111318] space-y-2.5">
          <button
            id="drawer-auth-btn"
            onClick={() => { onOpenAuth(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#E50914] hover:bg-[#b8060f] text-white font-bold rounded-xl transition-all shadow-[0_4px_16px_rgba(229,9,20,0.4)]"
          >
            <LogIn className="w-4 h-4" />
            <span>{isLoggedIn ? 'Switch Student Profile' : 'Student Login →'}</span>
          </button>
          <p className="text-[11px] text-center text-gray-400">
            MediSpark • “Together we Achieve Dreams”
          </p>
        </div>
      </div>
    </div>
  );
};

