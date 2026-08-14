import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div id="contact-us-page" className="min-h-screen bg-[#090909] text-white py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E50914]/15 border border-[#E50914]/30 text-[#FF3540] text-xs font-black uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>24/7 Student Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-white tracking-tight">
            Get in Touch with MediSpark
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Have questions about course admissions, payment verification, or 1-on-1 counseling? Our academic counselors are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Contact Info (5 cols) */}
          <div className="md:col-span-5 bg-[#111318] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-lg">
            <h3 className="text-lg font-black font-heading text-white">
              Contact Information
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E50914]/20 text-[#FF3540] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Student Helpline</div>
                  <div className="text-gray-400">+880 1700-000000</div>
                  <div className="text-[11px] text-gray-500">Everyday: 9:00 AM – 11:00 PM</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E50914]/20 text-[#FF3540] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Academic Email</div>
                  <div className="text-gray-400">admission@medispark.edu.bd</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E50914]/20 text-[#FF3540] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Campus & Studio</div>
                  <div className="text-gray-400">Level 4, MediSpark Academic Tower, Farmgate, Dhaka 1215, Bangladesh</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#181b24] rounded-xl border border-white/5 text-xs text-gray-400 space-y-1">
              <div className="font-bold text-white">Direct WhatsApp Counseling</div>
              <p>Chat with a senior medical mentor instantly on WhatsApp: +880 1700-112233</p>
            </div>
          </div>

          {/* Right Contact Form (7 cols) */}
          <div className="md:col-span-7 bg-[#111318] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-lg">
            {isSubmitted ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl border border-emerald-500/40">
                  ✓
                </div>
                <h4 className="text-xl font-black font-heading text-white">
                  Message Sent Successfully!
                </h4>
                <p className="text-xs sm:text-sm text-gray-300">
                  Thank you, <strong className="text-white">{name}</strong>. A MediSpark academic counselor will call you back on <strong className="text-white">{phone}</strong> within 30 minutes.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all"
                >
                  Send Another Query
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-black font-heading text-white mb-2">
                  Send a Direct Message
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Abrar Fahim"
                    className="w-full px-4 py-2.5 bg-[#171922] border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-4 py-2.5 bg-[#171922] border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    What would you like to know?
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about batch timings, fee discounts, or admission syllabus..."
                    className="w-full px-4 py-2.5 bg-[#171922] border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#E50914] hover:bg-[#b8060f] text-white font-bold text-xs sm:text-sm rounded-xl shadow-[0_4px_16px_rgba(229,9,20,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Counselor</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
