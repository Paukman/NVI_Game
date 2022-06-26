import React, { memo, Fragment, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { Button, ToolBar, ToolBarItem, Search, RemoveConfirmationDialog, InputAlert } from 'mdo-react-components';
import {
  DataLoading,
  DisplayApiErrors,
  DisplayNoData,
  KpiActions,
  KpiCategoryDropdown,
  PaginatedDataTable,
  useIfPermitted,
} from '../../components';
import { getText, search } from '../../utils/localesHelpers';
import { kpiLibraryColumnsConfig } from './kpiLibraryColumnsConfig';
import { AppContext } from '../../contexts';
import { useKpi } from '../../graphql';
import { appSettings } from '../../config/appSettings';
import logger from '../../utils/logger';
import { strReplace } from '../../utils/formatHelpers';
import { ToastContext } from '../../components/Toast';
import { getComparator, stableSort, switchDirection, direction } from '../../utils/pageHelpers';

const STATUSES = {
  INIT: 1,
  IDLE: 2,
  SAVING: 3,
  ERRORS: 4,
  SAVED: 5,
};

const KpiLibrary = memo(() => {
  const { showToast } = useContext(ToastContext);
  const {
    kpiList,
    kpis,
    kpi,
    kpisLoading,
    kpiRemove,
    //kpiRemoving,
    kpiMakeGlobal,
    //kpiMakingGlobal,
    kpiMakePrivate,
    //kpiMakingPrivate,
    kpiDuplicate,
    //kpiDuplicating
  } = useKpi();
  const history = useHistory();
  const { appPages } = useContext(AppContext);
  const [toRemove, setToRemove] = useState(null);
  const [toMakeGlobal, setToMakeGlobal] = useState(null);
  const [toMakePrivate, setToMakePrivate] = useState(null);
  const [toDuplicate, setToDuplicate] = useState(null);
  const [status, setStatus] = useState(STATUSES.INIT);
  const [filters, setFilters] = useState({
    category: -1,
    keyword: '',
  });
  const [sortData, setSortData] = useState({
    orderBy: '',
    order: '',
    items: [],
  });
  const handleFilterChange = useCallback(
    (name, value) => {
      const newFilters = {
        ...filters,
        [name]: value,
      };

      kpi.errors = [];
      setFilters(newFilters);
    },
    [setFilters, filters, kpi],
  );
  const { isPermitted } = useIfPermitted({ page: 'kpi' });

  const handleActionClick = useCallback(
    (args) => {
      const { action, dataRow } = args || {};
      kpi.errors = [];
      logger.log('KPI action clicked', { action, dataRow });

      switch (action.id) {
        case KpiActions.actions.EDIT:
          history.push(strReplace(`${appPages.keys['kpi-edit'].url}`, { id: dataRow.id }));
          break;

        case KpiActions.actions.MAKEPRIVATE:
          setToMakePrivate(dataRow);
          break;

        case KpiActions.actions.SHAREGLOBALLY:
          setToMakeGlobal(dataRow);
          break;

        case KpiActions.actions.SHARETOSELECTED:
          history.push(strReplace(`${appPages.keys['kpi-share'].url}`, { id: dataRow.id }));
          break;

        case KpiActions.actions.DUPLICATE:
          setToDuplicate({ ...dataRow });
          break;

        case KpiActions.actions.DELETE:
          setToRemove(dataRow);
          break;
      }
    },
    [kpi],
  );

  const handleKpiRemove = (kpi) => {
    showToast({
      message: getText('kpi.modals.remove.successDeletedKPI').concat(' ').concat(kpi.kpiName),
      severity: 'info',
    });
    logger.error('Remove KPI', kpi);
    kpiRemove(kpi.id);
    setToRemove(null);
  };

  const handleKpiMakeGlobal = (kpi) => {
    logger.error('Make KPI Globar', kpi);
    kpiMakeGlobal(kpi.id);
    setToMakeGlobal(null);
  };

  const handleKpiMakePrivate = (kpi) => {
    logger.error('Make KPI Private', kpi);
    kpiMakePrivate(kpi.id);
    setToMakePrivate(null);
  };

  const handleKpiDuplicate = (kpi) => {
    logger.error('Duplicate KPI', kpi);
    kpiDuplicate({
      id: kpi.id,
      kpiName: kpi.kpiName,
    });
    setStatus(STATUSES.SAVING);
  };

  useEffect(() => {
    if (status == STATUSES.SAVING) {
      if (kpi.errors.length != 0) {
        logger.debug('Loading KPI Error', kpi.errors);
        setStatus(STATUSES.ERRORS);
      } else {
        showToast({
          message: getText('kpi.modals.duplicate.successDuplicateKPI').concat(' ').concat(toDuplicate.kpiName),
        });
        logger.error('Duplicate KPI', kpi);
        setToDuplicate(null);
        setStatus(STATUSES.IDLE);
      }
    }
  }, [kpi, STATUSES]);

  const dataShow = !kpisLoading && kpis.data.length > 0 && kpis.errors.length === 0;

  const calcSelectedFilters = () => {
    let cnt = 0;

    if (filters.category != -1) {
      cnt++;
    }

    if (filters.keyword != '') {
      cnt++;
    }

    return cnt;
  };

  useEffect(() => {
    kpiList({
      params: {
        keyword: '',
        kpiCategoryId: null,
      },
    });
  }, [kpiList]);

  useMemo(() => {
    const { data } = kpis;
    const { category, keyword } = filters;

    const items = data.filter((item) => {
      const doesCategoryMatch = item.kpiCategoryId == category || category == -1;
      let found = false;

      if (keyword.length == 0 && category) {
        if (doesCategoryMatch) {
          found = true;
        }
      } else {
        if (search(item.kpiName, keyword) !== -1 && doesCategoryMatch) {
          found = true;
        }
        if (search(item.kpiFormula, keyword) !== -1 && doesCategoryMatch) {
          found = true;
        }
        if (search(item.kpiDescription, keyword) !== -1 && doesCategoryMatch) {
          found = true;
        }
      }

      if (!found) {
        return false;
      }

      return true;
    });
    setSortData({ ...sortData, items });
  }, [filters, kpis]);

  const onRequestSort = (column, dir) => {
    const { order, orderBy, items } = sortData;
    let newDirection = dir;
    let columnToSortBy = column;

    if (column === orderBy && dir === order) {
      newDirection = switchDirection(dir);
    }
    if (column !== orderBy) {
      newDirection = direction.DESC; // start descending as default for new columns
    }

    const newListData = stableSort(items, getComparator(newDirection, columnToSortBy));

    setSortData({
      order: newDirection,
      orderBy: column,
      items: newListData,
    });
  };

  return (
    <Fragment>
      <ToolBar>
        <ToolBarItem>
          <Search
            dataEl='searchInput'
            label={getText('kpi.search')}
            value={filters.keyword}
            name='keyword'
            onChange={handleFilterChange}
          />
        </ToolBarItem>
        <ToolBarItem>
          <KpiCategoryDropdown
            label={getText('kpi.category')}
            value={filters.category}
            name='category'
            onChange={handleFilterChange}
          />
        </ToolBarItem>
        <ToolBarItem toTheRight>
          {isPermitted('view') && (
            <Button
              iconName='Add'
              text=''
              variant='tertiary'
              title={appPages.keys['kpi-add']?.name}
              onClick={() => {
                history.push(appPages.keys['kpi-add'].url);
              }}
              dataEl='buttonAdd'
            />
          )}
        </ToolBarItem>
      </ToolBar>
      <Fragment>
        {kpisLoading && <DataLoading />}
        {!kpisLoading && kpis.errors.length > 0 && <DisplayApiErrors errors={kpis.errors} />}
        {!kpisLoading && kpis.data.length === 0 && kpis.errors.length === 0 && (
          <DisplayNoData message={getText('kpi.emptyData')} />
        )}
        {dataShow && (
          <PaginatedDataTable
            expandCollapePlacement={-1}
            subHeaders={kpiLibraryColumnsConfig({
              onActionClick: handleActionClick,
              disabled: !isPermitted('edit'),
            })}
            {...sortData}
            filtersApplied={calcSelectedFilters()}
            dataRowsCount={kpis.data.length}
            onRequestSort={onRequestSort}
            stickyHeaders={true}
            filtersActive={!!filters?.keyword}
            search={filters?.keyword ?? ''}
          />
        )}
      </Fragment>
      <RemoveConfirmationDialog
        open={toRemove}
        title={getText('kpi.modals.remove.title')}
        description={strReplace(getText('kpi.modals.remove.text'), { kpiName: toRemove?.kpiName })}
        onCancel={() => {
          setToRemove(null);
        }}
        onClose={() => setToRemove(null)}
        onConfirm={() => {
          handleKpiRemove(toRemove);
          setToRemove(null);
        }}
        deleteText={getText('generic.remove')}
        cancelText={getText('generic.cancel')}
      />
      <RemoveConfirmationDialog
        open={toMakeGlobal}
        title={getText('kpi.modals.makeGlobal.title')}
        description={strReplace(getText('kpi.modals.makeGlobal.text'), { kpiName: toMakeGlobal?.kpiName })}
        onCancel={() => {
          setToMakeGlobal(null);
        }}
        onClose={() => setToMakeGlobal(null)}
        onConfirm={() => {
          handleKpiMakeGlobal(toMakeGlobal);
        }}
        deleteText={getText('generic.confirm')}
        cancelText={getText('generic.cancel')}
      />
      <RemoveConfirmationDialog
        open={toMakePrivate}
        title={getText('kpi.modals.makePrivate.title')}
        description={strReplace(getText('kpi.modals.makePrivate.text'), { kpiName: toMakePrivate?.kpiName })}
        onCancel={() => {
          setToMakePrivate(null);
        }}
        onClose={() => setToMakePrivate(null)}
        onConfirm={() => {
          handleKpiMakePrivate(toMakePrivate);
        }}
        deleteText={getText('generic.confirm')}
        cancelText={getText('generic.cancel')}
      />
      <InputAlert
        open={toDuplicate}
        label={getText('kpi.modals.duplicate.label')}
        title={getText('kpi.modals.duplicate.title')}
        onClose={() => setToDuplicate(null)}
        onConfirm={(newData) => {
          toDuplicate.kpiName = newData;
          handleKpiDuplicate(toDuplicate);
        }}
        confirmText={getText('generic.confirm')}
        cancelText={getText('generic.cancel')}
        errorMsg={status == STATUSES.ERRORS ? kpi.errors[0].messages[0] : getText('kpi.modals.duplicate.required')}
      />
    </Fragment>
  );
});

KpiLibrary.displayName = 'KpiLibrary';

export { KpiLibrary };
