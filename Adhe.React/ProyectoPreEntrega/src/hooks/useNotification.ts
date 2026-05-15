import { useContext } from "react";

import NotificationContext, { type NotificationContextType } from "../contexts/NotificationContext";

export const useNotification: () => NotificationContextType = (): NotificationContextType => {
  const ctx: NotificationContextType | undefined = useContext(NotificationContext);

  if (!ctx) {
    throw new Error("useNotification must be used within NotificationProvider");
  }

  return ctx;
};
