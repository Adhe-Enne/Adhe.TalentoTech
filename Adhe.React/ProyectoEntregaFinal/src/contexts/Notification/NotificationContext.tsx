import React, { createContext } from "react";

import type { NotificationContextType } from "./Notification.Types";

const NotificationContext: React.Context<NotificationContextType | undefined> = createContext<
  NotificationContextType | undefined
>(undefined);

export default NotificationContext;
