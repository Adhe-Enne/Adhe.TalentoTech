import React from "react";

import HelmetMeta from "../ui/HelmetMeta";

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
      <div className="flex justify-center items-center min-h-[calc(100vh-120px)] p-8" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
