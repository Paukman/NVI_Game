import React, { memo } from 'react';

import { ToolBar, ToolBarItem, Button, YearSelector, ButtonDropdown } from 'mdo-react-components';
import {
  HotelSelector,
  DisplayNoData,
  DataLoading,
  DisplayApiErrors,
  PnLUnmappedSelector,
  PaginatedDataTable,
} from 'components';
import { getText } from 'utils/localesHelpers';
import { usePnLUnmapped } from './hooks';

const PnLUnmapped = memo(() => {
  const { state, onChange, displayReport, onReturn } = usePnLUnmapped();

  return (
    <>
      <ToolBar>
        <ToolBarItem>
          <HotelSelector
            value={state?.hotelId}
            name='hotelId'
            disableClearable
            disabled={state?.pageState.LOADING}
            onChange={onChange}
            helperText={state?.errors['hotelId'] || ''}
            error={!!state?.errors['hotelId']}
            required
          />
        </ToolBarItem>
        <ToolBarItem>
          <YearSelector
            name='pnlYear'
            label='Year'
            value={state?.pnlYear}
            disabled={state?.pageState.LOADING}
            yearsSince={new Date().getFullYear() - 10}
            yearsTo={new Date().getFullYear()}
            onChange={onChange}
            dataEl='selectorYear'
            maxHeight={'200px'}
          />
        </ToolBarItem>
        <ToolBarItem>
          <PnLUnmappedSelector
            label='Unmapped Selector'
            name='unmappedSelector'
            value={state?.unmappedSelector}
            onChange={onChange}
            disabled={state?.pageState.LOADING}
          />
        </ToolBarItem>
        <ToolBarItem>
          <Button
            iconName={state?.requestReport ? '' : 'Refresh'}
            text={state?.requestReport ? getText('generic.go') : ''}
            title={getText(`generic.${state?.requestReport ? 'refresh' : 'go'}`)}
            variant='secondary'
            onClick={() => displayReport()}
            dataEl='buttonGo'
          />
        </ToolBarItem>
        <ToolBarItem toTheRight>
          <ButtonDropdown
            text={getText('generic.return')}
            name='returnButton'
            onClick={onReturn}
            items={state?.returnItems}
            dataEl='buttonDropdown'
          />
        </ToolBarItem>
      </ToolBar>

      {state?.listData?.length ? (
        <PaginatedDataTable
          obsoleteData={state?.requestReport}
          expandCollapePlacement={-1}
          subHeaders={state?.subHeaders}
          items={state?.listData}
          freezeColumns={0}
          stickyHeaders={true}
        />
      ) : (
        <>
          {state?.pageState.LOADING && <DataLoading />}
          {state?.pageState.ERROR && <DisplayApiErrors errors={state?.errors} />}
          {state?.pageState.NO_DATA && <DisplayNoData message={state?.pageState.NO_DATA} />}
          {state?.pageState.DEFAULT && <DisplayNoData message={state?.pageState.DEFAULT} />}
        </>
      )}
    </>
  );
});

PnLUnmapped.displayName = 'PnLUnmapped';

export { PnLUnmapped };
