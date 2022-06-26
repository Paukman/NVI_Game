import React from 'react';
import { GL_CODE_STATUS, DEFAULT_FILTERS, GL_ACTIONS, SEARCH_EXCLUDE_LIST, pageState } from './constants';
import { getText, findDepth, exportToXLSX, buildDownloadableFilename, findInObject, logger } from 'utils';
import { buttonEditGrey, buttonRemoveGrey } from 'config/actionButtons';
import { Switch, LinkActions, Button, buildHierarchy, mapArrayBy } from 'mdo-react-components';
import { MdoGlCodeSelector } from 'components';
import { DownloadableReportNames } from 'config/downlodableReportNames';
import { camelCase, isArray } from 'lodash';
import { appSettings } from 'config/appSettings';
import { MdoWrapper } from './styled';

export const filterOutHmgGLCodes = (hmgGlCodes, filters, departmentCodes, departmentNames, mdoGlCodeNames, keyword) => {
  let listData = [];

  // add more conditions here if needed
  if (Array.isArray(hmgGlCodes) && hmgGlCodes?.length) {
    listData = hmgGlCodes.reduce((acc, cur) => {
      if (
        (filters?.filterStatus === 'ACTIVE' && cur?.statusId !== GL_CODE_STATUS.ACTIVE) ||
        (filters?.filterStatus === 'INACTIVE' && cur?.statusId !== GL_CODE_STATUS.DISABLED) ||
        (filters?.filterMdoGlCode === 'MAPPED' && (!cur?.mdoGlCode || cur?.mdoGlCode === 'NOTFOUND')) ||
        (filters?.filterMdoGlCode === 'UNMAPPED' && cur?.mdoGlCode) ||
        (filters?.filterMdoGlCode === 'NOTFOUND' && cur?.mdoGlCode !== 'NOTFOUND') ||
        (filters?.filterMdoDepartment !== 'ALL' && departmentCodes?.[cur?.mdoGlCode] !== filters?.filterMdoDepartment)
      ) {
        return acc;
      } else {
        // no need to run on render if we have values
        const mdoGlCodeName = mdoGlCodeNames?.[cur.mdoGlCode] ?? cur.mdoGlCode ?? '';
        const departmentName = departmentNames?.[cur?.mdoGlCode] ?? '';
        acc.push({ ...cur, mdoGlCodeName, departmentName });
        return acc;
      }
    }, []);
  }

  let matchingList = listData;
  // refilter again if we're in the midlle of search...
  if (keyword) {
    matchingList = filterOutResultsInList(listData, keyword, SEARCH_EXCLUDE_LIST);
  }

  return { listData: matchingList };
};

export const mapHmgGlCodesMappingColumns = (handleActions, disabledItems, isPermitted) => {
  let actionsButtons = [];
  if (isPermitted('edit')) {
    actionsButtons.push(buttonEditGrey);
  }
  if (isPermitted('remove')) {
    actionsButtons.push(buttonRemoveGrey);
  }

  const subHeaders = [
    {
      field: 'hmgGlCode',
      headerName: getText('generic.hmgGlCode'),
      align: 'left',
      width: 150,
    },
    { field: 'displayName', headerName: getText('generic.displayName'), width: 400, minWidth: 100 },
    {
      field: 'mdoGlCodeName',
      headerName: getText('generic.mdoGlCode'),
      width: 400,
      sortable: false,
      disableFlex: true,
      // eslint-disable-next-line
      onRender: (args) => {
        // eslint-disable-next-line
        const { dataRow, value } = args;
        if (value?.includes('NOTFOUND') || value === '') {
          return (
            <MdoWrapper>
              <MdoGlCodeSelector
                skipAllParents
                name={`mdo-${dataRow.id}`}
                // eslint-disable-next-line
                value={dataRow.mdoGlCode}
                onChange={(_, value) => handleActions({ action: GL_ACTIONS.MAP_MDO, value, data: dataRow })}
                disabledItems={disabledItems}
                tableDropDownFontSize={true}
              />
            </MdoWrapper>
          );
        } else {
          return value;
        }
      },
    },
    {
      field: 'departmentName',
      headerName: getText('generic.department'),
      width: 200,
      sortable: false,
    },
    {
      field: 'statusId',
      headerName: getText('generic.isEnabled'),
      width: 150,
      align: 'center',
      sortable: false,
      // eslint-disable-next-line
      onRender: (args) => {
        // eslint-disable-next-line
        const { dataRow, id, value } = args;

        return !!dataRow.mdoGlCode && dataRow.mdoGlCode != 'NOTFOUND' ? (
          <Switch
            name={`switch-${id}`}
            value={value === 100 ? true : false}
            onChange={(_, value) => handleActions({ action: GL_ACTIONS.CHANGE_STATUS, value, data: dataRow })}
          />
        ) : (
          <span />
        );
      },
    },
    {
      field: 'actions',
      width: 50,
      minWidth: 50,
      sortable: false,
      align: 'right',
      // eslint-disable-next-line
      onRender: ({ dataRow }) => {
        return (
          <LinkActions
            noPadding
            items={actionsButtons}
            onClick={(button) =>
              handleActions({
                action: button.clickId === 'remove' ? GL_ACTIONS.REMOVE : GL_ACTIONS.EDIT,
                data: dataRow,
              })
            }
          />
        );
      },
    },
  ];

  return { subHeaders };
};

