import React from 'react';
import { PageView } from '../../types';
import { CheckCircle2, Clock, Award, BarChart3, BrainCircuit, Target, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

interface MedicalPrepFeaturesProps {
  onNavigate: (page: PageView) => void;
}

export const MedicalPrepFeatures: React.FC<MedicalPrepFeaturesProps> = ({ onNavigate }) => {
  const liveExams = [
    {
      id: 'exam-1',
      title: 'Medical Central Model Test - 09 (DGHS Standard)',
      subject: 'Full Syllabus (100 MCQs)',
      duration: '60 Mins',
      marks: '100 Marks',
      status: 'Active',
      statusColor: 'bg-[#E50914] text-white',
      participants: '3,850+ Live',
    },
    {
      id: 'exam-2',
      title: 'Biology Rapid Fire: Genetics & Epistasis Special',
      subject: 'Zoology Ch-11 (50 MCQs)',
      duration: '30 Mins',
      marks: '50 Marks',
      status: 'Upcoming',
      statusColor: 'bg-white/10 text-gray-200 border border-white/10',
      participants: 'Starts at 9:00 PM',
    },
    {
      id: 'exam-3',
      title: 'Chemistry Organic Reactions & Named Tests',
      subject: 'Chemistry 2nd Paper (25 MCQs)',
      duration: '20 Mins',
      marks: '25 Marks',
      status: 'Result Published',
      statusColor: 'bg-[#E50914]/20 text-[#FF3540] border border-[#E50914]/30',
      participants: 'Rank 14 / 3,420',
    }
  ];

  return (
    <section 
      id="exam-features-section"
      className="py-14 sm:py-20 bg-[#090909] border-t border-white/5 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid: Exam System on Left, DGHS Negative Marking Engine on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (6 cols): Live Exam Engine Card */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E50914]/10 border border-[#E50914]/30 text-[#FF3540] text-xs font-extrabold uppercase tracking-widest mb-3">
              <Target className="w-3.5 h-3.5" />
              <span>Exam & Assessment Portal</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-white tracking-tight mb-4">
              Real-Time Simulated <br />
              <span className="text-[#E50914]">DGHS Model Tests</span>
            </h2>
            
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
              Experience the pressure of the real exam hall with automated negative marking (-0.25), 
              instant merit position, and chapter-by-chapter AI error breakdown.
            </p>

            {/* Exam Cards Stack */}
            <div className="space-y-3">
              {liveExams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-[#111318] border border-white/10 hover:border-[#E50914]/50 rounded-xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${exam.statusColor}`}>
                        {exam.status}
                      </span>
                      <span className="text-xs text-gray-400">{exam.subject}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      {exam.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#E50914]" /> {exam.duration}
                      </span>
                      <span>•</span>
                      <span>{exam.marks}</span>
                      <span>•</span>
                      <span className="text-gray-400">{exam.participants}</span>
                    </div>
                  </div>

                  <button
                    id={`start-exam-action-${exam.id}`}
                    onClick={() => onNavigate('exam')}
                    className="px-4 py-2 bg-[#E50914] hover:bg-[#b8060f] text-white text-xs font-bold rounded-xl transition-all shadow-[0_2px_10px_rgba(229,9,20,0.3)] shrink-0 self-start sm:self-auto"
                  >
                    {exam.status === 'Active' ? 'Start Exam Now' : exam.status === 'Result Published' ? 'View Analysis' : 'Set Reminder'}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button
                id="explore-all-exams-btn"
                onClick={() => onNavigate('exam')}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FF3540] hover:text-white transition-colors"
              >
                <span>Browse full medical question bank & model test schedule</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column (6 cols): Performance & Rank Metrics Visual */}
          <div className="lg:col-span-6 bg-gradient-to-b from-[#14161f] to-[#0c0d12] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <span className="text-xs font-bold uppercase text-[#E50914]">Live Student Analytics</span>
                <h3 className="text-xl font-extrabold text-white">Performance Scorecard</h3>
              </div>
              <span className="px-3 py-1 bg-[#E50914]/20 border border-[#E50914]/40 text-[#FF3540] text-xs font-bold rounded-full">
                Rank #14 Nationally
              </span>
            </div>

            {/* Subject Mastery Radial / Bar Visuals */}
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-white">Biology (Botany & Zoology)</span>
                  <span className="text-[#FF3540]">95.0% Accuracy</span>
                </div>
                <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div className="h-full bg-gradient-to-r from-[#E50914] to-[#FF3540] rounded-full w-[95%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-white">Medical Chemistry</span>
                  <span className="text-[#FF3540]">88.0% Accuracy</span>
                </div>
                <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div className="h-full bg-gradient-to-r from-[#E50914] to-[#FF3540] rounded-full w-[88%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-white">Medical Physics (Speed Techniques)</span>
                  <span className="text-[#FF3540]">86.2% Accuracy</span>
                </div>
                <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div className="h-full bg-gradient-to-r from-[#E50914] to-[#FF3540] rounded-full w-[86.2%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-white">English & General Knowledge (GK)</span>
                  <span className="text-[#FF3540]">83.3% Accuracy</span>
                </div>
                <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div className="h-full bg-gradient-to-r from-[#E50914] to-[#FF3540] rounded-full w-[83.3%]" />
                </div>
              </div>
            </div>

            {/* Rank Prediction Quick Teaser */}
            <div className="p-4 bg-[#0a0b0e] rounded-xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#E50914]/20 flex items-center justify-center text-[#FF3540]">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Predicted Medical Merit Position</div>
                  <div className="text-base font-black text-white">Top 250 (DMC / ShSMC Zone)</div>
                </div>
              </div>
              <button
                id="open-rank-predictor-teaser-btn"
                onClick={() => onNavigate('rank-predictor')}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-all"
              >
                Predict Yours →
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
