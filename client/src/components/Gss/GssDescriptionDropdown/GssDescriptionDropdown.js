import React, { memo } from 'react';
import { Dropdown } from 'mdo-react-components';
import { useContext } from 'react';
import { HotelContext } from 'contexts';
import { useEffect } from 'react';
import { useGSSReports } from 'graphql/useGSSReports';

export const GssDescriptionDropdown = memo((props) => {
  const { hotels } = useContext(HotelContext);
  const { listQueryGssDescriptionList, gssDescriptionList } = useGSSReports();

  useEffect(() => {
    listQueryGssDescriptionList({ hotelId: hotels.map((hotel) => hotel?.id) });
  }, []);

  const items = gssDescriptionList.data.map((item) => ({
    label: item.description,
    value: item.description,
  }));

  return <Dropdown items={items} {...props} />;
});

GssDescriptionDropdown.displayName = 'GssDescriptionDropdown';

GssDescriptionDropdown.propTypes = {
  ...Dropdown.propTypes,
};
