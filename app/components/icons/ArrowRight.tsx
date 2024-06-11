import React from "react";
import { IIconProps } from "./interface";

export default function ArrowRight({
  width,
  height,
  fill,
  onClick,
}: IIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <g clip-path="url(#clip0_373_2353)">
        <path
          d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z"
          fill={fill}
        />
      </g>
    </svg>
  );
}
