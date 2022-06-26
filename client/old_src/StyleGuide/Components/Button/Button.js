// default props will be depricated with the use of es6 defaults
/* eslint-disable react/require-default-props */

import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Button } from "antd";

import { LoadingOutlined } from "@ant-design/icons";

const buttonTypes = types => {
  if (types.primary) {
    return "primary";
  }
  if (types.secondary) {
    return null;
  }
  if (types.text) {
    return "text";
  }
  if (types.link) {
    return "link";
  }
  return null;
};

const buttonShapes = shapes => {
  if (shapes.circle) {
    return "circle";
  }
  if (shapes.square) {
    return null;
  }
  return "round";
};

const ButtonComponent = React.forwardRef(
  (
    {
      children = null,
      loading = false,
      primary = false,
      text = false,
      secondary = false,
      link = false,
      unclickable = false,
      className = "",
      circle = false,
      square = false,
      block = false,
      icon = null,
      size = link ? "md-link" : "large",
      onClick = () => null,
      ...attributes
    },
    ref
  ) => {
    ButtonComponent.propTypes = {
      children: PropTypes.node,
      onClick: PropTypes.func,
      unclickable: PropTypes.bool,
      loading: PropTypes.bool,
      className: PropTypes.string,
      size: PropTypes.string,
      primary: PropTypes.bool,
      secondary: PropTypes.bool,
      text: PropTypes.bool,
      link: PropTypes.bool,
      circle: PropTypes.bool,
      square: PropTypes.bool,
      block: PropTypes.bool,
      icon: PropTypes.node
    };
    const buttonType = buttonTypes({
      primary,
      secondary,
      text,
      link
    });
    const buttonShape = buttonShapes({
      circle,
      square
    });

    const classes = classNames(className, {
      "ant-btn-secondary": secondary,
      "sm-link": link && size === "sm-link",
      "md-link": link && size === "md-link",
      "lg-link": link && size === "lg-link",
      "ant-btn-loading": loading,
      "ant-btn-primary-unclickable": unclickable && primary,
      "ant-btn-secondary-unclickable": unclickable && secondary,
      "ant-btn-text-unclickable": unclickable && text,
      "ant-btn-link-unclickable": unclickable && link
    });

    const handleOnClick = e => {
      if (unclickable || loading) {
        e.preventDefault();
        return;
      }
      onClick(e);
    };

    return (
      <Button
        {...attributes}
        ref={ref}
        size={size}
        block={block}
        shape={!link ? buttonShape : null}
        type={buttonType}
        icon={loading ? <LoadingOutlined /> : icon}
        onClick={handleOnClick}
        className={classes}
      >
        {children}
      </Button>
    );
  }
);
export default ButtonComponent;
