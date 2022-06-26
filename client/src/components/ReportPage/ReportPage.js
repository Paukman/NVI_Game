import React, { memo, useState, Fragment, useEffect, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import {
  Button,
  ButtonDownloadAs,
  RecursiveDataTable,
  ToolBar,
  ToolBarItem,
  InputDate,
  Drawer,
  Toggle,
  Search,
} from 'mdo-react-components';

import { getText } from 'utils/localesHelpers';
import logger from 'utils/logger';

import { DataLoading, DisplayApiErrors, DisplayNoData, DataContainer } from 'components';
import { PortfolioSelector } from '../PortoflioSelector';
import { Selector } from '../Selector';
import { AppContext, ReportContext } from '../../contexts';
import { VALUE_TYPES } from 'config/constants';
import { checkStringTypeAndConvert } from 'utils/dataManipulation';

const componentsMap = {
  PortfolioSelector: PortfolioSelector,
  InputDate: InputDate,
  Selector: Selector,
};

const buildFiltersObject = (reportFilters) => {
  if (!Array.isArray(reportFilters)) {
    return {};
  }

  return reportFilters.reduce((acc, reportFilter) => {
    if (reportFilter.filterStatusId !== 100) {
      return acc;
    }

    acc[reportFilter.filterParamName] = reportFilter.defaultValue;

    return acc;
  }, {});
};

const buildComponentAttrs = (attrs) => {
  if (typeof attrs !== 'string') {
    return [];
  }

  const parts = attrs.split(',');

  const obj = parts.reduce((acc, part) => {
    const [name, value] = part.split('=');
    const value2use = checkStringTypeAndConvert(value);

    acc[name] = value != undefined ? value2use : true;

    return acc;
  }, {});

  return obj;
};

const ReportPage = memo((props) => {
  const {
    reportName,
    reportData,
    isLoading,
    onLoad,
    filtersValues,
    onFiltersChange,
    headers,
    subHeaders,
    freezeColumns,
    toggles,
    downloadable,
    onDownload,
    downloadExclude,
    searchable,
    onSearch,
    actions,
  } = props;
  const { appPages } = useContext(AppContext);
  const { reports } = useContext(ReportContext);
  const history = useHistory();
  const [reportRequested, setReportRequested] = useState(false);
  const [requestNo, setRequestNo] = useState(1);
  const [filterState, setFilterState] = useState(null);
  const [reportDetails, setReportDetails] = useState(null);

  useEffect(() => {
    const newReportDetails = reports.reportByName[reportName];
    logger.debug('Setting report details:', newReportDetails);
    setReportDetails(newReportDetails);
  }, [reports, reportName]);

  useEffect(() => {
    if (!reportDetails) {
      return;
    }

    const newFilterState = {
      ...buildFiltersObject(reportDetails.reportFilters),
      ...(filtersValues || {}),
      ...(searchable && { keyword: filterState.keyword || '' }),
    };

    logger.debug('Setting initial filters:', newFilterState);

    setFilterState(newFilterState);

    setReportRequested(false);
  }, [filtersValues, reportDetails, searchable, filterState?.keyword]);

  const toolbarItemFilters = useMemo(() => {
    if (!Array.isArray(reportDetails?.reportFilters) || !filterState) {
      return [];
    }

    return reportDetails?.reportFilters
      .filter((reportFilter) => reportFilter.isVisible && reportFilter.filterStatusId === 100)
      .map((reportFilter) => {
        const {
          filterComponent,
          defaultValue,
          filterLabel,
          filterOptions,
          filterParamName,
          componentAttributes /*, valueTypeId*/,
        } = reportFilter || {};
        const FilterComponent = componentsMap[filterComponent];
        const componentAttrs = buildComponentAttrs(componentAttributes);

        return FilterComponent ? (
          <ToolBarItem key={filterParamName}>
            <FilterComponent
              label={filterLabel}
              name={filterParamName}
              value={filterState[filterParamName] != undefined ? filterState[filterParamName] : defaultValue}
              options={filterOptions}
              onChange={(name, value) => {
                const newFilterState = {
                  ...filterState,
                  [name]: value,
                };
                // TODO: Convert values to corresponding type taken from reportFilter.valueTypeId
                if (typeof onFiltersChange === 'function') {
                  onFiltersChange(newFilterState);
                } else {
                  setFilterState(newFilterState);
                }

                setReportRequested(false);
              }}
              {...componentAttrs}
            />
          </ToolBarItem>
        ) : null;
      });
  }, [reportDetails, filterState, onFiltersChange]);

  const toggleButtons = useMemo(() => {
    if (!reportDetails || !filterState) {
      return [];
    }

    const toggles2use = Array.isArray(reportDetails.appPage.pageToggles) ? [...reportDetails.appPage.pageToggles] : [];

    if (Array.isArray(toggles)) {
      toggles2use.push(...toggles);
    }

    return (
      <Toggle
        value={toggles2use.findIndex(
          (toggle) => toggle.isActive || location.pathname === appPages.keys[toggle.referToPageKey].url,
        )}
        onChange={(idx) => {
          if (toggles2use[idx].referToPageKey) {
            history.push(appPages.keys[toggles2use[idx].referToPageKey].url);
          } else if (toggles2use[idx].url) {
            history.push(toggles2use[idx].url);
          } else if (typeof toggles2use[idx].onClick) {
            toggles2use[idx].onClick(toggle, idx);
          }
        }}
        dataEl='toggleReportPage'
      >
        {toggles2use.map((toggle) => {
          return (
            <span key={toggle.toggleName} title={toggle.toggleTooltip}>
              {toggle.toggleName}
            </span>
          );
        })}
      </Toggle>
    );
  }, [toggles, appPages, reportDetails, history, filterState]);

  const actionButtons = useMemo(() => {
    if (!Array.isArray(actions)) {
      return [];
    }

    return actions.map((action) => {
      const { text, iconName, onClick, dataEl, disabled, title } = action || {};

      return (
        <ToolBarItem key={text || title || dataEl}>
          <Button
            iconName={iconName}
            text={text}
            variant='tertiary'
            title={title}
            onClick={onClick}
            disabled={isLoading || disabled}
            dataEl={dataEl}
          />
        </ToolBarItem>
      );
    });
  }, [actions, isLoading]);

  if (reportDetails === undefined) {
    return (
      <DisplayApiErrors
        errors={[
          {
            name: '',
            messages: [
              `No report details found for report by name "${reportName}". Please check database table "report"`,
            ],
          },
        ]}
      />
    );
  }

  return (
    <Fragment>
      <ToolBar>
        {toolbarItemFilters}
        <ToolBarItem>
          <Button
            iconName={reportRequested ? 'Refresh' : ''}
            text={reportRequested ? '' : getText('generic.go')}
            title={getText(`generic.${reportRequested ? 'refresh' : 'go'}`)}
            variant='secondary'
            onClick={() => {
              if (typeof onLoad === 'function') {
                onLoad(filterState);
                setRequestNo(requestNo + 1);
                setReportRequested(true);
              }
            }}
            disabled={isLoading}
            dataEl='buttonGo'
          />
        </ToolBarItem>
        <ToolBarItem toTheRight>{toggleButtons}</ToolBarItem>
      </ToolBar>
      <ToolBar>
        {searchable && (
          <ToolBarItem width={'320px'}>
            <Search
              label={getText('generic.search')}
              value={filterState.keyword}
              name='keyword'
              onChange={(_, value) => {
                setFilterState({
                  ...filterState,
                  keyword: value,
                });
              }}
              dataEl='searchInput'
            />
          </ToolBarItem>
        )}
        <ToolBarItem toTheRight></ToolBarItem>
        {downloadable && (
          <ToolBarItem>
            <ButtonDownloadAs
              iconName='CloudDownloadSharp'
              text=''
              variant='tertiary'
              onClick={({ value }) => onDownload({ value, fileNamePrefix: reportDetails.fileNamePrefix })}
              exclude={downloadExclude}
              disabled={isLoading || !reportRequested}
              dataEl={'buttonDownloadAs'}
            />
          </ToolBarItem>
        )}
        {actionButtons}
      </ToolBar>
      <Fragment>
        {isLoading && <DataLoading />}
        {!isLoading && <DisplayApiErrors errors={reportData.errors} />}
        {!isLoading && reportData.data.length === 0 && reportData.errors.length === 0 && (
          <DisplayNoData
            message={reportRequested ? getText('generic.noReportDataForTheDate') : getText('generic.selectFilters')}
          />
        )}
        {!isLoading && reportData.data.length > 0 && reportData.errors.length === 0 && (
          <DataContainer obsoleteData={!reportRequested}>
            <RecursiveDataTable
              key={requestNo}
              data={reportData.data}
              subHeaders={subHeaders}
              headers={headers}
              freezeColumns={freezeColumns}
              removeBottomBorder={true}
              stickyHeaders={true}
            />
          </DataContainer>
        )}
      </Fragment>
    </Fragment>
  );
});

ReportPage.displayName = 'ReportPage';

ReportPage.propTypes = {
  reportName: PropTypes.string,
  reportData: PropTypes.any,
  isLoading: PropTypes.bool,
  filtersValues: PropTypes.any,
  onLoad: PropTypes.func,
  onFiltersChange: PropTypes.func,
  headers: PropTypes.any,
  subHeaders: PropTypes.any,
  freezeColumns: PropTypes.number,
  searchable: PropTypes.bool,
  onSearch: PropTypes.func,
  downloadable: PropTypes.bool,
  onDownload: PropTypes.func,
  downloadExclude: PropTypes.arrayOf(PropTypes.string),
  toggles: PropTypes.arrayOf(
    PropTypes.shape({
      isActive: PropTypes.bool,
      toggleIcon: PropTypes.string,
      toggleName: PropTypes.string,
      toggleTooltip: PropTypes.string,
      referToPageKey: PropTypes.string,
      toggleStatusId: PropTypes.number,
      url: PropTypes.string,
      onClick: PropTypes.func,
    }),
  ),
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      iconName: PropTypes.string,
      label: PropTypes.string,
      url: PropTypes.string,
      pageKey: PropTypes.string,
      onClick: PropTypes.func,
      disabled: PropTypes.bool,
    }),
  ),
};

export { ReportPage };
