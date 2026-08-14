import React, { useState, useRef } from 'react';
import { Course } from '../types';
import { useCourseImage, DEFAULT_COURSE_THUMBNAILS } from '../utils/courseStorage';
import {
  X,
  Camera,
  Upload,
  Link as LinkIcon,
  RotateCcw,
  Check,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';

interface CoursePictureModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_THUMBNAILS = [
  {
    name: 'Cell Biology & Cytology',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'Medical Doctor & Stethoscope',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'Laboratory Microscopy & Genetics',
    url: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'Clinical Diagnostics & Medicine',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'Molecular DNA & Biochemistry',
    url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'Medical Anatomy & Research',
    url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=80',
  }
];

export const CoursePictureModal: React.FC<CoursePictureModalProps> = ({
  course,
  isOpen,
  onClose,
}) => {
  const { currentImage, isCustom, updateImage, resetImage } = useCourseImage(course);
  
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage);
  const [urlInput, setUrlInput] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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
      updateImage(previewUrl);
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 700);
    }
  };

  const handleResetToDefault = () => {
    resetImage();
    const defaultThumb = course.thumbnail || DEFAULT_COURSE_THUMBNAILS[course.id] || PRESET_THUMBNAILS[0].url;
    setPreviewUrl(defaultThumb);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        id="course-picture-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      {/* Modal Container */}
      <div
        id="course-picture-modal"
        className="relative w-full max-w-xl bg-[#111318] border border-white/10 rounded-2xl shadow-2xl z-10 text-white overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#1a1215] via-[#141622] to-[#111318] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center text-[#FF3540]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black font-heading text-white">
                Course Picture & Thumbnail
              </h3>
              <p className="text-xs text-gray-400 line-clamp-1">
                {course.title}
              </p>
            </div>
          </div>
          <button
            id="close-course-pic-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[75vh] space-y-5">
          {/* Live Thumbnail Preview */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Current Picture Preview (16:9 Aspect Ratio)
            </label>
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border-2 border-dashed border-white/20 bg-[#0d0f14] group">
              <img
                src={previewUrl}
                alt={course.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80';
                }}
              />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white">
                <span className="text-[#FF3540]">{course.targetBatch}</span>
                <span>•</span>
                <span className="text-gray-300">{course.category}</span>
              </div>
              {isCustom && (
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Custom Upload</span>
                </div>
              )}
            </div>
          </div>

          {/* Upload Box (Drag & Drop + File Selector) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Upload from Device
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-5 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#E50914] bg-[#E50914]/10'
                  : 'border-white/15 bg-[#141620] hover:border-white/30 hover:bg-[#181b28]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              <Upload className="w-6 h-6 text-[#FF3540] mx-auto mb-2" />
              <p className="text-xs sm:text-sm font-bold text-white">
                Click to browse or drag & drop image here
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                Supports PNG, JPG, WebP (Recommended 16:9 ratio, min 800x450)
              </p>
            </div>
          </div>

          {/* Direct Image URL input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Or Paste Direct Image Link
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full pl-9 pr-3 py-2 bg-[#171922] border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#E50914]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyUrl();
                    }
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-4 py-2 bg-[#1f2230] hover:bg-[#282c3f] text-white text-xs font-bold rounded-xl border border-white/10 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Choose Medical & Biology Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_THUMBNAILS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPreviewUrl(preset.url)}
                  className={`relative aspect-video rounded-lg overflow-hidden border transition-all text-left group ${
                    previewUrl === preset.url
                      ? 'border-[#E50914] ring-2 ring-[#E50914]/40'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-1.5 flex items-end">
                    <span className="text-[9px] font-bold text-white line-clamp-1">
                      {preset.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#141620] border-t border-white/10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-transparent hover:bg-white/5 text-gray-400 hover:text-white text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              id="save-course-picture-btn"
              type="button"
              onClick={handleSavePhoto}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#E50914] hover:bg-[#b8060f] text-white text-xs font-bold shadow-[0_4px_16px_rgba(229,9,20,0.4)] transition-all"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Picture</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
