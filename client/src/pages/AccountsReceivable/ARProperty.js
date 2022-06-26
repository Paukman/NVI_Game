import dayjs from 'dayjs';
import React, { Fragment, memo, useState } from 'react';
import { useARReport } from '../../graphql/useARReport';
import { ARReport } from './ARReport';
import { useParams } from 'react-router-dom';
import logger from 'utils/logger';

const ARProperty = memo(() => {
  const { hotelARPropertyGet, ARPropertyLoading, listARProperty } = useARReport();
  const param = useParams();

  // no need to pull all that stuff, we get hotel from Id, and keep it in filters
  const hotelId = param?.id?.split(':')?.[0];

  const [filters, setFilters] = useState({
    hotelIds: [Number(hotelId) || null],
    date: dayjs(new Date()).format('YYYY-MM-DD'),
    highlights: [0.75, 0.5],
  });
  const [reportRequested, setReportRequested] = useState(false);

  const requestReport = (newFilters = '') => {
    const currentFilters = newFilters ? newFilters : filters;

    const params = {
      ...currentFilters,
      date: dayjs(currentFilters.date).format('YYYY-MM-DD'),
    };
    logger.debug('listARProperty with params :', params);

    listARProperty({ params });
    if (reportRequested) {
      setReportRequested(false);
    }
  };

  return (
    <Fragment>
      <ARReport
        data={hotelARPropertyGet}
        loading={ARPropertyLoading}
        reportType={'Property'}
        setFilters={setFilters}
        filters={filters}
        requestReport={requestReport}
        reportRequested={reportRequested}
        setReportRequested={setReportRequested}
        param={param}
      />
    </Fragment>
  );
});

ARProperty.displayName = 'ARProperty';

export { ARProperty };
