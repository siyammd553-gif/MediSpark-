import React, { useState } from 'react';
import { X, LogIn, UserCheck, ShieldCheck, Mail, Lock, Sparkles } from 'lucide-react';
import { MediSparkLogo } from './MediSparkLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string, role: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<'student' | 'mentor' | 'admin'>('student');
  const [email, setEmail] = useState('arafat.hossain@medispark.edu.bd');
  const [password, setPassword] = useState('••••••••••');
  const [name, setName] = useState('Md. Arafat Hossain');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(name || 'Md. Arafat Hossain', role);
    onClose();
  };

  const handleQuickDemo = (demoType: 'student' | 'mentor') => {
    if (demoType === 'student') {
      onLoginSuccess('Md. Arafat Hossain (HSC 25)', 'student');
    } else {
      onLoginSuccess('Md. Siyam Talukder (MBBS, ShSMC)', 'mentor');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        id="auth-modal-backdrop"
        onClick={onClose} 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" 
      />

      {/* Modal Card */}
      <div 
        id="auth-modal-content"
        className="relative w-full max-w-md bg-[#101218] border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden z-10 text-white animate-in zoom-in-95 duration-200"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#14161f]">
          <MediSparkLogo size="sm" />
          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="p-4 bg-gradient-to-r from-[#E50914]/15 via-[#1a1214] to-[#101218] border-b border-white/5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF3540]" />
              Quick One-Click Demo Access
            </span>
            <span className="text-[10px] bg-[#E50914]/30 text-[#FF3540] font-bold px-2 py-0.5 rounded-full border border-[#E50914]/40">
              Instant
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="quick-demo-student-btn"
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="px-3 py-2 rounded-xl bg-[#E50914] hover:bg-[#b8060f] text-white text-xs font-bold transition-all shadow-[0_2px_10px_rgba(229,9,20,0.3)] flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Login as Student</span>
            </button>
            <button
              id="quick-demo-mentor-btn"
              type="button"
              onClick={() => handleQuickDemo('mentor')}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Mentor Portal</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-black font-heading text-white">
                {isRegister ? 'Create Student Account' : 'Student & Mentor Login'}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {isRegister 
                  ? 'Join 45,000+ medical admission aspirants' 
                  : 'Access your classes, exams, and AI study tracker'}
              </p>
            </div>
            {/* Tab switch */}
            <div className="flex bg-[#161820] p-1 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  !isRegister ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  isRegister ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Md. Arafat Hossain"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171922] border border-white/10 text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Email / Phone Number</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@medispark.edu.bd"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#171922] border border-white/10 text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#171922] border border-white/10 text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" defaultChecked className="rounded border-gray-700 text-[#E50914] focus:ring-0" />
                <span>Keep me logged in</span>
              </label>
              <a href="#forgot" className="text-[#FF3540] hover:underline">Forgot password?</a>
            </div>

            <button
              id="submit-auth-form-btn"
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-[#E50914] hover:bg-[#b8060f] text-white font-bold text-sm shadow-[0_4px_16px_rgba(229,9,20,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isRegister ? 'Complete Registration & Start' : 'Login to MediSpark →'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
