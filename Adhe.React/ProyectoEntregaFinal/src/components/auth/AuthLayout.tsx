import React from "react";

import HelmetMeta from "../ui/HelmetMeta";

const pageStyles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 120px)",
    padding: "2rem 1rem",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  card: {
    maxWidth: 420,
    width: "100%",
  },
} as const;

interface AuthLayoutProps {
  children: React.ReactNode;
  helmetDescription: string;
  helmetTitle: string;
  title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = (props: AuthLayoutProps) => {
  const { children, helmetDescription, helmetTitle, title } = props;

  return (
    <>
      <HelmetMeta description={helmetDescription} title={helmetTitle} />
      <div style={pageStyles.page}>
        <div className="card shadow-sm" style={pageStyles.card}>
          <div className="card-body p-4">
            <h2 className="card-title text-center mb-4">{title}</h2>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
