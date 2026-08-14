import React from 'react';
import { PageView } from '../../types';
import { Sparkles, ArrowRight, ShieldCheck, Stethoscope } from 'lucide-react';

interface CtaSectionProps {
  onNavigate: (page: PageView) => void;
  onOpenAuth: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onNavigate, onOpenAuth }) => {
  return (
    <section 
      id="home-final-cta-section"
      className="py-14 sm:py-20 bg-gradient-to-b from-[#090909] via-[#1a080a] to-[#090909] relative overflow-hidden border-t border-white/5"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#E50914]/20 blur-3xl opacity-60" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/20 text-[#FF3540] text-xs font-black uppercase tracking-wider mb-4 shadow-lg">
          <Stethoscope className="w-4 h-4" />
          <span>Your Dream Medical College Awaits</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight leading-tight mb-4">
          Together we Achieve Dreams. <br />
          <span className="text-[#E50914]">Start Your Preparation Today.</span>
        </h2>

        <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          Join thousands of dedicated HSC students and admission candidates practicing daily on MediSpark.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="final-cta-explore-courses-btn"
            onClick={() => onNavigate('courses')}
            className="w-full sm:w-auto px-8 py-4 bg-[#E50914] hover:bg-[#b8060f] text-white text-base font-bold rounded-xl shadow-[0_6px_25px_rgba(229,9,20,0.5)] transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-2"
          >
            <span>Explore Admission Programs</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            id="final-cta-dashboard-btn"
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-base font-bold rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#FF3540]" />
            <span>Launch Student Dashboard</span>
          </button>
        </div>
      </div>
    </section>
  );
};
