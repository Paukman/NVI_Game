import React from "react";
import Icon from "..";

const CloseIconSVG = () => {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16">
      <path
        fill="#63666A"
        fillOpacity=".75"
        fillRule="evenodd"
        d="M11.889 3L13 4.111 9.111 8 13 11.889 11.889 13 8 9.111 4.111 13 3 11.889 6.889 8 3 4.111 4.111 3 8 6.889 11.889 3z"
      />
    </svg>
  );
};

const CloseIcon = props => <Icon component={CloseIconSVG} {...props} />;
export default CloseIcon;
