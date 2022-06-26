import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { SalesManagerContext } from '../contexts';
import { useSalesManager } from '../graphql';

const SalesManagerProvider = (props) => {
  const { children } = props;
  const { salesManagers, loadingList, listSalesManagers } = useSalesManager();

  useEffect(() => {
    listSalesManagers({ params: {}, pagination: {} });
  }, [listSalesManagers]);

  return (
    <SalesManagerContext.Provider
      value={{
        salesManagers,
        loadingList,
      }}
    >
      {children}
    </SalesManagerContext.Provider>
  );
};

SalesManagerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { SalesManagerProvider };
