// default props will be depricated with the use of es6 defaults
/* eslint-disable react/require-default-props */
import React from "react";
import PropTypes from "prop-types";

const PrefixText = ({ children = null }) => {
  PrefixText.propTypes = {
    children: PropTypes.node
  };
  return <span className="input-prefix-text">{children}</span>;
};

export default PrefixText;
