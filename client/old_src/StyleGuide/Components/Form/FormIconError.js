// default props will be depricated with the use of es6 defaults
/* eslint-disable react/require-default-props */
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const FormIconError = React.forwardRef(
  ({ children, className = "", ...restProps }, ref) => {
    FormIconError.propTypes = {
      children: PropTypes.node,
      className: PropTypes.string
    };
    const classes = classNames(className, "error-icon-before");
    return (
      <div ref={ref} className={classes} {...restProps}>
        {children}
      </div>
    );
  }
);

export default FormIconError;
