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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full">
      <div className="px-4 py-3 border-b border-gray-100 font-semibold bg-white flex items-center gap-2">
        <span className={iconColor}>{icon}</span>
        <h5 className="mb-0">{title}</h5>
      </div>
      <div className="p-4">
        {children}
        {footer && <div className="flex justify-between pt-2 border-t border-gray-100">{footer}</div>}
      </div>
    </div>
  );
};

export default DashboardCard;
