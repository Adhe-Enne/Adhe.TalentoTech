import React from "react";
import { Helmet } from "react-helmet-async";

interface HelmetMetaProps {
  title: string;
  description?: string;
}

const HelmetMeta: React.FC<HelmetMetaProps> = (props) => {
  const { title, description } = props;
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta content={description} name="description" />}
    </Helmet>
  );
};

export default HelmetMeta;
