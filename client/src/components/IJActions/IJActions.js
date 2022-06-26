import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { ButtonDropdown, Button } from 'mdo-react-components';
import { getText } from '../../utils/localesHelpers';

export const actions = {
  ADD: 'ADD',
  IMPORT: 'IMPORT',
  DOWNLOAD: 'DOWNLOAD',
  SYNC: 'SYNC',
};

const items = [
  {
    id: actions.ADD,
    label: getText('selectors.ijActions.add'),
    icon: 'Add',
  },
  {
    id: actions.SYNC,
    label: getText('selectors.ijActions.sync'),
    icon: 'Sync',
  },
];

const IJActions = memo((props) => {
  const { id, text, iconName, disabled, onClick, variant, disabledItems, dataEl } = props;
  const items2use = items.map((item) => {
    return {
      ...item,
      disabled: disabledItems.indexOf(item.id) !== -1,
    };
  });

  return (
    <ButtonDropdown
      id={id}
      text={text}
      iconName={iconName}
      disabled={disabled}
      onClick={onClick}
      variant={variant}
      items={items2use}
      dataEl={dataEl ?? 'buttonDropdownIJActions'}
    />
  );
});

IJActions.displayName = 'IJActions';

IJActions.variants = Button.variants;

IJActions.actions = actions;

IJActions.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string,
  iconName: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(IJActions.variants),
  disabledItems: PropTypes.arrayOf(Object.keys(actions)),
};

IJActions.defaultProps = {
  variant: 'tertiary',
  iconName: 'MoreVert',
  disabledItems: [],
};

export { IJActions };
