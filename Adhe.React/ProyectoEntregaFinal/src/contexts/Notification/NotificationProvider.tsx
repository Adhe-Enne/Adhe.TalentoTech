import React, { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";

import type { ProviderProps } from "../../types/ProviderProps";
import type { NotificationContextType, NotificationItem, NotificationVariant, SetNotificationFn } from "./NotificationTypes";

import NotificationContext from "./NotificationContext";

type ToastType = "success" | "info" | "warning" | "error" | "default";

const variantMap: Record<NotificationVariant, ToastType> = {
  danger: "error",
  info: "info",
  primary: "default",
  secondary: "default",
  success: "success",
  warning: "warning",
};

let toastIdCounter: number = 1;

export const NotificationProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const [notifs] = useState<NotificationItem[]>([]);

  const dismiss: (id?: number) => void = useCallback((id?: number) => {
    if (id === undefined) {
      toast.dismiss();
    } else {
      toast.dismiss(id);
    }
  }, []);

  const setNotification: SetNotificationFn = useCallback((message: string | null, duration = 3000, variant?: NotificationVariant): void => {
    if (message === null) {
      return;
    }
    const toastId: number = toastIdCounter++;
    const mappedType: ToastType = variant ? (variantMap[variant] ?? "default") : "default";
    toast(message, {
      autoClose: duration,
      toastId,
      type: mappedType,
    });
  }, []);

  const value: NotificationContextType = useMemo(() => ({ notifications: notifs, setNotification, dismiss }), [notifs, setNotification, dismiss]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
