import React, { memo } from 'react';

import {
  ToolBar,
  ToolBarItem,
  ButtonDownloadAs,
  Search,
  ButtonFilter,
  Label,
  InputDate,
  Button,
  DataGridTable,
} from 'mdo-react-components';
import { DisplayNoData, DataLoading, DisplayApiErrors, PaginatedDataTable, GroupOnlySelector } from 'components';
import { getText } from 'utils/localesHelpers';
import { DEFAULT_FILTERS } from './constants';
import { useGuestLedgerGet } from './hooks';
import { timestampToShortLocal, isDateValid, isValidDate } from 'utils';

import { numberOfChangedFilters } from 'utils';

const GuestLedger = memo(() => {
  const {
    guestLedgerState: state,
    onChange,
    onHandleDownload,
    filterOutResults,
    onHandleExtraButton2,
    onHandleFilters,
    onHandleResetFilters,
    onRequestSort,
    filters,
    onRequestTableData,
    fetchReport,
  } = useGuestLedgerGet();

  return (
    <>
      <ToolBar>
        <ToolBarItem>
          <GroupOnlySelector
            name={'hotelGroupId'}
            value={state?.hotelGroupId}
            onChange={onChange}
            helperText={state?.errors['hotelGroupId'] || ''}
            error={!!state?.errors['hotelGroupId']}
            allowAllGroups
          />
        </ToolBarItem>
        <ToolBarItem width='170px'>
          <InputDate
            label={getText('generic.date')}
            name='latestDate'
            value={state?.latestDate}
            onChange={onChange}
            dataEl='inputDateLatestDate'
          />
        </ToolBarItem>
        <ToolBarItem width='316px'>
          <Search
            label={getText('kpi.search')}
            name='keyword'
            //value={state?.keyword} // search is internaly handling value, we need something inside to be able to change it....
            onChange={filterOutResults}
            dataEl='searchInput'
          />
        </ToolBarItem>
        <ToolBarItem>
          <Button
            iconName={state?.requestReport ? '' : 'Refresh'}
            text={state?.requestReport ? getText('generic.go') : ''}
            title={getText(`generic.${state?.requestReport ? 'refresh' : 'go'}`)}
            variant='secondary'
            onClick={() => fetchReport()}
            // zero is still valid, have to do it like this
            disabled={
              !isDateValid(state.latestDate) ||
              state?.hotelGroupId === null ||
              state?.hotelGroupId === undefined ||
              state?.hotelGroupId === ''
            }
            dataEl='buttonGo'
          />
        </ToolBarItem>
        <ToolBarItem>
          <ButtonFilter
            variant='tertiary'
            filtersSelected={numberOfChangedFilters(filters, DEFAULT_FILTERS)}
            text={getText('generic.filters')}
            onClick={onHandleFilters}
            onReset={onHandleResetFilters}
            disabled={!state?.listDataSorting?.length || state?.requestReport}
            dataEl='buttonOpenFilters'
            resetDataEl='buttonResetFilters'
          />
        </ToolBarItem>
      </ToolBar>
      <ToolBar>
        <Label style={{ paddingBottom: '10px', paddingLeft: '8px', color: '#3b6cb4', fontWeight: 'bold' }}>
          {state?.listData?.length > 0 &&
            isValidDate(state?.latestDate) &&
            !state?.requestReport &&
            timestampToShortLocal({
              timestamp: state?.latestDate,
              format: 'dddd,MMMM D,YYYY',
            })}
        </Label>
        <ToolBarItem toTheRight>
          <ButtonDownloadAs
            iconName='CloudDownloadSharp'
            title={getText('generic.download')}
            text=''
            variant='tertiary'
            onClick={onHandleDownload}
            exclude={['pdf']}
            dataEl={'buttonDownloadAs'}
            disabled={state?.listData?.length <= 0}
          />
        </ToolBarItem>
      </ToolBar>
      {!!state.listData.length ? (
        <>
          {/* <PaginatedDataTable
            obsoleteData={state?.requestReport}
            expandCollapePlacement={-1}
            subHeaders={state?.subHeaders}
            items={state?.listData}
            dataIdField='id'
            order={state?.order}
            orderBy={state?.orderBy}
            onRequestSort={onRequestSort}
            freezeColumns={0}
            stickyHeaders={true}
            onRequestTableData={onRequestTableData}
            maintainPageOnUpdate={true}
            filtersActive={!!state?.keyword || !!numberOfChangedFilters(filters, DEFAULT_FILTERS)}
            search={state?.keyword ?? ''}
            filters={filters}
          /> */}
          <DataGridTable rows={state?.listData} columns={state?.subHeaders} />
        </>
      ) : (
        <>
          {state?.pageState.LOADING && <DataLoading />}
          {state?.pageState.ERROR && <DisplayApiErrors errors={state?.queryErrors} />}
          {state?.pageState.DEFAULT && <DisplayNoData message={state?.pageState.DEFAULT} />}
        </>
      )}
    </>
  );
});

GuestLedger.displayName = 'GuestLedger';

export { GuestLedger };
