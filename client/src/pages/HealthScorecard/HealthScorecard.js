import React, { memo } from 'react';

import {
  ToolBar,
  ToolBarItem,
  InputDate,
  Button,
  RecursiveDataTable,
  ButtonDownloadAs,
  Drawer,
  SlideBar,
} from 'mdo-react-components';
import {
  DisplayNoData,
  DataLoading,
  DisplayApiErrors,
  DataContainer,
  GroupOnlySelector,
  PeriodSelector,
} from 'components';
import { getText } from 'utils/localesHelpers';
import { useHealthScorecard, useHealthScorecardEdit } from './hooks';
import { isDateValid } from 'utils/validators';
import { PERIOD_ITEMS } from './constants';
import { HealthScorecardEditDrawer } from './components';
import { EditDrawer } from './styled';

const HealthScorecard = memo(() => {
  const { state, onChange, displayReport, onHandleDownload, onHandleUpload, onHandleManualEntry, onRequestSort } =
    useHealthScorecard();

  const {
    state: editState,
    onHandleEdit,
    onCloseEditDrawer,
    saveColumnView,
    onUpdateColumn,
  } = useHealthScorecardEdit(displayReport);

  return (
    <>
      <ToolBar>
        <ToolBarItem>
          <GroupOnlySelector
            name={'hotelGroupId'}
            value={state?.hotelGroupId}
            onChange={onChange}
            disabled={state?.pageState.LOADING}
            disableClearable
            helperText={state?.errors['hotelGroupId'] || ''}
            error={!!state?.errors['hotelGroupId']}
            allowAllGroups
            required
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
            helperText={state?.errors['hmgGlCodeStatus'] || ''}
            error={!!state?.errors['hmgGlCodeStatus']}
          />
        </ToolBarItem>

        <ToolBarItem>
          <InputDate
            name='date'
            label={getText('generic.date')}
            value={state?.date}
            onChange={onChange}
            disabled={state?.pageState.LOADING}
            autoClose={true}
            errorMsg={getText('generic.dateErrorText')}
            dataEl='inputDate'
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
        <ToolBarItem toTheRight>
          <Button
            iconName='CloudUpload'
            variant='tertiary'
            title={getText('generic.import')}
            alt='buttonCreateKpi'
            onClick={onHandleUpload}
            disabled={false} // add you condition
            dataE='buttonUpload'
          />
        </ToolBarItem>
        <ToolBarItem>
          <ButtonDownloadAs
            iconName='CloudDownloadSharp'
            text=''
            variant='tertiary'
            onClick={onHandleDownload}
            exclude={['pdf']}
            dataEl={'buttonDownloadAs'}
            disabled={state?.listData?.length ? false : true}
          />
        </ToolBarItem>
        <ToolBarItem>
          <Button
            variant='tertiary'
            text=''
            iconName='Keyboard'
            title={getText('generic.manualEntry')}
            onClick={onHandleManualEntry}
            disabled={false} // add you condition
            dataEl='buttonManualEntry'
          />
        </ToolBarItem>
        <ToolBarItem>
          <Button
            variant='tertiary'
            text=''
            iconName='ViewWeekOutlined'
            title={getText('generic.editDescriptions')}
            onClick={onHandleEdit}
            dataEl='buttonEdit'
            disabled={state?.listData?.length ? false : true}
          />
        </ToolBarItem>
      </ToolBar>
      <div style={{ paddingBottom: '20px' }} />
      {state?.listData?.length ? (
        <DataContainer obsoleteData={state?.requestReport || state?.pageState.SORTING}>
          <RecursiveDataTable
            expandCollapePlacement={-1}
            data={[{ children: state?.listData }]}
            headers={[state?.headers]}
            subHeaders={state?.subHeaders}
            freezeColumns={0}
            stickyHeaders={true}
            order={state?.order}
            orderBy={state?.orderBy}
            onRequestSort={onRequestSort}
          />
        </DataContainer>
      ) : (
        <>
          {state?.pageState.LOADING && <DataLoading />}
          {state?.pageState.ERROR && <DisplayApiErrors errors={state?.errors} />}
          {state?.pageState.MESSAGE && <DisplayNoData message={state?.pageState.MESSAGE} />}
        </>
      )}

      <SlideBar
        title={getText('generic.columnView')}
        open={editState?.openEditDrawer}
        onCancel={() => onCloseEditDrawer()}
        onSave={saveColumnView}
        anchor={'right'}
        buttonSaveText={getText('generic.save')}
        buttonCancelText={getText('generic.cancel')}
      >
        {editState?.editData?.length ? (
          <EditDrawer>
            <HealthScorecardEditDrawer onChange={onUpdateColumn} data={editState?.editData} />
          </EditDrawer>
        ) : (
          <EditDrawer>
            {editState?.pageState.LOADING && <DataLoading />}
            {editState?.pageState.ERROR && <DisplayApiErrors errors={editState?.errors} />}
          </EditDrawer>
        )}
      </SlideBar>
    </>
  );
});

HealthScorecard.displayName = 'HealthScorecard';

export { HealthScorecard };
