import React, { useState } from "react";

const useSearchBox = ({ data, minCharsSearch, SearchIcon, LoadingIcon }) => {
  const [searchBoxState, setSearchBoxState] = useState({
    suffixIcon: <SearchIcon />,
    formattedResults: [],
    noResultsFound: null
  });

  const formatResults = (str, res) => {
    const result = res.map(item => {
      // prepare each item:
      const startIx = item.toLowerCase().indexOf(str.toLowerCase());

      const value = (
        <>
          <span className="font-weight-normal">{item.substr(0, startIx)}</span>
          <span className="search-box-highlight">
            {item.substr(startIx, str.length)}
          </span>
          <span className="font-weight-normal">
            {item.substr(startIx + str.length, item.length)}
          </span>
        </>
      );
      return { value, key: item };
    });
    return result;
  };

  const handleSelected = () => {
    // clean previous results
    setSearchBoxState(state => ({
      ...state,
      formattedResults: []
    }));
  };

  const handleSearch = str => {
    let res = [];
    if (!str || str.length < minCharsSearch) {
      setSearchBoxState(state => ({
        ...state,
        formattedResults: [],
        suffixIcon: <SearchIcon />,
        noResultsFound: null
      }));
      return;
    }

    setSearchBoxState(state => ({
      ...state,
      suffixIcon: <LoadingIcon className="search-box-icon" />
    }));
    if (data) {
      res = data.filter(dataItem => {
        return dataItem.toLowerCase().indexOf(str.toLowerCase()) >= 0;
      });
    }
    if (res.length > 0) {
      setSearchBoxState(state => ({
        ...state,
        formattedResults: formatResults(str, res),
        suffixIcon: ""
      }));
    } else {
      setSearchBoxState(state => ({
        ...state,
        formattedResults: res,
        suffixIcon: <SearchIcon />,
        noResultsFound: "No results found"
      }));
    }
  };

  return [handleSearch, handleSelected, searchBoxState, formatResults];
};

export default useSearchBox;
