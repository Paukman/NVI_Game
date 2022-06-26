/* eslint-disable react/prop-types */
import React, { useRef } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Select } from "antd";
import SelectComponent from "./Select";

import useSearchBox from "./useSearchBox";
import { Search } from "../Icons";

const { Option } = Select;

const SearchBox = ({
  children = null,
  data = [],
  minCharsSearch = 3,
  placeholder = "Enter payee",
  className = "",
  ...attributes
}) => {
  const [handleSearch, handleSelected, searchBoxState] = useSearchBox({
    data,
    minCharsSearch,
    SearchIcon: Search,
    LoadingIcon: LoadingOutlined
  });

  const handleOnChange = str => {
    return handleSearch(str);
  };

  const divRef = useRef();

  return (
    <>
      <SelectComponent
        {...attributes}
        placeholder={placeholder}
        onSearch={handleOnChange}
        suffixIcon={searchBoxState.suffixIcon}
        notFoundContent={searchBoxState.noResultsFound}
        className={className}
        onSelect={handleSelected}
      >
        {children ||
          searchBoxState.formattedResults.map(item => (
            <Option key={item.key}>{item.value}</Option>
          ))}
      </SelectComponent>
      <div ref={divRef} />
    </>
  );
};

export default SearchBox;
