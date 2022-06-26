import React from "react";
import Icon from "..";

const ExclamationBlueCircleSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <path
        fill="#005EB8"
        fillRule="evenodd"
        d="M8 0c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8zm0 1.5C4.416 1.5 1.5 4.416 1.5 8s2.916 6.5 6.5 6.5 6.5-2.916 6.5-6.5S11.584 1.5 8 1.5zM8.5 7c.276 0 .5.224.5.5v4c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-4c0-.276.224-.5.5-.5h1zm0-3c.276 0 .5.224.5.5v1c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5h1z"
      />
    </svg>
  );
};

const ExclamationBlueCircle = props => (
  <Icon component={ExclamationBlueCircleSVG} {...props} />
);
export default ExclamationBlueCircle;