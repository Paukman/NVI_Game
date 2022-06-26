import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';

import { Button } from 'mdo-react-components';

import { getText } from '../../utils/localesHelpers';
import { FilterPnLDepartments, FilterPnLMdoGlCodes, FilterStatusActiveInactive } from './../../components/filters';

import { FiltersContainer, FilterTitle, Form, ButtonGroup } from './styled';

const HmgGlCodeFilters = memo((props) => {
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
      <FilterTitle>Filters</FilterTitle>
      <Form>
        <FilterPnLMdoGlCodes
          label={'MDO GL Code'}
          name='filterMdoGlCode'
          value={state.filterMdoGlCode}
          onChange={handleChange}
        />
        <FilterPnLDepartments name='filterMdoDepartment' value={state.filterMdoDepartment} onChange={handleChange} />
        <FilterStatusActiveInactive
          label={'Status'}
          name='filterStatus'
          value={state.filterStatus}
          onChange={handleChange}
        />
      </Form>
      <ButtonGroup>
        <Button iconName='Block' variant='default' text={getText('generic.cancel')} onClick={() => onCancel(state)} />
        <Button
          variant='primary'
          iconName='Check'
          text={getText('generic.applyFilter')}
          onClick={() => onApply(state)}
        />
      </ButtonGroup>
    </FiltersContainer>
  );
});

HmgGlCodeFilters.displayName = 'HmgGlCodeFilters';

HmgGlCodeFilters.propTypes = {
  filters: PropTypes.any,
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
};

export { HmgGlCodeFilters };
