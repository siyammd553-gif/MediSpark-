import React from 'react';
import { WeakTopic } from '../../types';
import { AlertCircle, ArrowRight, BookOpen, BrainCircuit, Play, Sparkles } from 'lucide-react';

interface WeakTopicAnalysisProps {
  weakTopics: WeakTopic[];
  onStartLesson: (topic: WeakTopic) => void;
}

export const WeakTopicAnalysis: React.FC<WeakTopicAnalysisProps> = ({
  weakTopics,
  onStartLesson,
}) => {
  return (
    <div 
      id="weak-topic-analysis-card"
      className="bg-[#111318] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#E50914]/15 border border-[#E50914]/30 text-[#FF3540] flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black font-heading text-white">
              Weak Topic Diagnostic & Action Plan
            </h3>
            <p className="text-xs text-gray-400">Algorithmic analysis of errors from recent 100-mark mock tests</p>
          </div>
        </div>
        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded-md">
          {weakTopics.length} Priority Areas
        </span>
      </div>

      <div className="space-y-3.5">
        {weakTopics.map((topic) => (
          <div
            key={topic.id}
            className="p-4 rounded-xl bg-[#0d0e13] border border-white/5 hover:border-[#E50914]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#E50914]/20 text-[#FF3540] rounded">
                  {topic.subject}
                </span>
                <span className="text-xs text-gray-400">{topic.chapter}</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                {topic.topicName}
              </h4>
              <p className="text-xs text-gray-300">
                💡 <span className="text-gray-400">Prescription:</span> {topic.suggestedAction}
              </p>
            </div>

            {/* Accuracy ring + Action Button */}
            <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
              <div className="text-right">
                <div className="text-sm font-black text-amber-400">{topic.accuracy}%</div>
                <div className="text-[10px] text-gray-400 uppercase font-semibold">Accuracy</div>
              </div>

              <button
                id={`review-weak-topic-btn-${topic.id}`}
                onClick={() => onStartLesson(topic)}
                className="px-3.5 py-2 bg-[#E50914] hover:bg-[#b8060f] text-white text-xs font-bold rounded-xl transition-all shadow-[0_2px_8px_rgba(229,9,20,0.3)] flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Fix Weak Point</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
