import React from "react";

import { useNotification } from "../hooks/useNotification";

const ProductNotifications: React.FC = () => {
  const { notification, dismiss } = useNotification();

  const message: string | undefined = notification ? notification.message : undefined;
  const variant: string | undefined = notification ? notification.variant : undefined;
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

export default ProductNotifications;
