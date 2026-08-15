import React, { useState } from 'react';
import { ChapterPDF } from '../../types';
import { useLearning } from '../../context/LearningContext';
import { useFavorites } from '../../utils/favoriteStorage';
import { 
  X, 
  Download, 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  BookOpen, 
  Maximize2,
  Share2,
  Bookmark
} from 'lucide-react';

interface ChapterPdfReaderModalProps {
  pdf: ChapterPDF;
  chapterTitle: string;
  onClose: () => void;
}

export const ChapterPdfReaderModal: React.FC<ChapterPdfReaderModalProps> = ({
  pdf,
  chapterTitle,
  onClose
}) => {
  const { markPdfViewed, userState } = useLearning();
  const { favorites, addFavoriteDocument, removeFavoriteDocument } = useFavorites();
  const isViewed = userState.viewedPdfIds.includes(pdf.id);
  const isFavorited = favorites.documents.some((d) => d.id === pdf.id);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const totalPages = pdf.pages || 16;

  const handleDownload = () => {
    markPdfViewed(pdf.id);
    // Trigger simulated download or new tab
    const element = document.createElement('a');
    const file = new Blob([
      `MediSpark Academic Learning Document\nTitle: ${pdf.title}\nChapter: ${chapterTitle}\nType: ${pdf.type}\nPages: ${pdf.pages}\n\nContents & Summaries:\n${(pdf.contentSummary || []).join('\n')}\n\nPrepared for MediSpark HSC & Medical Aspirants.`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${pdf.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Favourite (Save) — persisted under this Student Account so the material
  // appears in the student's Favourites vault.
  const handleToggleFavorite = () => {
    if (isFavorited) {
      removeFavoriteDocument(pdf.id);
      return;
    }
    addFavoriteDocument({
      id: pdf.id,
      title: pdf.title,
      subject: 'Biology',
      category: pdf.type === 'lecture-sheet' ? 'Lecture Sheet' : pdf.type === 'mcq-bank' ? 'Question Bank' : 'Lecture Sheet',
      pages: pdf.pages || pdf.pagesCount || 16,
      fileSize: pdf.fileSize,
      fileType: 'PDF',
      downloadCount: 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-y-auto">
      <div 
        id="pdf-reader-modal-container"
        className="bg-[#0f1117] border border-white/15 rounded-2xl sm:rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 bg-[#141622] border-b border-white/10 flex items-center justify-between gap-4">
          <div className="space-y-0.5 truncate">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-[#E50914] text-white text-[10px] font-black uppercase tracking-wider">
                {pdf.type}
              </span>
              <span className="text-xs text-gray-400 truncate">
                {chapterTitle}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white truncate">
              {pdf.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={handleToggleFavorite}
              title={isFavorited ? 'Remove from Favourites' : 'Save to Favourites'}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                isFavorited
                  ? 'bg-amber-400/15 text-amber-300 border-amber-400/40'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border-white/10'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isFavorited ? 'fill-amber-300' : ''}`} />
              <span className="hidden sm:inline">{isFavorited ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 bg-[#E50914] hover:bg-[#b8060f] text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF ({pdf.fileSize})</span>
              <span className="sm:hidden">Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Controls Subheader */}
        <div className="px-4 py-2 bg-[#10121a] border-b border-white/5 flex items-center justify-between text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setZoomLevel(prev => Math.max(75, prev - 15))}
              className="p-1 text-gray-400 hover:text-white"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono text-[11px] text-gray-400">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
              className="p-1 text-gray-400 hover:text-white"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Visual Canvas View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#090a0f] flex items-center justify-center no-scrollbar">
          <div 
            className="bg-white text-gray-900 rounded-xl shadow-2xl p-6 sm:p-10 max-w-2xl w-full min-h-[550px] transition-transform duration-200 flex flex-col justify-between"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {/* Simulated Clean Medical PDF Header */}
            <div className="border-b-2 border-red-600 pb-4 flex items-center justify-between">
              <div>
                <div className="text-red-600 font-black text-sm tracking-wider uppercase font-heading">
                  MediSpark Medical & HSC Academy
                </div>
                <h2 className="text-lg sm:text-xl font-black text-gray-900 mt-1">
                  {pdf.title}
                </h2>
                <span className="text-xs text-gray-500 font-medium">
                  {chapterTitle} • Verified Official Lecture Material
                </span>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 bg-red-50 text-red-700 text-[10px] font-black rounded border border-red-200 block">
                  {pdf.type}
                </span>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            </div>

            {/* Simulated Content Body */}
            <div className="py-6 space-y-4 text-xs sm:text-sm text-gray-800 leading-relaxed font-serif">
              <div className="bg-red-50/60 p-3 rounded-lg border border-red-100">
                <strong className="text-red-900 block mb-1 font-sans">
                  📌 Key High-Yield Chapter Directives (Abul Hasan / Gazi Ajmal Sir):
                </strong>
                <ul className="list-disc pl-4 space-y-1 text-xs text-red-950 font-sans">
                  <li>পরীক্ষায় সর্বাধিক আসা চিহ্নিত চিত্র ও ব্যাখ্যামূলক পয়েন্টসমূহ এখানে অন্তর্ভুক্ত করা হয়েছে।</li>
                  <li>মেডিকেল ভর্তি পরীক্ষার বিগত ২০ বছরের প্রশ্নোত্তর ও ব্যাখ্যা সংযোজিত।</li>
                </ul>
              </div>

              {pdf.contentSummary && pdf.contentSummary.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-900 font-sans text-xs uppercase tracking-wider">
                    Topics Covered in This Lecture Sheet:
                  </h4>
                  <div className="space-y-2 font-sans">
                    {pdf.contentSummary.map((topic, i) => (
                      <div key={i} className="p-2.5 rounded bg-gray-50 border border-gray-200 text-xs flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          {i + 1}
                        </span>
                        <span className="font-medium text-gray-800">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-700">
                  Full high-resolution digitized textbook breakdown with annotated diagrams, formulas, mnemonic charts, and past medical admission diagnostic breakdown.
                </p>
              )}
            </div>

            {/* PDF Footer */}
            <div className="border-t border-gray-200 pt-3 flex items-center justify-between text-[10px] text-gray-400 font-sans">
              <span>MediSpark Academic Portal © 2026</span>
              <span>Proprietary Educational Material • Not for Resale</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
