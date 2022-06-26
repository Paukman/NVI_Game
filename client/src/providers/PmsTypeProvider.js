import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { PmsTypeContext } from '../contexts';
import { usePmsTypes } from '../graphql';

const PmsTypesProvider = (props) => {
  const { children } = props;
  const { pmsTypes, loadingList, listPmsTypes } = usePmsTypes();

  useEffect(() => {
    listPmsTypes({
      params: {},
      pagination: {
        page: 1,
        pageSize: null,
        sortBy: [
          {
            name: 'order_no',
            order: 'ASC',
          },
        ],
      },
    });
  }, [listPmsTypes]);

  return (
    <PmsTypeContext.Provider
      value={{
        pmsTypes,
        loadingList,
      }}
    >
      {children}
    </PmsTypeContext.Provider>
  );
};

PmsTypesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { PmsTypesProvider };
