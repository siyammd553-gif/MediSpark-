import React from 'react';
import { PageView } from '../../types';
import { mentorSiyamImage } from '../../assets/images';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Activity, 
  Award, 
  Users, 
  BookOpen, 
  ShieldCheck, 
  Flame,
  Stethoscope
} from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (page: PageView) => void;
  onOpenAuth: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onOpenAuth }) => {
  return (
    <section 
      id="home-hero-section"
      className="relative w-full overflow-hidden bg-[#090909] pt-6 sm:pt-10 pb-12 sm:pb-20 border-b border-white/5"
    >
      {/* Background Ambience: Deep Red Radials, ECG Waveform & Medical Geometry */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep Red Radial Glow top right */}
        <div className="absolute -top-32 -right-32 w-[550px] h-[550px] bg-radial from-[#E50914]/25 via-[#E50914]/5 to-transparent blur-3xl opacity-70 animate-glow" />
        {/* Soft Radial Center Left */}
        <div className="absolute top-1/2 -left-48 -translate-y-1/2 w-[450px] h-[450px] bg-radial from-[#b8060f]/15 to-transparent blur-3xl opacity-50" />
        
        {/* Animated SVG ECG Heartbeat Line across hero */}
        <svg 
          className="absolute bottom-6 left-0 right-0 w-full h-24 text-[#E50914]/20 opacity-40 pointer-events-none"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          fill="none"
        >
          <path
            d="M0 60 H300 L320 20 L340 100 L360 40 L380 75 L400 60 H700 L720 15 L740 105 L760 35 L780 80 L800 60 H1200"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-ecg"
          />
        </svg>

        {/* Subtle Decorative Medical Cross Grid */}
        <div className="absolute top-12 left-8 text-white/5 text-4xl select-none font-bold">✚</div>
        <div className="absolute top-48 right-16 text-white/5 text-5xl select-none font-bold">✚</div>
        <div className="absolute bottom-20 left-1/3 text-white/5 text-3xl select-none font-bold">✚</div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Hero Copy & CTA (8 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Hero Badge: ⚕ MEDICAL ADMISSION PREPARATION */}
            <div 
              id="hero-admission-badge"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/20 backdrop-blur-md mb-5 sm:mb-6 shadow-[0_2px_12px_rgba(229,9,20,0.25)]"
            >
              <span className="text-[#FF3540] text-sm">⚕</span>
              <span className="text-xs sm:text-sm font-extrabold tracking-wider text-white uppercase">
                Medical Admission Preparation
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-ping" />
            </div>

            {/* Main Heading: Prepare Smarter. Achieve Your Medical Dream. */}
            <h1 
              id="hero-main-heading"
              className="text-[35px] sm:text-[44px] lg:text-[50px] font-black font-heading text-white leading-[1.12] tracking-tight mb-4"
            >
              Prepare Smarter. <br className="hidden sm:inline" />
              Achieve Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3540] via-[#E50914] to-[#ff6b74] drop-shadow-[0_0_25px_rgba(229,9,20,0.5)]">
                Medical Dream.
              </span>
            </h1>

            {/* Tagline & Subheading */}
            <div className="mb-4 inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#FF3540]">
              <Sparkles className="w-4 h-4" />
              <span>“Together we Achieve Dreams”</span>
            </div>

            {/* Hero Description */}
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
              HSC একাডেমিক ও মেডিকেল ভর্তি প্রস্তুতির জন্য একটি নিবেদিত লার্নিং প্ল্যাটফর্ম — যেখানে শিক্ষার্থীরা আরও স্মার্টভাবে শিখবে, নিজেদের দক্ষতা আরও সমৃদ্ধ করবে এবং জ্ঞান, আত্মবিশ্বাস ও সাফল্যের পথে এগিয়ে যাবে।
            </p>

            {/* Hero CTA Buttons */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-8">
              {/* Primary: Explore Programs */}
              <button
                id="hero-primary-cta-btn"
                onClick={() => onNavigate('courses')}
                className="px-7 py-3.5 rounded-xl bg-[#E50914] hover:bg-[#b8060f] text-white text-base font-bold transition-all shadow-[0_4px_20px_rgba(229,9,20,0.5)] hover:shadow-[0_6px_28px_rgba(229,9,20,0.7)] hover:scale-102 active:scale-98 flex items-center justify-center gap-2 group"
              >
                <span>Explore Programs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary: Start Learning */}
              <button
                id="hero-secondary-cta-btn"
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-base font-bold border border-white/20 backdrop-blur-md transition-all hover:border-[#E50914]/60 hover:scale-102 active:scale-98 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#FF3540]" />
                <span>My Dashboard</span>
              </button>
            </div>

            {/* Hero Trust Points */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-6 gap-y-3 pt-2 border-t border-white/10 w-full text-xs sm:text-sm font-semibold text-gray-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#E50914] shrink-0" />
                <span>HSC Focused</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#FF3540] text-sm">⚕</span>
                <span>Medical Admission</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#E50914] shrink-0" />
                <span>Expert Guidance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#E50914] shrink-0" />
                <span>Smart Learning</span>
              </div>
            </div>

          </div>

          {/* Right Column: Floating Medical Information Card (Desktop / Tablet) */}
          <div className="lg:col-span-5 hidden md:block">
            <div className="relative">
              
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#E50914] to-[#FF3540] rounded-3xl blur-xl opacity-30 animate-glow" />

              {/* Main Floating Card (White background, rounded corners, clean shadow) */}
              <div 
                id="hero-floating-medical-card"
                className="relative bg-white text-[#090909] rounded-2xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-100"
              >
                {/* Header Badge with ECG Icon */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#E50914]/10 text-[#E50914] flex items-center justify-center font-bold">
                      ⚡
                    </div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#E50914]">
                      MediSpark Roadmap
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    Batch 2025–26
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-xl sm:text-2xl font-black font-heading text-[#090909] leading-snug mb-2">
                  Your Medical Journey Starts Here
                </h3>

                {/* Card Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  Learn with structure, practice with purpose and prepare with confidence under top medical mentors.
                </p>

                {/* Interactive Mini Stats Grid inside Floating Card */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="text-xl font-extrabold text-[#E50914]">3,850+</div>
                    <div className="text-xs font-semibold text-gray-600">Medical Selections</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="text-xl font-extrabold text-[#090909]">100%</div>
                    <div className="text-xs font-semibold text-gray-600">DGHS Standard Tests</div>
                  </div>
                </div>

                {/* Active Live Class Preview Pill */}
                <div className="p-3.5 bg-[#090909] rounded-xl text-white flex items-center justify-between gap-3 shadow-md border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={mentorSiyamImage}
                        alt="Dr. Md. Siyam Talukder"
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#E50914]"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#090909]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Cardiac Cycle & Zoology 360°</span>
                        <span className="px-1.5 py-0.2 bg-[#E50914] text-[9px] font-black rounded uppercase">Live</span>
                      </div>
                      <div className="text-[10px] text-gray-400">By Md. Siyam Talukder (MBBS, ShSMC)</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="px-3 py-1.5 bg-[#E50914] hover:bg-[#b8060f] text-white text-xs font-bold rounded-lg transition-all shadow-[0_2px_10px_rgba(229,9,20,0.3)] shrink-0"
                  >
                    Join Live
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
