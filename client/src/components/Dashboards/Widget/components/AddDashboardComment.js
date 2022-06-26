import React, { memo } from 'react';

import { GenericForm } from 'components';
import { addDashboardCommentConfig } from '../constants';
import { useAddDashboardComment } from '../hooks';

const AddEditDashboardComment = memo((args) => {
  const { state, onHandleSave, onHandleCancel, onErrorHandle } = useAddDashboardComment(args);
  const { formConfig } = addDashboardCommentConfig(onHandleCancel, onHandleSave, state, onErrorHandle);

  return (
    <div>
      <GenericForm formConfig={formConfig} data={state || {}} errors={state?.errors} />
    </div>
  );
});

AddEditDashboardComment.displayName = 'AddEditDashboardComment';

export { AddEditDashboardComment };
