import React, { useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';
import { WIDGET_ID, REPORTS, DATE_RANGE } from '../constants';
import { TopHeader } from '../styled';
import { useMissingDates as useMissingDatesGQL } from '../../../../graphql';
import { HotelContext } from 'contexts';
import { formatMissingDates, getTooltipTitle, formatMissingDatesDownload, prepareMissingDatesTooltip } from '../utils';

// this hook is called from the tableValue and it will will fetch all missing dates and organize
export const useMissingDates = (widgetId, dashboardId, period, date, hotelId, startDate, endDate) => {
  const { missingDataGet, missingDataGetState } = useMissingDatesGQL();
  const { hotels } = useContext(HotelContext);

  const [stateMissingDates, updateState] = useState({
    dashboardId: dashboardId,
    widgetId: widgetId,
    missingDates: {},
    missingHotelIds: [],
    downloadData: [],
  });

  useEffect(() => {
    if (widgetId === WIDGET_ID.BY_PROPERTY) {
      const params = {
        reportName: REPORTS.BY_PROPERTY,
        hotelIds: hotelId,
        period,
        date,
      };
      if (period == DATE_RANGE) {
        delete params.date;
        params.startDate = dayjs(startDate).format('YYYY-MM-DD');
        params.endDate = dayjs(endDate).format('YYYY-MM-DD');
      }
      missingDataGet(params);
    }
  }, [widgetId]);

  useEffect(() => {
    const { data, errors } = missingDataGetState;
    if (data?.length > 0 && errors?.length === 0) {
      const { missingHotelIds, missingDates } = formatMissingDates(data[0]?.reportMissingDates, new Date(endDate));
      const { downloadData } = formatMissingDatesDownload(data[0]?.reportMissingDates, data[0]?.date, hotels);
      updateState((state) => ({
        ...state,
        missingHotelIds,
        missingDates,
        downloadData,
      }));
    }
  }, [missingDataGetState]);

  // return tooltip content to display as title
  const handleViewMissingDates = (hotelId) => {
    const { roomRevenue, fAndBRevenue, otherRevenue } = getTooltipTitle(stateMissingDates, hotelId);

    return (
      <>
        <TopHeader>Missing Dates</TopHeader>
        {prepareMissingDatesTooltip(roomRevenue, fAndBRevenue, otherRevenue)}
      </>
    );
  };

  return {
    state: stateMissingDates,
    handleViewMissingDates,
  };
};
