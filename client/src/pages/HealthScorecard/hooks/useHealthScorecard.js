import { useState, useContext, useEffect } from 'react';
import { AppContext, GlobalFilterContext, HotelContext } from 'contexts';
import { useHealthScoreBoard, useUserSettings } from '../../../graphql';
import { globals, usePageState } from 'hooks';
import { pageState, PERIOD_ITEMS } from '../constants';
import { prepareDataForHealthScorecard, downloadExcelFile } from '../utils';
import { getComparator, stableSort, switchDirection, direction } from 'utils/pageHelpers';
import logger from 'utils/logger';
import { useHistory } from 'react-router-dom';
import { formatQueryErrors } from 'utils/dataManipulation';

export const useHealthScorecard = () => {
  const healthScorecard = [];
  const history = useHistory();
  const { healthScoreBoardGet, healthScoreBoard } = useHealthScoreBoard();

  const { settingsListGet: userSettingsListGet, userSettingsList: userSettings } = useUserSettings();

  const { appPages } = useContext(AppContext);
  const { portfolio, assignGlobalValue } = useContext(GlobalFilterContext);
  const { getPortfolioHotelIds } = useContext(HotelContext);
  const myGlobals = [globals.hotelGroupId, globals.date];
  const { updatePageState } = usePageState(pageState);

  const [healthScorecardState, updateState] = useState({
    hotelGroupId: portfolio.hotelGroupId,
    date: portfolio.date || new Date(),
    period: PERIOD_ITEMS.MTD.value,
    data: null,
    errors: [],
    listData: [],
    subHeaders: [],
    pageState: { ...updatePageState(pageState.DEFAULT) },
    requestReport: true,
    order: direction.DESC, // default
    orderBy: 'name',
  });

  useEffect(() => {
    if (healthScoreBoard?.data && userSettings?.data) {
      logger.debug('Health scoreboard and user settings: ', { healthScoreBoard, userSettings });
      // no errors
      if (healthScoreBoard?.data && !healthScoreBoard?.errors?.length) {
        if (!healthScoreBoard.data?.length) {
          // condition if no data is available
          // no data
          updateState((state) => ({
            ...state,
            listData: [],
            pageState: updatePageState(pageState.MESSAGE),
          }));
        } else {
          const { subHeaders, listData, headers } = prepareDataForHealthScorecard(
            healthScoreBoard.data[0],
            userSettings?.data,
          );
          updateState((state) => ({
            ...state,
            subHeaders,
            listData,
            headers,
            pageState: updatePageState(pageState.DEFAULT),
          }));
        }
      } // errors...
      else if (healthScoreBoard?.errors?.length || userSettings?.errors?.length) {
        updateState((state) => ({
          ...state,
          errors: {
            ...formatQueryErrors(healthScoreBoard?.errors),
            ...formatQueryErrors(userSettings?.errors?.length),
          },
          pageState: updatePageState(pageState.ERROR),
        }));
      }
    }
  }, [healthScoreBoard, userSettings]);

  const onChange = (name, value) => {
    if (myGlobals.includes(name)) {
      assignGlobalValue(name, value); // keep globals up to date
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
    // if inputs are not set should never be the case
    if (!healthScorecardState.period || !healthScorecardState.date) {
      return;
    }

    updateState((state) => ({
      ...state,
      pageState: updatePageState(pageState.LOADING),
      listData: [],
      requestReport: false,
    }));

    const hotels = getPortfolioHotelIds({ hotelGroupId: healthScorecardState.hotelGroupId });
    healthScoreBoardGet({
      hotelId: hotels,
      date: healthScorecardState.date,
      period: healthScorecardState.period,
    });
    // TODO: we should get settings, previous query should get us proper columns (now it gets
    // all so we have to use setting to see which ones to display)
    userSettingsListGet({ settingTypeId: 1100 });
  };

  const onHandleDownload = ({ value }) => {
    downloadExcelFile(value, appPages, healthScorecardState);
  };

  const onHandleUpload = () => {
    logger.debug('onHandleUpload');
  };

  const onHandleManualEntry = () => {
    history.push(appPages.keys['health-scorecard-manual-entry'].url);
    logger.debug('onHandleManualEntry');
  };

  const onRequestSort = (column, dir) => {
    // opaque report while sorting, this could take a bit sometimes....
    updateState((state) => ({
      ...state,
      pageState: updatePageState(pageState.SORTING),
    }));

    let newDirection = dir;
    if (column === healthScorecardState.orderBy && dir === healthScorecardState.order) {
      newDirection = switchDirection(dir);
    }
    if (column !== healthScorecardState.orderBy) {
      newDirection = direction.DESC; // start descending as default for new columns
    }

    const newListData = stableSort(healthScorecardState.listData, getComparator(newDirection, column));

    updateState((state) => ({
      ...state,
      listData: newListData,
      order: newDirection,
      orderBy: column,
      pageState: updatePageState(pageState.DEFAULT),
    }));
  };

  return {
    state: healthScorecardState,
    onChange,
    displayReport,
    onHandleDownload,
    onHandleUpload,
    onHandleManualEntry,
    onRequestSort,
  };
};
