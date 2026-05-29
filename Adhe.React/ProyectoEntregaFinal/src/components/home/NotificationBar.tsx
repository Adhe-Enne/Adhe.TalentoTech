import React from "react";

import type { NotificationItem } from "../../contexts/Notification/Notification.Types";

import { useNotification } from "../../hooks/useNotification";

const NotificationBar: React.FC = () => {
  const { notifications, dismiss } = useNotification();

  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div aria-atomic="true" aria-live="polite" className="notification-wrapper">
      <div className="container">
        <div className="notification-stack">
          {notifications.map((n: NotificationItem) => {
            const variantClass: string = n.variant ? `notification--${n.variant}` : "notification--success";
            return (
              <output aria-live="polite" className={`notification ${variantClass}`} key={n.id}>
                {n.message}
                <button aria-label="Cerrar notificación" className="notification__close" onClick={() => dismiss(n.id)}>
                  ×
                </button>
              </output>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NotificationBar;
