import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import React, { Fragment, memo, useContext, useEffect, useState, useMemo } from 'react';
import { useARReport } from '../../graphql/useARReport';
import { ARReport } from './ARReport';
import { HotelContext } from '../../contexts';
import logger from 'utils/logger';

const ARDashboard = memo(() => {
  const { hotelARDashboardGet, ARDashboardLoading, listARDashboard } = useARReport();
  const { hotels, hotelsGroups, hotelsGroupsMap } = useContext(HotelContext);
  const [dashboardHotelIds, setDashboardHotelIds] = useState([]);
  const [reportRequested, setReportRequested] = useState(false);

  const [filters, setFilters] = useState({
    hotelIds: hotels.map((hotel) => hotel.id),
    date: new Date(),
    highlights: [0.75, 0.5],
  });

  useEffect(() => {
    if (hotels?.length !== 0) {
      setFilters({
        hotelIds: hotels.map((hotel) => hotel.id),
        date: new Date(),
        highlights: [0.75, 0.5],
      });
    }
  }, [hotels]);

  useMemo(() => {
    if (hotelsGroups && hotelsGroupsMap && hotelsGroups.length !== 0 && !isEmpty(hotelsGroupsMap)) {
      setFilters({
        ...filters,
        hotelIds: [...hotels.map((hotel) => hotel.id)],
      });
    }
  }, [hotelsGroups, hotelsGroupsMap, setDashboardHotelIds, setFilters]);

  const requestReport = (newFilters = '') => {
    const currentFilters = newFilters ? newFilters : filters;
    const params = {
      ...currentFilters,
      date: dayjs(currentFilters.date).format('YYYY-MM-DD'),
    };
    logger.debug('listARDashboard with params :', params);

    listARDashboard({ params });
    if (reportRequested) {
      setReportRequested(false);
    }
  };

  return (
    <Fragment>
      <ARReport
        data={hotelARDashboardGet}
        loading={ARDashboardLoading}
        reportType={'Dashboard'}
        setFilters={setFilters}
        filters={filters}
        requestReport={requestReport}
        reportRequested={reportRequested}
        setReportRequested={setReportRequested}
      />
    </Fragment>
  );
});

ARDashboard.displayName = 'ARDashboard';

export { ARDashboard };
