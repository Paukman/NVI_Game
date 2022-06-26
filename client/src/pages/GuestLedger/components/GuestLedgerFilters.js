import React from 'react';
import PropTypes from 'prop-types';
import { GenericForm } from 'components';
import { guestLedgerFilterConfig } from '../constants';

const GuestLedgerFilters = (props) => {
  GuestLedgerFilters.propTypes = {
    onHandleCancel: PropTypes.func,
    onHandleApplyFilters: PropTypes.func,
    onHandleCloseDrawer: PropTypes.func,
    filters: PropTypes.any,
    errors: PropTypes.any,
    filterSelections: PropTypes.any,
    onErrorHandle: PropTypes.func,
  };

  const {
    onHandleCancel,
    onHandleApplyFilters,
    onHandleCloseDrawer,
    filters,
    errors,
    filterSelections,
    onErrorHandle,
  } = props;

  const { formConfig } = guestLedgerFilterConfig(
    onHandleCancel,
    onHandleApplyFilters,
    onHandleCloseDrawer,
    filterSelections,
    onErrorHandle,
  );

  return (
    <div>
      <GenericForm formConfig={formConfig} data={filters} errors={errors} />
    </div>
  );
};

GuestLedgerFilters.displayName = 'GuestLedgerFilters';

export { GuestLedgerFilters };
