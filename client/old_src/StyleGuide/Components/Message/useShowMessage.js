// default props will be depricated with the use of es6 defaults
/* eslint-disable react/require-default-props */
import React, { useRef } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import classNames from "classnames";
import ExclamationBlueCircle from "StyleGuide/Components/Icons/ExclamationBlueCircle";
import ExclamationYellowCircle from "StyleGuide/Components/Icons/ExclamationYellowCircle";
import ExclamationRedCircle from "StyleGuide/Components/Icons/ExclamationRedCircle";
import CheckMarkCircle from "StyleGuide/Components/Icons/CheckMarkCircle";

const Content = ({ children, type, className = "" }) => {
  Content.propTypes = {
    children: PropTypes.node,
    type: PropTypes.string,
    className: PropTypes.string
  };
  const classes = classNames(className, {
    "info-message-content": type === "info",
    "success-message-content": type === "success",
    "error-message-content": type === "error",
    "warning-message-content": type === "warning"
  });

  const icon = () => {
    const style = { marginTop: "3px" };
    switch (type) {
      case "success":
        return <CheckMarkCircle style={style} />;
      case "error":
        return <ExclamationRedCircle style={style} />;
      case "warning":
        return <ExclamationYellowCircle style={style} />;
      case "info":
      default:
        return <ExclamationBlueCircle style={style} />;
    }
  };

  return (
    <div className={classes}>
      {icon()}
      <span className="message-text">{children}</span>
    </div>
  );
};
export const calcDuration = content => {
  if (typeof content !== "string") {
    return 3;
  }
  const charLength = content.replace(/\s/g, "").length;
  if (charLength < 17) {
    return 3;
  }
  if (charLength >= 17 && charLength <= 32) {
    return 6;
  }
  if (charLength >= 33) {
    return 10;
  }
  return 3;
};
const useShowMessage = () => {
  const [api, contextHolder] = message.useMessage();
  const onCloseRef = useRef();
  const show = ({
    type = "info",
    content = null,
    duration = calcDuration(content),
    onClose = () => null,
    className = "",
    top = 0,
    style = {
      marginTop: `${top}px`
    }
  }) => {
    const newStyle = {
      ...style,
      marginTop: `${top}px`
    };
    onCloseRef.current = onClose;
    api.open({
      content: <Content type={type}>{content}</Content>,
      duration,
      onClose,
      style: newStyle,
      className
    });
    return {
      type,
      content,
      duration,
      onClose,
      className,
      top,
      style,
      newStyle
    };
  };

  const close = () => {
    if (!onCloseRef.current) return;
    message.destroy();
    onCloseRef.current();
  };

  return { show, close, api, contextHolder };
};

export default useShowMessage;
