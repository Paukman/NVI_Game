/* eslint-disable */
import React from "react";
import Icon from "..";

const UserSVG = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24">
            <g fill="none" fillRule="evenodd">
                <g fill="#63666A">
                    <path d="M12 13c4.71 0 8 2.467 8 6v1H4v-1c0-3.533 3.29-6 8-6zm0 2c-3.008 0-5.243 1.192-5.841 3h11.683c-.598-1.808-2.834-3-5.842-3zm0-11c2.206 0 4 1.794 4 4s-1.794 4-4 4-4-1.794-4-4 1.794-4 4-4zm0 2c-1.103 0-2 .896-2 2 0 1.103.897 2 2 2s2-.897 2-2c0-1.104-.897-2-2-2z" transform="translate(-626 -394) translate(626 360) translate(0 34)" />
                </g>
            </g>
        </svg>
    );
};

const User = props => <Icon component={UserSVG} {...props} />;
export default User;
