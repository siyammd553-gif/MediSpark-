import React from 'react';
import { StudentProfile } from '../../types';
import { Flame, CheckCircle2, Award, Calendar } from 'lucide-react';

interface StudyStreakTrackerProps {
  profile?: StudentProfile;
  streakDays?: number;
  weeklyStreak?: { day: string; studied: boolean; hours: number }[];
  todayCompletedMinutes?: number;
  todayTargetMinutes?: number;
}

export const StudyStreakTracker: React.FC<StudyStreakTrackerProps> = ({
  profile,
  streakDays: propStreakDays,
  weeklyStreak: propWeeklyStreak,
  todayCompletedMinutes: propTodayCompleted,
  todayTargetMinutes: propTodayTarget,
}) => {
  const streakDays = propStreakDays ?? profile?.streakDays ?? 0;
  const weeklyStreak = propWeeklyStreak ?? profile?.weeklyStreak ?? [
    { day: 'Sat', studied: true, hours: 3.5 },
    { day: 'Sun', studied: true, hours: 4.2 },
    { day: 'Mon', studied: true, hours: 3.8 },
    { day: 'Tue', studied: true, hours: 5.1 },
    { day: 'Wed', studied: true, hours: 4.0 },
    { day: 'Thu', studied: true, hours: 4.8 },
    { day: 'Fri', studied: true, hours: 2.5 },
  ];
  const todayCompletedMinutes = propTodayCompleted ?? profile?.todayStudyTarget?.completedMinutes ?? 180;
  const todayTargetMinutes = propTodayTarget ?? profile?.todayStudyTarget?.targetMinutes ?? 240;

  const targetPct = Math.min(100, Math.round((todayCompletedMinutes / Math.max(1, todayTargetMinutes)) * 100));

  return (
    <div 
      id="study-streak-tracker-card"
      className="bg-[#111318] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E50914] to-[#80030a] text-white flex items-center justify-center text-xl shadow-[0_0_15px_rgba(229,9,20,0.5)]">
            🔥
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black font-heading text-white">
              Weekly Study Streak
            </h3>
            <p className="text-xs text-gray-400">Consistency is key to cracking Medical Admission</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-[#FF3540]">{streakDays} Days</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Flame</div>
        </div>
      </div>

      {/* 7-Day Visual Progress Track */}
      <div className="grid grid-cols-7 gap-2 py-3 border-y border-white/5 my-4">
        {(weeklyStreak || []).map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-gray-400 mb-1.5">{item?.day}</span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                item?.studied
                  ? 'bg-[#E50914] text-white shadow-[0_0_12px_rgba(229,9,20,0.4)]'
                  : 'bg-white/5 text-gray-400 border border-white/5'
              }`}
            >
              {item?.studied ? '✓' : '—'}
            </div>
            <span className="text-[9px] text-gray-400 font-semibold mt-1">
              {(item?.hours || 0) > 0 ? `${item.hours}h` : '0h'}
            </span>
          </div>
        ))}
      </div>

      {/* Today's Target Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-gray-300">Today’s Study Target ({todayCompletedMinutes}/{todayTargetMinutes} mins)</span>
          <span className="text-[#FF3540]">{targetPct}% Reached</span>
        </div>
        <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-[#E50914] to-[#FF3540] rounded-full transition-all duration-500"
            style={{ width: `${targetPct}%` }}
          />
        </div>
      </div>
    </div>
  );
};
