import React, { useState } from 'react';
import { PageView } from '../types';
import { Trophy, Stethoscope, Calculator, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RankPredictorPageProps {
  onNavigate: (page: PageView) => void;
}

export const RankPredictorPage: React.FC<RankPredictorPageProps> = ({ onNavigate }) => {
  const [sscGpa, setSscGpa] = useState<number>(5.0);
  const [hscGpa, setHscGpa] = useState<number>(5.0);
  const [examScore, setExamScore] = useState<number>(82.5);
  const [isCalculated, setIsCalculated] = useState(false);

  // DGHS Calculation Formula
  // SSC GPA x 15 (75 marks) + HSC GPA x 25 (125 marks) = 200 marks GPA + 100 marks Exam = Total 300
  const sscContribution = Number((sscGpa * 15).toFixed(2));
  const hscContribution = Number((hscGpa * 25).toFixed(2));
  const gpaTotal = Number((sscContribution + hscContribution).toFixed(2));
  const totalScore = Number((gpaTotal + examScore).toFixed(2));

  // Medical Colleges Cutoff Database
  const colleges = [
    { name: 'Dhaka Medical College (DMC)', seats: 230, minCutoff: 282.0, tier: 'Top Tier (DMC)' },
    { name: 'Sir Salimullah Medical College (SSMC)', seats: 250, minCutoff: 275.5, tier: 'Top Tier' },
    { name: 'Shaheed Suhrawardy Medical College (ShSMC)', seats: 230, minCutoff: 272.5, tier: 'Top Tier' },
    { name: 'Mymensingh Medical College (MMC)', seats: 250, minCutoff: 268.0, tier: 'Central Tier' },
    { name: 'Chittagong Medical College (CMC)', seats: 250, minCutoff: 267.0, tier: 'Central Tier' },
    { name: 'Rajshahi Medical College (RMC)', seats: 250, minCutoff: 265.5, tier: 'Central Tier' },
    { name: 'MAG Osmani Medical College, Sylhet', seats: 250, minCutoff: 263.0, tier: 'Govt. Medical' },
    { name: 'Sher-e-Bangla Medical College (SBMC), Barisal', seats: 250, minCutoff: 261.5, tier: 'Govt. Medical' },
    { name: 'Rangpur Medical College (RpMC)', seats: 250, minCutoff: 260.0, tier: 'Govt. Medical' },
    { name: 'Cumilla Medical College (CuMC)', seats: 200, minCutoff: 258.5, tier: 'Govt. Medical' },
  ];

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculated(true);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  };

  // Rank estimation formula
  let estimatedRank = '5,000+';
  if (totalScore >= 282) estimatedRank = 'Top 1 – 250 (DMC Confirmed)';
  else if (totalScore >= 275) estimatedRank = 'Top 250 – 750 (SSMC / ShSMC Zone)';
  else if (totalScore >= 268) estimatedRank = 'Top 750 – 2,000 (MMC / CMC / RMC Zone)';
  else if (totalScore >= 260) estimatedRank = 'Top 2,000 – 4,350 (Govt. Medical Seat Zone)';
  else if (totalScore >= 250) estimatedRank = 'Waiting / Top Private Medical College Merit';

  return (
    <div id="rank-predictor-page" className="min-h-screen bg-[#090909] text-white py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E50914]/15 border border-[#E50914]/30 text-[#FF3540] text-xs font-black uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            <span>DGHS Standard Merit Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-white tracking-tight">
            Medical Admission Rank & College Predictor
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Enter your SSC GPA, HSC GPA, and expected exam score (out of 100) to calculate your official 300-mark merit standing and eligible medical colleges.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="bg-[#111318] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.7)]">
          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* SSC GPA */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-300">
                  SSC GPA (without 4th subject if applicable)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="3.5"
                    max="5.0"
                    required
                    value={sscGpa}
                    onChange={(e) => setSscGpa(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-[#161822] border border-white/10 rounded-xl text-white text-base font-bold focus:outline-none focus:border-[#E50914]"
                  />
                  <span className="absolute right-3 top-3.5 text-xs text-gray-400 font-semibold">
                    = {sscContribution} / 75
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">Multiplied by 15 (Max 75 marks)</p>
              </div>

              {/* HSC GPA */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-300">
                  HSC GPA (Science)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="3.5"
                    max="5.0"
                    required
                    value={hscGpa}
                    onChange={(e) => setHscGpa(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-[#161822] border border-white/10 rounded-xl text-white text-base font-bold focus:outline-none focus:border-[#E50914]"
                  />
                  <span className="absolute right-3 top-3.5 text-xs text-gray-400 font-semibold">
                    = {hscContribution} / 125
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">Multiplied by 25 (Max 125 marks)</p>
              </div>

              {/* Expected Exam Score */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-300">
                  Expected Medical MCQ Score (Out of 100)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max="100"
                    required
                    value={examScore}
                    onChange={(e) => setExamScore(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-[#161822] border border-white/10 rounded-xl text-white text-base font-bold focus:outline-none focus:border-[#E50914]"
                  />
                  <span className="absolute right-3 top-3.5 text-xs text-[#FF3540] font-bold">
                    / 100
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">100 MCQs with -0.25 negative marking</p>
              </div>

            </div>

            <div className="pt-2 text-center">
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#E50914] hover:bg-[#b8060f] text-white font-bold text-sm rounded-xl shadow-[0_4px_20px_rgba(229,9,20,0.5)] transition-all inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Calculate Total Merit & Match Colleges</span>
              </button>
            </div>
          </form>
        </div>

        {/* Results Panel */}
        {isCalculated && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Scorecard Hero */}
            <div className="bg-gradient-to-r from-[#1c1115] via-[#141622] to-[#10121a] border border-[#E50914]/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left items-center">
                <div>
                  <span className="text-xs font-bold uppercase text-[#FF3540]">Combined Merit Score</span>
                  <div className="text-4xl sm:text-5xl font-black font-heading text-white mt-1">
                    {totalScore} <span className="text-base text-gray-400 font-medium">/ 300</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    GPA: {gpaTotal}/200 + Admission Exam: {examScore}/100
                  </p>
                </div>

                <div className="p-4 bg-[#0a0b0e] rounded-2xl border border-white/5 text-center">
                  <div className="text-xs text-gray-400">Estimated DGHS Merit Zone</div>
                  <div className="text-base font-black text-amber-400 mt-1">
                    {estimatedRank}
                  </div>
                </div>

                <div className="text-center md:text-right">
                  <button
                    onClick={() => onNavigate('exam')}
                    className="px-5 py-3 bg-[#E50914] hover:bg-[#b8060f] text-white text-xs font-bold rounded-xl shadow-md inline-flex items-center gap-2"
                  >
                    <span>Practice High-Yield MCQs</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Eligible Medical Colleges List */}
            <div className="bg-[#111318] border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base sm:text-lg font-black font-heading text-white flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-[#E50914]" />
                  <span>College Eligibility Breakdown based on {totalScore}/300</span>
                </h3>
                <span className="text-xs text-gray-400">Cutoffs based on recent DGHS official statistics</span>
              </div>

              <div className="space-y-3">
                {colleges.map((col, idx) => {
                  const isEligible = totalScore >= col.minCutoff;
                  const diff = Number((totalScore - col.minCutoff).toFixed(2));

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isEligible
                          ? 'bg-[#141820] border-emerald-500/30 text-white'
                          : 'bg-[#12141a] border-white/5 opacity-70'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-white/5 rounded text-gray-400">
                            {col.tier}
                          </span>
                          <span className="text-xs text-gray-400">{col.seats} Total Seats</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">{col.name}</h4>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xs text-gray-400">Past Cutoff: {col.minCutoff}</div>
                          <div className={`text-xs font-bold ${isEligible ? 'text-emerald-400' : 'text-[#FF3540]'}`}>
                            {isEligible ? `+${diff} above cutoff` : `${diff} below cutoff`}
                          </div>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            isEligible
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-white/5 text-gray-400 border border-white/10'
                          }`}
                        >
                          {isEligible ? 'High Probability' : 'Competitive Reach'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
