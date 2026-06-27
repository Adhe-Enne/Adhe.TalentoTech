import type { NotificationContextType } from "../../contexts/Notification/NotificationContext";

import NotificationContext from "../../contexts/Notification/NotificationContext";
import { createSelectorHook } from "./factory";

const useNotification: () => NotificationContextType = createSelectorHook(NotificationContext, "Notification");

export default useNotification;
