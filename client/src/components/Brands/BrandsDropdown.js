import React, { memo } from 'react';
import { Dropdown } from 'mdo-react-components';
import { useContext } from 'react';
import { HotelContext } from 'contexts';

export const BrandsDropdown = memo((props) => {
  const { hotels } = useContext(HotelContext);

  const uniqueBrands = hotels
    .map((hotel) => ({ value: hotel?.brand?.id, label: hotel?.brand?.brandName }))
    .filter((v, i, a) => a.findIndex((t) => v && t?.label === v?.label) === i);

  return <Dropdown items={uniqueBrands} {...props} />;
});

BrandsDropdown.displayName = ' BrandsDropdown';

BrandsDropdown.propTypes = {
  ...Dropdown.propTypes,
};
