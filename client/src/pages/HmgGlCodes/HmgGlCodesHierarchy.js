import React, { memo } from 'react';
import {
  ToolBar,
  ToolBarItem,
  Toggle,
  Button,
  RecursiveDataTable,
  ButtonDownloadAs,
  Drawer,
  ButtonFilter,
  DataGridTable,
} from 'mdo-react-components';
import { HotelSelector, DisplayNoData, DataLoading, DisplayApiErrors, DataContainer } from 'components';
import { getText } from 'utils/localesHelpers';
import { GL_MODES, GL_ACTIONS, DEFAULT_FILTERS } from './constants';
import { useHmgGlCodesHierarchy } from './hooks';
import { HmgGlCodesFilters } from './components';
import { numberOfChangedFilters } from './utils';

const HmgGlCodesHierarchy = memo(() => {
  const {
    state,
    filters,
    onChange,
    onCloseFilters,
    onHandleFilters,
    onHandleResetFilters,
    onHandleApplyFilters,
    onModeChange,
    handleActions,
    onRequestTableData,
    isPermitted,
  } = useHmgGlCodesHierarchy();

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
        <ToolBarItem style={{ paddingTop: '12px' }}>
          <ButtonFilter
            variant='tertiary'
            filtersSelected={numberOfChangedFilters(filters, DEFAULT_FILTERS)}
            text={getText('generic.filters')}
            onClick={onHandleFilters}
            onReset={onHandleResetFilters}
            disabled={false}
            dataEl='buttonOpenFilters'
            resetDataEl='buttonResetFilters'
          />
        </ToolBarItem>

        <ToolBarItem toTheRight>
          <Toggle value={state?.mode} onChange={(value) => onModeChange(value)} dataEl='toggleModes'>
            <div>{GL_MODES.MAPPING.label}</div>
            <div>{GL_MODES.HIERARCHY.label}</div>
          </Toggle>
        </ToolBarItem>
      </ToolBar>
      <ToolBar>
        <ToolBarItem toTheRight>
          {isPermitted('create') && (
            <Button
              variant='tertiary'
              text=''
              iconName='Add'
              title={getText('generic.add')}
              onClick={() => handleActions({ action: GL_ACTIONS.ADD })}
              dataEl='buttonAdd'
              disabled={state?.pageState.LOADING}
            />
          )}
        </ToolBarItem>
        {isPermitted('copy') && (
          <ToolBarItem>
            <Button
              variant='tertiary'
              text=''
              iconName='FilterNone'
              title={getText('hmgGlCodes.copy')} // add your name
              onClick={() => handleActions({ action: GL_ACTIONS.COPY })}
              dataEl='buttonCopy'
              disabled={state?.listData?.length ? false : true}
            />
          </ToolBarItem>
        )}
        {/* {isPermitted('import') && (<ToolBarItem>
          <Button
            iconName='CloudUpload'
            variant='tertiary'
            title={getText('generic.import')}
            alt='buttonCreateKpi'
            onClick={() => handleActions({ action: GL_ACTIONS.UPLOAD })}
            disabled={true}
            dataE='buttonUpload'
          />
        </ToolBarItem>)} */}
        {isPermitted('download') && (
          <ToolBarItem>
            <ButtonDownloadAs
              iconName='CloudDownloadSharp'
              text=''
              variant='tertiary'
              onClick={(value) => handleActions({ action: GL_ACTIONS.DOWNLOAD, value: value.value })}
              exclude={['pdf']}
              dataEl={'buttonDownloadAs'}
              disabled={state?.listData?.length ? false : true}
            />
          </ToolBarItem>
        )}
      </ToolBar>
      {state?.listData?.length ? (
        <>
          <DataContainer obsoleteData={state?.requestReport}>
            {/* <RecursiveDataTable
              data={[{ children: state?.listData }]}
              subHeaders={state?.subHeaders}
              freezeColumns={0}
              stickyHeaders={true}
              onRequestTableData={onRequestTableData}
            /> */}
            <DataGridTable
              treeData={true}
              getTreeDataPath={(row) => row.path.split('/')}
              rows={state?.listData}
              columns={state?.subHeaders}
            />
          </DataContainer>
        </>
      ) : (
        <>
          {state?.pageState.LOADING && <DataLoading />}
          {state?.pageState.ERROR && <DisplayApiErrors errors={state?.queryErrors} />}
          {state?.pageState.NO_DATA && <DisplayNoData message={state?.pageState.NO_DATA} />}
        </>
      )}

      <Drawer open={state?.openFilters} onClose={() => onCloseFilters()} anchor={'right'}>
        <>
          <HmgGlCodesFilters
            onHandleCancel={onCloseFilters}
            onHandleApplyFilters={onHandleApplyFilters}
            filters={filters}
            errors={null}
          />
        </>
      </Drawer>
    </>
  );
});

HmgGlCodesHierarchy.displayName = 'HmgGlCodesHierarchy';

export { HmgGlCodesHierarchy };
