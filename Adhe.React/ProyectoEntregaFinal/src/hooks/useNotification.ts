import { useContextSelector } from "use-context-selector";

import type { NotificationContextType } from "../contexts/Notification/NotificationTypes";

import NotificationContext from "../contexts/Notification/NotificationContext";

const useNotification: () => NotificationContextType = (): NotificationContextType => {
  const notifications: NotificationContextType["notifications"] | undefined = useContextSelector(NotificationContext, (c) => c?.notifications);
  const setNotification: NotificationContextType["setNotification"] | undefined = useContextSelector(NotificationContext, (c) => c?.setNotification);
  const dismiss: NotificationContextType["dismiss"] | undefined = useContextSelector(NotificationContext, (c) => c?.dismiss);

  if (notifications === undefined || setNotification === undefined || dismiss === undefined) {
    throw new Error("useNotification must be used within NotificationProvider");
  }

  return { notifications, setNotification, dismiss };
};

export default useNotification;
