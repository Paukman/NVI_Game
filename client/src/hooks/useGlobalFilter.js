import { useCallback, useState } from 'react';
import { getText } from 'utils/localesHelpers';
import logger from 'utils/logger';

/**
 * Use the hook to work with global filter like hotelId, date, period, etc
 */
export const globals = {
  hotelGroupId: 'hotelGroupId',
  hotelId: 'hotelId',
  fromDate: 'fromDate',
  toDate: 'toDate',
  vendorId: 'vendorId',
  poHotelId: 'hotelId',
  date: 'date',
  pnlYear: 'pnlYear',
  pnlPeriod: 'pnlPeriod',
  primaryDashboardDate: 'primaryDashboardDate',
  latestDate: 'latestDate',
};

export const defaultValues = {
  hotelGroupId: 0,
  hotelId: 0,
  poHotelId: '',
  fromDate: new Date(),
  toDate: new Date(),
  date: new Date(),
  vendorId: 'allVendors',
  pnlYear: '',
  pnlPeriod: getText('selectors.periods.MTD'),
  primaryDashboardDate: new Date().setDate(new Date().getDate() - 1),
  latestDate: new Date(),
  // add your default value here
};

const useGlobalFilter = () => {
  const [portfolio, setPortfolio] = useState(defaultValues);

  const assignGlobalValue = useCallback(
    (name, value) => {
      logger.debug('Set global value:', { name, value });
      setPortfolio((state) => ({
        ...state,
        [name]: value,
      }));
    },
    [setPortfolio],
  );

  const clearGlobalValue = useCallback(
    (name) => {
      logger.debug('Clear global value:', name);
      setPortfolio((state) => ({
        ...state,
        [name]: defaultValues[name],
      }));
    },
    [setPortfolio],
  );

  const updateHotelAndGroup = useCallback(
    ({ value, resetHotel }) => {
      logger.debug('Update hotel & group:', value);
      setPortfolio((state) => ({
        ...state,
        hotelGroupId: value?.hotelGroupId ?? 0,
        hotelId: resetHotel ? 0 : value?.hotelId ?? 0,
      }));
    },
    [setPortfolio],
  );

  const clearHotelAndGroup = useCallback(() => {
    logger.debug('Clear hotel & group');
    setPortfolio((state) => ({
      ...state,
      hotelGroupId: 0,
      hotelId: 0,
    }));
  }, [setPortfolio]);

  const selectHotelId = useCallback(
    (id) => {
      logger.debug('Select property:', id);
      setPortfolio((state) => ({
        ...state,
        hotelId: id ?? 0,
      }));
    },
    [setPortfolio, portfolio],
  );

  const selectHotelGroupId = useCallback(
    (id) => {
      logger.debug('Select property group:', id);
      setPortfolio((state) => ({
        ...state,
        hotelGroupId: id ?? 0,
        hotelId: 0,
      }));
    },
    [setPortfolio],
  );

  const selectPortfolio = useCallback(
    (value) => {
      logger.debug('selectPortfolio:', value);
      setPortfolio((state) => ({
        ...state,
        hotelGroupId: value?.hotelGroupId ?? 0,
        hotelId: value?.hotelId ?? 0,
      }));
    },
    [setPortfolio],
  );

  const clearHotelId = useCallback(() => {
    logger.debug('Clear property selection');
    setPortfolio((state) => ({
      ...state,
      hotelId: 0,
    }));
  }, [setPortfolio, portfolio]);

  const clearHotelGroupId = useCallback(() => {
    logger.debug('Clear property group selection');
    setPortfolio((state) => ({
      ...state,
      hotelGroupId: 0,
    }));
  }, [setPortfolio, portfolio]);

  const clearPortfolio = useCallback(() => {
    logger.debug('Clear Portfolio selection');
    setPortfolio((state) => ({
      ...state,
      hotelId: 0,
      hotelGroupId: 0,
    }));
  }, [setPortfolio]);

  return {
    portfolio,
    hotelId: portfolio.hotelId,
    hotelGroupId: portfolio.hotelGroupId,
    selectHotelId,
    selectHotelGroupId,
    selectPortfolio,
    clearHotelId,
    clearHotelGroupId,
    clearPortfolio,
    assignGlobalValue,
    clearGlobalValue,
    updateHotelAndGroup,
    clearHotelAndGroup,
  };
};

export { useGlobalFilter };
