import React, { memo, useEffect, useContext, useState, Fragment, useCallback } from 'react';
import { flatten } from 'lodash';
import { useParams, useHistory } from 'react-router-dom';
import { Button, colors, ToolBar, ToolBarItem, DragDropList } from 'mdo-react-components';

import { useDashboard, useDashboardWidget } from '../../graphql';
import { AppContext } from 'contexts';
import { DataLoading, DisplayApiErrors, ButtonsCancelSave, DisplayNoData } from 'components';
import { useOrderCustomColumn } from './hooks/useOrderCustomColumn';
import logger from 'utils/logger';
import { getText } from 'utils/localesHelpers';
import { strReplace } from 'utils/formatHelpers';
import { StyledDragDropList, StyledList, StyledButton } from './styled';
/**
 * TODO: Complete the page when drag-and-drop list is implemented
 *
 * Make sure that when drag and drop happens then `widgets` state gets updated with new order
 */
const WIDTH = 265;
const PrimaryTableColumnOrder = memo(() => {
  const params = useParams();
  const history = useHistory();
  const { location } = useHistory();
  const { appPages } = useContext(AppContext);
  const [back, setBack] = useState(false);
  const { orderColumnsId, customTableRowColumnUpdateSetOrder } = useOrderCustomColumn();
  const columnsValue = location?.state?.customTable?.rowsAndColumns?.reduce((acc, item) => {
    if (!item?.thisIsRow) acc = [...acc, { ...item, label: item?.name }];
    return acc;
  }, []);

  const [columns, setColumns] = useState(columnsValue || []);

  useEffect(() => {}, []);
  const goBack = useCallback(() => {
    history.push(strReplace(appPages.keys['dashboards'].url, params));
  }, [history, appPages, params]);

  const handleChangeOrder = (value) => {
    console.log('Columns order has changed to:', value);
    setColumns(value);
  };

  const handleClickSave = () => {
    orderColumnsId({
      customTableId: location?.state?.customTable?.id,
      customTableColumsId: columns?.map((item) => item?.id),
    });
    setBack(true);
  };

  useEffect(() => {
    if (back && !customTableRowColumnUpdateSetOrder) goBack();
  }, [back, customTableRowColumnUpdateSetOrder]);

  return (
    <Fragment>
      <ToolBar>
        <ToolBarItem toTheRight>
          <Button
            iconName='Close'
            variant='tertiary'
            onClick={() => {
              goBack();
            }}
            dataEl='buttonClose'
          />
        </ToolBarItem>
      </ToolBar>
      <Fragment>
        {columns.length > 0 ? (
          <Fragment>
            <StyledList>
              <StyledDragDropList>
                <DragDropList
                  itemsData={columns}
                  onChange={handleChangeOrder}
                  backgrounds={{
                    background: colors.white,
                    draggingBackground: colors.blue,
                    draggingOverBackground: colors.grey,
                  }}
                  width={'auto'}
                />
              </StyledDragDropList>
              <StyledButton>
                <ButtonsCancelSave
                  canSave
                  onCancel={() => goBack()}
                  onSave={() => {
                    handleClickSave();
                  }}
                  centered
                  inProgress={customTableRowColumnUpdateSetOrder}
                />
              </StyledButton>
            </StyledList>
          </Fragment>
        ) : null}
        {columns.length === 0 ? <DisplayNoData message={getText('dashboard.noTable')} /> : null}
      </Fragment>
    </Fragment>
  );
});

PrimaryTableColumnOrder.displayName = 'PrimaryTableColumnOrder';

export { PrimaryTableColumnOrder };