export const downloadExcelFileForMapping = (value, resultData, departmentNames, hotelName) => {
  if (Array.isArray(resultData) && resultData?.length) {
    const excelData = resultData.map((obj) => {
      const result = {
        ...obj,
        ['Status']: obj[`Is Enabled`].toString() === `100` ? 'Active' : 'Inactive',
      };
      // remove not needed columns...
      delete result['Is Enabled'];
      delete result.actions;
      return result;
    });

    exportToXLSX(
      excelData,
      buildDownloadableFilename({
        hotelName: hotelName,
        reportName: DownloadableReportNames.glHierarchy,
      }),
      value == 'excel' ? 'xlsx' : value,
      '',
      {
        isHeader: false,
        style: true,
        noTotalStyle: true,
      },
    );
  }
};

export const remapHierarchyTableData = (data) => {
  if (!Array.isArray(data) || !data?.length || !data) {
    logger.debug('data not defined for hierarchy data:', data);
    return [];
  }
  let excelData = data?.map((obj) => {
    let status = getText('selectors.status.inactive');
    if ((obj['GL Code'] !== '' || !obj.parentId) && obj.statusId.toString() === `100`) {
      status = getText('selectors.status.active');
    }
    const result = { ...obj, ['Status']: status };
    // remove not needed columns...
    delete result.statusId;
    delete result.parentId;
    return result;
  });
  return excelData;
};

export const downloadExcelFileForHierarchy = (value, resultData, mdoGlCodes, hotelName) => {
  if (Array.isArray(resultData) && resultData?.length) {
    let indents = [];

    const [tree, _] = buildHierarchy(mdoGlCodes, 'id', 'parentId', 'children');
    findDepth(tree, indents);

    const excelData = remapHierarchyTableData(resultData);
    exportToXLSX(
      excelData,
      buildDownloadableFilename({
        hotelName: hotelName,
        reportName: DownloadableReportNames.glHierarchy,
      }),
      value == 'excel' ? 'xlsx' : value,
      '',
      {
        isHeader: false,
        style: true,
        noTotalStyle: true,
        indents,
      },
    );
  }
};

export const isKeyPresent = (appPages, key) => {
  if (appPages?.keys?.[key]?.url) {
    return true;
  }
  return false;
};

export const numberOfChangedFilters = (filters, DEFAULT_FILTERS) => {
  let filtersChanged = 0;
  for (const [key, value] of Object.entries(DEFAULT_FILTERS)) {
    if (filters[key] !== value) {
      filtersChanged++;
    }
  }

  return filtersChanged;
};

export const mapHmgGlCodesHierarchyColumns = (handleActions, isPermitted) => {
  let subHeaders = [
    {
      field: 'id',
      headerName: getText('generic.mdoGlCode'),
      headerAlign: 'left',
      align: 'left',
      width: 250,
    },
    {
      field: 'hmgGlCode',
      headerName: getText('generic.hmgGlCode'),
      headerAlign: 'left',
      align: 'left',
      width: 150,
      sortable: false,
    },
    { field: 'displayName', headerName: getText('generic.displayName'), width: 200, minWidth: 200 },
  ];
  if (isPermitted('toggle-status')) {
    subHeaders.push({
      field: 'statusId',
      headerName: '',
      width: 150,
      headerAlign: 'left',
      align: 'left',
      sortable: false,
      // eslint-disable-next-line
      renderHeader: () => {
        return (
          <Button
            name={'allOn'}
            text={getText('hmgGlCodes.allOn')}
            variant='tertiary'
            onClick={(name, _) => handleActions({ action: GL_ACTIONS.ALL_STATUSES_ON })}
            title={getText('hmgGlCodes.allOnTooltip')}
            dataEl='buttonAllOn'
          />
        );
      },
      // eslint-disable-next-line
      renderCell: (args) => {
        console.log(args);
        // eslint-disable-next-line
        const { row, id, value } = args;

        return (
          <Switch
            name={`switch-${id}`}
            //value={true}
            value={(() => {
              if ((row.children && row.children.length) || row?.hmgGlCode) {
                return Number(value) === 100 ? true : false;
              } else {
                return false;
              }
            })()}
            disabled={row?.hmgGlCode || row?.children?.length ? false : true}
            onChange={(_, value) => handleActions({ action: GL_ACTIONS.CHANGE_STATUS, value, data: row })}
          />
        );
      },
    });
    // this is dummy column so we can get info if parent or not
    subHeaders.push({
      field: 'parentId',
      headerName: 'parentId',
      width: 0,
      minWidth: 0,
      maxWidth: 0,
    });
  }

  return { subHeaders };
};

