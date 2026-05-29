import type { SVGProps, ReactElement } from "react";

const CreditCard: (props: SVGProps<SVGSVGElement>) => ReactElement = (props) => (
  <svg aria-hidden="true" shapeRendering="geometricPrecision" viewBox="0 0 24 24" {...props}>
    <rect fill="currentColor" height="14" rx="3.5" width="20" x="2" y="5" />
    <rect fill="#000" fillOpacity={0.18} height="2.2" rx="0.8" width="6" x="3.5" y="9.5" />
    <rect fill="#000" fillOpacity={0.18} height="2.6" rx="0.5" width="3" x="16" y="10.5" />
  </svg>
);

export default CreditCard;
