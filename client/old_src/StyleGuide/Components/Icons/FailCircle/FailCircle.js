/* eslint-disable */
import React from "react";
import Icon from "..";

const FailCircleVG = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
        >
            <g fill="#EB0042" fillRule="evenodd">
                <path d="M8 0C3.582 0 0 3.582 0 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8m0 1.5c3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5S1.5 11.584 1.5 8 4.416 1.5 8 1.5" />
                <path d="M11.359 5.702L10.298 4.641 8 6.94 5.702 4.641 4.641 5.702 6.94 8 4.641 10.299 5.702 11.359 8 9.061 10.298 11.359 11.359 10.299 9.061 8z" />
            </g>
        </svg>
    );
};

const FailCircle = props => <Icon component={FailCircleVG} {...props} />;
export default FailCircle;
