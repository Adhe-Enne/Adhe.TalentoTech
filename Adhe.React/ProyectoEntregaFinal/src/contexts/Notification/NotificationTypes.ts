export type NotificationVariant = "success" | "info" | "warning" | "danger" | "primary" | "secondary";

export type NotificationContextType = {
  setNotification: (message: string | null, duration?: number, variant?: NotificationVariant) => void;
};

export type SetNotificationFn = (message: string | null, duration?: number, variant?: NotificationVariant) => void;
