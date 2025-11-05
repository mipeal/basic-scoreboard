import { motion } from 'framer-motion';
import { useScoreboardStore } from '../store/useScoreboardStore';
import { Trophy, Flag, Users, Zap } from 'lucide-react';

export function StatsCards() {
  const { scoreboard, challenges, solves, submissions, firstBloods } = useScoreboardStore();

  // Calculate total solves from challenges.solves (sum of all challenge solve counts)
  // This represents the total number of successful solves across all challenges
  const totalSolves = challenges.reduce((sum, challenge) => {
    return sum + (challenge.solves ?? 0);
  }, 0);

  // Count first bloods per user by checking each challenge
  const firstBloodCounts: Record<string, number> = {};
  
  challenges.forEach((challenge) => {
    // Get solves for this challenge
    const challengeSolves = solves.filter(s => s.challenge_id === challenge.id);
    
    // Get correct submissions sorted by date (earliest first)
    const correctSubmissions = submissions.filter(
      s => s.challenge_id === challenge.id && s.type === 'correct'
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Determine first blood
    let firstBloodUser = null;
    if (challengeSolves.length > 0) {
      // Sort by date to get the first solve
      const sortedSolves = [...challengeSolves].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      firstBloodUser = sortedSolves[0].user.name;
    } else if (correctSubmissions.length > 0) {
      const submission = correctSubmissions[0];
      firstBloodUser = typeof submission.user === 'string' 
        ? submission.user 
        : submission.user.name;
    }
    
    if (firstBloodUser) {
      firstBloodCounts[firstBloodUser] = (firstBloodCounts[firstBloodUser] || 0) + 1;
    }
  });

  // Find user with most first bloods
  const topFirstBloodUser = Object.entries(firstBloodCounts).reduce(
    (max, [userName, count]) => (count > max.count ? { userName, count } : max),
    { userName: 'N/A', count: 0 }
  );

  const firstBloodDisplay = topFirstBloodUser.count > 0
    ? `${topFirstBloodUser.userName} (${topFirstBloodUser.count})`
    : 'N/A';

  const stats = [
    {
      label: 'Total Teams',
      value: scoreboard.length,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-700',
    },
    {
      label: 'Challenges',
      value: challenges.length,
      icon: Flag,
      color: 'text-purple-500',
      bgColor: 'bg-purple-900/20',
      borderColor: 'border-purple-700',
    },
    {
      label: 'Total Solves',
      value: totalSolves,
      icon: Trophy,
      color: 'text-green-500',
      bgColor: 'bg-green-900/20',
      borderColor: 'border-green-700',
    },
    {
      label: 'Most First Bloods',
      value: firstBloodDisplay,
      icon: Zap,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-900/20',
      borderColor: 'border-yellow-700',
      isText: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-6 hover:scale-105 transition-transform`}
        >
          <div className="flex items-center justify-between mb-2">
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
            <motion.span
              key={String(stat.value)}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`${stat.color} font-bold ${stat.isText ? 'text-lg text-right' : 'text-3xl'}`}
            >
              {stat.value}
            </motion.span>
          </div>
          <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
