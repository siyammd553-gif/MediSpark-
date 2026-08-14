import React from 'react';
import { PageView } from '../types';
import { mentorSiyamImage } from '../assets/images';
import { Stethoscope, Award, Users, BookOpen, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageView) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div id="about-us-page" className="min-h-screen bg-[#090909] text-white py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E50914]/15 border border-[#E50914]/30 text-[#FF3540] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Origin & Mission</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight">
            Built by Doctors for Tomorrow’s Doctors
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            MediSpark was founded to democratize premier medical admission coaching across Bangladesh — replacing blind memorization with clinical insight, structured practice, and personal mentorship.
          </p>
        </div>

        {/* Philosophy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111318] border border-white/10 rounded-2xl p-6 space-y-3 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#E50914]/15 text-[#FF3540] flex items-center justify-center text-2xl">
              📚
            </div>
            <h3 className="text-lg font-black font-heading text-white">Line-by-Line NCTB Mastery</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Every medical question originates from official NCTB textbooks (Abul Hasan, Gazi Ajmal, Dr. Soroj Kanti, etc.). We break down every footnote, table, and scientific term.
            </p>
          </div>

          <div className="bg-[#111318] border border-white/10 rounded-2xl p-6 space-y-3 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#E50914]/15 text-[#FF3540] flex items-center justify-center text-2xl">
              🧠
            </div>
            <h3 className="text-lg font-black font-heading text-white">Smart Exam Simulation</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Practicing under 60-second pressure with DGHS negative marking (-0.25) eliminates exam phobia and refines option-elimination skills.
            </p>
          </div>

          <div className="bg-[#111318] border border-white/10 rounded-2xl p-6 space-y-3 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#E50914]/15 text-[#FF3540] flex items-center justify-center text-2xl">
              ⚕
            </div>
            <h3 className="text-lg font-black font-heading text-white">Clinical Mentorship</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Students get direct 1-on-1 counseling from medical students who recently topped the DGHS national merit examinations.
            </p>
          </div>
        </div>

        {/* Lead Mentor Quote */}
        <div className="bg-gradient-to-r from-[#1a1215] via-[#141622] to-[#111318] border border-[#E50914]/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl">
          <div className="relative shrink-0">
            <img
              src={mentorSiyamImage}
              alt="Md. Siyam Talukder — Founder"
              referrerPolicy="no-referrer"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[#E50914] shadow-[0_0_20px_rgba(229,9,20,0.4)]"
            />
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-[#E50914] text-white text-[9px] font-black rounded-full uppercase tracking-wider">
              Founder
            </div>
          </div>
          <div className="space-y-2 text-center md:text-left">
            <p className="text-sm sm:text-base text-gray-200 italic leading-relaxed">
              “Admission preparation isn’t about reading 16 hours a day blindly. It’s about knowing what NOT to study, mastering high-yield concepts, and keeping your calm in the 60 minutes that define your dream.”
            </p>
            <div className="text-xs text-[#FF3540] font-black uppercase tracking-wider">
              — Md. Siyam Talukder (MBBS, ShSMC) • Founder & Lead Biology Faculty
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <button
            onClick={() => onNavigate('courses')}
            className="px-8 py-3.5 bg-[#E50914] hover:bg-[#b8060f] text-white font-bold text-sm rounded-xl shadow-[0_4px_20px_rgba(229,9,20,0.5)] inline-flex items-center gap-2"
          >
            <span>Explore Admission Programs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
