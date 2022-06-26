import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox } from 'mdo-react-components';
import { FiltersContainer, FilterTitle, Form, ButtonGroup } from '../ProfitAndLoss/styled';
import { getText } from '../../utils/localesHelpers';
import { buildASTSchema } from 'graphql';

const CheckboxFilters = memo((props) => {
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
      <FilterTitle>Map To</FilterTitle>
      {filters.map((f) => (
        <p key={f.id}>
          <Checkbox
            checked={state === f.id}
            onChange={(name, value) => {
              setState(buildASTSchema ? f.id : '');
            }}
          />
          {f.accountName}
        </p>
      ))}
      <ButtonGroup>
        <Button variant='default' text={getText('generic.cancel')} onClick={() => onCancel(state)} />
        <Button variant='success' text={getText('generic.applyFilter')} onClick={() => onApply(state)} />
      </ButtonGroup>
    </FiltersContainer>
  );
});

CheckboxFilters.displayName = 'CheckboxFilters';

CheckboxFilters.propTypes = {
  filters: PropTypes.array,
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
};

export { CheckboxFilters };
