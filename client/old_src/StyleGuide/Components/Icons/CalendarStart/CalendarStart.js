/* eslint-disable */
import React from "react";
import Icon from "..";

const CalendarStartSVG = () => {
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
      >
        <path
          d="M9 2v3h7v2h1V2h2v3h1c1.053 0 1.918.818 1.995 1.851L22 7v13a2.003 2.003 0 01-1.85 1.995L20 22H4a2.001 2.001 0 01-1.994-1.85L2 20V7c0-1.052.817-1.918 1.851-1.994L4.001 5h2v2h1V2h2zm11 7H4v11h15.997L20 9zm-10 2v4H6v-4h4zm5 0v4h-4v-4h4z"
          fill="#63666A"
          fillRule="evenodd"
        />
      </svg>

    );
};

const CalendarStart = props => (
    <Icon component={CalendarStartSVG} {...props} />
);
export default CalendarStart;
