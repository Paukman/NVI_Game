import React from 'react';
import PropTypes from 'prop-types';
import { HotelContext } from '../contexts';
import { useHotels } from '../graphql';

const HotelProvider = (props) => {
  const { children } = props;
  const hotelsHooks = useHotels();

  return <HotelContext.Provider value={hotelsHooks}>{children}</HotelContext.Provider>;
};

HotelProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { HotelProvider };
