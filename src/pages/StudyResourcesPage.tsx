import React, { useState } from 'react';
import { PageView } from '../types';
import { RESOURCES_DATA } from '../data/mockData';
import { Download, FileText, Search, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

interface StudyResourcesPageProps {
  onNavigate: (page: PageView) => void;
  onDownload: (title: string) => void;
}

export const StudyResourcesPage: React.FC<StudyResourcesPageProps> = ({
  onNavigate,
  onDownload,
}) => {
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const subjects = ['All', 'Biology', 'Chemistry', 'Physics', 'GK & English'];

  const filtered = RESOURCES_DATA.filter((res) => {
    const matchesSubject = selectedSubject === 'All' || res.subject === selectedSubject;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div id="study-resources-page" className="min-h-screen bg-[#090909] text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E50914]/15 border border-[#E50914]/30 text-[#FF3540] text-xs font-black uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>High-Yield Revision Materials</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-white tracking-tight">
            PDF Lecture Sheets & Resource Vault
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Free and premium high-yield lecture sheets, NCTB textbook line highlights, formula handbooks, and past 15-year medical admission solved papers.
          </p>
        </div>

        {/* Search & Subject Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#111318] border border-white/10 rounded-2xl p-4 shadow-lg">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PDF sheets, topics, question banks..."
              className="w-full pl-10 pr-4 py-2 bg-[#171922] border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#E50914]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedSubject === sub
                    ? 'bg-[#E50914] text-white shadow-[0_2px_10px_rgba(229,9,20,0.4)]'
                    : 'bg-[#181b24] text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((res) => (
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
                <h3 className="text-base font-bold text-white group-hover:text-[#FF3540] transition-colors line-clamp-2 mb-2">
                  {res.title}
                </h3>
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
    </div>
  );
};
