import React from 'react';
import { PageView } from '../../types';
import { RESOURCES_DATA } from '../../data/mockData';
import { Download, FileText, FolderDown, Sparkles, ArrowRight } from 'lucide-react';

interface StudyResourcesSectionProps {
  onNavigate: (page: PageView) => void;
  onDownload: (title: string) => void;
}

export const StudyResourcesSection: React.FC<StudyResourcesSectionProps> = ({
  onNavigate,
  onDownload,
}) => {
  return (
    <section 
      id="home-study-resources-section"
      className="py-14 sm:py-20 bg-[#0d0e12] border-t border-white/5 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#E50914] mb-2 block">
              Free & Premium Downloads
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-white tracking-tight">
              Lecture Sheets & Question Banks
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-1.5 max-w-xl">
              High-yield PDF lecture sheets, NCTB textbook line-by-line highlight compilations, and formula flowcharts.
            </p>
          </div>

          <button
            id="view-all-resources-btn"
            onClick={() => onNavigate('resources')}
            className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2 hover:border-[#E50914]"
          >
            <span>Resource Vault</span>
            <ArrowRight className="w-4 h-4 text-[#E50914]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {RESOURCES_DATA.slice(0, 3).map((res) => (
            <div
              key={res.id}
              className="bg-[#111318] border border-white/10 rounded-2xl p-5 hover:border-[#E50914]/50 transition-all flex flex-col justify-between group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#E50914]/15 text-[#FF3540] rounded-md border border-[#E50914]/20">
                    {res.category}
                  </span>
                  {res.badge && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md">
                      {res.badge}
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-[#FF3540] transition-colors line-clamp-2 mb-2">
                  {res.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                  <span>{res.pages} Pages</span>
                  <span>•</span>
                  <span>{res.fileSize}</span>
                  <span>•</span>
                  <span>{res.downloadCount.toLocaleString()} downloads</span>
                </div>
              </div>

              <button
                onClick={() => onDownload(res.title)}
                className="w-full py-2.5 px-4 bg-white/5 hover:bg-[#E50914] text-white hover:text-white text-xs font-bold rounded-xl border border-white/10 hover:border-transparent transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-[#FF3540] group-hover:text-white" />
                <span>Instant PDF Download</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
