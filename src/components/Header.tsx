import { useState } from 'react';
import { motion } from 'framer-motion';
import { useScoreboardStore } from '../store/useScoreboardStore';
import { Shield, Settings, LogOut, Bell, RefreshCw, Activity } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  const { clearConfig, unreadCount, lastUpdate, isLoading } = useScoreboardStore();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    if (confirm('Are you sure you want to disconnect?')) {
      clearConfig();
    }
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-30 backdrop-blur-lg bg-opacity-90">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Shield className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold text-white">CTFD Scoreboard</h1>
              <p className="text-xs text-gray-400">Real-time competition tracking</p>
            </div>
          </motion.div>

          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg">
            <motion.div
              animate={{
                scale: isLoading ? [1, 1.2, 1] : 1,
                opacity: isLoading ? [1, 0.5, 1] : 1,
              }}
              transition={{ repeat: isLoading ? Infinity : 0, duration: 1 }}
            >
              <Activity className={`w-4 h-4 ${isLoading ? 'text-blue-500' : 'text-green-500'}`} />
            </motion.div>
            <span className="text-sm text-gray-300">
              {isLoading ? 'Updating...' : 'Connected'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications Indicator */}
            <div className="relative">
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.div>
              )}
              <Bell className="w-5 h-5 text-gray-400" />
            </div>



            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSettingsClick}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-300" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-900/30 hover:bg-red-900/50 transition-colors"
              title="Disconnect"
            >
              <LogOut className="w-5 h-5 text-red-400" />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
