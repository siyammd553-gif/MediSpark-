import React from 'react';
import { PageView } from '../types';
import { MediSparkLogo } from './MediSparkLogo';
import { Phone, Mail, MapPin, Facebook, Youtube, Send, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer 
      id="main-site-footer"
      className="bg-[#07080a] text-white border-t border-white/10 pt-14 pb-20 lg:pb-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & About (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <MediSparkLogo onClick={() => onNavigate('home')} />
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              MediSpark is Bangladesh’s dedicated educational ecosystem for HSC academic preparation and Medical Admission excellence. 
              Helping students master concepts, practice real-exam MCQs, and achieve their white coat dreams.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="#facebook" 
                aria-label="Facebook Page"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#E50914] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="#youtube" 
                aria-label="YouTube Channel"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#E50914] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="#telegram" 
                aria-label="Telegram Group"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#E50914] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-white transition-colors">
                  Courses
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('exam')} className="hover:text-white transition-colors">
                  Exams & Mock Tests
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('qna')} className="hover:text-white transition-colors">
                  Q&A Doubt Clearance
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Academic Programs */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Key Programs
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-white transition-colors text-left">
                  Complete Biology Course (HSC 28)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-white transition-colors text-left">
                  Medical Admission Course (HSC 28)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('exam')} className="hover:text-white transition-colors">
                  DGHS Model Test System
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rank-predictor')} className="hover:text-white transition-colors">
                  Medical Rank Predictor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('resources')} className="hover:text-white transition-colors">
                  High-Yield Lecture & Formula PDF
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Student Helpdesk
            </h4>
            <div className="space-y-2.5 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E50914]" />
                <span>+880 1700-000000 (Helpline)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E50914]" />
                <span>support@medispark.edu.bd</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E50914]" />
                <span>Farmgate / Panthapath, Dhaka, Bangladesh</span>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg text-[11px] text-gray-300">
                  <ShieldCheck className="w-3 h-3 text-[#E50914]" />
                  SSL Encrypted Payments (bKash/Nagad)
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
          <p>© {new Date().getFullYear()} MediSpark Education. All rights reserved.</p>
          <p className="font-semibold text-gray-400 flex items-center gap-1">
            MediSpark • <span className="text-[#FF3540]">“Together we Achieve Dreams”</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
