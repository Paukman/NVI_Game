import React, { memo } from 'react';
import {
  ToolBar,
  ToolBarItem,
  Toggle,
  Button,
  ButtonDownloadAs,
  Search,
  Drawer,
  ButtonFilter,
} from 'mdo-react-components';
import {
  HotelSelector,
  DisplayNoData,
  DataLoading,
  DisplayApiErrors,
  IfPermitted,
  PaginatedDataTable,
} from 'components';
import { getText } from 'utils/localesHelpers';
import { GL_MODES, GL_ACTIONS, DEFAULT_FILTERS } from './constants';
import { useHmgGlCodesMapping } from './hooks';
import { HmgGlCodesFilters } from './components';
import { numberOfChangedFilters } from 'utils';

const HmgGlCodesMapping = memo(() => {
  const {
    state,
    filters,
    onChange,
    filterOutResults,
    onCloseFilters,
    onHandleFilters,
    onHandleResetFilters,
    onHandleApplyFilters,
    onModeChange,
    handleActions,
    onRequestTableData,
    isPermitted,
  } = useHmgGlCodesMapping();

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
        <ToolBarItem width='316px'>
          <Search
            label={getText('kpi.search')}
            name='keyword'
            value={state?.keyword || ''}
            onChange={filterOutResults}
            dataEl='searchInput'
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
        {isPermitted('upload') && (
          <ToolBarItem>
            <Button
              iconName='CloudUpload'
              variant='tertiary'
              title={getText('generic.import')}
              alt='buttonCreateKpi'
              onClick={() => handleActions({ action: GL_ACTIONS.UPLOAD })}
              dataE='buttonUpload'
            />
          </ToolBarItem>
        )}
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
          <PaginatedDataTable
            obsoleteData={state?.requestReport}
            expandCollapePlacement={-1}
            items={state?.listData}
            subHeaders={state?.subHeaders}
            freezeColumns={0}
            stickyHeaders={true}
            onRequestTableData={onRequestTableData}
            maintainPageOnUpdate={true}
            filtersActive={!!state?.keyword || !!numberOfChangedFilters(filters, DEFAULT_FILTERS)}
            filters={filters}
            search={state?.keyword ?? ''}
          />
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

HmgGlCodesMapping.displayName = 'HmgGlCodesMapping';

export { HmgGlCodesMapping };
