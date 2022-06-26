// default props will be depricated with the use of es6 defaults
/* eslint-disable react/require-default-props */
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Grid } from "antd";
import { isXXL, isXL, isLG, isMD, isSM, isXS } from "../utils";
import "./styles.less";

const { useBreakpoint } = Grid;

const Container = React.forwardRef(
  ({ children, className = "", ...restProps }, ref) => {
    const screens = useBreakpoint();

    Container.propTypes = {
      children: PropTypes.node,
      className: PropTypes.string
    };

    const classes = classNames(className, {
      "container-xxl": isXXL(screens),
      "container-xl": isXL(screens),
      "container-lg": isLG(screens),
      "container-md": isMD(screens),
      "container-sm": isSM(screens),
      "container-xs": isXS(screens)
    });

    return (
      <div {...restProps} className={classes} ref={ref}>
        {children}
      </div>
    );
  }
);

export default Container;
