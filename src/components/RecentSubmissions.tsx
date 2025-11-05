import { motion } from 'framer-motion';
import { useScoreboardStore } from '../store/useScoreboardStore';
import { Activity, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function RecentSubmissions() {
  const { submissions, challenges, isLoading } = useScoreboardStore();

  const getChallengeName = (challengeId: number) => {
    const challenge = challenges.find(c => c.id === challengeId);
    return challenge?.name || 'Unknown Challenge';
  };

  const recentSubmissions = submissions.slice(0, 20);

  if (isLoading && submissions.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="animate-pulse space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl font-bold text-white">Recent Submissions</h2>
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        <div className="divide-y divide-gray-700">
          {recentSubmissions.map((submission, index) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className={`
                p-4 hover:bg-gray-700/50 transition-colors
                ${submission.type === 'correct' ? 'bg-green-900/10' : 'bg-red-900/10'}
              `}
            >
              <div className="flex items-start gap-3">
                {submission.type === 'correct' ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-white font-medium truncate">
                      {typeof submission.user === 'string' 
                        ? submission.user 
                        : submission.user?.name || 'Unknown User'}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(submission.date), { addSuffix: true })}
                    </div>
                  </div>

                  <div className="text-sm text-gray-400">
                    {typeof submission.challenge === 'string'
                      ? submission.challenge
                      : submission.challenge?.name || getChallengeName(submission.challenge_id)}
                  </div>

                  <div className={`
                    text-xs mt-1 font-medium
                    ${submission.type === 'correct' ? 'text-green-400' : 'text-red-400'}
                  `}>
                    {submission.type === 'correct' ? 'Correct answer' : 'Incorrect attempt'}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {submissions.length === 0 && !isLoading && (
        <div className="p-12 text-center text-gray-500">
          <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No submissions yet</p>
        </div>
      )}
    </div>
  );
}
