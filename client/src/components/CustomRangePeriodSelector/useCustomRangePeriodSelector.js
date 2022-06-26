import { useState, useEffect } from 'react';
import { DATE_RANGE } from 'components/Dashboards/Widget/constants';

export const useCustomRangePeriodSelector = (
  initialState,
  onChange,
  selectorName,
  returnValueAsObject,
  startDate,
  endDate,
  date,
) => {
  const [periodSelectorState, updateState] = useState({
    period: initialState?.period || (!returnValueAsObject && initialState),
    startDate: initialState?.startDate || (!returnValueAsObject && startDate),
    endDate: initialState?.endDate || (!returnValueAsObject && endDate),
  });

  useEffect(() => {
    if (initialState?.period !== DATE_RANGE && date) {
      updateState((prevState) => ({
        ...prevState,
        startDate: date,
        endDate: date,
      }));
    }
  }, [date, initialState]);

  const onChangeCustomPeriodRange = (name, value) => {
    updateState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // return all as object
    if (returnValueAsObject) {
      onChange(selectorName, { ...periodSelectorState, [name]: value });
    }
    // return each value separately
    else {
      onChange(name, value);
    }
  };

  return { state: periodSelectorState, onChangeCustomPeriodRange };
};
