// default props will be depricated with the use of es6 defaults
/* eslint-disable react/require-default-props */
import React, { useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Grid } from "antd";
import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";
import generatePicker from "antd/lib/date-picker/generatePicker";

import { isXS, isSM } from "../utils";

const DatePicker = generatePicker(dayjsGenerateConfig);

const { useBreakpoint } = Grid;
const DatePickerComponent = React.forwardRef(
  (
    {
      suffixIcon = null,
      block = false,
      size = "large",
      footer = true,
      error = null,
      format = "MMM DD, YYYY",
      className = "",
      onChange = () => null,
      ...attributes
    },
    ref
  ) => {
    DatePickerComponent.propTypes = {
      error: PropTypes.bool,
      suffixIcon: PropTypes.element,
      size: PropTypes.string,
      block: PropTypes.bool,
      className: PropTypes.string,
      onChange: PropTypes.func,
      format: PropTypes.string,
      footer: PropTypes.bool
    };
    const divRef = useRef();
    const screens = useBreakpoint();
    const classes = classNames(
      className,
      { "ant-picker-error": error },
      { block }
    );
    const footerClass = classNames({ "ant-picker-no-footer": !footer });

    return (
      <>
        <DatePicker
          inputReadOnly={isXS(screens) || isSM(screens)}
          suffixIcon={suffixIcon}
          getPopupContainer={() => divRef.current}
          format={format}
          size={size}
          {...attributes}
          className={classes}
          ref={ref}
          onChange={onChange}
          mode="date"
        />
        <div className={footerClass} ref={divRef} />
      </>
    );
  }
);
export default DatePickerComponent;
