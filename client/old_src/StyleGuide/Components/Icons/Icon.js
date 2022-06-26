import React from "react";
import PropTypes from "prop-types";

const Icon = ({ component: Component, className, ...props }) => {
  Icon.propTypes = {
    component: PropTypes.elementType.isRequired,
    className: PropTypes.string
  };

  const iconClassNames = className ? `anticon ${className}` : "anticon";

  return (
    <span className={iconClassNames} {...props}>
      <Component />
    </span>
  );
};

export default Icon;
