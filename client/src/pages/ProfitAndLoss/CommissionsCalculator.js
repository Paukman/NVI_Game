import React, { memo } from 'react';

import { ToolBar, ToolBarItem, InputDate, Button, RecursiveDataTable } from 'mdo-react-components';
import {
  DisplayNoData,
  DataLoading,
  DisplayApiErrors,
  DataContainer,
  PeriodSelector,
  PortfolioSelector,
  IfPermitted,
} from 'components';

import { getText } from 'utils/localesHelpers';
import { useCommissionsCalculator } from './hooks';
import { isDateValid } from 'utils/validators';
import { PERIOD_ITEMS } from './constants';
import { useLocation } from 'react-router-dom';

const CommissionsCalculator = memo(() => {
  const location = useLocation();
  const pageKey = location?.state?.key;

  const { state, onChange, displayReport, onHandleAddNew, onHandleCloseCommissions } =
    useCommissionsCalculator(pageKey);

  return (
    <>
      <ToolBar>
        <ToolBarItem>
          <PortfolioSelector
            name='portfolio'
            value={state?.portfolio}
            onChange={onChange}
            disabled={state?.pageState.LOADING}
            disableClearable
            allowAllGroups
            allowAllHotels={false}
          />
        </ToolBarItem>
        <ToolBarItem>
          <PeriodSelector
            autoSelectOnNoValue
            name='period'
            label={getText('generic.period')}
            value={state?.period}
            items={PERIOD_ITEMS}
            onChange={onChange}
            disabled={state?.pageState.LOADING}
            dataEl='periodSelected'
            helperText={state?.errors['period'] || ''}
            error={!!state?.errors['period']}
          />
        </ToolBarItem>

        <ToolBarItem>
          <InputDate
            name='date'
            label={getText('generic.date')}
            value={state?.date}
            onChange={onChange}
            disabled={state?.pageState.LOADING}
            dataEl='inputDate'
            autoClose={true}
            errorMsg={getText('generic.dateErrorText')}
          />
        </ToolBarItem>

        <ToolBarItem>
          <Button
            iconName={state?.requestReport ? '' : 'Refresh'}
            text={state?.requestReport ? getText('generic.go') : ''}
            title={getText(`generic.${state?.requestReport ? 'refresh' : 'go'}`)}
            variant='secondary'
            onClick={() => displayReport()}
            disabled={!isDateValid(state.date)}
            dataEl='buttonGo'
          />
        </ToolBarItem>
        {pageKey && (
          <ToolBarItem toTheRight>
            <Button
              iconName='Close'
              text=''
              variant='tertiary'
              title={getText('generic.close')}
              onClick={onHandleCloseCommissions}
              dataEl='buttonXCancel'
            />
          </ToolBarItem>
        )}
      </ToolBar>
      <ToolBar>
        <ToolBarItem toTheRight>
          <IfPermitted page='commissions-calculator' permissionType='create'>
            <Button
              iconName='Add'
              text='Add Commission'
              variant='tertiary'
              title={getText('generic.add')}
              onClick={onHandleAddNew}
              disabled={false} // add you condition
              dataEl='buttonAdd'
            />
          </IfPermitted>
        </ToolBarItem>
      </ToolBar>
      {state?.listData?.length ? (
        <DataContainer obsoleteData={state?.requestReport}>
          <RecursiveDataTable
            expandCollapePlacement={-1}
            data={[{ children: state?.listData }]}
            subHeaders={state?.subHeaders}
            freezeColumns={0}
            stickyHeaders={true}
          />
        </DataContainer>
      ) : (
        <>
          {state?.pageState.LOADING && <DataLoading />}
          {state?.pageState.ERROR && <DisplayApiErrors errors={state?.queryErrors} genericOnlyErrors />}
          {state?.pageState.NO_DATA_CALC && <DisplayNoData message={state?.pageState.NO_DATA_CALC} />}
          {state?.pageState.DEFAULT && <DisplayNoData message={state?.pageState.DEFAULT} />}
        </>
      )}
    </>
  );
});

CommissionsCalculator.displayName = 'CommissionsCalculator';

export { CommissionsCalculator };
