import { useState, useContext, useEffect } from 'react';
import { AppContext, GlobalFilterContext, HotelContext } from 'contexts';
import { usePnlReports } from '../../../graphql';
import { globals, usePageState } from 'hooks';
import { pageState, returnItems, PNL_PAGES } from '../constants';
import { prepareDataForPnLUnmapped } from '../utils';
import { PNL_UNMAPPED_SELECTORS } from 'config/constants';
import { useLocation, useHistory } from 'react-router';
import dayjs from 'dayjs';
import logger from 'utils/logger';

export const usePnLUnmapped = () => {
  const { pnLUnmappedGet, pnlUnmappedReport } = usePnlReports();
  const { portfolio, assignGlobalValue } = useContext(GlobalFilterContext);
  const { hotels } = useContext(HotelContext);
  const myGlobals = [globals.hotelId, globals.pnlYear];
  const location = useLocation();
  const { updatePageState } = usePageState(pageState);

  const { appPages } = useContext(AppContext);
  const history = useHistory();

  const [pnlUnmappedState, updateState] = useState({
    hotelId: portfolio.hotelId, // use null if you don't inlcude all properties
    data: null,
    errors: [],
    listData: [],
    pageState: { ...updatePageState(pageState.DEFAULT) },
    requestReport: true,
    unmappedSelector: PNL_UNMAPPED_SELECTORS.MISSING_PROPERTY_GL.value,
    pnlYear: portfolio.pnlYear ?? location?.state?.year ? String(location.state.year) : dayjs().year(),
    subHeaders: [],
    returnItems: returnItems,
  });

  const onHandleMoreOptions = ({ action, dataRow }) => {
    logger.debug({ action, dataRow });

    // tbd when proper pre-population is done on add/edit pages...
    /*
    if (action?.id === actions.ADD) {
      history.push(appPages.keys['gl-mapping-add'].url);
    }

    if (action?.id === actions.MAP) {
      logger.debug('Edit HMG GL Code :', dataRow?.hmgGlCode);
      history.push(strReplace(`${appPages.keys['gl-mapping-edit'].url}`, { id: dataRow?.hmgGlCode }));
    }
    */
  };

  useEffect(() => {
    if (hotels?.length !== 0) {
      updateState((state) => ({
        ...state,
        hotelId: portfolio.hotelId || hotels[0]?.id,
      }));
    }
  }, [hotels]);

  useEffect(() => {
    if (pnlUnmappedReport?.data || pnlUnmappedReport?.errors?.length) {
      // no errors
      if (pnlUnmappedReport?.data && !pnlUnmappedReport?.errors?.length) {
        // is empty
        if (Array.isArray(pnlUnmappedReport.data?.items) && !pnlUnmappedReport.data?.items?.length) {
          updateState((state) => ({
            ...state,
            listData: [],
            pageState: updatePageState(pageState.NO_DATA),
          }));
        } else {
          const { subHeaders, listData } = prepareDataForPnLUnmapped(
            pnlUnmappedReport.data,
            onHandleMoreOptions,
            pnlUnmappedState.unmappedSelector,
          );
          updateState((state) => ({
            ...state,
            subHeaders,
            listData,
            pageState: updatePageState(pageState.DEFAULT),
          }));
        }
      } // errors...
      else if (pnlUnmappedReport?.errors?.length) {
        updateState((state) => ({
          ...state,
          errors: pnlUnmappedReport?.errors,
          pageState: updatePageState(pageState.ERROR),
        }));
      }
    }
  }, [pnlUnmappedReport]);

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
    // if inputs are not set
    if (!pnlUnmappedState?.hotelId || !pnlUnmappedState?.unmappedSelector || !pnlUnmappedState?.pnlYear) {
      updateState((state) => ({
        ...state,
        pageState: updatePageState(pageState.NO_DATA),
        listData: [],
      }));
      return;
    }

    updateState((state) => ({
      ...state,
      pageState: updatePageState(pageState.LOADING),
      listData: [],
      requestReport: false,
    }));

    pnLUnmappedGet({
      hotelId: pnlUnmappedState.hotelId,
      year: Number(pnlUnmappedState.pnlYear),
      hmgGlCodeStatus: pnlUnmappedState.unmappedSelector,
    });
  };

  const onReturn = (value) => {
    switch (value?.id) {
      case PNL_PAGES.PNL_MONTLY: {
        history.push(appPages.keys['pnl-monthly'].url);
        break;
      }
      case PNL_PAGES.PNL_YEARLY: {
        history.push(appPages.keys['pnl-yearly'].url);
        break;
      }
      case PNL_PAGES.PNL_COMPARISON: {
        history.push(appPages.keys['pnl-property-comparison'].url);
        break;
      }
      default:
        break;
    }
  };

  return { state: pnlUnmappedState, onChange, displayReport, onReturn };
};
