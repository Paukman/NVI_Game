import React, { useEffect, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

import { HotelContext } from 'contexts';
import { useStrDefaultReport } from 'pages/StrReports/hooks';

export const StrContext = createContext();

const StrProvider = ({ children }) => {
  StrProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const { hotels } = useContext(HotelContext);

  const strDefaultReport = useStrDefaultReport();

  // hotels might not be immediately available, have to do it this way...
  useEffect(() => {
    if (hotels?.length !== 0) {
      strDefaultReport.onChange('hotels', hotels);
      // assign first hotel to the state...
      strDefaultReport.onChange('hotelId', hotels[0]?.id);
    }
  }, [hotels]);

  return (
    <StrContext.Provider
      value={{
        defaultStr: {
          state: strDefaultReport.strDefaultState,
          onChange: strDefaultReport.onChange,
          listStrReport: strDefaultReport.listStrReport,
          reportRequested: strDefaultReport.reportRequested,
          onHandleDownload: strDefaultReport.onHandleDownload,
        },
      }}
    >
      {children}
    </StrContext.Provider>
  );
};

export { StrProvider };
