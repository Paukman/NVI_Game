import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { ButtonsGroup } from 'mdo-react-components';

import { getText } from '../../../utils/localesHelpers';

import { Container } from './styled';

const Buttons = [
  {
    id: 'cancel',
    iconName: '',
    variant: 'default',
    text: getText('generic.cancel'),
    dataEl: 'buttonFiltersCancel',
  },
  {
    id: 'ok',
    iconName: '',
    variant: 'success',
    text: getText('generic.applyFilter'),
    dataEl: 'buttonFiltersApply',
  },
];

const FilterButtons = memo((props) => {
  const { onApply, onCancel } = props;

  return (
    <Container>
      <ButtonsGroup
        items={Buttons}
        onClick={(button) => {
          if (button.id === 'ok') {
            if (typeof onApply === 'function') {
              onApply();
            }
          } else {
            if (typeof onCancel === 'function') {
              onCancel();
            }
          }
        }}
      />
    </Container>
  );
});

FilterButtons.displayName = 'FilterButtons';

FilterButtons.propTypes = {
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
};

export { FilterButtons };
