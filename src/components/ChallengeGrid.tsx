import { motion } from 'framer-motion';
import { useScoreboardStore } from '../store/useScoreboardStore';
import { Flag, Check, Lock, Users } from 'lucide-react';

export function ChallengeGrid() {
  const { challenges, solves, submissions } = useScoreboardStore();

  const getChallengeStats = (challengeId: number) => {
    // Get the challenge object
    const challenge = challenges.find(c => c.id === challengeId);
    const solveCount = challenge?.solves ?? 0;
    
    // First, try to get solves from the solves array (if available)
    const challengeSolves = solves.filter(s => s.challenge_id === challengeId);
    
    // Get correct submissions sorted by date (earliest first)
    const correctSubmissions = submissions.filter(
      s => s.challenge_id === challengeId && s.type === 'correct'
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Determine first blood - if we have solve data, use it; otherwise use submissions
    let firstBlood = null;
    if (challengeSolves.length > 0) {
      // Sort by date to get the first solve
      const sortedSolves = [...challengeSolves].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      firstBlood = sortedSolves[0];
    } else if (correctSubmissions.length > 0) {
      firstBlood = correctSubmissions[0];
    }
    
    // If challenge has solves but we don't have first blood data, 
    // it means the data hasn't loaded yet - first blood exists but isn't available
    const hasFirstBlood = firstBlood !== null || solveCount > 0;
    
    return {
      solveCount,
      firstBlood,
      hasSolves: solveCount > 0,
      hasFirstBlood,
    };
  };

  const categories = Array.from(new Set(challenges.map(c => c.category)));

  if (challenges.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-12 text-center text-gray-500 border border-gray-700">
        <Flag className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No challenges available</p>
        <p className="text-xs mt-2">Data will load automatically...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const categoryChalls = challenges.filter(c => c.category === category);
        
        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center gap-2 mb-4">
              <Flag className="w-5 h-5 text-blue-500" />
              <h3 className="text-xl font-bold text-white">{category}</h3>
              <span className="text-sm text-gray-400">({categoryChalls.length})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoryChalls.map((challenge) => {
                const stats = getChallengeStats(challenge.id);
                
                return (
                  <motion.div
                    key={challenge.id}
                    whileHover={{ scale: 1.02 }}
                    className={`
                      relative p-4 rounded-lg border cursor-pointer transition-all
                      ${stats.hasSolves
                        ? 'bg-green-900/20 border-green-700 hover:bg-green-900/30'
                        : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                      }
                    `}
                  >
                    {/* First blood indicator */}
                    {stats.hasFirstBlood && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2"
                      >
                        <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          🩸
                        </div>
                      </motion.div>
                    )}

                    {/* Challenge name */}
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-semibold text-sm leading-tight">
                        {challenge.name}
                      </h4>
                      {challenge.state === 'hidden' && (
                        <Lock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      )}
                    </div>

                    {/* Points */}
                    <div className="text-blue-400 font-bold mb-2">{challenge.value} pts</div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Users className="w-3 h-3" />
                        <span>{stats.solveCount} solves</span>
                      </div>
                      {stats.hasSolves && (
                        <div className="flex items-center gap-1 text-green-500">
                          <Check className="w-3 h-3" />
                          <span>Solved</span>
                        </div>
                      )}
                    </div>

                    {/* First blood info */}
                    {stats.hasFirstBlood && (
                      <div className="mt-2 pt-2 border-t border-gray-600 text-xs text-gray-400">
                        {stats.firstBlood ? (
                          <>
                            🩸 {typeof stats.firstBlood.user === 'string' 
                              ? stats.firstBlood.user 
                              : stats.firstBlood.user?.name || 'Unknown'}
                          </>
                        ) : (
                          <span className="text-gray-500">🩸 Loading...</span>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}

      {challenges.length === 0 && (
        <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
          <Flag className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-500">No challenges available</p>
          <p className="text-xs mt-2 text-gray-600">Data will load automatically...</p>
        </div>
      )}
    </div>
  );
}
