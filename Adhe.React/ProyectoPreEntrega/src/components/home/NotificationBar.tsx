import React from "react";

import type { NotificationVariant } from "../../contexts/NotificationContext";

import { useNotification } from "../../hooks/useNotification";

const NotificationBar: React.FC = () => {
  const { notification, dismiss } = useNotification();

  const message: string | undefined = notification?.message;
  const variant: NotificationVariant | undefined = notification?.variant;

  const variantClass: string = variant ? `notification--${variant}` : "notification--success";

  if (message === undefined) {
    return null;
  }

  return (
    <div aria-live="polite" className={"notification " + variantClass} role="status">
      {message}
      <button aria-label="Cerrar notificación" className="notification__close" onClick={dismiss}>
        ×
      </button>
    </div>
  );
};

export default NotificationBar;
