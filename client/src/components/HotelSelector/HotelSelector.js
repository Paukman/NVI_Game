import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import { SearchableDropdown } from 'mdo-react-components';
import { HotelContext } from 'contexts';
import { getText } from 'utils/localesHelpers';
import { Container } from './styled';

const HotelSelector = memo((props) => {
  const { hotels, loadingList } = useContext(HotelContext);
  const { label, placeholder, value, id, name, onChange, errorMsg, dataEl, disableClearable, disabled, addAll } = props;
  const addHotels = addAll ? [{ id: 0, hotelName: getText('selectors.hotel.allHotels') }, ...hotels] : hotels;

  // this is the same situation as in portfolio, just a bit simpler
  let usedValue = value;
  if (!addAll && value === 0) {
    usedValue = hotels?.[0]?.id || 0;

    // this eliminates all those issues when you have to call useEffect to pickup hotel change yay :-)
    // same as in portfolio, if component itself changing something, it needs to notify the parent:
    if (usedValue !== 0) {
      onChange(name, usedValue);
    }
  }

  const mapHotels = (data) => {
    const hotelsMapped = data.map((hotel) => {
      return {
        label: hotel.hotelName,
        value: hotel.id,
      };
    });
    return hotelsMapped;
  };

  return (
    <Container>
      <SearchableDropdown
        key={`${id || name}-${value}`}
        value={usedValue}
        id={id}
        name={name}
        onChange={onChange}
        label={label}
        placeholder={placeholder}
        itemName='label'
        valueName='value'
        items={
          loadingList
            ? [
                {
                  label: getText('generic.loading'),
                  value: '',
                  disabled: true,
                },
              ]
            : [...mapHotels(addHotels)]
        }
        error={!!errorMsg}
        helperText={errorMsg}
        dataEl={dataEl ?? `searchableDropdownHotelSelector`}
        disableClearable={disableClearable}
        disabled={disabled}
      />
    </Container>
  );
});

HotelSelector.displayName = 'HotelSelector';

HotelSelector.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.number,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  errorMsg: PropTypes.string,
  dataEl: PropTypes.string,
  disableClearable: PropTypes.bool,
  disabled: PropTypes.bool,
  addAll: PropTypes.bool,
};

HotelSelector.defaultProps = {
  label: 'Property',
  placeholder: 'Please, select a property',
  dataEl: 'selectorHotel',
  disabled: false,
  addAll: false,
};

export { HotelSelector };
