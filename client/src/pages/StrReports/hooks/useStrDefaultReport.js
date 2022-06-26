import { useState, useContext, useEffect } from 'react';

import { AppContext, GlobalFilterContext, HotelContext } from 'contexts';
import { useStrReport } from '../../../graphql';
import { globals, usePageState, useGetTableHeaders } from 'hooks';
import { mode, pageState } from '../constants';
import { PrepareDataForDefaultSTRReport } from '../utils';
import { timestampNoSeparators } from 'utils/formatHelpers';
import { buildDownloadableFilename, exportToXLSX, findDepth } from 'utils/downloadHelpers';
import { DownloadableReportNames } from 'config/downlodableReportNames';
import { getText } from 'utils/localesHelpers';

export const useStrDefaultReport = () => {
  const { strDefaultReport, strDefaultReportGet } = useStrReport();
  const { appPages } = useContext(AppContext);
  const { hotelsMap } = useContext(HotelContext);
  const { portfolio, assignGlobalValue } = useContext(GlobalFilterContext);
  const myGlobals = [globals.hotelId, globals.date];
  const { updatePageState } = usePageState(pageState);

  const [strDefaultState, updateDefaultState] = useState({
    hotels: [],
    hotelId: portfolio.hotelId || null, // use null if you don't inlcude all properties
    date: portfolio.date,
    mode: mode.fourWeeks,
    data: null,
    errors: [],
    loadingData: false,
    listingData: [],
    subHeaders: [],
    headers: [],
    noDataMessage: '',
    pageState: { ...updatePageState(pageState.DEFAULT) },
    requestReport: false,
  });

  useEffect(() => {
    if (strDefaultReport?.data || strDefaultReport?.errors?.length) {
      // no errors
      if (strDefaultReport?.data && !strDefaultReport?.errors?.length) {
        if (!strDefaultReport.data?.columnsCfg?.length) {
          // no data
          updateDefaultState((state) => ({
            ...state,
            listingData: [],
            pageState: updatePageState(pageState.MESSAGE),
          }));
        } else {
          const { subHeaders, listingData, headers } = PrepareDataForDefaultSTRReport(strDefaultReport.data);
          updateDefaultState((state) => ({
            ...state,
            subHeaders,
            listingData,
            headers,
            pageState: updatePageState(pageState.DEFAULT),
          }));
        }
      } // errors...
      else if (strDefaultReport?.errors?.length) {
        updateDefaultState((state) => ({
          ...state,
          showAlert: true,
          errors: strDefaultReport?.errors,
          pageState: updatePageState(pageState.ERROR),
        }));
      }
    }
  }, [strDefaultReport]);

  const onChange = (name, value) => {
    if (myGlobals.includes(name)) {
      assignGlobalValue(name, value); // keep globals up to date
    }
    updateDefaultState((state) => ({
      ...state,
      [name]: value,
      pageState: updatePageState(pageState.DEFAULT),
      requestReport: name === 'mode' && strDefaultState.listingData.length ? false : true,
    }));
  };

  const listStrReport = () => {
    if (!strDefaultState?.hotelId || !strDefaultState?.date) {
      updateDefaultState((state) => ({
        ...state,
        pageState: updatePageState(pageState.MESSAGE),
      }));
    }

    updateDefaultState((state) => ({
      ...state,
      pageState: updatePageState(pageState.LOADING),
      listingData: [],
      requestReport: false,
    }));

    strDefaultReportGet({
      hotelId: strDefaultState.hotelId,
      date: strDefaultState.date,
    });
  };

  const { fourWeeksHeader, fiftyTwoWeeksHeader } = strDefaultState?.headers ?? {};

  const { subHeader, span } = useGetTableHeaders(
    _,
    strDefaultState?.mode === 0 ? fourWeeksHeader : fiftyTwoWeeksHeader,
  );

  const onHandleDownload = ({ value }) => {
    if (strDefaultState?.listingData?.length > 0) {
      const indents = [];
      let excelData = [];
      let objWithData = Object.keys(strDefaultState.listingData[1]);
      objWithData.shift();
      const addObj = objWithData.reduce((acc, item) => {
        return { ...acc, [item]: '' };
      }, {});
      findDepth(strDefaultState.listingData, indents);
      const formatListing = strDefaultState.listingData?.map((obj) => {
        // easier to remove not needed keys, then to remap...
        if (obj.hasOwnProperty('hasHorizontalTopBorder')) {
          obj = { ...obj, ...addObj };
          delete obj.hasHorizontalTopBorder;
        }
        if (obj.hasOwnProperty('removeBottomBorder')) {
          delete obj.removeBottomBorder;
        }
        if (obj.hasOwnProperty('id')) {
          delete obj.id;
        }
        // rename title to STR for the left upper corner of cvs
        const modifiedObject = { ['']: obj.title, ...obj };
        delete modifiedObject.title;
        return modifiedObject;
      });
      formatListing.forEach((obj) => excelData.push(obj));
      const fromDate = timestampNoSeparators(new Date(strDefaultReport?.data.columnsCfg[0].days[0]));
      const toDate = timestampNoSeparators(
        new Date(strDefaultReport?.data.columnsCfg[0].days[strDefaultReport?.data.columnsCfg[0].days.length - 1]),
      );
      const fileName = buildDownloadableFilename({
        hotelName: hotelsMap[strDefaultState?.hotelId].hotelName,
        reportName: DownloadableReportNames.strDefault,
        startDate: fromDate,
        endDate: toDate,
      });

      exportToXLSX(excelData, fileName, value == 'excel' ? 'xlsx' : value, '', {
        isHeader: false,
        style: true,
        subHeader,
        span,
        noTotalStyle: true,
        indents,
      });
    }
  };

  return { strDefaultState, onChange, listStrReport, onHandleDownload };
};
