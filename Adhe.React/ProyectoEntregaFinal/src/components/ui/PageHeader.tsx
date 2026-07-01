import React, { type ReactNode } from "react";

interface PageHeaderProps {
  children?: ReactNode;
  className?: string;
  headingTag?: "h1" | "h2" | "h3" | "h4";
  title: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = (props) => {
  const { children, className = "mb-3", headingTag: Tag = "h2", title } = props;

  return (
    <div className={`d-flex justify-content-between align-items-center ${className}`}>
      <Tag className="mb-0">{title}</Tag>
      {children}
    </div>
  );
};

export default PageHeader;
