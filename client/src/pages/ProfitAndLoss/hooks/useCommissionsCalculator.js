import { useState, useContext, useEffect } from 'react';

import { AppContext, GlobalFilterContext, HotelContext } from 'contexts';
import { usePnLCommissionCalculator } from '../../../graphql';
import { globals, usePageState } from 'hooks';
import logger from 'utils/logger';
import { formatQueryErrors } from 'utils/dataManipulation';

import { pageState, PERIOD_ITEMS } from '../constants';
import { prepareDataForPnLCommissionCalculator, downloadExcelFile } from '../utils';
import { useHistory } from 'react-router-dom';
import { strReplace } from 'utils/formatHelpers';

export const useCommissionsCalculator = (pageKey) => {
  const {
    pnlCommissionCalculatorList,
    pnlCommissionCalculatorListState: commissions,
    pnlCommissionsCalculate,
    pnlCommissionsCalculateState: calculations,
  } = usePnLCommissionCalculator();
  const { appPages } = useContext(AppContext);
  const { portfolio, assignGlobalValue, updateHotelAndGroup } = useContext(GlobalFilterContext);
  const { updatePageState } = usePageState(pageState);
  const { getPortfolioHotelIds } = useContext(HotelContext);
  const history = useHistory();

  const myGlobals = [globals.date, globals.pnlPeriod];

  const [pnLCommissionsCalcState, updateState] = useState({
    date: portfolio.date,
    period: portfolio.pnlPeriod,
    portfolio: portfolio,
    errors: [],
    listData: [],
    subHeaders: [],
    pageState: { ...updatePageState(pageState.DEFAULT) },
    requestReport: true,
    commissionsData: [],
    pageKey: pageKey ?? null,
    queryErrors: [],
  });

  const getPageState = (data, errors) => {
    if (data?.length === 0 && !errors?.length) {
      return pageState.NO_DATA_CALC;
    } else if (errors?.length) {
      return pageState.ERROR;
    }
    return pageState.DEFAULT;
  };

  // for commissions
  useEffect(() => {
    if (commissions?.data || commissions?.errors?.length) {
      logger.debug('Commisions list: ', commissions);

      updateState((state) => ({
        ...state,
        errors: formatQueryErrors(commissions?.errors),
        queryErrors: commissions?.errors,
        commissionsData: commissions?.data?.length ? commissions?.data : [],
        pageState: updatePageState(getPageState(commissions?.data, commissions?.errors)),
      }));

      //if all good then run calculations...
      if (commissions?.data?.length) {
        const params = {
          hotelId: getPortfolioHotelIds(pnLCommissionsCalcState.portfolio),
          date: pnLCommissionsCalcState.date,
          period: pnLCommissionsCalcState.period,
          pnlCommissionId: commissions.data.map((commision) => commision.id),
        };

        pnlCommissionsCalculate(params);
      }
    }
  }, [commissions]);

  const onHandleEditDelete = (name, value) => {
    logger.debug('Actions: ', name, value);
  };
  // for calculations
  useEffect(() => {
    if ((calculations?.data || calculations?.errors?.length) && pnLCommissionsCalcState.commissionsData?.length) {
      logger.debug('Calculated list: ', calculations);

      const { subHeaders, listData } = prepareDataForPnLCommissionCalculator(
        calculations?.data?.[0],
        pnLCommissionsCalcState.commissionsData,
        onHandleEditDelete,
      );

      updateState((state) => ({
        ...state,
        errors: formatQueryErrors(calculations?.errors),
        queryErrors: calculations?.errors,
        listData,
        subHeaders,
        pageState: updatePageState(getPageState(calculations?.data, calculations?.errors)),
      }));
    }
  }, [pnLCommissionsCalcState.commissionsData, calculations]);

  const onChange = (name, value) => {
    if (myGlobals.includes(name)) {
      assignGlobalValue(name, value); // keep globals up to date
    }
    // using pnlPeriod, different then period, have to do it this way...
    if (name === 'period') {
      assignGlobalValue('pnlPeriod', value);
    }
    if (name === 'portfolio') {
      updateHotelAndGroup({ value });
    }
    updateState((state) => ({
      ...state,
      [name]: value,
      // reset message whenever we start changing any filters
      pageState: updatePageState(pageState.DEFAULT),
      requestReport: true,
    }));
  };

  const displayReport = () => {
    updateState((state) => ({
      ...state,
      pageState: updatePageState(pageState.LOADING),
      listData: [],
      calculatedData: [],
      requestReport: false,
    }));

    // we get list first and if all good, useEffect will get calculation
    pnlCommissionCalculatorList({
      keyword: 'www calculation',
    });
  };

  const onHandleDownload = ({ value }) => {
    downloadExcelFile(value, appPages, pnLCommissionsCalcState);
  };

  const onHandleAddNew = () => {
    logger.log('onHandleAddNew');
  };

  const onHandleCloseCommissions = () => {
    if (pageKey && strReplace(`${appPages.keys[pageKey]?.url}`) !== undefined) {
      history.push(strReplace(`${appPages.keys[pageKey]?.url}`));
    }
  };

  return {
    state: pnLCommissionsCalcState,
    onChange,
    displayReport,
    onHandleDownload,
    onHandleAddNew,
    onHandleCloseCommissions,
  };
};
