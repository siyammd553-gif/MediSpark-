import React from 'react';
import { PageView } from '../types';
import { Home, BookOpen, CheckCircle2, LayoutDashboard, MessageSquareQuote } from 'lucide-react';

interface MobileBottomNavProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onNavigate,
}) => {
  const items: { label: string; page: PageView; icon: React.ReactNode }[] = [
    { label: 'Home', page: 'home', icon: <Home className="w-5 h-5" /> },
    { label: 'Courses', page: 'courses', icon: <BookOpen className="w-5 h-5" /> },
    { label: 'Exams', page: 'exam', icon: <CheckCircle2 className="w-5 h-5" /> },
    { label: 'Q&A', page: 'qna', icon: <MessageSquareQuote className="w-5 h-5" /> },
    { label: 'Dashboard', page: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  ];

  return (
    <div 
      id="mobile-bottom-navigation-bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090909]/95 backdrop-blur-lg border-t border-white/10 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.8)]"
    >
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = currentPage === item.page;
          return (
            <button
              key={item.page}
              id={`mobile-bottom-nav-${item.page}`}
              onClick={() => onNavigate(item.page)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-[#E50914]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className={`relative p-1 rounded-lg transition-transform ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#E50914] rounded-full shadow-[0_0_6px_#E50914]" />
                )}
              </div>
              <span className={`text-[11px] font-semibold tracking-tight mt-0.5 ${
                isActive ? 'text-[#E50914] font-bold' : 'text-gray-400'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
