import type { SVGProps, ReactElement } from "react";

const CloudUpload: (props: SVGProps<SVGSVGElement>) => ReactElement = (props) => (
  <svg aria-hidden="true" shapeRendering="geometricPrecision" viewBox="0 0 24 24" {...props}>
    <rect fill="currentColor" height="18" rx="4" width="20" x="2" y="3" />
    <g fill="#000" fillOpacity={0.18}>
      <path d="M12 8v6a1 1 0 0 1-2 0V8H8l4-4 4 4h-2z" />
      <path d="M7 14a3 3 0 0 1 0-6 4 4 0 0 1 7.5-1.5A3.5 3.5 0 0 1 19 15H7z" />
    </g>
  </svg>
);

export default CloudUpload;
