import { useContextSelector } from "use-context-selector";

import type { NotificationContextType } from "../contexts/Notification/NotificationTypes";

import NotificationContext from "../contexts/Notification/NotificationContext";

const useNotification: () => NotificationContextType = (): NotificationContextType => {
  const setNotification: NotificationContextType["setNotification"] | undefined = useContextSelector(NotificationContext, (c) => c?.setNotification);

  if (setNotification === undefined) {
    throw new Error("useNotification must be used within NotificationProvider");
  }

  return { setNotification };
};

export default useNotification;
