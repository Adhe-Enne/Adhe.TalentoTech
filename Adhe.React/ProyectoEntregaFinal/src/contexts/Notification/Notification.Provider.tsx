import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

import type { ProviderProps } from "../../models/ProviderProps";
import type { NotificationContextType, NotificationItem, NotificationVariant, SetNotificationFn } from "./Notification.Types";

import NotificationContext from "./NotificationContext";

export const NotificationProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const [notifs, setNotifs] = useState<NotificationItem[]>([]);
  const idRef: React.RefObject<number> = useRef<number>(1);
  const timersRef: React.RefObject<Map<number, number>> = useRef<Map<number, number>>(new Map());

  const clearTimer: (id: number) => void = useCallback((id: number) => {
    const t: number | undefined = timersRef.current.get(id);
    if (t !== undefined) {
      globalThis.clearTimeout(t);
      timersRef.current.delete(id);
    }
  }, []);

  const dismiss: (id?: number) => void = useCallback(
    (id?: number): void => {
      if (id === undefined) {
        // dismiss all
        timersRef.current.forEach((t) => globalThis.clearTimeout(t));
        timersRef.current.clear();
        setNotifs([]);
      } else {
        clearTimer(id);
        setNotifs((prev) => prev.filter((n) => n.id !== id));
      }
    },
    [clearTimer],
  );

  const removeNotification: (id: number) => void = (id: number): void => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
    timersRef.current.delete(id);
  };

  const setNotification: SetNotificationFn = useCallback((message: string | null, duration = 3000, variant?: NotificationVariant): void => {
    if (message === null) {
      return;
    }

    const id: number = idRef.current++;
    const item: NotificationItem = { id, message, variant };

    setNotifs((prev) => [item, ...prev]);

    const timer: number = globalThis.setTimeout((): void => {
      removeNotification(id);
    }, duration) as unknown as number;

    timersRef.current.set(id, timer);
  }, []);

  function clearTimers(): void {
    const timers: Map<number, number> = timersRef.current;
    timers.forEach((t) => globalThis.clearTimeout(t));
    timers.clear();
  }

  useEffect(() => {
    return (): void => {
      clearTimers();
    };
  }, []);

  const value: NotificationContextType = useMemo(() => ({ notifications: notifs, setNotification, dismiss }), [notifs, setNotification, dismiss]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
