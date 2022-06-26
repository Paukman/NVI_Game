/* eslint-disable */
import React from "react";
import Icon from "..";

const EmailSVG = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24">
            <g fill="none" fillRule="evenodd">
                <path d="M0 0h24v24H0z" />
                <path fill="#63666A" d="M4 17V9.179l7.47 4.669a1.002 1.002 0 0 0 1.06 0L20 9.178V17H4zm14.113-9L12 11.82 5.887 8h12.226zM4 6c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2H4z" />
            </g>
        </svg>
    );
};

const Email = props => <Icon component={EmailSVG} {...props} />;
export default Email;
