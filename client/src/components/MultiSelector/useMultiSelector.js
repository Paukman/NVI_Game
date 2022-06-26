import { useState, useEffect } from 'react';

export const useMultiSelector = (data, selectedData) => {
  const [state, setState] = useState({
    active: {},
    allActive: false,
    searchData: [],
    selectedList: [],
    searchValue: '',
  });


  const setAllActive = (data, selectedData) => {
    let allActive = false;

    if(data.length === selectedData.length) {
      allActive = true;
    } else {
      allActive = false;
    }

    return allActive;
  }

  useEffect(() => {
    const active = selectedData?.reduce((acc, { value }) => {
      acc[value] = true;
      return acc;
    }, {});

    setState((preState) => ({ ...preState, active, searchData: data, selectedList: selectedData, allActive:setAllActive(data, selectedData) }));
  }, [data, selectedData]);

  const onDelete = (id) => {
    const active = { ...state.active };
    delete active[id];
    const selected = data?.filter((val) => active[val.value]);
    setState((preState) => ({ ...preState, selectedList: selected, active,  allActive:setAllActive(data, selected) }));
  };

  const onSelectAll = (name, value) => {
    let active = state.active;
    let selectedList = state.selectedList;

    if (value) {
      const selectList = data?.reduce((acc, { value }) => {
        acc[value] = true;
        return acc;
      }, {});
      active = selectList;
      selectedList = data;
    } else {
      active = {};
      selectedList = [];
    }
    setState((preState) => ({ ...preState, selectedList, active, allActive: !preState.allActive }));
  };

  const onSearch = (name, text) => {
    let searchData = [];

    if (text) {
      const regex = new RegExp(text, 'i');
      const result = data?.filter(({ label }) => regex.test(label));
      searchData = result;
    } else {
      searchData = data;
    }
    setState((preState) => ({ ...preState, searchValue: text, searchData }));
  };

  const onListSelect = (name, value) => {
    const active = { ...state.active, [name]: value };
    const selected = data?.filter((val) => active[val.value]);
    setState((preState) => ({ ...preState, active, selectedList: selected,  allActive:setAllActive(data, selected) }));
  };

  return { state, onDelete, onSelectAll, onSearch, onListSelect };
};
