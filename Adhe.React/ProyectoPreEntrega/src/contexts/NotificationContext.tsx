import React, { createContext, useState, useRef, useEffect, useCallback, useMemo } from "react";

import type { ProviderProps } from "../models/ProviderProps";

export type NotificationVariant = "success" | "info" | "warning" | "danger" | "primary" | "secondary";

export type NotificationPayload = {
  message: string;
  variant?: NotificationVariant;
};

export type NotificationContextType = {
  notification: NotificationPayload | null;
  setNotification: (message: string | null, duration?: number, variant?: NotificationVariant) => void;
  dismiss: () => void;
};

type SetNotificationFn = (message: string | null, duration?: number, variant?: NotificationVariant) => void;

const NotificationContext: React.Context<NotificationContextType | undefined> = createContext<
  NotificationContextType | undefined
>(undefined);

export const NotificationProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const [notif, setNotif] = useState<NotificationPayload | null>(null);
  const atimerRef: { current: number | null } = useRef<number | null>(null);

  const dismiss: () => void = useCallback((): void => {
    if (atimerRef.current !== null) {
      globalThis.clearTimeout(atimerRef.current);
      atimerRef.current = null;
    }
    setNotif(null);
  }, []);

  const setNotification: SetNotificationFn = useCallback(
    (message: string | null, duration = 3000, variant?: NotificationVariant): void => {
      // clear any existing timer
      if (atimerRef.current !== null) {
        globalThis.clearTimeout(atimerRef.current);
        atimerRef.current = null;
      }

      setNotif(message ? { message, variant } : null);

      if (message !== null) {
        atimerRef.current = globalThis.setTimeout((): void => {
          setNotif(null);
          atimerRef.current = null;
        }, duration) as unknown as number;
      }
    },
    [],
  );

  useEffect((): (() => void) => {
    return (): void => {
      if (atimerRef.current !== null) {
        globalThis.clearTimeout(atimerRef.current);
        atimerRef.current = null;
      }
    };
  }, []);

  const value: NotificationContextType = useMemo(
    () => ({ notification: notif, setNotification, dismiss }),
    [notif, setNotification, dismiss],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export default NotificationContext;
