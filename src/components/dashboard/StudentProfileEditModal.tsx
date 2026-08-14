import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { useStudentProfile } from '../../utils/studentStorage';
import {
  X,
  User,
  GraduationCap,
  Building2,
  Phone,
  Mail,
  Hash,
  Check,
  RotateCcw,
  Sparkles,
  Stethoscope
} from 'lucide-react';

interface StudentProfileEditModalProps {
  initialProfile: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedProfile: Partial<StudentProfile>) => void;
}

export const StudentProfileEditModal: React.FC<StudentProfileEditModalProps> = ({
  initialProfile,
  isOpen,
  onClose,
  onSave,
}) => {
  const { profile, updateProfile } = useStudentProfile(initialProfile);

  const [name, setName] = useState(profile.name);
  const [batch, setBatch] = useState(profile.batch);
  const [college, setCollege] = useState(profile.college);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [targetMedicalCollege, setTargetMedicalCollege] = useState(profile.targetMedicalCollege);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      name: name.trim() || profile.name,
      batch: batch.trim() || profile.batch,
      college: college.trim() || profile.college,
      phone: phone.trim() || profile.phone,
      email: email.trim() || profile.email,
      targetMedicalCollege: targetMedicalCollege.trim() || profile.targetMedicalCollege,
    };
    updateProfile(updated);
    if (onSave) {
      onSave(updated);
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#111318] border border-white/10 rounded-2xl sm:rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#141620]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E50914]/20 border border-[#E50914]/30 flex items-center justify-center text-[#FF3540]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-heading">
                Edit Student Information
              </h3>
              <p className="text-[11px] text-gray-400">
                Update your academic & contact information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar">
          
          {/* Student ID (Read Only) */}
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Hash className="w-4 h-4 text-[#FF3540]" />
              <span>Student ID:</span>
              <strong className="text-white font-mono">{profile.id}</strong>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
              Verified ID
            </span>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#FF3540]" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Full Name"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Batch */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#FF3540]" />
              <span>Batch</span>
            </label>
            <input
              type="text"
              required
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              placeholder="e.g. HSC 28 Batch / Medical Aspirant"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Institution */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#FF3540]" />
              <span>Institution (College / School)</span>
            </label>
            <input
              type="text"
              required
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="e.g. Dhaka College, Dhaka"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Contact: Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#FF3540]" />
              <span>Contact Number (Phone)</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880 1712-345678"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Contact: Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#FF3540]" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Target Medical College */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-[#FF3540]" />
              <span>Target Medical College</span>
            </label>
            <input
              type="text"
              value={targetMedicalCollege}
              onChange={(e) => setTargetMedicalCollege(e.target.value)}
              placeholder="e.g. Dhaka Medical College (DMC)"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Success message */}
          {isSaved && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>Information saved successfully!</span>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#E50914] hover:bg-[#b8060f] text-xs font-bold text-white transition-all shadow-lg flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Info</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
