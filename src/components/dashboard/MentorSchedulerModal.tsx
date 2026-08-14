import React, { useState } from 'react';
import { Mentor } from '../../types';
import { MENTORS_DATA } from '../../data/mockData';
import { X, Calendar, Clock, CheckCircle2, Video, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MentorSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMentor?: Mentor;
}

export const MentorSchedulerModal: React.FC<MentorSchedulerModalProps> = ({
  isOpen,
  onClose,
  selectedMentor = MENTORS_DATA[0],
}) => {
  const [activeMentor, setActiveMentor] = useState<Mentor>(selectedMentor);
  const [selectedDate, setSelectedDate] = useState('Tomorrow (8:30 PM)');
  const [selectedTopic, setSelectedTopic] = useState('Genetics & Zoology Chapter 11 Review');
  const [isBooked, setIsBooked] = useState(false);

  if (!isOpen) return null;

  const dates = [
    'Today (9:00 PM)',
    'Tomorrow (8:30 PM)',
    'Saturday (7:00 PM)',
    'Sunday (8:00 PM)',
  ];

  const topics = [
    'Genetics & Zoology Chapter 11 Review',
    'Medical Biology High-Yield Textbook Strategy',
    'Organic Chemistry Mechanism Shortcuts',
    'Mock Test Error Diagnostic & Mental Prep',
  ];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        id="mentor-modal-backdrop"
        onClick={onClose} 
        className="fixed inset-0 bg-black/85 backdrop-blur-md" 
      />

      {/* Modal Container */}
      <div 
        id="mentor-modal-card"
        className="relative w-full max-w-lg bg-[#111318] border border-white/10 rounded-2xl shadow-2xl z-10 text-white overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#141620]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E50914] text-white flex items-center justify-center font-bold">
              ⚕
            </div>
            <div>
              <h3 className="text-base font-black font-heading text-white">
                Book 1-on-1 Mentor Guidance
              </h3>
              <p className="text-xs text-gray-400">Direct 20-minute Zoom clinical review slot</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isBooked ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl border border-emerald-500/40">
              ✓
            </div>
            <h4 className="text-xl font-black font-heading text-white">
              Slot Confirmed with {activeMentor.name}!
            </h4>
            <p className="text-sm text-gray-300">
              Your 1-on-1 session is scheduled for <span className="text-[#FF3540] font-bold">{selectedDate}</span>.
              Zoom link and calendar invite have been sent to your student dashboard.
            </p>
            <div className="p-3 bg-[#181b24] rounded-xl border border-white/10 text-xs text-gray-400">
              Topic: <strong className="text-white">{selectedTopic}</strong>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#E50914] hover:bg-[#b8060f] text-white font-bold rounded-xl"
            >
              Done & Return to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="p-6 space-y-4">
            {/* Choose Mentor */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Select Mentor
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MENTORS_DATA.filter((m) => !m.isEmpty).map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setActiveMentor(m)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      activeMentor.id === m.id
                        ? 'bg-[#E50914]/20 border-[#E50914] text-white'
                        : 'bg-[#161820] border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#E50914]/30 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {m.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-white truncate">{m.name}</div>
                      <div className="text-[10px] text-[#FF3540] truncate">{m.degree}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Slot Date/Time */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Select Available Slot
              </label>
              <div className="grid grid-cols-2 gap-2">
                {dates.map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                      selectedDate === d
                        ? 'bg-[#E50914] text-white border-[#E50914] shadow-md'
                        : 'bg-[#161820] border-white/5 text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Discussion Topic */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Primary Discussion Focus
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#161820] border border-white/10 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-[#E50914]"
              >
                {topics.map((t) => (
                  <option key={t} value={t} className="bg-[#111318] text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#E50914] hover:bg-[#b8060f] text-white font-bold text-sm rounded-xl shadow-[0_4px_16px_rgba(229,9,20,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4" />
                <span>Confirm 1-on-1 Slot (Free with Batch)</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
