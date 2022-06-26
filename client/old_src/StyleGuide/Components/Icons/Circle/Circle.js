import React from "react";
import Icon from "..";

const CircleIconSVG = () => {
  return (
    <svg width="16px" height="16px" viewBox="0 0 16 16">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <path
          d="M8,0 C3.582,0 0,3.582 0,8 C0,12.418 3.582,16 8,16 C12.418,16 16,12.418 16,8 C16,3.582 12.418,0 8,0 M8,1.5 C11.584,1.5 14.5,4.416 14.5,8 C14.5,11.584 11.584,14.5 8,14.5 C4.416,14.5 1.5,11.584 1.5,8 C1.5,4.416 4.416,1.5 8,1.5"
          fill="#63666A"
        />
      </g>
    </svg>
  );
};

const Circle = props => <Icon component={CircleIconSVG} {...props} />;
export default Circle;
