import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { SearchableDropdown } from 'mdo-react-components';
import { getText } from '../../utils/localesHelpers';
import { Container } from './styled';
import { useHotelClientAccount } from '../../graphql/useHotelClientAccount';

const AccountSelector = memo((props) => {
  const { hotelClientAccountList, loadingList, MappedTo } = useHotelClientAccount();
  const { label, placeholder, value, id, name, onChange, errorMsg, dataEl, disableClearable, disabled, allowAddAll } =
    props;
  const [filters, setFilters] = useState({});

  useEffect(() => {
    // if (!loadingList && MappedTo && MappedTo.data.length === 0 && MappedTo.errors.length === 0) {
    hotelClientAccountList({
      params: {
        ...filters,
      },
      pagination: {
        page: 1,
        pageSize: 1000,
      },
    });
    // }
  }, [filters]);

  const accountNames = allowAddAll
    ? [{ id: -1, accountName: getText('account.allGroups') }, ...(MappedTo && MappedTo.data)]
    : MappedTo.data;

  return (
    <Container>
      <SearchableDropdown
        key={`${id || name}-${value}`}
        value={value}
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
            : accountNames.map((account, index) => {
                return {
                  label: account?.accountName,
                  value: account?.id,
                };
              })
        }
        error={!!errorMsg}
        helperText={errorMsg}
        dataEl={dataEl ?? `searchableDropdownAccountSelector`}
        disableClearable={disableClearable}
        disabled={disabled}
      />
    </Container>
  );
});

AccountSelector.displayName = 'AccountSelector';

AccountSelector.propTypes = {
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
  allowAddAll: PropTypes.bool,
};

AccountSelector.defaultProps = {
  label: 'Property',
  placeholder: 'Please, select a property',
  dataEl: 'selectorHotel',
  disabled: false,
};

export { AccountSelector };
