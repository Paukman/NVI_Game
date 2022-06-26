import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { ButtonDropdown, Button } from 'mdo-react-components';
import { getText } from '../../../utils/localesHelpers';

export const actions = {
  MAKEPRIVATE: 'MAKEITPRIVATE',
  SHAREGLOBALLY: 'SHAREGLOBALLY',
  SHARETOSELECTED: 'SHARETOSELECTED',
  EDIT: 'EDIT',
  DUPLICATE: 'DUPLICATE',
  DELETE: 'DELETE',
};

const items = [
  {
    id: actions.MAKEPRIVATE,
    label: getText('selectors.kpiActions.makePrivate'),
  },
  {
    id: actions.SHAREGLOBALLY,
    label: getText('selectors.kpiActions.shareGlobally'),
  },
  {
    id: actions.SHARETOSELECTED,
    label: getText('selectors.kpiActions.shareToSelected'),
  },
  {
    id: actions.EDIT,
    label: getText('selectors.kpiActions.edit'),
  },
  {
    id: actions.DUPLICATE,
    label: getText('selectors.kpiActions.duplicate'),
  },
  {
    id: actions.DELETE,
    label: getText('selectors.kpiActions.delete'),
  },
];

const KpiActions = memo((props) => {
  const { id, text, iconName, disabled, onClick, variant, disabledItems } = props;

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
      dataEl='buttonDropdown'
    />
  );
});

KpiActions.displayName = 'KpiActions';

KpiActions.variants = Button.variants;

KpiActions.actions = actions;

KpiActions.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string,
  iconName: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(KpiActions.variants),
  disabledItems: PropTypes.arrayOf(Object.keys(actions)),
};

KpiActions.defaultProps = {
  variant: 'none',
  iconName: 'MoreVert',
  disabledItems: [],
};

export { KpiActions };
