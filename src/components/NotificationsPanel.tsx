import { motion, AnimatePresence } from 'framer-motion';
import { useScoreboardStore } from '../store/useScoreboardStore';
import { Bell, X, Trophy, TrendingUp, Crown, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function NotificationsPanel() {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useScoreboardStore();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'first_blood':
        return <Trophy className="w-5 h-5 text-red-500" />;
      case 'top1_change':
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'rank_change':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationMessage = (notification: any) => {
    switch (notification.type) {
      case 'first_blood':
        return (
          <>
            <span className="font-semibold text-white">{notification.data.userName}</span>
            {' '}got first blood on{' '}
            <span className="font-semibold text-white">{notification.data.challengeName}</span>
          </>
        );
      case 'top1_change':
        return (
          <>
            <span className="font-semibold text-white">{notification.data.userName}</span>
            {' '}is now in first place!
          </>
        );
      case 'rank_change':
        return (
          <>
            <span className="font-semibold text-white">{notification.data.userName}</span>
            {' '}moved from #{notification.data.oldRank} to #{notification.data.newRank}
          </>
        );
      default:
        return 'New event';
    }
  };

  const recentNotifications = notifications.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-6 h-6 text-blue-500" />
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white">Notifications</h2>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="max-h-[500px] overflow-y-auto">
        <AnimatePresence>
          {recentNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`
                p-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 transition-colors
                ${!notification.read ? 'bg-blue-900/10' : ''}
              `}
            >
              <div className="flex items-start gap-3">
                {getNotificationIcon(notification.type)}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {getNotificationMessage(notification)}
                  </p>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                  </div>
                </div>

                {!notification.read && (
                  <button
                    onClick={() => markNotificationRead(notification.id)}
                    className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl p-12 text-center text-gray-500 border border-gray-700">
          <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No notifications yet</p>
        </div>
      )}
    </div>
  );
}