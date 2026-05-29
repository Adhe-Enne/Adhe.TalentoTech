import type { SVGProps, ReactElement } from "react";

const PlusCircle: (props: SVGProps<SVGSVGElement>) => ReactElement = (props) => (
  <svg aria-hidden="true" shapeRendering="geometricPrecision" viewBox="0 0 24 24" {...props}>
    <rect fill="currentColor" height="20" rx="5" width="20" x="2" y="2" />
    <rect fill="#000" fillOpacity={0.18} height="9" rx="1" width="2" x="11" y={7.5} />
    <rect fill="#000" fillOpacity={0.18} height="2" rx="1" width="9" x={7.5} y={11} />
  </svg>
);

export default PlusCircle;
