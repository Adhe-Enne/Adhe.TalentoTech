import { createTypedContext } from "../../utils/context";

export type NotificationVariant = "success" | "info" | "warning" | "danger" | "primary" | "secondary";

export type SetNotificationFn = (message: string | null, duration?: number, variant?: NotificationVariant) => void;

export interface NotificationContextType {
  setNotification: (message: string | null, duration?: number, variant?: NotificationVariant) => void;
}

export default createTypedContext<NotificationContextType>();
