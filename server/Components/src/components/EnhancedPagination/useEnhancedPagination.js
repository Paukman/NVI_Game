import { useEffect, useState } from 'react';
import { colors } from '../../theme/colors';

export const useEnhancedPagination = (page, count, onChange) => {
  const [paginationState, updatePaginationState] = useState({
    pageNo: page,
    goToPage: '',
    iconColor: colors.grey,
    leftButtonColors: colors.darkGray,
    rightButtonColors: colors.darkGray,
    leftButtonsDisabled: true,
    rightButtonsDisabled: false,
  });

  useEffect(() => {
    updatePaginationState((state) => ({
      ...state,
      leftButtonsDisabled: page === 1 ? true : false,
      rightButtonsDisabled: (page === 1 && count === 1) || page === count ? true : false,
    }));
  }, [page, count]);

  const handleGoToPageInpput = (_, value) => {
    const regex = /^0*[1-9]\d*$/;
    const matching = value.match(regex);

    if ((matching && Number(value) >= 1 && Number(value) <= count) || value === '') {
      updatePaginationState((state) => ({
        ...state,
        goToPage: value,
        iconColor: value === '' ? colors.grey : colors.blue,
      }));
    }
  };

  const onChangePage = (_, page) => {
    // jsut to cover case if number remains but no page exists
    if (page === '' || page < 1 || page > count) {
      return;
    }
    updatePaginationState((state) => ({
      ...state,
      pageNo: Number(page),
      iconColor: colors.grey,
    }));
    onChange(Number(page));
  };

  const updateState = (name, value) => {
    updatePaginationState((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const onHandleLeftButtons = (name, value) => {
    switch (value.clickId) {
      case 'first': {
        onChange(1);
        updatePaginationState((state) => ({
          ...state,
          leftButtonsDisabled: true,
          rightButtonsDisabled: false,
        }));
        break;
      }
      case 'left': {
        if (page > 1) {
          onChange(page - 1);
          updatePaginationState((state) => ({
            ...state,
            leftButtonsDisabled: page - 1 === 1 ? true : false,
            rightButtonsDisabled: false,
          }));
        }
      }
    }
  };
  const onHandleRightButtons = (name, value) => {
    switch (value.clickId) {
      case 'last': {
        onChange(count);
        updatePaginationState((state) => ({
          ...state,
          leftButtonsDisabled: false,
          rightButtonsDisabled: true,
        }));
        break;
      }
      case 'right': {
        if (page < count) {
          onChange(page + 1);
          updatePaginationState((state) => ({
            ...state,
            leftButtonsDisabled: page + 1 === count ? true : false,
            rightButtonsDisabled: false,
          }));
        }
      }
    }
  };

  return {
    state: paginationState,
    updateState,
    handleGoToPageInpput,
    onChangePage,
    onHandleLeftButtons,
    onHandleRightButtons,
  };
};
