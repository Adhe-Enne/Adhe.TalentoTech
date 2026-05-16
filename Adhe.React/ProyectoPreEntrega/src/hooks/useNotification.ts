import { useContext } from "react";

import type { NotificationContextType } from "../contexts/Notification/Notification.Types";

import NotificationContext from "../contexts/Notification/NotificationContext";

export const useNotification: () => NotificationContextType = (): NotificationContextType => {
  const ctx: NotificationContextType | undefined = useContext(NotificationContext);

  if (!ctx) {
    throw new Error("useNotification must be used within NotificationProvider");
  }

  return ctx;
};
