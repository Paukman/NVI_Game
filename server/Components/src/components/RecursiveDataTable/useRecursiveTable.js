import { useEffect, useState } from 'react';
import { formatValue } from '../../utils/formatValue';
import { isEqual } from 'lodash';

export const VALUE_TYPES = {
  NUMBER: 'NUMBER',
  CURRENCY: 'CURRENCY',
  PERCENTAGE: 'PERCENTAGE',
};

export const localValueFormat = (value, valueType) => {
  let resultValue = value;
  if (valueType === VALUE_TYPES.CURRENCY) {
    resultValue = formatValue({
      value: value,
      valueTypeId: 2,
      valueFormat: '0,000.00',
      noValueStr: value,
      displaySize: 'as-is',
      ignoreNotNumbers: true,
    });
  } else if (valueType === VALUE_TYPES.PERCENTAGE) {
    resultValue = formatValue({
      value: value,
      valueTypeId: 3,
      valueFormat: '0.00',
      noValueStr: value,
      displaySize: 'as-is',
      ignoreNotNumbers: true,
    });
  }
  return resultValue;
};

export const createDownloadFile = ({ data, rowFields, rowNamesMapping, expandedRows }) => {
  const returnRows = (row) => {
    const recursiveRows = [];

    if (!rowFields || !rowFields?.length || !row || !data) {
      return [];
    }

    const rowFromRowFields = rowFields?.reduce((acc, cur) => {
      const field = cur.field;
      const name = rowNamesMapping ? rowNamesMapping[field]?.name || field : field;
      // if we don't explicitly say don't format we will format if valueType is there
      const format = rowNamesMapping?.[field]?.format ?? true;
      let value = localValueFormat(row[field] ?? '', row.valueType || cur.valueType);
      return {
        ...acc,
        [name]: value.toString(), //??? should I do it like this?
      };
    }, {});

    recursiveRows.push(rowFromRowFields);
    let tempRowsChildren = [];
    if (row.children && row.children?.length && expandedRows?.[row.id]) {
      tempRowsChildren = row.children.reduce((allChilderRows, singleChildRow) => {
        const childrenRows = returnRows(singleChildRow);
        allChilderRows.push(...childrenRows);
        return allChilderRows;
      }, []);
    }
    recursiveRows.push(...tempRowsChildren);
    return recursiveRows;
  };

  const resultData =
    (data &&
      data?.reduce((acc, cur, index) => {
        const childData =
          cur.children?.reduce((allRows, row) => {
            const rowRows = returnRows(row);
            allRows.push(...rowRows);
            return allRows;
          }, []) || [];
        acc.push(...childData);
        return acc;
      }, [])) ||
    [];

  return resultData;
};

export const useRecursiveTable = ({
  data,
  subHeaders,
  expandedRows,
  columnNamesMapping = null,
  onRequestTableData = () => {},
  isUpdated = true,
}) => {
  const [dataState, updateDataState] = useState({
    // need to have these 2 for deep comparison...
    data: [],
    subHeadersSubset: [],

    // might not need all of them, but leave it for future use...
    rowFields: [],
    rowNamesMapping: {},
    resultData: [],
    expandedRows: expandedRows || {},
    columnNamesMapping: columnNamesMapping,
  });

  useEffect(() => {
    // check empty values, if none continue...
    if (
      !data ||
      !Array.isArray(data) ||
      !data?.length ||
      !Array.isArray(data?.[0]?.children) ||
      !data?.[0]?.children?.length ||
      !subHeaders ||
      !Array.isArray(subHeaders) ||
      !subHeaders?.length
    ) {
      return;
    }

    // because header could have onRender function (cannot deep compare),
    // we will only grab what we need...
    const subHeadersSubset = subHeaders.map((obj) => {
      return {
        field: obj.field,
        headerName: obj.headerName,
        valueType: obj.valueType,
      };
    });

    let rowFields = [];
    let rowNamesMapping = { ...columnNamesMapping } || {};

    rowFields = subHeadersSubset?.map((header) => {
      return {
        field: header.field,
        valueType: header.valueType,
      };
    });

    if (!columnNamesMapping) {
      let nameIndexes = {};
      let names = [];
      subHeadersSubset?.map((header) => {
        const field = header.field;
        let nameToMap = header.headerName;
        if (names.includes(nameToMap)) {
          // duplicate, just add 1,2 at the end of the name...
          let currentItteration = nameIndexes[nameToMap] || 0;
          currentItteration++;
          nameIndexes[nameToMap] = currentItteration;
          nameToMap = nameToMap + currentItteration;
        }
        rowNamesMapping[field] = { name: nameToMap };
        names.push(header.headerName);
      });
    }

    // deal with subheaders first
    const sameAsPreviousSubheaders = isEqual(subHeadersSubset, dataState.subHeadersSubset);
    const sameAsPreviousExpandedRows = isEqual(expandedRows === undefined ? {} : expandedRows, dataState.expandedRows);
    const sameAsPreviousData = isEqual(data, dataState.data);

    if (isUpdated && sameAsPreviousData && sameAsPreviousExpandedRows && sameAsPreviousSubheaders) {
      return;
    }
    const resultData = createDownloadFile({
      data,
      rowFields: rowFields,
      rowNamesMapping: rowNamesMapping,
      expandedRows,
    });

    onRequestTableData(resultData);
    updateDataState((state) => ({
      ...state,
      data: data,
      subHeadersSubset: subHeadersSubset,
      resultData: resultData,
      expandedRows: expandedRows === undefined ? {} : expandedRows,
      rowFields: rowFields,
      rowNamesMapping: rowNamesMapping,
    }));
  }, [expandedRows, data, onRequestTableData, subHeaders, dataState, columnNamesMapping]);

  return { dataState };
};
