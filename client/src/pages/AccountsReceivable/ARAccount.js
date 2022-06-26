import React, { memo, Fragment, useContext, useEffect, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { ARReport } from './ARReport';
import { Button, ToolBar, ToolBarItem } from 'mdo-react-components';
import { useARReport } from '../../graphql/useARReport';
import { AppContext } from '../../contexts';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { useARMapping } from '../../graphql/useARMapping';
import { ARAccountHook } from './Hooks/ARAccountHook';

const ARAccount = memo(() => {
  const { hotelARAccountGet, ARAccountLoading, listARAccount } = useARReport();
  const { MappedTo } = ARAccountHook();
  const param = useParams();
  const [filters, setFilters] = useState({
    hotelClientAccountId: 0,
    date: new Date(),
    highlights: [0.75, 0.5],
  });
  const [reportRequested, setReportRequested] = useState(false);

  useMemo(() => {
    if (MappedTo && MappedTo.data.length !== 0) {
      setFilters({
        ...filters,
        hotelClientAccountId: MappedTo.data[0].id,
      });
    }
  }, [MappedTo, setFilters]);

  // useEffect(() => {
  //   if (hotelARAccountGet && hotelARAccountGet.data.length === 0 && hotelARAccountGet.errors.length === 0) {
  //     listARAccount({
  //       params: {
  //         ...filters,
  //       },
  //     });
  //   }
  // }, [listARAccount, hotelARAccountGet, filters]);

  const requestReport = (newFilters = '') => {
    const currentFilters = newFilters ? newFilters : filters;
    listARAccount({
      params: {
        ...currentFilters,
        date: dayjs(currentFilters.date).format('YYYY-MM-DD'),
      },
    });
    if (reportRequested) {
      setReportRequested(false);
    }
  };

  return (
    <Fragment>
      <ARReport
        data={hotelARAccountGet}
        loading={ARAccountLoading}
        reportType={'Account'}
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

ARAccount.displayName = 'ARAccount';

export { ARAccount };
