import React from "react";
import Icon from "StyleGuide/Components/Icons";

const ExternalLinkSVG = () => {
  return (
    <svg width="24" height="24" viewBox="0 -8 24 24">
      <g fill="none" fillRule="evenodd">
        <path d="M0 0H24V24H0z" />
        <path
          fill="#005EB8"
          d="M15 1.586L13.586 3l2 2H10C7.794 5 6 6.794 6 9v1h2V9c0-1.102.897-2 2-2h5.586l-2 2L15 10.414 19.414 6 15 1.586z"
        />
        <path
          fill="#005EB8"
          d="M11 14L2 14 2 2 13 2 13 0 0 0 0 16 13 16 13 11 11 11z"
        />
      </g>
    </svg>
  );
};

const ExternalLink = props => <Icon component={ExternalLinkSVG} {...props} />;
export default ExternalLink;