export const buildTreeData = (arr, idField, parentIdField, nameForChildren) => {
  const noParent = [];
  const tree = [];

  const mappedArr = arr.reduce((acc, item) => {
    acc[item[idField]] = item;
    acc[item[idField]][nameForChildren] = [];

    return acc;
  }, {});

  for (let key in mappedArr) {
    const item = mappedArr[key];
    const parentId = item[parentIdField];

    if (parentId !== undefined && isIdEmpty(parentId)) {
      // This is a root element
      tree.push(item);
    } else if (mappedArr[parentId]) {
      mappedArr[parentId][nameForChildren].push(item);
    } else {
      noParent.push(item);
    }
  }

  return [tree, noParent];
};

export const prepareDataForHmgGlCodesHierarchy = (hmgGlCodes, mdoGlCodes, mdoGlCodeStatuses, hotelId) => {
  let listData = [];

  if (hmgGlCodes && Array.isArray(hmgGlCodes) && hmgGlCodes?.length) {
    //let newData = [];
    let orphans = [];
    const mapHmgGlCodes = mapArrayBy(hmgGlCodes, 'mdoGlCode');
    const mapMdoGlCodeStatus = mapArrayBy(mdoGlCodeStatuses, 'mdoGlCode');

    mdoGlCodes.forEach((obj) => {
      const hmgGlCode = mapHmgGlCodes?.[obj?.id] || {};
      const status = mapMdoGlCodeStatus?.[obj?.id] || {};

      listData.push({
        ...obj,
        hmgGlCode: hmgGlCode?.hmgGlCode || '',
        statusId: status?.statusId,
        hotelId: hotelId,
      });
    });
    // console.log(newData);

    //[listData, orphans] = buildHierarchy(newData, 'id', 'parentId', 'children');

    // if (!appSettings.isProduction && orphans.length > 0) {
    //   logger.warn(`There are ${orphans.length} orphans in the data to display in HMG GL Codes hierarchy`, orphans);
    // }
  }
  logger.debug({ listData });
  return { listData };
};

export const getMdoGLCodesFromChildren = (data) => {
  return data.reduce((a, b) => {
    if (b?.children?.length) {
      a = [...a, ...getMdoGLCodesFromChildren(b?.children)];
    }
    a.push(b.id);
    return a;
  }, []);
};

export const filterOutResultsInList = (list, keyword, exludeFields) => {
  const matchingList = list?.filter((item) => {
    return findInObject({
      predicate: (val) => {
        return val.toLowerCase().includes(keyword.toLowerCase());
      },
      object: item,
      exclude: exludeFields, // don't look here...
    });
  });

  return matchingList;
};

export const getMappedGlCodeForImport = (hotelIds, csvData) => {
  const data = [...csvData];

  if (isArray(data)) {
    data.pop();
    const columns = data.shift();

    const tpl = columns?.reduce((acc, column, idx) => {
      acc[idx] = camelCase(column);
      return acc;
    }, {});

    const glCodes = [];

    data.forEach((row) => {
      const rowData = row?.reduce((acc, columnData, idx) => {
        acc[tpl[idx]] = columnData;
        return acc;
      }, {});

      hotelIds.forEach((hotelId) => glCodes.push({ ...rowData, hotelId: Number(hotelId) }));
    });
    return glCodes;
  }
  return [];
};

// this function might need some adjustments depending on the specific page
// but in 9 out 10 cases no need to change
export const getPageState = (data, errors, updatePageState, message) => {
  if (data?.length === 0 && !errors?.length) {
    return updatePageState(pageState.NO_DATA, message);
  } else if (errors?.length) {
    return updatePageState(pageState.ERROR);
  }
  return updatePageState(pageState.DEFAULT);
};
