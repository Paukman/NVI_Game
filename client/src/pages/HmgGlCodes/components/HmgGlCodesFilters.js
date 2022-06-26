import React from 'react';
import PropTypes from 'prop-types';
import { GenericForm } from 'components';
import { filtersConfig } from '../constants';

const HmgGlCodesFilters = (props) => {
  HmgGlCodesFilters.propTypes = {
    onHandleCancel: PropTypes.func,
    onHandleApplyFilters: PropTypes.func,
    filters: PropTypes.any,
    errors: PropTypes.any,
  };

  const { onHandleCancel, onHandleApplyFilters, filters, errors } = props;

  const { formConfig } = filtersConfig(onHandleCancel, onHandleApplyFilters);

  return (
    <div>
      <GenericForm formConfig={formConfig} data={filters} errors={errors} />
    </div>
  );
};

HmgGlCodesFilters.displayName = 'HmgGlCodesFilters';

export { HmgGlCodesFilters };
