import React, { type ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  action?: ReactNode;
  icon?: ReactNode;
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = (props) => {
  const { action, icon, message, title } = props;

  return (
    <div className="text-center py-12">
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <h4 className="text-gray-900 mb-2">{title}</h4>
      {message && <p className="text-muted text-sm max-w-md mx-auto mb-6">{message}</p>}
      {action}
    </div>
  );
};

export default EmptyState;
