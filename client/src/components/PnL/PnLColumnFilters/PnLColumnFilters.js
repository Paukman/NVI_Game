import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { set, cloneDeep } from 'lodash';
import { Grid, GridItem, YearSelector, Dropdown } from 'mdo-react-components';
import { Form } from '../../Forms';
import { FilterButtons, FilterTitle } from '../../filters';
import { PnLDataModeSelector } from '../index';
import { FiltersContainer } from './styled';
import { Fragment } from 'react';
import { getText } from '../../../utils/localesHelpers';

const PnLColumnFilters = memo((props) => {
  const { filters, onApply, onCancel, minRequired, forecastNumbers } = props;
  const [state, setState] = useState({ ...filters });

  const handleChange = (name, value) => {
    const newState = cloneDeep(state);
    set(newState, name, value);
    setState(cloneDeep(newState));
  };

  const year = isNaN(state.year) ? state.date.getFullYear() : filters.year;

  const items = [];

  for (let offset = 0, years = 3; offset < years; ++offset) {
    items.push({
      label: `${year - offset}`,
      value: offset,
    });
  }

  return (
    <FiltersContainer>
      <FilterTitle>{getText('generic.editColumns')}</FilterTitle>
      <Form>
        <Grid spacing={2}>
          {filters.columns.map((column, idx) => {
            const currentYear = year - state.columns[idx].yearOffest;
            return (
              <Fragment key={idx}>
                <GridItem xs={12} md={6}>
                  <PnLDataModeSelector
                    label={`${getText('generic.column')} ${idx + 1}`}
                    name={`columns[${idx}].dataType`}
                    value={state.columns[idx].dataType}
                    onChange={handleChange}
                    dataEl={`selectorColumnDataType${idx}`}
                    allowNoSelection={minRequired < idx + 1}
                  />
                </GridItem>
                <GridItem xs={12} md={6}>
                  <div>
                    <Dropdown
                      label={getText('generic.year')}
                      name={`columns[${idx}].yearOffest`}
                      value={state.columns[idx].yearOffest}
                      items={items}
                      onChange={handleChange}
                      dataEl={`selectorColumnYear${idx}`}
                      disabled={!state.columns[idx].dataType}
                    />
                  </div>
                </GridItem>
                <GridItem xs={12} md={12}>
                  {(state.columns[idx].dataType === 'FORECAST' ||
                    state.columns[idx].dataType === 'ACTUAL_FORECAST') && (
                    <YearSelector
                      label={getText('generic.forecastNumber')}
                      name={`columns[${idx}].forecastNumber`}
                      value={state.columns[idx].forecastNumber}
                      years={forecastNumbers[currentYear]}
                      yearsSince={!forecastNumbers[currentYear] ? 1 : undefined}
                      yearsTo={!forecastNumbers[currentYear] ? 52 : undefined}
                      onChange={handleChange}
                      dataEl={`selectorColumnForecast${idx}`}
                      disabled={!state.columns[idx].dataType}
                      maxHeight={'200px'}
                    />
                  )}
                </GridItem>
              </Fragment>
            );
          })}
        </Grid>
      </Form>
      <FilterButtons onCancel={onCancel} onApply={() => onApply(state)} />
    </FiltersContainer>
  );
});

PnLColumnFilters.displayName = 'PnLColumnFilters';

PnLColumnFilters.propTypes = {
  filters: PropTypes.any,
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
  minRequired: PropTypes.number,
  forecastNumbers: PropTypes.any,
};

export { PnLColumnFilters };
