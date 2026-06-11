import React, { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";

import type { ProviderProps } from "../../models/ProviderProps";
import type { NotificationContextType, NotificationItem, NotificationVariant, SetNotificationFn } from "./NotificationTypes";

import NotificationContext from "./NotificationContext";

const variantMap: Record<NotificationVariant, "success" | "info" | "warning" | "error" | "default"> = {
  danger: "error",
  info: "info",
  primary: "default",
  secondary: "default",
  success: "success",
  warning: "warning",
};

let toastIdCounter = 1;

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
    const mappedType = variant ? variantMap[variant] ?? "default" : "default";
    toast(message, {
      autoClose: duration,
      toastId,
      type: mappedType,
    });
  }, []);

  const value: NotificationContextType = useMemo(() => ({ notifications: notifs, setNotification, dismiss }), [notifs, setNotification, dismiss]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
