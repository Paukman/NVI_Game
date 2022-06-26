// default props will be depricated with the use of es6 defaults
/* eslint-disable react/require-default-props */

import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { CalendarStart } from "../Icons";
import "./styles.less";

const CalendarIcon = ({
  children = null,
  classNameGrid = "",
  classNameIcon = "",
  classNamePicker = ""
}) => {
  CalendarIcon.propTypes = {
    children: PropTypes.node,
    classNameGrid: PropTypes.string,
    classNameIcon: PropTypes.string,
    classNamePicker: PropTypes.string
  };
  const classesGrid = classNames("date-picker-icon-grid", classNameGrid);

  const classesIcon = classNames("date-picker-icon-grid-icon", classNameIcon);
  const classesPicker = classNames(
    "date-picker-icon-grid-picker",
    classNamePicker
  );

  return (
    <div className={classesGrid}>
      <div className={classesIcon}>
        <CalendarStart />
      </div>
      <div className={classesPicker}>{children}</div>
    </div>
  );
};

export default CalendarIcon;
