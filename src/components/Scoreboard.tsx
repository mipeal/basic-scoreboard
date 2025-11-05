import { motion, AnimatePresence } from 'framer-motion';
import { useScoreboardStore } from '../store/useScoreboardStore';
import { Trophy, TrendingUp, TrendingDown, Medal, Crown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function Scoreboard() {
  const { scoreboard, rankChanges, lastUpdate } = useScoreboardStore();

  // Get rank change for a specific user
  const getRankChange = (accountId: number) => {
    const change = rankChanges.find(rc => rc.userId === accountId);
    if (!change) return null;
    
    const rankDiff = change.oldRank - change.newRank; // Positive = moved up, negative = moved down
    return rankDiff;
  };

  // Split into top 3 and rest
  const topThree = scoreboard.slice(0, 3);
  const restOfTeams = scoreboard.slice(3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
          </div>
          {lastUpdate && (
            <span className="text-sm text-gray-400">
              Updated {formatDistanceToNow(lastUpdate, { addSuffix: true })}
            </span>
          )}
        </div>
      </div>

      {/* Podium for Top 3 */}
      {topThree.length > 0 && (
        <div className="flex items-end justify-center gap-4 px-4">
          {/* 2nd Place */}
          {topThree[1] && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center flex-1 max-w-xs"
            >
              <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl p-6 w-full border-2 border-gray-500 shadow-xl mb-4">
                <div className="flex flex-col items-center gap-3">
                  <Medal className="w-12 h-12 text-gray-400" />
                  <div className="text-4xl font-bold text-gray-400">2</div>
                  <div className="text-lg font-semibold text-white text-center">{topThree[1].name}</div>
                  <div className="text-2xl font-bold text-blue-400">{topThree[1].score} pts</div>
                  {(() => {
                    const rankChange = getRankChange(topThree[1].account_id);
                    if (rankChange !== null && rankChange !== 0) {
                      if (rankChange > 0) {
                        return (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1 text-green-400 text-sm font-semibold"
                          >
                            <TrendingUp className="w-5 h-5" />
                            <span>+{rankChange}</span>
                          </motion.div>
                        );
                      } else {
                        return (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1 text-red-400 text-sm font-semibold"
                          >
                            <TrendingDown className="w-5 h-5" />
                            <span>{rankChange}</span>
                          </motion.div>
                        );
                      }
                    }
                    return null;
                  })()}
                </div>
              </div>
              <div className="w-full bg-gradient-to-br from-gray-600 to-gray-700 rounded-t-xl h-32 border-2 border-gray-500 flex items-center justify-center">
                <span className="text-5xl font-bold text-gray-400">2</span>
              </div>
            </motion.div>
          )}

          {/* 1st Place */}
          {topThree[0] && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center flex-1 max-w-xs"
            >
              <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl p-6 w-full border-2 border-yellow-500 shadow-2xl mb-4">
                <div className="flex flex-col items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Crown className="w-16 h-16 text-yellow-300" />
                  </motion.div>
                  <div className="text-5xl font-bold text-yellow-300">1</div>
                  <div className="text-xl font-bold text-white text-center">{topThree[0].name}</div>
                  <div className="text-3xl font-bold text-yellow-200">{topThree[0].score} pts</div>
                  {(() => {
                    const rankChange = getRankChange(topThree[0].account_id);
                    if (rankChange !== null && rankChange !== 0) {
                      if (rankChange > 0) {
                        return (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1 text-green-300 text-sm font-semibold"
                          >
                            <TrendingUp className="w-5 h-5" />
                            <span>+{rankChange}</span>
                          </motion.div>
                        );
                      } else {
                        return (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1 text-red-300 text-sm font-semibold"
                          >
                            <TrendingDown className="w-5 h-5" />
                            <span>{rankChange}</span>
                          </motion.div>
                        );
                      }
                    }
                    return null;
                  })()}
                </div>
              </div>
              <div className="w-full bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-t-xl h-44 border-2 border-yellow-500 flex items-center justify-center">
                <span className="text-6xl font-bold text-yellow-300">1</span>
              </div>
            </motion.div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center flex-1 max-w-xs"
            >
              <div className="bg-gradient-to-br from-orange-700 to-orange-800 rounded-xl p-6 w-full border-2 border-orange-600 shadow-xl mb-4">
                <div className="flex flex-col items-center gap-3">
                  <Medal className="w-12 h-12 text-orange-400" />
                  <div className="text-4xl font-bold text-orange-400">3</div>
                  <div className="text-lg font-semibold text-white text-center">{topThree[2].name}</div>
                  <div className="text-2xl font-bold text-blue-400">{topThree[2].score} pts</div>
                  {(() => {
                    const rankChange = getRankChange(topThree[2].account_id);
                    if (rankChange !== null && rankChange !== 0) {
                      if (rankChange > 0) {
                        return (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1 text-green-400 text-sm font-semibold"
                          >
                            <TrendingUp className="w-5 h-5" />
                            <span>+{rankChange}</span>
                          </motion.div>
                        );
                      } else {
                        return (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1 text-red-400 text-sm font-semibold"
                          >
                            <TrendingDown className="w-5 h-5" />
                            <span>{rankChange}</span>
                          </motion.div>
                        );
                      }
                    }
                    return null;
                  })()}
                </div>
              </div>
              <div className="w-full bg-gradient-to-br from-orange-700 to-orange-800 rounded-t-xl h-24 border-2 border-orange-600 flex items-center justify-center">
                <span className="text-5xl font-bold text-orange-400">3</span>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Rest of leaderboard */}
      {restOfTeams.length > 0 && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <AnimatePresence mode="popLayout">
                  {restOfTeams.map((entry) => (
                    <motion.tr
                      key={entry.account_id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-bold text-gray-300">#{entry.pos}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">{entry.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-blue-400">{entry.score}</div>
                      </td>
                      <td className="px-6 py-4">
                        {(() => {
                          const rankChange = getRankChange(entry.account_id);
                          
                          if (rankChange === null || rankChange === 0) {
                            return <span className="text-gray-500 text-sm">-</span>;
                          }
                          
                          if (rankChange > 0) {
                            return (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-1 text-green-500 text-sm"
                              >
                                <TrendingUp className="w-4 h-4" />
                                <span>+{rankChange}</span>
                              </motion.div>
                            );
                          }
                          
                          return (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-1 text-red-500 text-sm"
                            >
                              <TrendingDown className="w-4 h-4" />
                              <span>{rankChange}</span>
                            </motion.div>
                          );
                        })()}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {scoreboard.length === 0 && (
        <div className="bg-gray-800 rounded-xl p-12 text-center text-gray-500 border border-gray-700">
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No scoreboard data available</p>
          <p className="text-xs mt-2">Data will load automatically...</p>
        </div>
      )}
    </div>
  );
}
