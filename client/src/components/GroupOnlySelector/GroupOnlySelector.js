import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import { SearchableDropdown } from 'mdo-react-components';
import { HotelContext, GlobalFilterContext } from 'contexts';
import { getText } from 'utils/localesHelpers';
import { Container, GroupItem } from './styled';

const GroupOnlySelector = memo((props) => {
  const { hotelsGroups, loadingList } = useContext(HotelContext);
  const { assignGlobalValue } = useContext(GlobalFilterContext);
  const { value, id, name, onChange, errorMsg, dataEl, disableClearable, disabled, allowAllGroups, label } = props;

  const handleChange = (name, newValue) => {
    // clean hotelId on every hotelGroupId change
    assignGlobalValue(`hotelId`, 0);
    onChange(name, newValue);
  };

  const addGroups = allowAllGroups
    ? [{ id: 0, groupName: getText('selectors.group.allGroups') }, ...hotelsGroups]
    : hotelsGroups;

  const mapGroups = (data) => {
    const groupsMapped = data.map((group) => {
      return {
        label: group.groupName,
        value: group.id,
      };
    });
    return groupsMapped;
  };

  return (
    <Container id={id} data-el={dataEl}>
      <GroupItem>
        <SearchableDropdown
          key={`${id || name}-${value}`}
          value={value}
          id={id}
          name={name}
          onChange={handleChange}
          label={label}
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
              : [...mapGroups(addGroups)]
          }
          hasError={!!errorMsg}
          errorMsg={errorMsg}
          dataEl={dataEl ?? 'searchableDropdownGroup'}
          disableClearable={disableClearable}
          disabled={disabled}
          width='300px'
        />
      </GroupItem>
    </Container>
  );
});

GroupOnlySelector.displayName = 'GroupOnlySelector';

GroupOnlySelector.propTypes = {
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

GroupOnlySelector.defaultProps = {
  dataEl: 'selectorGroup',
  disabled: false,
  label: getText('generic.group'),
};

export { GroupOnlySelector };
