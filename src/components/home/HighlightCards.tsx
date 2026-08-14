import React from 'react';
import { PageView } from '../../types';

interface HighlightCardsProps {
  onNavigate: (page: PageView) => void;
}

export const HighlightCards: React.FC<HighlightCardsProps> = ({ onNavigate }) => {
  const cards = [
    {
      id: 'card-hsc',
      icon: '📚',
      title: 'HSC Preparation',
      desc: 'Structured academic preparation with board CQ & MCQ techniques.',
      action: 'courses' as PageView,
    },
    {
      id: 'card-med',
      icon: '⚕',
      title: 'Medical Admission',
      desc: 'Focused admission preparation covering DGHS standard syllabus.',
      action: 'courses' as PageView,
    },
  ];

  return (
    <section 
      id="medical-highlight-cards-section"
      className="relative -mt-6 sm:-mt-8 z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-14"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            id={card.id}
            onClick={() => onNavigate(card.action)}
            className="group cursor-pointer bg-white text-[#090909] rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_36px_rgba(229,9,20,0.2)] hover:-translate-y-1.5 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Red Icon Container */}
              <div className="w-12 h-12 rounded-xl bg-[#E50914] text-white flex items-center justify-center text-2xl shadow-[0_4px_12px_rgba(229,9,20,0.35)] group-hover:scale-110 group-hover:bg-[#b8060f] transition-all mb-4">
                <span>{card.icon}</span>
              </div>

              {/* Title */}
              <h4 className="text-lg font-black font-heading text-[#090909] mb-1.5 group-hover:text-[#E50914] transition-colors">
                {card.title}
              </h4>

              {/* Description */}
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                {card.desc}
              </p>
            </div>

            {/* Subtle bottom arrow */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#E50914]">
              <span>Explore Track</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
