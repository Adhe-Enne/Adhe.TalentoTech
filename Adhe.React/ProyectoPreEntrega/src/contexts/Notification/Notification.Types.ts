export type NotificationVariant = "success" | "info" | "warning" | "danger" | "primary" | "secondary";

export type NotificationItem = {
  id: number;
  message: string;
  variant?: NotificationVariant;
};

export type NotificationContextType = {
  notifications: NotificationItem[];
  setNotification: (message: string | null, duration?: number, variant?: NotificationVariant) => void;
  dismiss: (id?: number) => void;
};

export type SetNotificationFn = (message: string | null, duration?: number, variant?: NotificationVariant) => void;
