/* eslint-disable */
import React from "react";
import Icon from "..";

const CheckMarkCircleSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <g fill="#008576" fillRule="evenodd">
        <path d="M8 0C3.582 0 0 3.582 0 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8m0 1.5c3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5S1.5 11.584 1.5 8 4.416 1.5 8 1.5" />
        <path d="M6.814 11.14c-.192 0-.383-.073-.53-.22L3.914 8.549l1.06-1.06 1.841 1.84 4.213-4.212 1.06 1.06-4.742 4.743c-.146.147-.338.22-.53.22" />
      </g>
    </svg>
  );
};

const CheckMarkCircle = props => (
  <Icon component={CheckMarkCircleSVG} {...props} />
);
export default CheckMarkCircle;
