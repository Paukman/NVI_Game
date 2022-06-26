import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { MappedToContext } from '../contexts';
import { useHotelClientAccount } from '../graphql';

const HotelClientAccountProvider = (props) => {
  const { children } = props;
  const { hotelClientAccountList, loadingList, MappedTo } = useHotelClientAccount();

  useEffect(() => {
    hotelClientAccountList({
      params: {
        keyword: '',
        accountName: '',
        managementStatusId: null,
      },
    });
  }, [hotelClientAccountList]);

  return (
    <MappedToContext.Provider
      value={{
        MappedTo,
        loadingList,
      }}
    >
      {children}
    </MappedToContext.Provider>
  );
};

HotelClientAccountProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { HotelClientAccountProvider };
