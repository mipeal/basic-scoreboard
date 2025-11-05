import { useEffect, useRef } from 'react';
import { useScoreboardStore } from '../store/useScoreboardStore';
import { soundManager } from '../lib/sound-manager';

export function useSoundEffects() {
  const { notifications, soundEnabled, volume } = useScoreboardStore();
  const lastNotificationCount = useRef(0);

  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
    soundManager.setVolume(volume);
  }, [soundEnabled, volume]);

  useEffect(() => {
    if (notifications.length > lastNotificationCount.current) {
      const newNotifications = notifications.slice(0, notifications.length - lastNotificationCount.current);
      
      newNotifications.forEach((notification) => {
        if (!notification.read) {
          switch (notification.type) {
            case 'first_blood':
              soundManager.play('first_blood');
              break;
            case 'top1_change':
              soundManager.play('top1_change');
              break;
            case 'rank_change':
              soundManager.play('rank_change');
              break;
            default:
              soundManager.play('notification');
          }
        }
      });
    }
    
    lastNotificationCount.current = notifications.length;
  }, [notifications]);
}
