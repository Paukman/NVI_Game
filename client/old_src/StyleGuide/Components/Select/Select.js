/* eslint-disable react/require-default-props */
import React, { useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Select } from "antd";

import CaretDownOutlined from "../Icons/CaretDownOutilned";

const SelectComponent = React.forwardRef(
  (
    {
      children = null,
      suffixIcon = CaretDownOutlined,
      placeholder = "Please select",
      notFoundContent = "No results found",
      showSearch = true,
      optionGroup = false,
      block = true,
      className = "",
      size = "large",
      filterOption = (input, option) =>
        option.props.value?.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
        option.props.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0,
      ...attributes
    },
    ref
  ) => {
    SelectComponent.propTypes = {
      children: PropTypes.node,
      suffixIcon: PropTypes.node,
      placeholder: PropTypes.string,
      notFoundContent: PropTypes.string,
      showSearch: PropTypes.bool,
      optionGroup: PropTypes.bool,
      block: PropTypes.bool,
      className: PropTypes.string,
      size: PropTypes.string,
      footer: PropTypes.bool,
      filterOption: PropTypes.func
    };

    const classes = classNames(className, { block });
    const divRef = useRef();

    return (
      <>
        <Select
          {...attributes}
          ref={ref}
          notFoundContent={notFoundContent}
          suffixIcon={suffixIcon}
          placeholder={placeholder}
          showSearch={showSearch}
          size={size}
          filterOption={filterOption}
          className={classes}
          dropdownClassName={optionGroup ? "with-option" : ""}
          dropdownAlign={{
            offset: [0, 0], // align offset, no gap when dropdown is open
            overflow: { adjustX: true, adjustY: false } // disable flip on y side
          }}
          getPopupContainer={() => divRef.current}
        >
          {children}
        </Select>
        <div ref={divRef} />
      </>
    );
  }
);
export default SelectComponent;
