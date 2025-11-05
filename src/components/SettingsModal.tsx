import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScoreboardStore } from '../store/useScoreboardStore';
import { X, Settings as SettingsIcon, Volume2, VolumeX, RefreshCw } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const {
    autoRefresh,
    refreshInterval,
    soundEnabled,
    volume,
    setAutoRefresh,
    setRefreshInterval,
    setSoundEnabled,
    setVolume,
  } = useScoreboardStore();

  const [localInterval, setLocalInterval] = useState(refreshInterval / 1000);

  const handleSaveInterval = () => {
    setRefreshInterval(localInterval * 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gray-800 rounded-xl border border-gray-700 shadow-2xl z-50"
          >
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SettingsIcon className="w-6 h-6 text-blue-500" />
                  <h2 className="text-2xl font-bold text-white">Settings</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Auto Refresh */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Auto Refresh
                  </label>
                  <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`
                      relative w-12 h-6 rounded-full transition-colors
                      ${autoRefresh ? 'bg-blue-600' : 'bg-gray-600'}
                    `}
                  >
                    <motion.div
                      layout
                      className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
                      animate={{ x: autoRefresh ? 24 : 0 }}
                    />
                  </button>
                </div>
                <p className="text-xs text-gray-500">Automatically fetch new data at regular intervals</p>
              </div>

              {/* Refresh Interval */}
              {autoRefresh && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-gray-300">
                    Refresh Interval (seconds)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={localInterval}
                    onChange={(e) => setLocalInterval(Number(e.target.value))}
                    onBlur={handleSaveInterval}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500">How often to fetch new data (5-300 seconds)</p>
                </motion.div>
              )}

              {/* Sound Effects */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                    Sound Effects
                  </label>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`
                      relative w-12 h-6 rounded-full transition-colors
                      ${soundEnabled ? 'bg-blue-600' : 'bg-gray-600'}
                    `}
                  >
                    <motion.div
                      layout
                      className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
                      animate={{ x: soundEnabled ? 24 : 0 }}
                    />
                  </button>
                </div>
                <p className="text-xs text-gray-500">Play sounds for first bloods and rank changes</p>
              </div>

              {/* Volume */}
              {soundEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-gray-300">
                    Volume: {Math.round(volume * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </motion.div>
              )}
            </div>

            <div className="p-6 border-t border-gray-700">
              <p className="mb-4 text-xs text-gray-500 text-center">
                <strong>Disclaimer:</strong> We do not keep or hold any data. Your credentials are stored securely in your browser and never sent to any third party.
              </p>
              <button
                onClick={onClose}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
