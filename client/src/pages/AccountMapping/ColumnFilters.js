import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown } from 'mdo-react-components';
import { FiltersContainer, FilterTitle, Form, ButtonGroup } from '../ProfitAndLoss/styled';
import { getText } from '../../utils/localesHelpers';

const ColumnFilters = memo((props) => {
  const { filters, onApply, onCancel } = props;
  const [state, setState] = useState({ ...filters });

  const handleChange = (name, value) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  return (
    <FiltersContainer>
      <FilterTitle>{getText('generic.filters')}</FilterTitle>
      <Form>
        <Dropdown
          value={state.ms}
          name={'ms'}
          disabled={false}
          onChange={handleChange}
          label={'Mapping Status'}
          items={[
            {
              label: 'All(Mapped, UnMapped)',
              value: 0,
            },
            {
              label: 'Mapped',
              value: 1,
            },
            {
              label: 'UnMapped',
              value: 2,
            },
          ]}
        />
      </Form>
      <ButtonGroup>
        <Button variant='default' text={getText('generic.cancel')} onClick={() => onCancel(state)} />
        <Button variant='success' text={getText('generic.applyFilter')} onClick={() => onApply(state)} />
      </ButtonGroup>
    </FiltersContainer>
  );
});

ColumnFilters.displayName = 'ColumnFilters';

ColumnFilters.propTypes = {
  filters: PropTypes.any,
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
};

export { ColumnFilters };
