import React, { useState } from 'react';
import { BrainCircuit, Sparkles, Send, Bot, User, Loader2, BookOpen, Stethoscope, RefreshCw, Zap } from 'lucide-react';
import { StudentProfile } from '../../types';

interface AIStudyAssistantProps {
  studentProfile: StudentProfile;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestedTopics?: string[];
}

export const AIStudyAssistant: React.FC<AIStudyAssistantProps> = ({
  studentProfile,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'ai',
      text: `Hello ${studentProfile.name.split(' ')[0]}! ⚕ I’m your MediSpark AI Academic Mentor. I reviewed your recent Model Test (87.75/100, Rank 14). You are excelling in Botany and Zoology Physiology, but losing crucial fractions in Genetics Non-Mendelian Epistasis ratios and Organic Chemistry Reaction conversions.\n\nWhat would you like to master today?`,
      timestamp: 'Just now',
      suggestedTopics: [
        'Give me a mnemonic for Epistasis Ratios (9:7, 13:3, 9:3:4)',
        'What should I study next to reach DMC merit zone?',
        'Explain SN1 vs SN2 reaction mechanism for medical MCQs',
        'Generate 5 high-yield Zoology questions on Heart valves & circulation',
      ],
    },
  ]);

  const handleSendMessage = async (queryText?: string) => {
    const text = queryText || inputQuery;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    try {
      // Call server-side AI endpoint
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          studentName: studentProfile.name,
          weakTopics: studentProfile.weakTopics.map((w) => `${w.subject}: ${w.topicName}`),
          targetCollege: studentProfile.targetMedicalCollege,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.reply || data.response || 'Here is your high-yield medical admission breakdown.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedTopics: data.nextSuggestions,
        };
        setChatHistory((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('Server fallback');
      }
    } catch (err) {
      // High quality fallback medical admission tutor response
      setTimeout(() => {
        let fallbackText = '';
        if (text.toLowerCase().includes('mnemonic') || text.toLowerCase().includes('ratio') || text.toLowerCase().includes('epistasis')) {
          fallbackText = `💡 **High-Yield Medical Mnemonic: Epistasis Ratios**\n\n1. **Duplicate Recessive (Complementary Genes): 9 : 7**\n   • *Mnemonic:* **"Nine Complementary Sevens"** — Purple sweet pea flower.\n\n2. **Dominant Epistasis: 12 : 3 : 1**\n   • *Mnemonic:* **"12 Dominant Dogs"** — Summer squash / Dog coat.\n\n3. **Duplicate Dominant (Duplicate Genes): 15 : 1**\n   • *Mnemonic:* **"15 Duplicate Triangles"** — Shepherd’s purse fruit shape.\n\n4. **Inhibitory Gene: 13 : 3**\n   • *Mnemonic:* **"13 Inhibited Hens"** — Feather color in Leghorn fowl.\n\n✨ *DGHS Medical Exam Tip:* Questions frequently ask for phenotypic vs genotypic F2 ratios in non-Mendelian inheritance.`;
        } else if (text.toLowerCase().includes('study next') || text.toLowerCase().includes('dmc') || text.toLowerCase().includes('schedule')) {
          fallbackText = `🎯 **Personalized 3-Step DMC Merit Booster Plan for Tonight:**\n\n1. **Biology (45 mins):** Solve 25 MCQs on Zoology Chapter 11 (Genetics Linkage & Crossing Over).\n2. **Chemistry (30 mins):** Review Dr. Tanvir's Lucas Reagent & Tollens Reagent conversion charts.\n3. **Physics (25 mins):** Practice 10 dimensional analysis shortcuts for thermodynamics.\n\n*Target today:* Complete the remaining 60 mins of your 240-min target to keep your 19-day streak active!`;
        } else {
          fallbackText = `⚕ **MediSpark High-Yield Concept Breakdown:**\n\nFor medical admission examinations, direct textbook memory of scientists, discoveries, and specific ratios yields the highest ROI in the 60-second-per-question limit.\n\n• Always eliminate two distractor options first.\n• Beware of negative marking (-0.25) on uncertain questions.\n• Would you like a 5-question rapid-fire diagnostic test on this topic?`;
        }

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatHistory((prev) => [...prev, aiMsg]);
      }, 700);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      id="ai-study-assistant-component"
      className="bg-[#111318] border border-white/10 rounded-2xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex flex-col h-[580px]"
    >
      {/* Top Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#171216] via-[#14161f] to-[#111318] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E50914] to-[#80030a] p-0.5 shadow-[0_0_15px_rgba(229,9,20,0.5)]">
            <div className="w-full h-full bg-[#0d0e12] rounded-[10px] flex items-center justify-center text-white">
              <BrainCircuit className="w-5 h-5 text-[#FF3540]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black font-heading text-white">
                MediSpark AI Academic Mentor
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-[#E50914] text-white rounded-md">
                Powered by Gemini
              </span>
            </div>
            <p className="text-xs text-gray-400">Personalized Medical Admission & HSC Doubt Solver</p>
          </div>
        </div>

        <button
          onClick={() => {
            setChatHistory((prev) => [prev[0]]);
          }}
          title="Reset conversation"
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-[#0a0b0e]/70">
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-[#E50914] text-white'
                  : 'bg-gradient-to-br from-[#1a1215] to-[#12141a] border border-[#E50914]/40 text-[#FF3540]'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[85%] sm:max-w-[75%] space-y-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <div
                className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-[#E50914] text-white rounded-tr-none shadow-[0_4px_16px_rgba(229,9,20,0.3)]'
                    : 'bg-[#14161f] text-gray-200 border border-white/10 rounded-tl-none shadow-md'
                }`}
              >
                {msg.text}
              </div>

              {/* Suggested Follow-up Quick Query Chips */}
              {msg.suggestedTopics && msg.suggestedTopics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.suggestedTopics.map((topic, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(topic)}
                      className="text-[11px] font-semibold text-gray-300 bg-white/5 hover:bg-[#E50914]/20 hover:text-[#FF3540] border border-white/10 hover:border-[#E50914]/40 px-2.5 py-1 rounded-lg transition-all text-left"
                    >
                      ⚡ {topic}
                    </button>
                  ))}
                </div>
              )}

              <span className="text-[10px] text-gray-500 block px-1">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1a1215] border border-[#E50914]/40 flex items-center justify-center text-[#FF3540]">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#14161f] border border-white/10 text-xs text-gray-400 flex items-center gap-2">
              <span>MediSpark AI is analyzing curriculum & generating medical insights...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-[#111318] border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="ai-assistant-query-input"
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask anything (e.g. 'Explain cardiac cycle', 'Give chemistry mnemonics', 'What to study next?')..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#171922] border border-white/10 text-white text-xs sm:text-sm placeholder-gray-500 focus:outline-none focus:border-[#E50914] transition-colors"
          />
          <button
            id="send-ai-query-btn"
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="px-4 py-2.5 bg-[#E50914] hover:bg-[#b8060f] disabled:opacity-40 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-[0_2px_10px_rgba(229,9,20,0.3)] flex items-center gap-1.5"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
