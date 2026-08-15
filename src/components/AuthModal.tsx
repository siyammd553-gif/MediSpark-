import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  LogIn,
  UserCheck,
  ShieldCheck,
  Mail,
  Lock,
  Sparkles,
  Loader2,
  Eye,
  EyeOff,
  Camera,
  Upload,
  Phone,
  Building2,
  GraduationCap,
  User,
  Facebook,
  Check,
  KeyRound,
  Send,
  Hash,
  ArrowLeft,
} from 'lucide-react';
import { MediSparkLogo } from './MediSparkLogo';
import { useAuth, } from '../context/AuthContext';
import { RegistrationFields } from '../utils/authApi';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string, role: string, accountId: string) => void;
}

type AuthView = 'login' | 'register' | 'register-otp' | 'forgot' | 'forgot-otp' | 'register-success';

const PHONE_RE = /^(\+?88)?01[3-9]\d{8}$/;

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(-10);
  if (digits.length < 10) return phone;
  return `+880 ${digits.slice(0, 3)}*****${digits.slice(8)}`;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const { login, sendRegisterOtp, verifyRegister, forgotPassword, resetPassword } = useAuth();

  const [view, setView] = useState<AuthView>('login');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Login state ---
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  // --- Registration state ---
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [batch, setBatch] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [facebookId, setFacebookId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- OTP state ---
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Forgot password state ---
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // --- Registration success state ---
  const [generatedStudentId, setGeneratedStudentId] = useState('');
  const [registeredName, setRegisteredName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset the form each time the modal opens
  useEffect(() => {
    if (isOpen) {
      setView('login');
      setError('');
      setInfo('');
      setOtp('');
      setDevOtp('');
      setRegisteredName('');
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const startResendCooldown = (seconds: number) => {
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    setResendCooldown(seconds);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (!isOpen) return null;

  // ---------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!identifier.trim() || !password) {
      setError('Please enter your Student ID / Email / Contact Number and password.');
      return;
    }
    setIsSubmitting(true);
    try {
      const user = await login(identifier.trim(), password, remember);
      onLoginSuccess(user.name, user.role, user.accountId);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (demoType: 'student' | 'mentor') => {
    setError('');
    setInfo('');
    setIsSubmitting(true);
    try {
      const user =
        demoType === 'student'
          ? await login('arafat.hossain@medispark.edu.bd', 'Student@2026')
          : await login('siyam@medispark.edu.bd', 'Mentor@2026');
      onLoginSuccess(user.name, user.role, user.accountId);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Demo access failed. Please register a new account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSendRegisterOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!name.trim()) return setError('Please enter your full name.');
    if (!college.trim()) return setError('Please enter your institution.');
    if (!batch.trim()) return setError('Please enter your HSC batch.');
    if (!PHONE_RE.test(phone.trim())) return setError('Enter a valid Bangladeshi contact number (e.g. 01XXXXXXXXX).');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Enter a valid email address.');
    if (regPassword.length < 6) return setError('Password must be at least 6 characters.');
    if (regPassword !== confirmPassword) return setError('Passwords do not match.');

    const payload: RegistrationFields = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      batch: batch.trim(),
      college: college.trim(),
      facebookId: facebookId.trim(),
      avatar,
      password: regPassword,
    };

    setIsSubmitting(true);
    try {
      const resp = await sendRegisterOtp(payload);
      if (resp.devOtp) setDevOtp(resp.devOtp);
      setInfo(resp.message || 'Verification code sent.');
      setView('register-otp');
      startResendCooldown(60);
    } catch (err: any) {
      setError(err?.message || 'Failed to send verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!/^\d{6}$/.test(otp.trim())) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    const payload: RegistrationFields = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      batch: batch.trim(),
      college: college.trim(),
      facebookId: facebookId.trim(),
      avatar,
      password: regPassword,
    };
    setIsSubmitting(true);
    try {
      const result = await verifyRegister({ ...payload, otp: otp.trim() });
      setGeneratedStudentId(result.studentId);
      setRegisteredName(result.user.name);
      onLoginSuccess(result.user.name, result.user.role, result.user.accountId);
      setView('register-success');
    } catch (err: any) {
      setError(err?.message || 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendRegisterOtp = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setInfo('');
    const payload: RegistrationFields = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      batch: batch.trim(),
      college: college.trim(),
      facebookId: facebookId.trim(),
      avatar,
      password: regPassword,
    };
    setIsSubmitting(true);
    try {
      const resp = await sendRegisterOtp(payload);
      if (resp.devOtp) setDevOtp(resp.devOtp);
      setInfo('A new verification code has been sent.');
      startResendCooldown(60);
    } catch (err: any) {
      setError(err?.message || 'Failed to resend code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!forgotIdentifier.trim()) {
      setError('Please enter your Student ID, email, or contact number.');
      return;
    }
    setIsSubmitting(true);
    try {
      const resp = await forgotPassword(forgotIdentifier.trim());
      if (resp.devOtp) setDevOtp(resp.devOtp);
      setInfo(resp.message || 'If an account matches, a code has been sent.');
      setView('forgot-otp');
      startResendCooldown(60);
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!/^\d{6}$/.test(forgotOtp.trim())) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsSubmitting(true);
    try {
      await resetPassword({ identifier: forgotIdentifier.trim(), otp: forgotOtp.trim(), newPassword });
      setInfo('Password updated successfully. Please log in with your new password.');
      setView('login');
      setIdentifier(forgotIdentifier.trim());
      setPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setForgotOtp('');
      setDevOtp('');
    } catch (err: any) {
      setError(err?.message || 'Failed to reset password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendForgotOtp = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setInfo('');
    setIsSubmitting(true);
    try {
      const resp = await forgotPassword(forgotIdentifier.trim());
      if (resp.devOtp) setDevOtp(resp.devOtp);
      setInfo('A new verification code has been sent.');
      startResendCooldown(60);
    } catch (err: any) {
      setError(err?.message || 'Failed to resend code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-xl bg-[#171922] border border-white/10 text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors';
  const inputWithIconClass = (hasIcon: boolean) =>
    `w-full ${hasIcon ? 'pl-10 pr-3.5' : 'px-3.5'} py-2.5 rounded-xl bg-[#171922] border border-white/10 text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors`;
  const labelClass = 'block text-xs font-semibold text-gray-300 mb-1';

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
        {view === 'login' && (
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
                disabled={isSubmitting}
                className="px-3 py-2 rounded-xl bg-[#E50914] hover:bg-[#b8060f] text-white text-xs font-bold transition-all shadow-[0_2px_10px_rgba(229,9,20,0.3)] flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Signing in...' : 'Login as Student'}</span>
              </button>
              <button
                id="quick-demo-mentor-btn"
                type="button"
                onClick={() => handleQuickDemo('mentor')}
                disabled={isSubmitting}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>{isSubmitting ? 'Signing in...' : 'Mentor Portal'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6">
          {/* ============ VIEW: LOGIN ============ */}
          {view === 'login' && (
            <>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-black font-heading text-white">Student & Mentor Login</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Access your classes, exams, and AI study tracker
                  </p>
                </div>
                <div className="flex bg-[#161820] p-1 rounded-xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      setView('login');
                      setError('');
                      setInfo('');
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      view === 'login' ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setView('register');
                      setError('');
                      setInfo('');
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      view === 'register' ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <label className={labelClass}>Student ID / Email / Contact Number</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. STD-2026-0001 or 01XXXXXXXXX"
                      autoComplete="username"
                      className={inputWithIconClass(true)}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className={inputWithIconClass(true) + ' pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="rounded border-gray-700 text-[#E50914] focus:ring-0"
                    />
                    <span>Remember This Device</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setView('forgot');
                      setError('');
                      setInfo('');
                    }}
                    className="text-[#FF3540] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-[#E50914]/15 border border-[#E50914]/40 text-[#FF6B75] text-xs font-bold animate-in fade-in">
                    {error}
                  </div>
                )}
                {info && (
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-in fade-in">
                    {info}
                  </div>
                )}

                <button
                  id="submit-auth-form-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 rounded-xl bg-[#E50914] hover:bg-[#b8060f] text-white font-bold text-sm shadow-[0_4px_16px_rgba(229,9,20,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                  <span>{isSubmitting ? 'Securing your session...' : 'Login to MediSpark →'}</span>
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-5">
                New to MediSpark?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setView('register');
                    setError('');
                    setInfo('');
                  }}
                  className="text-[#FF3540] font-bold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </>
          )}

          {/* ============ VIEW: REGISTER (Step 1) ============ */}
          {view === 'register' && (
            <>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-black font-heading text-white">Create Student Account</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Join 45,000+ medical admission aspirants
                  </p>
                </div>
                <div className="flex bg-[#161820] p-1 rounded-xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      setView('login');
                      setError('');
                      setInfo('');
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      view === 'login' ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setView('register');
                      setError('');
                      setInfo('');
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      view === 'register' ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

              <form onSubmit={handleSendRegisterOtp} className="space-y-3.5 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
                {/* Student Picture */}
                <div>
                  <label className={labelClass}>Student Picture</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-16 h-16 rounded-2xl overflow-hidden bg-[#171922] border border-dashed border-white/25 hover:border-[#E50914]/60 transition-colors flex items-center justify-center shrink-0"
                    >
                      {avatar ? (
                        <img src={avatar} alt="Student preview" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-6 h-6 text-gray-500" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <div className="text-xs text-gray-400">
                      <p className="font-semibold text-gray-300">Upload a clear passport-style photo</p>
                      <p className="mt-0.5">JPG, PNG, or WebP. Used for your Student ID card.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Md. Arafat Hossain"
                      className={inputWithIconClass(true)}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Institution</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. Dhaka College, Dhaka"
                      className={inputWithIconClass(true)}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>HSC Batch</label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      placeholder="e.g. HSC 28 Batch / Medical Aspirant"
                      className={inputWithIconClass(true)}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Contact Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className={inputWithIconClass(true)}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@medispark.edu.bd"
                      className={inputWithIconClass(true)}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Facebook ID</label>
                  <div className="relative">
                    <Facebook className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={facebookId}
                      onChange={(e) => setFacebookId(e.target.value)}
                      placeholder="Optional — your Facebook profile link or ID"
                      className={inputWithIconClass(true)}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      autoComplete="new-password"
                      className={inputWithIconClass(true) + ' pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword((prev) => !prev)}
                      aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      className={inputWithIconClass(true) + ' pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-[#E50914]/15 border border-[#E50914]/40 text-[#FF6B75] text-xs font-bold animate-in fade-in">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 rounded-xl bg-[#E50914] hover:bg-[#b8060f] text-white font-bold text-sm shadow-[0_4px_16px_rgba(229,9,20,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>{isSubmitting ? 'Sending code...' : 'Send Verification Code'}</span>
                </button>
                <p className="text-[11px] text-gray-500 text-center">
                  Your Student ID is generated automatically after verification.
                </p>
              </form>
            </>
          )}

          {/* ============ VIEW: REGISTER OTP (Step 2) ============ */}
          {view === 'register-otp' && (
            <>
              <button
                type="button"
                onClick={() => {
                  setView('register');
                  setError('');
                  setInfo('');
                }}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mb-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to form
              </button>
              <h2 className="text-lg font-black font-heading text-white">Verify Your Mobile</h2>
              <p className="text-xs text-gray-400 mt-0.5 mb-5">
                Enter the 6-digit code sent to <span className="text-white font-bold">{maskPhone(phone)}</span>
              </p>

              <form onSubmit={handleVerifyRegister} className="space-y-3.5">
                <div>
                  <label className={labelClass}>Verification Code</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••••"
                      className={inputWithIconClass(true) + ' font-mono tracking-[0.5em]'}
                    />
                  </div>
                </div>

                {devOtp && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold animate-in fade-in">
                    Dev mode only — your code is: <span className="font-mono font-black tracking-widest">{devOtp}</span>
                  </div>
                )}

                {info && (
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-in fade-in">
                    {info}
                  </div>
                )}
                {error && (
                  <div className="p-3 rounded-xl bg-[#E50914]/15 border border-[#E50914]/40 text-[#FF6B75] text-xs font-bold animate-in fade-in">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 rounded-xl bg-[#E50914] hover:bg-[#b8060f] text-white font-bold text-sm shadow-[0_4px_16px_rgba(229,9,20,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{isSubmitting ? 'Verifying...' : 'Verify & Create Account'}</span>
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-5">
                Didn't receive the code?{' '}
                {resendCooldown > 0 ? (
                  <span className="text-gray-500 font-semibold">Resend in {resendCooldown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendRegisterOtp}
                    disabled={isSubmitting}
                    className="text-[#FF3540] font-bold hover:underline disabled:opacity-50"
                  >
                    Resend Code
                  </button>
                )}
              </p>
            </>
          )}

          {/* ============ VIEW: REGISTER SUCCESS ============ */}
          {view === 'register-success' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-lg font-black font-heading text-white">Registration Successful!</h2>
              <p className="text-xs text-gray-400 mt-1">
                Welcome to MediSpark, {registeredName}! Your account is ready.
              </p>
              <div className="mt-5 p-4 rounded-2xl bg-[#171922] border border-white/10">
                <p className="text-[11px] text-gray-400 uppercase tracking-wide font-bold mb-1">Your Student ID</p>
                <p className="text-xl font-black font-mono text-[#FF3540] flex items-center justify-center gap-2">
                  <Hash className="w-5 h-5" /> {generatedStudentId}
                </p>
                <p className="text-[11px] text-gray-500 mt-2">Keep this ID safe — use it to log in.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full mt-6 py-3 rounded-xl bg-[#E50914] hover:bg-[#b8060f] text-white font-bold text-sm shadow-[0_4px_16px_rgba(229,9,20,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                Go to My Dashboard
              </button>
            </div>
          )}

          {/* ============ VIEW: FORGOT PASSWORD (Step 1) ============ */}
          {view === 'forgot' && (
            <>
              <button
                type="button"
                onClick={() => {
                  setView('login');
                  setError('');
                  setInfo('');
                }}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mb-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to login
              </button>
              <h2 className="text-lg font-black font-heading text-white">Forgot Password</h2>
              <p className="text-xs text-gray-400 mt-0.5 mb-5">
                Enter your Student ID, email, or contact number. We'll send a verification code to your registered
                mobile number.
              </p>

              <form onSubmit={handleForgotPassword} className="space-y-3.5">
                <div>
                  <label className={labelClass}>Student ID / Email / Contact Number</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="e.g. STD-2026-0001 or 01XXXXXXXXX"
                      className={inputWithIconClass(true)}
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-[#E50914]/15 border border-[#E50914]/40 text-[#FF6B75] text-xs font-bold animate-in fade-in">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 rounded-xl bg-[#E50914] hover:bg-[#b8060f] text-white font-bold text-sm shadow-[0_4px_16px_rgba(229,9,20,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>{isSubmitting ? 'Sending code...' : 'Send Verification Code'}</span>
                </button>
              </form>
            </>
          )}

          {/* ============ VIEW: FORGOT PASSWORD OTP (Step 2) ============ */}
          {view === 'forgot-otp' && (
            <>
              <button
                type="button"
                onClick={() => {
                  setView('forgot');
                  setError('');
                  setInfo('');
                }}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mb-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <h2 className="text-lg font-black font-heading text-white">Reset Your Password</h2>
              <p className="text-xs text-gray-400 mt-0.5 mb-5">
                Enter the code sent to your registered mobile number and set a new password.
              </p>

              <form onSubmit={handleResetPassword} className="space-y-3.5">
                <div>
                  <label className={labelClass}>Verification Code</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••••"
                      className={inputWithIconClass(true) + ' font-mono tracking-[0.5em]'}
                    />
                  </div>
                </div>

                {devOtp && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold animate-in fade-in">
                    Dev mode only — your code is: <span className="font-mono font-black tracking-widest">{devOtp}</span>
                  </div>
                )}

                <div>
                  <label className={labelClass}>New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      autoComplete="new-password"
                      className={inputWithIconClass(true) + ' pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Confirm New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      autoComplete="new-password"
                      className={inputWithIconClass(true) + ' pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                      aria-label={showConfirmNewPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {info && (
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-in fade-in">
                    {info}
                  </div>
                )}
                {error && (
                  <div className="p-3 rounded-xl bg-[#E50914]/15 border border-[#E50914]/40 text-[#FF6B75] text-xs font-bold animate-in fade-in">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 rounded-xl bg-[#E50914] hover:bg-[#b8060f] text-white font-bold text-sm shadow-[0_4px_16px_rgba(229,9,20,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{isSubmitting ? 'Resetting...' : 'Reset Password'}</span>
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-5">
                Didn't receive the code?{' '}
                {resendCooldown > 0 ? (
                  <span className="text-gray-500 font-semibold">Resend in {resendCooldown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendForgotOtp}
                    disabled={isSubmitting}
                    className="text-[#FF3540] font-bold hover:underline disabled:opacity-50"
                  >
                    Resend Code
                  </button>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};