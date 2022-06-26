/* eslint react/require-default-props: 0 */
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const Spin = React.forwardRef((props, ref) => {
  Spin.propTypes = {
    className: PropTypes.string
  };
  const { className, ...attributes } = props;

  const classes = classNames(className || false);

  return (
    <div className={classes} {...attributes} ref={ref}>
      <svg width="38" height="38" viewBox="0 0 38 38">
        <defs>
          <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
            <stop stopColor="#9756b3" stopOpacity="0" offset="0%" />
            <stop stopColor="#9756b3" stopOpacity=".631" offset="63.146%" />
            <stop stopColor="#9756b3" offset="100%" />
          </linearGradient>
        </defs>
        <g fill="none" fillRule="evenodd">
          <g transform="translate(1 1)">
            <path
              d="M36 18c0-9.94-8.06-18-18-18"
              stroke="url(#a)"
              strokeWidth="2"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="0.9s"
                repeatCount="indefinite"
              />
            </path>
            <circle fill="#fff" cx="36" cy="18" r="1">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="0.9s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </g>
      </svg>
    </div>
  );
});

export default Spin;
