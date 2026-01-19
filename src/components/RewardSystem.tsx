import { Trophy, Star, Zap, Award, Target, Flame, Crown, Medal } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface RewardSystemProps {
  xp: number;
  level: number;
  streak: number;
  achievements: Achievement[];
  onClose: () => void;
}

const getLevelThreshold = (level: number) => {
  return level * 100; // Each level requires 100 * level XP
};

export function RewardSystem({ xp, level, streak, achievements, onClose }: RewardSystemProps) {
  const currentLevelXP = getLevelThreshold(level - 1);
  const nextLevelXP = getLevelThreshold(level);
  const xpInCurrentLevel = xp - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  const progressPercent = (xpInCurrentLevel / xpNeededForLevel) * 100;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return Trophy;
      case 'star': return Star;
      case 'zap': return Zap;
      case 'award': return Award;
      case 'target': return Target;
      case 'flame': return Flame;
      case 'crown': return Crown;
      case 'medal': return Medal;
      default: return Trophy;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 p-8 text-white rounded-t-xl overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white text-2xl font-bold mb-2">Rewards & Achievements</h2>
                <p className="text-white/70">Track your learning progress and unlock badges</p>
              </div>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors text-2xl font-light cursor-pointer hover:bg-white/10 w-10 h-10 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Level & XP Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Level */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="w-6 h-6 text-yellow-300" />
                  <span className="text-white/80 text-sm">Level</span>
                </div>
                <p className="text-white text-3xl font-bold">{level}</p>
              </div>

              {/* Total XP */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-6 h-6 text-yellow-300" />
                  <span className="text-white/80 text-sm">Total XP</span>
                </div>
                <p className="text-white text-3xl font-bold">{xp.toLocaleString()}</p>
              </div>

              {/* Streak */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Flame className="w-6 h-6 text-orange-400" />
                  <span className="text-white/80 text-sm">Day Streak</span>
                </div>
                <p className="text-white text-3xl font-bold">{streak} days</p>
              </div>
            </div>

            {/* Level Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-white/80 mb-2">
                <span>Level {level}</span>
                <span className="font-medium">{xpInCurrentLevel} / {xpNeededForLevel} XP</span>
                <span>Level {level + 1}</span>
              </div>
            <div className="bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
        </div>

        {/* Achievements Grid */}
        <div className="p-8 bg-[#1A1425]">
          <h3 className="text-white text-lg font-semibold mb-6">Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => {
              const Icon = getIcon(achievement.icon);
              return (
                <div
                  key={achievement.id}
                  className={`rounded-xl p-5 border-2 transition-all ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/50 shadow-lg shadow-amber-500/10'
                      : 'bg-white/5 border-white/10 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`p-3 rounded-xl ${
                        achievement.unlocked
                          ? 'bg-gradient-to-br from-amber-400 to-yellow-500'
                          : 'bg-slate-700'
                      }`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-white font-medium">{achievement.title}</h4>
                        {achievement.unlocked && (
                          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Unlocked
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 mt-1">{achievement.description}</p>

                      {/* Progress Bar (for locked achievements with progress) */}
                      {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress !== undefined && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress} / {achievement.maxProgress}</span>
                          </div>
                          <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-primary-500 to-accent-500 h-full rounded-full transition-all"
                              style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* XP Earning Guide */}
          <div className="mt-8 bg-primary-500/10 border border-primary-500/30 rounded-xl p-6">
            <h4 className="text-primary-300 font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              How to Earn XP
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
                <span>Complete a video lesson: <strong className="text-white">+50 XP</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
                <span>Finish a quiz: <strong className="text-white">+75 XP</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
                <span>Complete exercises: <strong className="text-white">+100 XP</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
                <span>Daily login streak: <strong className="text-white">+25 XP</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
                <span>Perfect quiz score: <strong className="text-white">+150 XP</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
                <span>Help a classmate: <strong className="text-white">+50 XP</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
