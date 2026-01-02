"use client";

import { useMemo } from "react";
import { Award, Trophy, Star, Flame, Target, Sparkles } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  achieved: boolean;
  progress?: number;
  target?: number;
}

interface MilestonesProps {
  stats: {
    today: number;
    week: number;
    month: number;
    streak: number;
  };
  totalChants: number;
}

export function Milestones({ stats, totalChants }: MilestonesProps) {
  const milestones = useMemo<Milestone[]>(() => {
    const ms: Milestone[] = [];

    // Streak milestones
    ms.push({
      id: "streak-7",
      title: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: <Flame className="w-6 h-6" />,
      achieved: stats.streak >= 7,
      progress: Math.min(stats.streak, 7),
      target: 7,
    });

    ms.push({
      id: "streak-30",
      title: "Monthly Devotee",
      description: "Maintain a 30-day streak",
      icon: <Flame className="w-6 h-6" />,
      achieved: stats.streak >= 30,
      progress: Math.min(stats.streak, 30),
      target: 30,
    });

    ms.push({
      id: "streak-100",
      title: "Century Streak",
      description: "Maintain a 100-day streak",
      icon: <Flame className="w-6 h-6" />,
      achieved: stats.streak >= 100,
      progress: Math.min(stats.streak, 100),
      target: 100,
    });

    // Daily milestones
    ms.push({
      id: "daily-108",
      title: "Sacred Count",
      description: "Chant 108 times in a day",
      icon: <Target className="w-6 h-6" />,
      achieved: stats.today >= 108,
      progress: Math.min(stats.today, 108),
      target: 108,
    });

    ms.push({
      id: "daily-1000",
      title: "Thousand Chants",
      description: "Chant 1000 times in a day",
      icon: <Star className="w-6 h-6" />,
      achieved: stats.today >= 1000,
      progress: Math.min(stats.today, 1000),
      target: 1000,
    });

    // Weekly milestones
    ms.push({
      id: "weekly-1000",
      title: "Weekly Devotion",
      description: "Chant 1000 times in a week",
      icon: <Award className="w-6 h-6" />,
      achieved: stats.week >= 1000,
      progress: Math.min(stats.week, 1000),
      target: 1000,
    });

    // Monthly milestones
    ms.push({
      id: "monthly-5000",
      title: "Monthly Champion",
      description: "Chant 5000 times in a month",
      icon: <Trophy className="w-6 h-6" />,
      achieved: stats.month >= 5000,
      progress: Math.min(stats.month, 5000),
      target: 5000,
    });

    ms.push({
      id: "monthly-10000",
      title: "Elite Devotee",
      description: "Chant 10000 times in a month",
      icon: <Trophy className="w-6 h-6" />,
      achieved: stats.month >= 10000,
      progress: Math.min(stats.month, 10000),
      target: 10000,
    });

    // Lifetime milestones
    ms.push({
      id: "lifetime-10000",
      title: "Ten Thousand",
      description: "Reach 10,000 total chants",
      icon: <Sparkles className="w-6 h-6" />,
      achieved: totalChants >= 10000,
      progress: Math.min(totalChants, 10000),
      target: 10000,
    });

    ms.push({
      id: "lifetime-100000",
      title: "Hundred Thousand",
      description: "Reach 100,000 total chants",
      icon: <Sparkles className="w-6 h-6" />,
      achieved: totalChants >= 100000,
      progress: Math.min(totalChants, 100000),
      target: 100000,
    });

    return ms;
  }, [stats, totalChants]);

  const achievedCount = milestones.filter((m) => m.achieved).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Milestones & Achievements
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {achievedCount} / {milestones.length} achieved
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {milestones.map((milestone) => {
          const progressPercent = milestone.target
            ? (milestone.progress! / milestone.target) * 100
            : 0;

          return (
            <div
              key={milestone.id}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                milestone.achieved
                  ? "border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 shadow-lg"
                  : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    milestone.achieved
                      ? "bg-amber-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {milestone.icon}
                </div>
                <div className="flex-1">
                  <h4
                    className={`font-semibold mb-1 ${
                      milestone.achieved
                        ? "text-amber-700 dark:text-amber-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {milestone.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {milestone.description}
                  </p>
                  {milestone.target && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          {milestone.progress?.toLocaleString()} /{" "}
                          {milestone.target.toLocaleString()}
                        </span>
                        <span>{Math.round(progressPercent)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            milestone.achieved
                              ? "bg-gradient-to-r from-amber-500 to-orange-600"
                              : "bg-gray-400 dark:bg-gray-600"
                          }`}
                          style={{ width: `${Math.min(progressPercent, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {milestone.achieved && (
                    <div className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Achieved!
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

