import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CTFDConfig,
  CTFDChallenge,
  CTFDSolve,
  CTFDSubmission,
  ScoreboardEntry,
  FirstBloodEvent,
  RankChange,
  EventNotification,
} from '../types/ctfd';
import { CTFDApiClient } from '../lib/ctfd-api';

interface ScoreboardState {
  // Configuration
  config: CTFDConfig | null;
  isAuthenticated: boolean;
  
  // Data
  scoreboard: ScoreboardEntry[];
  challenges: CTFDChallenge[];
  solves: CTFDSolve[];
  submissions: CTFDSubmission[];
  
  // Events
  firstBloods: FirstBloodEvent[];
  rankChanges: RankChange[];
  notifications: EventNotification[];
  unreadCount: number;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  lastUpdate: number | null;
  autoRefresh: boolean;
  refreshInterval: number;
  soundEnabled: boolean;
  volume: number;
  theme: 'dark' | 'light';
  
  // Actions
  setConfig: (config: CTFDConfig) => void;
  clearConfig: () => void;
  loadDemoData: () => void;
  setScoreboard: (scoreboard: ScoreboardEntry[]) => void;
  setChallenges: (challenges: CTFDChallenge[]) => void;
  setSolves: (solves: CTFDSolve[]) => void;
  setSubmissions: (submissions: CTFDSubmission[]) => void;
  addFirstBlood: (event: FirstBloodEvent) => void;
  addRankChange: (change: RankChange) => void;
  addNotification: (notification: EventNotification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLastUpdate: (timestamp: number) => void;
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (interval: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  reset: () => void;
}

const initialState = {
  config: null,
  isAuthenticated: false,
  scoreboard: [],
  challenges: [],
  solves: [],
  submissions: [],
  firstBloods: [],
  rankChanges: [],
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  lastUpdate: null,
  autoRefresh: true,
  refreshInterval: 10000,
  soundEnabled: true,
  volume: 0.5,
  theme: 'dark' as const,
};

export const useScoreboardStore = create<ScoreboardState>()(
  persist(
    (set) => ({
      ...initialState,

      setConfig: (config) => set({ config, isAuthenticated: true, error: null }),
      
      clearConfig: () => set({ 
        config: null, 
        isAuthenticated: false,
        scoreboard: [],
        challenges: [],
        solves: [],
        submissions: [],
        error: null,
      }),

      loadDemoData: () => set({ 
        config: { instanceUrl: 'https://demo.ctfd.io', apiKey: 'demo_key' }, 
        isAuthenticated: true,
        scoreboard: [],
        challenges: [],
        solves: [],
        submissions: [],
        error: null,
      }),

      setScoreboard: (scoreboard) => {
        set((state) => {
          const oldScoreboard = state.scoreboard;
          const newRankChanges: RankChange[] = [];
          const newNotifications: EventNotification[] = [];
          
          // Detect rank changes
          scoreboard.forEach((entry) => {
            const oldEntry = oldScoreboard.find(e => e.account_id === entry.account_id);
            if (oldEntry && oldEntry.pos !== entry.pos) {
              const change: RankChange = {
                userId: entry.account_id,
                userName: entry.name,
                oldRank: oldEntry.pos,
                newRank: entry.pos,
                timestamp: new Date().toISOString(),
              };
              newRankChanges.push(change);
              
              const notification: EventNotification = {
                id: `rank_${Date.now()}_${entry.account_id}`,
                type: entry.pos === 1 ? 'top1_change' : 'rank_change',
                timestamp: change.timestamp,
                read: false,
                data: change,
              };
              newNotifications.push(notification);
            }
          });

          return {
            scoreboard,
            rankChanges: [...newRankChanges, ...state.rankChanges].slice(0, 50),
            notifications: [...newNotifications, ...state.notifications],
            unreadCount: state.unreadCount + newNotifications.length,
          };
        });
      },

      setChallenges: (challenges) => set({ challenges }),
      
      setSolves: (solves) => {
        set((state) => {
          const oldSolves = state.solves;
          const newFirstBloods: FirstBloodEvent[] = [];
          const newNotifications: EventNotification[] = [];
          
          // Detect first bloods
          solves.forEach((solve) => {
            const challengeSolves = solves.filter(s => s.challenge_id === solve.challenge_id);
            const isFirstBlood = challengeSolves.length === 1 || 
              challengeSolves.every(s => s.id >= solve.id || s.id === solve.id);
            
            const alreadyTracked = oldSolves.some(s => s.id === solve.id);
            
            if (isFirstBlood && !alreadyTracked && !state.firstBloods.some(fb => fb.challengeId === solve.challenge_id)) {
              const event: FirstBloodEvent = {
                id: `fb_${solve.id}`,
                challengeId: solve.challenge_id,
                challengeName: solve.challenge.name,
                category: solve.challenge.category,
                userId: solve.user_id,
                userName: solve.user.name,
                timestamp: solve.date,
                value: solve.challenge.value,
              };
              newFirstBloods.push(event);
              
              const notification: EventNotification = {
                id: `fb_notif_${solve.id}`,
                type: 'first_blood',
                timestamp: solve.date,
                read: false,
                data: event,
              };
              newNotifications.push(notification);
            }
          });

          return {
            solves,
            firstBloods: [...newFirstBloods, ...state.firstBloods].slice(0, 50),
            notifications: [...newNotifications, ...state.notifications],
            unreadCount: state.unreadCount + newNotifications.length,
          };
        });
      },

      setSubmissions: (submissions) => set({ submissions }),

      addFirstBlood: (event) => 
        set((state) => ({
          firstBloods: [event, ...state.firstBloods].slice(0, 50),
        })),

      addRankChange: (change) =>
        set((state) => ({
          rankChanges: [change, ...state.rankChanges].slice(0, 50),
        })),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        })),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),

      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setLastUpdate: (lastUpdate) => set({ lastUpdate }),
      setAutoRefresh: (autoRefresh) => set({ autoRefresh }),
      setRefreshInterval: (refreshInterval) => set({ refreshInterval }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setVolume: (volume) => set({ volume }),
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
      reset: () => set(initialState),
    }),
    {
      name: 'ctfd-scoreboard-storage',
      partialize: (state) => ({
        config: state.config,
        isAuthenticated: state.isAuthenticated,
        autoRefresh: state.autoRefresh,
        refreshInterval: state.refreshInterval,
        soundEnabled: state.soundEnabled,
        volume: state.volume,
        theme: state.theme,
      }),
    }
  )
);
