import React from 'react';
import PropTypes from 'prop-types';
import { ARMappedToDropdown } from '../../components';
import { getText } from '../../utils/localesHelpers';

const HotelClientAccountDropdown = ({ value, dataRow, onAccountId }) => {
  const labelText =
    dataRow?.hotelClientAccountId === null
      ? 'null'
      : dataRow?.hotelClientAccount === null
      ? dataRow?.hotelClientAccountId
      : dataRow?.hotelClientAccount?.accountName;
  return (
    <ARMappedToDropdown
      name={`ar-${dataRow?.hotelClientAccountId}`}
      value={dataRow?.hotelClientAccountId === null ? 'null' : dataRow?.hotelClientAccountId}
      onChange={(name, value, event) => {
        /* Ommit change events that trigger:
         * When user clicks on close button of the searchable dropdown while there is no 'mapped to' value.
         * When user completely clear the search filed of the searchable dropdown.
         */
        if (name === 'blur') {
          console.log(value);
          value = 'null';
          onAccountId({ dataRow, value });
        } else {
          if (value !== null) {
            // Trigger backend call only for required actions on search field.
            // In order to identify the search field close button press
            // as a client account remove, update the value to 'null' when it is originally ''.
            if (value === '') value = 'null';
            onAccountId({ dataRow, value });
          }
        }
      }}
      placeholder={getText('generic.selectAccount')}
      dataEl={'arDropdown'}
      tableDropDownFontSize={true}
      label={labelText}
    />
  );
};

HotelClientAccountDropdown.propTypes = {
  value: PropTypes.any,
  dataRow: PropTypes.any,
  onAccountId: PropTypes.any,
};

HotelClientAccountDropdown.displayName = 'HotelClientAccountDropdown';

export { HotelClientAccountDropdown };
