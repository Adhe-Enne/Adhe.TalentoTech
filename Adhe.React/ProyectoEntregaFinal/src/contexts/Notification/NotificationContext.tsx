import { createContext, type Context } from "use-context-selector";

import type { NotificationContextType } from "./NotificationTypes";

const NotificationContext: Context<NotificationContextType | undefined> = createContext<NotificationContextType | undefined>(undefined);

export default NotificationContext;
