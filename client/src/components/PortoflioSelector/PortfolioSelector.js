import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { SearchableDropdown } from 'mdo-react-components';
import { HotelContext } from 'contexts';
import { getText } from '../../utils/localesHelpers';
import { Container, PortfolioItem, HotelItem } from './styled';

let isDefaultValue = true;

const PortfolioSelector = (props) => {
  const { hotels, hotelsGroups, hotelsGroupsMap, loadingList } = useContext(HotelContext);
  const {
    value,
    id,
    name,
    onChange,
    errorMsg,
    dataEl,
    disableClearable,
    disabled,
    allowAllGroups,
    allowAllHotels,
    highlightDefaultHotelId,
    allowHotelSelection = true,
  } = props;

  let usedValue = {};

  const getHotelId = ({ hotelId, hotelGroupId }) => {
    if ((hotelId === null || hotelId === undefined) && (hotelGroupId === null || hotelGroupId === undefined)) {
      return 0;
    }
    let hotelIdResult = hotelId;

    if (!allowAllHotels && hotelId === 0 && hotelGroupId === 0) {
      hotelIdResult = hotels?.[0]?.id ?? 0;
    } else if (!allowAllHotels && hotelId === 0 && hotelGroupId !== 0) {
      hotelIdResult = hotelsGroupsMap[hotelGroupId]?.hotels?.[0]?.id ?? 0;
    }

    return hotelIdResult;
  };

  // two situations are possible:
  // 1. this is on initial value
  usedValue = {
    hotelGroupId: value?.hotelGroupId,
    hotelId: getHotelId({ hotelId: value?.hotelId, hotelGroupId: value?.hotelGroupId }),
  };

  if (!value) {
    usedValue = {
      hotelGroupId: 0,
      hotelId: 0,
    };
  }

  const nameGroup = `${name}-group`;
  const nameHotel = `${name}-hotel`;

  const handleChange = (inputName, newValue) => {
    isDefaultValue = false;
    if (typeof onChange !== 'function') {
      return;
    }

    if (inputName === nameGroup) {
      // 2. this is on change
      onChange(name || id, {
        hotelGroupId: newValue,
        hotelId: getHotelId({ hotelId: hotelsGroupsMap[newValue]?.hotels[0]?.id, hotelGroupId: newValue }),
      });
    } else {
      onChange(name || id, { hotelGroupId: usedValue.hotelGroupId || 0, hotelId: newValue });
    }
  };

  if (highlightDefaultHotelId && allowHotelSelection && isDefaultValue) {
    usedValue.hotelId = usedValue?.hotelGroupId
      ? hotelsGroupsMap[usedValue?.hotelGroupId]?.hotels?.[0]?.id ?? 0
      : hotels?.[0]?.id ?? 0;
    handleChange(name, Number(usedValue.hotelId));
  }

  if (loadingList) {
    return <span>Portfolio is loading...</span>;
  }

  const groups2use = allowAllGroups
    ? [{ id: 0, groupName: getText('selectors.portfolio.allGroups') }, ...hotelsGroups]
    : hotelsGroups;

  const groupHotels = usedValue?.hotelGroupId ? hotelsGroupsMap[usedValue?.hotelGroupId]?.hotels || [] : hotels;

  const hotels2use = allowAllHotels
    ? [{ id: 0, hotelName: getText('selectors.portfolio.allHotels') }, ...groupHotels]
    : groupHotels;

  return (
    <Container id={id} data-el={dataEl}>
      <PortfolioItem>
        <SearchableDropdown
          value={usedValue?.hotelGroupId}
          name={nameGroup}
          onChange={handleChange}
          label={getText('generic.group')}
          itemName='groupName'
          valueName='id'
          items={groups2use}
          error={!!errorMsg}
          helperText={errorMsg}
          dataEl={dataEl ? `${dataEl}Group` : 'searchableDropdownPortfolioSelectorGroup'}
          disableClearable={disableClearable}
          disabled={disabled}
          width='300px'
        />
      </PortfolioItem>
      {allowHotelSelection && (
        <HotelItem>
          <SearchableDropdown
            value={usedValue?.hotelId}
            name={nameHotel}
            onChange={handleChange}
            label={getText('generic.property')}
            itemName='hotelName'
            valueName='id'
            items={hotels2use}
            dataEl={dataEl ? `${dataEl}Hroup` : 'searchableDropdownPortfolioSelectorHotel'}
            disableClearable={disableClearable}
            disabled={disabled}
          />
        </HotelItem>
      )}
    </Container>
  );
};

PortfolioSelector.displayName = 'PortfolioSelector';

PortfolioSelector.propTypes = {
  value: PropTypes.any,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  errorMsg: PropTypes.string,
  dataEl: PropTypes.string,
  disableClearable: PropTypes.bool,
  disabled: PropTypes.bool,
  allowAllGroups: PropTypes.bool,
  allowAllHotels: PropTypes.bool,
  allowHotelSelection: PropTypes.bool,
  highlightDefaultHotelId: PropTypes.bool,
};

PortfolioSelector.defaultProps = {
  dataEl: 'selectorPortfolio',
  disabled: false,
  highlightDefaultHotelId: false,
};

export { PortfolioSelector };
