/* eslint-disable */
import React from "react";
import Icon from "StyleGuide/Components/Icons";

const UUID = `7a70fe90-07cc-4ce9-a4fd-a75651251fba`;
const LoginBrandAreaSVG = () => {
    return (
        <svg width="604px" height="814px" viewBox="0 0 604 814" >
            <defs>
                <linearGradient x1="77.5292939%" y1="0%" x2="33.9029778%" y2="79.2361698%" id={`${UUID}linearGradient-1`}>
                    <stop stopColor="#71C5E8" offset="0%"></stop>
                    <stop stopColor="#A25CBF" offset="100%"></stop>
                </linearGradient>
                <rect id={`${UUID}path-2`} x="0" y="0" width="604" height="814"></rect>
            </defs>
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g transform="translate(-420.000000, 0.000000)">
                    <g id="Group" transform="translate(420.000000, 0.000000)">
                        <g>
                            <mask fill="white">
                                <use xlinkHref={`#${UUID}path-2`}></use>
                            </mask>
                            <use fill={`url(#${UUID}linearGradient-1)`} fillRule="nonzero" xlinkHref={`#${UUID}path-2`}></use>
                        </g>
                        <g transform="translate(87.000000, 141.000000)" fill="#FFFFFF" fontFamily="Sentinel-Bold, Sentinel" fontSize="60" fontWeight="bold" linespacing="73">
                            <text>
                                <tspan x="0" y="48">Welcome to </tspan>
                                <tspan x="0" y="121">ATB Personal </tspan>
                                <tspan x="0" y="194">Banking</tspan>
                            </text>
                        </g>
                    </g>
                </g>
            </g>
        </svg >
    );
};

const LoginBrandArea = props => (
    <Icon component={LoginBrandAreaSVG} {...props} />
);
export default LoginBrandArea;
