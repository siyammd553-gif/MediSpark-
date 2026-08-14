import React from 'react';
import { LEADERBOARD_DATA } from '../../data/mockData';
import { Trophy, Award, Flame, Star, Users } from 'lucide-react';
import { useStudentProfile } from '../../utils/studentStorage';

export const LeaderboardView: React.FC = () => {
  const { profile } = useStudentProfile();
  
  return (
    <div 
      id="leaderboard-view-card"
      className="bg-[#111318] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black font-heading text-white">
              Nationwide Medical Merit Leaderboard
            </h3>
            <p className="text-xs text-gray-400">Based on cumulative score across 8 Central Model Tests</p>
          </div>
        </div>
        <span className="text-xs font-extrabold text-[#FF3540] bg-[#E50914]/15 px-3 py-1 rounded-full border border-[#E50914]/30">
          3,420 Active Aspirants
        </span>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 my-4">
        {/* Rank 2 */}
        <div className="p-3 rounded-xl bg-[#141620] border border-white/5 text-center flex flex-col items-center justify-between">
          <div className="w-6 h-6 rounded-full bg-gray-400 text-black font-extrabold text-xs flex items-center justify-center mb-1">
            2
          </div>
          <img
            src={LEADERBOARD_DATA[1].avatar}
            alt={LEADERBOARD_DATA[1].name}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-400 mb-1"
          />
          <span className="text-xs font-bold text-white line-clamp-1">{LEADERBOARD_DATA[1].name}</span>
          <span className="text-xs font-black text-[#FF3540]">{LEADERBOARD_DATA[1].score}%</span>
        </div>

        {/* Rank 1 */}
        <div className="p-3.5 rounded-xl bg-gradient-to-b from-[#2a1a10] to-[#161820] border border-amber-400/30 text-center flex flex-col items-center justify-between relative -translate-y-1 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
          <div className="w-7 h-7 rounded-full bg-amber-400 text-black font-black text-xs flex items-center justify-center mb-1 shadow-md">
            👑 1
          </div>
          <img
            src={LEADERBOARD_DATA[0].avatar}
            alt={LEADERBOARD_DATA[0].name}
            className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 mb-1"
          />
          <span className="text-xs font-black text-white line-clamp-1">{LEADERBOARD_DATA[0].name}</span>
          <span className="text-sm font-black text-amber-400">{LEADERBOARD_DATA[0].score}%</span>
        </div>

        {/* Rank 3 */}
        <div className="p-3 rounded-xl bg-[#141620] border border-white/5 text-center flex flex-col items-center justify-between">
          <div className="w-6 h-6 rounded-full bg-amber-700 text-white font-extrabold text-xs flex items-center justify-center mb-1">
            3
          </div>
          <img
            src={LEADERBOARD_DATA[2].avatar}
            alt={LEADERBOARD_DATA[2].name}
            className="w-10 h-10 rounded-full object-cover border-2 border-amber-700 mb-1"
          />
          <span className="text-xs font-bold text-white line-clamp-1">{LEADERBOARD_DATA[2].name}</span>
          <span className="text-xs font-black text-[#FF3540]">{LEADERBOARD_DATA[2].score}%</span>
        </div>
      </div>

      {/* Ranks list */}
      <div className="space-y-2 mt-4">
        {LEADERBOARD_DATA.map((user) => {
          const isUser = user.name.includes('(You)');
          return (
            <div
              key={user.rank}
              className={`p-3 rounded-xl flex items-center justify-between transition-all ${
                isUser
                  ? 'bg-gradient-to-r from-[#E50914]/25 via-[#1a1215] to-[#12141a] border border-[#E50914]/50 shadow-[0_0_15px_rgba(229,9,20,0.2)]'
                  : 'bg-[#0d0e13] border border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                    user.rank === 1
                      ? 'bg-amber-400 text-black'
                      : user.rank === 2
                      ? 'bg-gray-300 text-black'
                      : user.rank === 3
                      ? 'bg-amber-700 text-white'
                      : isUser
                      ? 'bg-[#E50914] text-white'
                      : 'bg-white/10 text-gray-300'
                  }`}
                >
                  #{user.rank}
                </div>

                <img
                  src={isUser && profile.avatar ? profile.avatar : user.avatar}
                  alt={isUser ? profile.name : user.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border border-white/10"
                />

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold ${isUser ? 'text-[#FF3540]' : 'text-white'}`}>
                      {isUser ? `${profile.name} (You)` : user.name}
                    </span>
                    {user.badge && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-white/10 text-white rounded">
                        {user.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {isUser ? profile.college : user.college} • Target: {isUser ? profile.targetMedicalCollege : user.target.split(' ')[0]}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-black text-white">{user.score} / 100</div>
                <div className="text-[10px] text-gray-400 flex items-center justify-end gap-1">
                  <span>🔥 {user.streak}d</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
