import React from "react";
import Icon from "..";

const ExclamationYellowCircleSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="16"
      viewBox="0 0 17 16"
    >
      <path
        fill="#F1BE48"
        fillRule="evenodd"
        d="M8.5 0c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8zm0 1.5C4.916 1.5 2 4.416 2 8s2.916 6.5 6.5 6.5S15 11.584 15 8s-2.916-6.5-6.5-6.5zm1 8.5v2h-2v-2h2zm0-6v5h-2V4h2z"
      />
    </svg>
  );
};

const ExclamationYellowCircle = props => (
  <Icon component={ExclamationYellowCircleSVG} {...props} />
);
export default ExclamationYellowCircle;
