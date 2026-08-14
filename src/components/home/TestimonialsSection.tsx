import React from 'react';
import { TESTIMONIALS } from '../../data/mockData';
import { Quote, Star } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section 
      id="testimonials-section"
      className="py-14 sm:py-20 bg-[#090909] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E50914] mb-2 block">
            Success Stories
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-heading text-white tracking-tight">
            Hear from MediSpark Doctors & Top Rankers
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-2">
            Thousands of aspirants turned their medical dreams into reality through systematic practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-[#111318] border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#E50914]/40 transition-all shadow-lg"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-[#E50914]/40 mb-3" />
                <p className="text-gray-300 text-sm leading-relaxed italic mb-6">
                  “{t.quote}”
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center gap-3.5">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border border-[#E50914]/50"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{t.name}</h4>
                  <p className="text-xs text-[#FF3540] font-semibold">{t.nowAt}</p>
                  <p className="text-[11px] text-gray-500">{t.batch}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
