import React, { useState, useRef } from 'react';
import { StudentProfile } from '../../types';
import { useStudentAvatar } from '../../utils/studentStorage';
import {
  X,
  Eye,
  Camera,
  Upload,
  Link as LinkIcon,
  RotateCcw,
  Check,
  ZoomIn,
  ZoomOut,
  User,
  GraduationCap,
  Sparkles
} from 'lucide-react';

interface StudentPictureModalProps {
  profile: StudentProfile;
  initialMode?: 'menu' | 'view' | 'change';
  onClose: () => void;
  onAvatarUpdated?: (newAvatarUrl: string) => void;
}

export const StudentPictureModal: React.FC<StudentPictureModalProps> = ({
  profile,
  initialMode = 'menu',
  onClose,
  onAvatarUpdated,
}) => {
  const { avatarUrl, isCustom, updateAvatar, resetAvatar } = useStudentAvatar(profile.avatar);
  const [mode, setMode] = useState<'menu' | 'view' | 'change'>(initialMode);

  // View mode state
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Change mode state
  const [previewUrl, setPreviewUrl] = useState<string>(avatarUrl);
  const [urlInput, setUrlInput] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process file upload from local device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setPreviewUrl(urlInput.trim());
      setUrlInput('');
    }
  };

  const handleSavePhoto = () => {
    if (previewUrl) {
      updateAvatar(previewUrl);
      if (onAvatarUpdated) {
        onAvatarUpdated(previewUrl);
      }
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 700);
    }
  };

  const handleResetPhoto = () => {
    resetAvatar();
    setPreviewUrl(profile.avatar);
    if (onAvatarUpdated) {
      onAvatarUpdated(profile.avatar);
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#111318] border border-white/10 rounded-2xl sm:rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= MODE 1: OPTION MENU (View Picture / Change Picture) ================= */}
        {mode === 'menu' && (
          <div>
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#141620]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center text-[#FF3540]">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-heading">
                    Profile Picture Options
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    ছবি দেখুন অথবা নতুন ছবি আপলোড করুন
                  </p>
                </div>
              </div>
              <button
                id="close-student-picture-menu"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content & Action Buttons */}
            <div className="p-6 space-y-6">
              {/* Photo Preview Thumbnail */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-b from-[#1c1216] to-[#12131b] border-2 border-[#E50914] shadow-xl relative group">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={profile.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                      <User className="w-12 h-12 text-[#FF3540]" />
                    </div>
                  )}
                  {isCustom && (
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-emerald-500/90 text-white text-[9px] font-bold">
                      Custom
                    </span>
                  )}
                </div>
                <h4 className="mt-3 text-base font-extrabold text-white">
                  {profile.name}
                </h4>
                <p className="text-xs text-gray-400 font-medium">
                  {profile.batch} • ID: {profile.id}
                </p>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* 1. VIEW PICTURE OPTION */}
                <button
                  id="student-pic-opt-view"
                  onClick={() => setMode('view')}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#E50914]/50 transition-all text-left group flex flex-col justify-between space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center text-[#FF3540] group-hover:scale-110 transition-transform">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block group-hover:text-[#FF3540] transition-colors">
                      View Picture
                    </span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      প্রোফাইল ছবি ফুল ভিউ বা জুম করে দেখুন
                    </span>
                  </div>
                </button>

                {/* 2. CHANGE PICTURE OPTION */}
                <button
                  id="student-pic-opt-change"
                  onClick={() => setMode('change')}
                  className="p-4 rounded-xl bg-gradient-to-br from-[#1c1216] to-[#12131b] hover:from-[#2a131a] hover:to-[#1a1c29] border border-[#E50914]/40 hover:border-[#E50914] transition-all text-left group flex flex-col justify-between space-y-3 shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#E50914] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-red-950/50">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block group-hover:text-[#FF3540] transition-colors">
                      Change Picture
                    </span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      নতুন ছবি আপলোড বা পরিবর্তন করুন
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODE 2: VIEW PICTURE (Full-Screen Image Viewer) ================= */}
        {mode === 'view' && (
          <div className="flex flex-col h-full">
            {/* Top Toolbar */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#141620]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMode('menu')}
                  className="text-xs text-gray-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  ← Back to Options
                </button>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs font-bold text-white truncate max-w-[140px] sm:max-w-none">
                  {profile.name}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5))}
                  title="Zoom In"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75))}
                  title="Zoom Out"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  title="Reset Zoom"
                  className="px-2 py-1 text-[10px] font-bold rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                >
                  100%
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 ml-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Viewer Canvas */}
            <div className="p-6 flex-1 flex flex-col items-center justify-center overflow-auto min-h-[320px] max-h-[55vh] bg-[#090a0f]/90 relative">
              <div
                className="transition-transform duration-200 flex items-center justify-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={profile.name}
                    referrerPolicy="no-referrer"
                    className="max-h-[46vh] max-w-full rounded-2xl border-2 border-white/10 shadow-2xl object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-2xl bg-[#141620] border-2 border-white/10 flex flex-col items-center justify-center text-gray-400">
                    <User className="w-16 h-16 text-[#FF3540] mb-2" />
                    <span className="text-xs">No image available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="p-4 border-t border-white/10 bg-[#141620] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">{profile.name}</p>
                <p className="text-[11px] text-gray-400">
                  Target: {profile.targetMedicalCollege}
                </p>
              </div>
              <button
                onClick={() => setMode('change')}
                className="px-3.5 py-1.5 rounded-xl bg-[#E50914] hover:bg-[#b8060f] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Change Picture</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= MODE 3: CHANGE PICTURE (Upload / Change Modal) ================= */}
        {mode === 'change' && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#141620]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMode('menu')}
                  className="text-xs text-gray-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  ← Back
                </button>
                <h3 className="text-sm font-bold text-white font-heading">
                  Upload Student Photo
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Change Content */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[65vh] custom-scrollbar">
              {/* Preview Comparison */}
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#141620] border-2 border-dashed border-white/20 flex items-center justify-center shadow">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-500" />
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold block mt-1.5">
                    New Preview
                  </span>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#E50914] bg-[#E50914]/10'
                    : 'border-white/15 bg-white/5 hover:border-[#E50914]/50 hover:bg-white/[0.07]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-xl bg-[#E50914]/20 border border-[#E50914]/30 text-[#FF3540] flex items-center justify-center mx-auto mb-2.5">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-white">
                  Click to browse or drag & drop photo
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Supports JPG, PNG, WEBP, or high-res profile photo
                </p>
              </div>

              {/* Image URL Alternative */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 block">
                  Or paste Image URL:
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914]"
                    />
                  </div>
                  <button
                    onClick={handleApplyUrl}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Success Notification */}
              {isSaved && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4" />
                  <span>Profile photo updated successfully!</span>
                </div>
              )}
            </div>

            {/* Footer Action Buttons */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#141620] flex items-center justify-between gap-3">
              <div>
                {isCustom && (
                  <button
                    onClick={handleResetPhoto}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset to Default</span>
                    <span className="sm:hidden">Reset</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMode('menu')}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePhoto}
                  className="px-5 py-2 rounded-xl bg-[#E50914] hover:bg-[#b8060f] text-xs font-bold text-white transition-all shadow-lg flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Photo</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
