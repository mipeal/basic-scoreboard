import { useState, useEffect } from 'react';
import { useScoreboardStore } from './store/useScoreboardStore';
import { useDataRefresh } from './hooks/useDataRefresh';
import { useSoundEffects } from './hooks/useSoundEffects';
import { LoginForm } from './components/LoginForm';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { Scoreboard } from './components/Scoreboard';
import { ChallengeGrid } from './components/ChallengeGrid';
import { RecentSubmissions } from './components/RecentSubmissions';
import { NotificationsPanel } from './components/NotificationsPanel';
import { SettingsModal } from './components/SettingsModal';
import { FirstBloodCelebration } from './components/FirstBloodCelebration';
import { motion } from 'framer-motion';

function App() {
  const { isAuthenticated, theme } = useScoreboardStore();
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'challenges' | 'activity'>('overview');

  // Initialize hooks
  useDataRefresh();
  useSoundEffects();



  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Header onSettingsClick={() => setShowSettings(true)} />

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <StatsCards />
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-6 flex gap-2 border-b border-gray-700">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'challenges', label: 'Challenges' },
            { id: 'activity', label: 'Activity' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                px-6 py-3 font-medium transition-colors relative
                ${activeTab === tab.id
                  ? 'text-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
                }
              `}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Scoreboard */}
              <div className="lg:col-span-2 space-y-6">
                <Scoreboard />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <NotificationsPanel />
              </div>
            </div>
          )}

          {activeTab === 'challenges' && (
            <ChallengeGrid />
          )}

          {activeTab === 'activity' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentSubmissions />
              <NotificationsPanel />
            </div>
          )}
        </motion.div>
      </main>

      {/* Modals and Overlays */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <FirstBloodCelebration />
    </div>
  );
}

export default App;
