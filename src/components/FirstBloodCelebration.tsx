import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useScoreboardStore } from '../store/useScoreboardStore';
import type { FirstBloodEvent } from '../types/ctfd';

export function FirstBloodCelebration() {
  const { notifications } = useScoreboardStore();
  const [currentEvent, setCurrentEvent] = useState<FirstBloodEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const firstBloodNotifs = notifications.filter(n => n.type === 'first_blood' && !n.read);
    if (firstBloodNotifs.length > 0) {
      const latestEvent = firstBloodNotifs[0].data as FirstBloodEvent;
      setCurrentEvent(latestEvent);
      setShow(true);

      const timer = setTimeout(() => {
        setShow(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  return (
    <AnimatePresence>
      {show && currentEvent && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: -100 }}
          className="fixed bottom-8 right-8 z-50 max-w-md"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(239, 68, 68, 0.5)',
                '0 0 40px rgba(239, 68, 68, 0.8)',
                '0 0 20px rgba(239, 68, 68, 0.5)',
              ],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-6 shadow-2xl border-2 border-red-400"
          >
            <div className="flex items-start gap-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Trophy className="w-12 h-12 text-yellow-300" />
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <h3 className="text-white font-bold text-lg">FIRST BLOOD!</h3>
                </div>
                <p className="text-white/90 text-sm mb-1">
                  <span className="font-semibold">{currentEvent.userName}</span> scored first blood on
                </p>
                <p className="text-white font-semibold">{currentEvent.challengeName}</p>
                <p className="text-yellow-300 text-sm mt-1">+{currentEvent.value} points</p>
              </div>
            </div>

            {/* Particle effects */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 1,
                  x: Math.cos((i * Math.PI * 2) / 8) * 100,
                  y: Math.sin((i * Math.PI * 2) / 8) * 100,
                }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
