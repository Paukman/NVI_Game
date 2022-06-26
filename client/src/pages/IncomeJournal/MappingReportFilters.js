import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Dropdown } from 'mdo-react-components';
import { getText } from '../../utils/localesHelpers';
import { FilterContainer, FilterTitle, FilterButtons, PmsTypeSelector } from '../../components';
import { Form } from './styled';

const hasAmountItems = [
  {
    label: 'All',
    value: 'ALL',
  },
  {
    label: 'Have Amount',
    value: 'AMOUNT',
  },
  {
    label: "Don't Have Amount",
    value: 'NO-AMOUNT',
  },
];

const mappedItems = [
  {
    label: 'All',
    value: 'ALL',
  },
  {
    label: 'Mapped',
    value: 'MAPPED',
  },
  {
    label: 'Unmapped',
    value: 'UNMAPPED',
  },
];

const MappingReportFilters = memo((props) => {
  const { filters, onApply, onCancel } = props;
  const [state, setState] = useState({ ...filters });

  const handleChange = (name, value) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  return (
    <FilterContainer>
      <FilterTitle>Filters</FilterTitle>
      <Form>
        <PmsTypeSelector
          label='PMS Type'
          name='pmsType'
          value={state.pmsType}
          onChange={handleChange}
          excludeItems={PmsTypeSelector.notAllowed}
        />
        <Dropdown
          items={hasAmountItems}
          label='Has Amount'
          name='hasAmount'
          value={state.hasAmount}
          onChange={handleChange}
        />
        <Dropdown items={mappedItems} label='Mapped' name='mapped' value={state.mapped} onChange={handleChange} />
      </Form>
      <FilterButtons onApply={() => onApply(state)} onCancel={onCancel} />
    </FilterContainer>
  );
});

MappingReportFilters.displayName = 'MappingReportFilters';

MappingReportFilters.propTypes = {
  filters: PropTypes.any,
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
};

export { MappingReportFilters };
