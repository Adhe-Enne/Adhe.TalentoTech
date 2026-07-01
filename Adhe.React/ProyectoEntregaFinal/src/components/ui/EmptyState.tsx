import React, { type ReactNode } from "react";

interface EmptyStateProps {
  action?: ReactNode;
  icon?: ReactNode;
  message?: string;
  title: string;
}

const EmptyState: React.FC<EmptyStateProps> = (props) => {
  const { action, icon, message, title } = props;

  return (
    <div className="text-center py-5">
      {icon}
      <h4>{title}</h4>
      {message && <p className="text-muted">{message}</p>}
      {action}
    </div>
  );
};

export default EmptyState;
