import React, { useState } from 'react';
import { Course } from '../types';
import { X, ShieldCheck, CheckCircle2, Lock, Sparkles, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onSuccess: (course: Course) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  course,
  onSuccess,
}) => {
  const [method, setMethod] = useState<'bkash' | 'nagad' | 'card'>('bkash');
  const [phone, setPhone] = useState('01700000000');
  const [trxId, setTrxId] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen || !course) return null;

  const basePrice = course.discountPrice || course.price;
  const finalPrice = Math.max(0, basePrice - discount);

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'MEDISPARK500' || promoCode.toUpperCase() === 'DOCTOR') {
      setDiscount(500);
      setPromoApplied(true);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } else {
      alert('Invalid promo code. Try code "MEDISPARK500"');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      onSuccess(course);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        id="payment-modal-backdrop"
        onClick={onClose} 
        className="fixed inset-0 bg-black/85 backdrop-blur-md" 
      />

      <div 
        id="payment-modal-card"
        className="relative w-full max-w-lg bg-[#111318] border border-white/10 rounded-2xl shadow-2xl z-10 text-white overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 bg-[#161822] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E50914] text-white flex items-center justify-center font-black">
              🔒
            </div>
            <div>
              <h3 className="text-base font-black font-heading text-white">
                MediSpark Secure Checkout
              </h3>
              <p className="text-xs text-gray-400">256-bit SSL Encrypted Admission Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isCompleted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl border border-emerald-500/40">
              ✓
            </div>
            <h4 className="text-xl font-black font-heading text-white">
              {finalPrice === 0 ? 'Free Enrollment Activated!' : 'Enrollment Successful!'}
            </h4>
            <p className="text-sm text-gray-300">
              You are now officially enrolled in <strong className="text-white">{course.title}</strong>.
              Your student dashboard, live classes and study resources are unlocked.
            </p>
            <div className="p-3 bg-[#181b24] rounded-xl border border-white/10 text-xs text-gray-400">
              {finalPrice === 0 ? (
                <span>Access Status: <strong className="text-emerald-400 font-bold">100% FREE Access Granted</strong></span>
              ) : (
                <span>Transaction ID: <strong className="text-white">{trxId || 'MS-98234871'}</strong> • Paid: <strong className="text-emerald-400">৳{finalPrice.toLocaleString()}</strong></span>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#E50914] hover:bg-[#b8060f] text-white font-bold rounded-xl shadow-lg"
            >
              Go to Student Dashboard
            </button>
          </div>
        ) : finalPrice === 0 || course.isFree ? (
          /* 100% Free Instant Enrollment Screen */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Course Summary Pill */}
            <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-[#161822] to-emerald-950/20 rounded-xl border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                  🎁 Free Academic Initiative
                </span>
                <h4 className="text-sm font-bold text-white line-clamp-1 mt-0.5">{course.title}</h4>
                <p className="text-xs text-gray-400">{course.targetBatch} • By Md. Siyam Talukder</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-black text-emerald-400">FREE</div>
                <div className="text-[10px] text-emerald-300 font-semibold">৳0.00</div>
              </div>
            </div>

            <div className="p-4 bg-[#0d0e13] rounded-xl border border-white/5 space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Full HSC 28 Complete Biology Access</span>
              </div>
              <ul className="space-y-1.5 text-xs text-gray-300">
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> 65+ Botany & Zoology Live & Recorded Classes
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> 40+ Chapterwise Exams & Model Tests
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> DGHS Highlighted PDF Notes & Question Bank
                </li>
              </ul>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                Your Contact Number (for WhatsApp Study Group & Class Links)
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-3.5 py-2.5 bg-[#181b24] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-[0_4px_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>{isProcessing ? 'Enrolling You for Free...' : 'Confirm 100% Free Enrollment'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Course Summary Pill */}
            <div className="p-3.5 bg-[#161822] rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-[#FF3540]">{course.category}</span>
                <h4 className="text-sm font-bold text-white line-clamp-1">{course.title}</h4>
              </div>
              <div className="text-right shrink-0">
                <div className="text-base font-black text-white">৳{finalPrice.toLocaleString()}</div>
                {discount > 0 && (
                  <div className="text-[10px] text-emerald-400 font-bold">-৳{discount} promo</div>
                )}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('bkash')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    method === 'bkash'
                      ? 'bg-[#e2136e]/20 border-[#e2136e] text-white'
                      : 'bg-[#161822] border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="text-sm font-black text-[#e2136e]">bKash</div>
                  <div className="text-[10px] text-gray-400">Merchant / App</div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('nagad')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    method === 'nagad'
                      ? 'bg-[#f7941d]/20 border-[#f7941d] text-white'
                      : 'bg-[#161822] border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="text-sm font-black text-[#f7941d]">Nagad</div>
                  <div className="text-[10px] text-gray-400">Direct Pay</div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    method === 'card'
                      ? 'bg-blue-500/20 border-blue-500 text-white'
                      : 'bg-[#161822] border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="text-sm font-black text-blue-400">Card / Banking</div>
                  <div className="text-[10px] text-gray-400">Visa / Master</div>
                </button>
              </div>
            </div>

            {/* Merchant Instruction box */}
            <div className="p-3 bg-[#0d0e13] rounded-xl border border-white/5 text-xs text-gray-300 space-y-1">
              <p className="font-semibold text-white">
                Send ৳{finalPrice.toLocaleString()} to MediSpark {method === 'bkash' ? 'bKash' : 'Nagad'} Merchant Number:
              </p>
              <p className="text-sm font-black text-[#FF3540] tracking-wider">
                01700-112233
              </p>
              <p className="text-[11px] text-gray-400">
                After payment, enter your mobile number and the Transaction ID (TrxID) below.
              </p>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                  Sender Mobile Number
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3 py-2 bg-[#181b24] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                  Transaction ID (TrxID)
                </label>
                <input
                  type="text"
                  required
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  placeholder="e.g. 9J82K39A"
                  className="w-full px-3 py-2 bg-[#181b24] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#E50914]"
                />
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo code (e.g. MEDISPARK500)"
                className="flex-1 px-3 py-2 bg-[#181b24] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#E50914]"
              />
              <button
                type="button"
                onClick={applyPromo}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all"
              >
                Apply
              </button>
            </div>

            {promoApplied && (
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Promo MEDISPARK500 applied! ৳500 discount added.
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-[#E50914] hover:bg-[#b8060f] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-[0_4px_16px_rgba(229,9,20,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isProcessing ? 'Verifying Transaction...' : `Confirm & Pay ৳${finalPrice.toLocaleString()}`}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
