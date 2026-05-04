import { useState, useEffect, useRef, useCallback } from 'react';
import * as Haptics from 'expo-haptics';

export function useTimer() {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsRunning(false);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return clear;
  }, [isRunning, clear]);

  const start = useCallback((seconds: number) => {
    clear();
    setSecondsLeft(seconds);
    setIsRunning(true);
  }, [clear]);

  const stop = useCallback(() => {
    clear();
    setIsRunning(false);
    setSecondsLeft(0);
  }, [clear]);

  return { secondsLeft, isRunning, start, stop };
}
