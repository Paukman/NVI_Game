import React, { memo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { ToolBarItem, Button, ToolBar } from 'mdo-react-components';
import { GenericForm } from 'components';
import { addEditGenericFormConfig } from './constants';
import { InputGroup } from './styled';

import { useMdoGlCodesAddEdit } from './hooks';
import { getText } from 'utils';

const MdoGlCodesAddEdit = memo(() => {
  const location = useLocation();
  const params = useParams();

  const pageKey = location?.state?.key ?? null;
  const mdoGlCodeId = params?.id ?? null;

  const { state, onHandleSubmit, onHandleCancel, onChange } = useMdoGlCodesAddEdit(mdoGlCodeId, pageKey);
  const { formConfig } = addEditGenericFormConfig(onHandleCancel, onHandleSubmit, onChange, state);

  return (
    <div>
      <ToolBar>
        <ToolBarItem toTheRight>
          <Button
            iconName='Close'
            text=''
            variant='tertiary'
            title={getText('generic.close')}
            onClick={onHandleCancel}
            dataEl='buttonXCancel'
          />
        </ToolBarItem>
      </ToolBar>
      <GenericForm formConfig={formConfig} data={state || {}} errors={state?.errors} />
      <InputGroup>{state?.glCode?.length === 8 ? `GL Code: ${state.glCode}` : ''} </InputGroup>
    </div>
  );
});

MdoGlCodesAddEdit.displayName = 'MdoGlCodesAddEdit';

export { MdoGlCodesAddEdit };
