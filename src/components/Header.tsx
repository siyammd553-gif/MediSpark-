import React, { useState, useEffect } from 'react';
import { PageView } from '../types';
import { MediSparkLogo } from './MediSparkLogo';
import { useTheme } from '../context/ThemeContext';
import { 
  Menu, 
  Sparkles, 
  User, 
  LogIn, 
  Flame, 
  GraduationCap, 
  ChevronRight,
  Bell,
  BookOpen,
  BrainCircuit,
  BarChart3,
  Users,
  Sun,
  Moon
} from 'lucide-react';

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onOpenDrawer: () => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
  userStreak: number;
  unreadNotificationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenDrawer,
  onOpenAuth,
  isLoggedIn,
  userStreak,
  unreadNotificationsCount = 2,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; page: PageView; isNew?: boolean; badge?: string }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Courses', page: 'courses' },
    { label: 'Exams', page: 'exam', badge: 'DGHS' },
    { label: 'Q&A', page: 'qna', isNew: true, badge: 'Live' },
    { label: 'Dashboard', page: 'dashboard' },
  ];

  const moreLinks: { label: string; page: PageView }[] = [
    { label: 'Top Mentors', page: 'mentors' },
    { label: 'Rank Predictor', page: 'rank-predictor' },
    { label: 'Study Resources Vault', page: 'resources' },
  ];

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  return (
    <header
      id="main-site-header"
      className={`sticky top-0 z-40 w-full transition-all duration-250 ${
        scrolled
          ? 'bg-[#090909]/95 backdrop-blur-md border-b border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.6)] py-2.5'
          : 'bg-[#090909] border-b border-white/5 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Brand Logo (Desktop & Mobile) */}
        <div className="flex items-center gap-6">
          <div className="flex items-center">
            <MediSparkLogo onClick={() => onNavigate('home')} />
          </div>
        </div>

        {/* Center: Desktop Navigation Links (5 Core Segments + More) */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {navLinks.map((link) => {
            const isActive = currentPage === link.page;
            return (
              <button
                key={link.page}
                id={`header-nav-${link.page}`}
                onClick={() => onNavigate(link.page)}
                className={`relative px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white bg-white/10 shadow-sm font-bold'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
                {link.isNew && (
                  <span className="flex items-center gap-0.5 text-[10px] font-extrabold uppercase px-1.5 py-0.2 bg-[#E50914] text-white rounded-full shadow-[0_0_8px_rgba(229,9,20,0.6)]">
                    <Sparkles className="w-2.5 h-2.5" /> AI
                  </span>
                )}
                {isActive && (
                  <span className="absolute -bottom-[14px] left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#E50914] rounded-full shadow-[0_0_8px_#E50914]" />
                )}
              </button>
            );
          })}

          {/* More menu dropdown */}
          <div className="relative">
            <button
              id="header-nav-more"
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1"
            >
              <span>More</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isMoreMenuOpen ? 'rotate-90 text-[#FF3540]' : ''}`} />
            </button>

            {isMoreMenuOpen && (
              <div 
                id="header-more-dropdown"
                onMouseLeave={() => setIsMoreMenuOpen(false)}
                className="absolute top-full right-0 mt-2 w-48 bg-[#111318] border border-white/10 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                {moreLinks.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => {
                      onNavigate(item.page);
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                      currentPage === item.page
                        ? 'bg-[#E50914] text-white'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right: Actions (Theme toggle, Streak pill, Student status, Login button, Drawer menu) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Theme Toggle (Dark Mode / Light Mode) */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode (#111318)'}
            aria-label="Toggle theme mode"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all flex items-center justify-center"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-200" />
            ) : (
              <Moon className="w-4 h-4 text-sky-400 animate-in spin-in-90 duration-200" />
            )}
          </button>

          {/* Daily Study Streak Pill */}
          <button
            id="streak-indicator-btn"
            onClick={() => onNavigate('dashboard')}
            title="Daily Study Streak Tracker"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161820] border border-[#E50914]/30 hover:border-[#E50914] text-white text-xs font-bold transition-all shadow-inner hover:shadow-[0_0_12px_rgba(229,9,20,0.3)]"
          >
            <span className="text-[#FF3540] animate-pulse">🔥</span>
            <span>{userStreak}d Streak</span>
          </button>

          {/* Quick Notifications Trigger */}
          <button
            id="notifications-bell-btn"
            onClick={() => onNavigate('dashboard')}
            title="Notifications"
            className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 hover:text-white transition-all"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E50914] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#090909]">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Student Portal / Login CTA Button */}
          {isLoggedIn ? (
            <button
              id="student-dashboard-cta-btn"
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#E50914] to-[#c20510] hover:from-[#f51420] hover:to-[#E50914] text-white text-xs sm:text-sm font-bold shadow-[0_4px_16px_rgba(229,9,20,0.4)] transition-all hover:scale-102 active:scale-98"
            >
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">My Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </button>
          ) : (
            <button
              id="header-login-btn"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E50914] hover:bg-[#b8060f] text-white text-xs sm:text-sm font-bold shadow-[0_4px_16px_rgba(229,9,20,0.4)] transition-all hover:scale-102 active:scale-98"
            >
              <span>Login</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Hamburger Menu button */}
          <button
            id="mobile-drawer-toggle-btn"
            onClick={onOpenDrawer}
            aria-label="Open Navigation Drawer"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

