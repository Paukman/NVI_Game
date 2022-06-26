import React, { memo } from 'react';
import { LinkActions } from 'mdo-react-components';
import { buttonEditGrey, buttonRemoveGrey, buttonMakeDefault } from '../constants';
import { ViewItemInner, ViewItemOuter, ViewText } from '../styled';

export const PnLViewTable = memo((props) => {
  const { data, onHandleActions } = props;

  if (!data) return null;

  return data.map((obj) => {
    let viewActionButtons = [];
    if (obj.permissionUpdate) {
      viewActionButtons.push(buttonEditGrey);
    }
    if (obj.permissionDelete) {
      viewActionButtons.push(buttonRemoveGrey);
    }

    return (
      <ViewItemOuter key={obj.id}>
        <ViewItemInner section={obj.section} defaultViewId={obj.defaultViewId}>
          <ViewText singleLine={obj.name?.length > 50}>{obj.name}</ViewText>
          {!obj?.section && !obj?.defaultViewId && (
            <LinkActions
              noPadding
              hasFont
              items={buttonMakeDefault}
              onClick={(button) => onHandleActions(button, obj)}
            />
          )}
          {obj?.defaultViewId && <div>{'Default View'}</div>}
        </ViewItemInner>
        <div style={{ paddingLeft: '12px' }}></div>
        <LinkActions noPadding items={viewActionButtons} onClick={(button) => onHandleActions(button, obj)} />
      </ViewItemOuter>
    );
  });
});

PnLViewTable.displayName = 'PnLViewTable';
