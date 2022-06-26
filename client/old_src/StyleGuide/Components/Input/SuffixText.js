// default props will be depricated with the use of es6 defaults
/* eslint-disable react/require-default-props */
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Typography } from "antd";

const { Text } = Typography;

const SuffixText = ({ children, className, ...attributes }) => {
  SuffixText.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };
  const classes = classNames(className, "font-size-14");
  return (
    <Text {...attributes} className={classes}>
      {children}
    </Text>
  );
};

export default SuffixText;
