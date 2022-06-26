// default props will be depricated with the use of es6 defaults
/* eslint-disable react/require-default-props */

import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Input } from "antd";

const InputComponent = React.forwardRef(
  (
    {
      size = "large",
      allowClear = true,
      className = "",
      staticInput = false,
      ...restProps
    },
    ref
  ) => {
    InputComponent.propTypes = {
      size: PropTypes.string,
      allowClear: PropTypes.bool,
      staticInput: PropTypes.bool,
      className: PropTypes.string
    };

    const classes = classNames(className, {
      "lg-close-circle": size === "large" && allowClear && !staticInput,
      "ant-static-input": staticInput
    });
    const extraProps = staticInput
      ? {
          ...restProps,
          readOnly: true // antd doesn't have readonly as a prop, passed readonly as attribute
        }
      : { ...restProps };

    return (
      <Input
        {...extraProps}
        allowClear={allowClear && !staticInput}
        ref={ref}
        size={size}
        className={classes}
      />
    );
  }
);
export default InputComponent;
