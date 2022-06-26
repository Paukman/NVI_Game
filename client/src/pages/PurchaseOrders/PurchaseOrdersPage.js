import React, { memo, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  ToolBar,
  ToolBarItem,
  InputDate,
  Content,
  SearchableDropdown,
  Search,
  ButtonDownloadAs,
} from 'mdo-react-components';

import { debounce } from 'lodash';

import { HotelSelector, DisplayNoData, DataLoading, DisplayApiErrors, IfPermitted } from 'components';
import { PurchaseOrderPaginatedDataTable } from './components';
import { getText } from 'utils/localesHelpers';
import { AppContext } from 'contexts';
import { mappingPurchaseOrderColumns } from './constants';
import { PurchaseOrderContext } from 'providers/PurchaseOrderProvider';

const PurchaseOrdersPage = memo(() => {
  const history = useHistory();
  const { appPages } = useContext(AppContext);

  // use provider, not directly from the hook
  const { listing } = useContext(PurchaseOrderContext);
  const {
    state,
    onChange,
    listPurchaseOrders,
    onRequestSort,
    filterOutResults,
    onPurchaseOrderSelect,
    onHandleDownload,
    onHandleMoreOptions,
    allDataIsValid,
  } = listing;

  return (
    <>
      <ToolBar>
        <ToolBarItem>
          <HotelSelector addAll name='hotelId' value={state?.hotelId} onChange={onChange} />
        </ToolBarItem>
        <ToolBarItem width='300px'>
          <SearchableDropdown
            label={getText('po.vendor')}
            name='vendorId'
            items={state?.vendorsMapped || []}
            value={state?.vendorId || null}
            onChange={onChange}
            dataEl='searchableDropdownVendor'
          />
        </ToolBarItem>
        <ToolBarItem>
          <InputDate
            label={getText('generic.fromDate')}
            name='fromDate'
            value={state?.fromDate}
            onChange={onChange}
            errorMsg={getText('generic.dateErrorText')}
            dataEl='inputDateFromDate'
          />
        </ToolBarItem>
        <ToolBarItem>
          <InputDate
            label={getText('generic.toDate')}
            name='toDate'
            value={state?.toDate}
            onChange={onChange}
            errorMsg={getText('generic.dateErrorText')}
            dataEl='inputDateToDate'
          />
        </ToolBarItem>
        <ToolBarItem>
          <Button
            iconName={state?.requestReport ? '' : 'Refresh'}
            title={getText(`generic.${state?.requestReport ? 'go' : 'refresh'}`)}
            text={state?.requestReport ? getText('generic.go') : ''}
            variant='secondary'
            onClick={() => listPurchaseOrders()}
            disabled={!allDataIsValid()}
            dataEl='buttonGo'
          />
        </ToolBarItem>
      </ToolBar>

      <Content mt={-16}>
        <ToolBar>
          <ToolBarItem width='316px'>
            <Search
              label={getText('kpi.search')}
              name='keyword'
              value={state?.keyword || ''}
              onChange={debounce(filterOutResults, 500)}
              dataEl='searchInput'
            />
          </ToolBarItem>
          <ToolBarItem toTheRight>
            <IfPermitted page='purchase-orders-add' permissionType='view'>
              <Button
                iconName='Add'
                text=''
                variant='tertiary'
                title={getText('generic.add')}
                onClick={() => {
                  history.push(appPages.keys['purchase-orders-add'].url);
                }}
                dataEl='buttonAdd'
              />
            </IfPermitted>
          </ToolBarItem>
          <ToolBarItem>
            <IfPermitted page='purchase-orders' permissionType='view'>
              <ButtonDownloadAs
                iconName='CloudDownloadSharp'
                text=''
                variant='tertiary'
                onClick={onHandleDownload}
                exclude={['pdf']}
                dataEl={'buttonDownloadAs'}
              />
            </IfPermitted>
          </ToolBarItem>
        </ToolBar>
      </Content>
      {state?.listData?.length ? (
        <>
          <PurchaseOrderPaginatedDataTable
            obsoleteData={state?.requestReport}
            expandCollapePlacement={-1}
            subHeaders={mappingPurchaseOrderColumns({ onPurchaseOrderSelect, onHandleMoreOptions })}
            items={state?.listData}
            dataIdField='poId'
            order={state?.order}
            orderBy={state?.orderBy}
            onRequestSort={onRequestSort}
            stickyHeaders={true}
            maintainPageOnUpdate={true}
            search={state?.keyword}
            filtersActive={!!state?.keyword}
          />
        </>
      ) : (
        <>
          {state?.pageState.LOADING && <DataLoading />}
          {state?.pageState.ERROR && <DisplayApiErrors errors={state?.errors} />}
          {state?.pageState.MESSAGE && <DisplayNoData message={state?.pageState.MESSAGE} />}
        </>
      )}
    </>
  );
});

PurchaseOrdersPage.displayName = 'PurchaseOrders';

export { PurchaseOrdersPage };
