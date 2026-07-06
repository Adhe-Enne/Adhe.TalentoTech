import React from "react";

interface DashboardCardProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  title: React.ReactNode;
  footer?: React.ReactNode;
  iconColor?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = (props) => {
  const { children, footer, icon, iconColor = "primary", title } = props;

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-white d-flex align-items-center gap-2">
        <span className={`text-${iconColor}`}>{icon}</span>
        <h5 className="mb-0">{title}</h5>
      </div>
      <div className="card-body">
        {children}
        {footer && <div className="d-flex justify-content-between pt-2 border-top">{footer}</div>}
      </div>
    </div>
  );
};

export default DashboardCard;
