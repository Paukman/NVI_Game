// default props will be depricated with the use of es6 defaults
/* eslint-disable react/require-default-props */
/* eslint react/prop-types: 0 */
import React from "react";
import classNames from "classnames";

const PrefixLeftIcon = ({ component: Component, className, ...attributes }) => {
  const classes = classNames(className, "input-inline-icon-left");
  return <Component {...attributes} className={classes} />;
};

export default PrefixLeftIcon;
