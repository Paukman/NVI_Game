import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import { SearchableDropdown } from 'mdo-react-components';
import { HotelContext } from '../../contexts';
import { getText } from '../../utils/localesHelpers';
import { Container, GroupItem, HotelItem } from './styled';
import logger from '../../utils/logger';

const GroupSelector = memo((props) => {
  const { hotelsGroups, loadingList } = useContext(HotelContext);
  const { value, id, name, onChange, errorMsg, dataEl, disableClearable, disabled, allowAllGroups, label } = props;

  if (loadingList) {
    return <span>Groups is loading...</span>;
  }

  if (value == null) {
    value = {
      hotelGroupId: 0,
      hotelId: 0,
    };
  }

  const handleChange = (name, newValue) => {
    if (typeof onChange !== 'function') {
      return;
    }

    onChange(name || id, { hotelGroupId: newValue || 0, hotelId: 0 });
  };

  const groups2use = allowAllGroups
    ? [{ id: 0, groupName: getText('selectors.portfolio.allGroups') }, ...hotelsGroups]
    : hotelsGroups;

  return (
    <Container id={id} data-el={dataEl}>
      <GroupItem>
        <SearchableDropdown
          value={value?.hotelGroupId}
          name={name}
          onChange={handleChange}
          label={label}
          itemName='groupName'
          valueName='id'
          items={groups2use}
          error={!!errorMsg}
          helperText={errorMsg}
          dataEl={dataEl ?? `searchableDropdownGroupSelector`}
          disableClearable={disableClearable}
          disabled={disabled}
          width='300px'
        />
      </GroupItem>
    </Container>
  );
});

GroupSelector.displayName = 'GroupSelector';

GroupSelector.propTypes = {
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
  label: PropTypes.string,
};

GroupSelector.defaultProps = {
  dataEl: 'selectorGroup',
  disabled: false,
  label: getText('generic.group'),
};

export { GroupSelector };
