import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { ButtonsGroup } from 'mdo-react-components';
import { getText } from '../../utils/localesHelpers';

import { Container } from './styled';

const ButtonsCancelSave = memo((props) => {
  const { onCancel, onSave, inProgress, canSave, centered } = props;

  return (
    <Container centered={centered}>
      <ButtonsGroup
        direction='horizontal'
        items={[
          {
            id: 'cancel',
            text: getText('generic.cancel'),
            iconName: '',
            variant: 'default',
            dataEl: 'buttonCancel',
            width: '120px',
          },
          {
            id: 'save',
            text: getText('generic.save'),
            iconName: inProgress ? 'MoreHoriz' : '',
            variant: 'success',
            disabled: inProgress || !canSave,
            dataEl: 'buttonSave',
            width: '120px',
          },
        ]}
        onClick={(button) => {
          switch (button.id) {
            case 'cancel':
              if (typeof onCancel === 'function') {
                onCancel();
              }

              break;

            case 'save':
              if (typeof onSave === 'function') {
                onSave();
              }
              break;
          }
        }}
      />
    </Container>
  );
});

ButtonsCancelSave.displayName = 'ButtonsCancelSave';

ButtonsCancelSave.propTypes = {
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  inProgress: PropTypes.bool,
  canSave: PropTypes.bool,
  centered: PropTypes.bool,
};

export { ButtonsCancelSave };
