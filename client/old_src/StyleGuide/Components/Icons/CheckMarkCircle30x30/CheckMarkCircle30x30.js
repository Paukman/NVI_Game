import React from "react";
import Icon from "..";

const CheckMarkCircle30x30SVG = () => {
  return (
    <svg width={30} height={30} viewBox="0 0 30 30">
      <g fill="none" fillRule="evenodd">
        <path
          stroke="#008576"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.375 15.083l4.75 4.75L21.25 9.541"
        />
        <path
          fill="#008576"
          d="M15 0C6.716 0 0 6.716 0 15c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15m0 1.25c7.582 0 13.75 6.168 13.75 13.75S22.582 28.75 15 28.75 1.25 22.582 1.25 15 7.418 1.25 15 1.25"
        />
      </g>
    </svg>
  );
};

const CheckMarkCircle30x30 = props => (
  <Icon component={CheckMarkCircle30x30SVG} {...props} />
);
export default CheckMarkCircle30x30;
