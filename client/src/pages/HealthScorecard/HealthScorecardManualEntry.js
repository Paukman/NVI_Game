import React, { Fragment, memo } from 'react';
import { DisplayNoData } from '../../components/DisplayNoData';
import { Button, ToolBar, ToolBarItem, YearSelector, InputField } from 'mdo-react-components';
import { DataContainer, DataLoading, DisplayApiErrors, HotelSelector, PaginatedDataTable } from 'components';
import useHealthScoreCardManualEntry from './hooks/useHealthScorecardManualEntry';
import { getText } from 'utils/localesHelpers';
import { ManualEntryConstants } from './ManualEntryConstants';

const HealthScorecardManualEntry = memo(() => {
  const { state, onChange, handleReport, handleValueChange, submitAndClose } = useHealthScoreCardManualEntry();
  return (
    <>
      <ToolBar>
        <ToolBarItem>
          <HotelSelector name='hotelId' value={state?.hotelId} onChange={onChange} />
        </ToolBarItem>
        <ToolBarItem>
          <YearSelector
            name='year'
            label='Year'
            value={state.year}
            yearSince={new Date().getFullYear() - 1}
            yearsTo={new Date().getFullYear()}
            onChange={onChange}
            maxHeight={'200px'}
            dataEl='yearSelector'
          />
        </ToolBarItem>
        <ToolBarItem>
          <Button
            iconName={state?.requestReport ? '' : 'Refresh'}
            text={state?.requestReport ? getText('generic.go') : ''}
            title={getText(`generic.${state?.requestReport ? 'refresh' : 'go'}`)}
            variant='secondary'
            onClick={() => handleReport()}
            dataEl='buttonGo'
          />
        </ToolBarItem>
      </ToolBar>
      {state?.data && state?.data.length > 0 && (
        <ToolBar>
          <ToolBarItem>
            <InputField
              name='svpName'
              value={state?.svpName || ''}
              inputProps={{ style: { fontSize: '12px', fontWeight: '400' } }}
              style={{ width: '300px' }}
              onChange={onChange}
              label={'SVP Name'}
              dataEl='inputFieldsvpName'
            />
          </ToolBarItem>
          <ToolBarItem>
            <InputField
              name='evpName'
              value={state?.evpName || ''}
              inputProps={{ style: { fontSize: '12px', fontWeight: '400' } }}
              style={{ width: '300px' }}
              onChange={onChange}
              label={'EVP Name'}
              dataEl='inputFieldevpName'
            />
          </ToolBarItem>
          <ToolBarItem toTheRight>
            <Button
              text={'Finish and Close'}
              title={'Finish and Close'}
              variant='success'
              onClick={() => submitAndClose()}
              dataEl='buttonGo'
            />
          </ToolBarItem>
        </ToolBar>
      )}
      {state?.loading && <DataLoading />}
      {!state?.loading && state?.errors.length === 0 && state?.data?.length > 0 && (
        <Fragment>
          <PaginatedDataTable
            hasStripes={false}
            expandCollapePlacement={-1}
            subHeaders={ManualEntryConstants({ onValueChange: handleValueChange })}
            items={state?.data}
            stickyHeaders={true}
          />
        </Fragment>
      )}
      {!state?.loading && state?.data.length == 0 && (
        <DisplayNoData
          message={!state?.requestReport ? getText('generic.noReportDataForTheYear') : getText('generic.selectFilters')}
        />
      )}
    </>
  );
});

HealthScorecardManualEntry.displayName = 'HealthScorecardManualEntry';

export { HealthScorecardManualEntry };
