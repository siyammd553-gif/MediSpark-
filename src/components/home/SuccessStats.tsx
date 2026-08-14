import React from 'react';
import { SUCCESS_STATS } from '../../data/mockData';

export const SuccessStats: React.FC = () => {
  return (
    <section 
      id="success-stats-section"
      className="py-12 bg-gradient-to-r from-[#0d0e12] via-[#141014] to-[#0d0e12] border-y border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {SUCCESS_STATS.map((stat, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#E50914]/30 transition-all">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl sm:text-4xl font-black font-heading text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-400 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
