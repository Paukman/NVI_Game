import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { ButtonDropdown, Button } from 'mdo-react-components';
import { getText } from '../../utils/localesHelpers';
import { useIfPermitted } from 'components/IfPermitted';

export const actions = {
  PRINT: 'PRINT',
  MARK_RECEIVED: 'MARK_RECEIVED',
  MARK_ACTIVE: 'MARK_ACTIVE',
};

const items = [
  {
    id: actions.PRINT,
    label: getText('generic.print'),
  },
  {
    id: actions.MARK_RECEIVED,
    label: getText('po.markReceived'),
  },
  {
    id: actions.MARK_ACTIVE,
    label: getText('po.markActive'),
  },
];

const PurchaseOrderMoreMenu = memo((props) => {
  const { id, text, iconName, disabled, onClick, variant, disabledItems, poReceivedAt } = props;

  const items2use = items.reduce((allItems, item) => {
    if (
      item.id === actions.PRINT ||
      (item.id === actions.MARK_RECEIVED && !poReceivedAt) ||
      (item.id === actions.MARK_ACTIVE && poReceivedAt)
    ) {
      allItems.push({
        ...item,
        disabled: disabledItems.indexOf(item.id) !== -1,
      });
    }
    return allItems;
  }, []);
  const { isPermitted } = useIfPermitted({ page: 'purchase-orders-edit' });

  return (
    isPermitted('view') && (
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
    )
  );
});

PurchaseOrderMoreMenu.displayName = 'PurchaseOrderMoreMenu';

PurchaseOrderMoreMenu.variants = Button.variants;

PurchaseOrderMoreMenu.actions = actions;

PurchaseOrderMoreMenu.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string,
  iconName: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(PurchaseOrderMoreMenu.variants),
  disabledItems: PropTypes.arrayOf(Object.keys(actions)),
  poReceivedAt: PropTypes.element,
};

PurchaseOrderMoreMenu.defaultProps = {
  variant: 'none',
  iconName: 'MoreVert',
  disabledItems: [],
  poReceivedAt: null,
};

export { PurchaseOrderMoreMenu };
