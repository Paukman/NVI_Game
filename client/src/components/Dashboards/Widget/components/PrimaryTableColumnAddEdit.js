import React, { memo } from 'react';
import { addEditColumnFormConfig, CUSTOM_COLUMN_MODE } from '../constants';
import { GenericForm } from 'components';
import { usePrimaryTableColumnAddEdit } from '../hooks';

const PrimaryTableColumnAddEdit = memo((args) => {
  const { state, onCancel, onAddNew, onUpdate } = usePrimaryTableColumnAddEdit(args);
  const { mode } = args?.args;
  const { formConfig } = addEditColumnFormConfig(
    onCancel,
    mode === CUSTOM_COLUMN_MODE.ADD ? onAddNew : onUpdate,
    mode,
    state,
  );

  return (
    <>
      <div style={{ marginTop: '20px' }}>
        <GenericForm formConfig={formConfig} data={state?.data} errors={state?.errors} />
      </div>
    </>
  );
});

PrimaryTableColumnAddEdit.displayName = 'PrimaryTableColumnAddEdit';

export { PrimaryTableColumnAddEdit };
