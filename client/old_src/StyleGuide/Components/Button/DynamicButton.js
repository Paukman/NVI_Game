import React, { forwardRef } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { Button } from "StyleGuide/Components";
import useResponsive from "utils/hooks/useResponsive";
import "./DynamicButton.less";

const DynamicButton = forwardRef(
  (
    {
      block,
      blockBreakpoint = "sm",
      children,
      className = "",
      icon = null,
      loading = false,
      ...props
    },
    ref
  ) => {
    DynamicButton.propTypes = {
      block: PropTypes.bool,
      blockBreakpoint: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", "xxl"]),
      className: PropTypes.string,
      children: PropTypes.node,
      icon: PropTypes.node,
      loading: PropTypes.bool
    };
    const { screenIsAtMost } = useResponsive();

    const isBlock = () => block || screenIsAtMost(blockBreakpoint);

    const renderIcon = () => (
      <span
        className={`dynamic-button__icon ${
          loading ? "dynamic-button--hidden" : ""
        }`}
      >
        {icon}
      </span>
    );

    return (
      <Button
        {...props}
        block={isBlock()}
        icon={icon && renderIcon()}
        ref={ref}
        className={`dynamic-button ${
          loading ? "ant-btn-loading" : ""
        } ${className}`}
      >
        <span className={`${loading ? "dynamic-button--hidden" : ""}`}>
          {children}
        </span>
        {loading && (
          <span
            className="dynamic-button__spinner"
            data-testid="dynamic-button-spinner"
          >
            <LoadingOutlined />
          </span>
        )}
      </Button>
    );
  }
);

export default DynamicButton;
