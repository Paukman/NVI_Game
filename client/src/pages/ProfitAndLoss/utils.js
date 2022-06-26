import dayjs from 'dayjs';

import { mapPnLUnmappedColumns, mapPnLCommissionsCalcColumns, ADD_CUSTOM_VIEW, OWNERS_VIEW_ID } from './constants';
import { getText } from 'utils/localesHelpers';
import { valueTypes } from 'config/constants';

export const shouldHideReportRow = (isHideNullRecordsOn, columnsData) => {
  return !isHideNullRecordsOn && columnsData.every((columnData) => !columnData.value && !columnData.kpiValue);
};

export const prepareDataForPnLUnmapped = (data, onHandleMoreOptions, unmappedSelector) => {
  const listData = [];
  const subHeaders = mapPnLUnmappedColumns(onHandleMoreOptions, unmappedSelector);

  // add more conditions here if needed
  if (!data?.items?.length) {
    return null;
  }

  if (data?.items?.length) {
    data.items.forEach((obj, index) => {
      const dataRow = {};
      dataRow.description = obj.description;
      dataRow.id = obj.description;
      dataRow.hmgGlCode = obj.hmgGlCode;
      obj.months.forEach((month) => {
        const monthFromDate = dayjs(month.date).month(); // 0-11
        dataRow[getText(`monthsShort.${monthFromDate}`)] = month.value;
      });
      listData.push(dataRow);
    });
  }

  return { subHeaders, listData };
};

export const columnNamesMappingMonthly = (subHeaders) => {
  let columnNamesMapping = {};
  let names = [];
  subHeaders?.map((header, index) => {
    if (header.field !== 'name' && header.field !== 'glCode') {
      columnNamesMapping[header.field] = {
        name: !names.includes(header.headerName) ? header.headerName : `${header.headerName}:${index}`,
      };
    } else {
      columnNamesMapping[header.field] = {
        name: !names.includes(header.headerName) ? header.headerName : `${header.headerName}:${index}`,
        format: false,
      };
    }
    names.push(header.headerName);
  });

  return columnNamesMapping;
};

export const columnNamesMappingYearly = (subHeaders) => {
  let columnNamesMapping = {};
  let names = [];
  subHeaders?.map((header, index) => {
    columnNamesMapping[header.field] = {
      name: !names.includes(header.headerName) ? header.headerName : `${header.headerName}:${index}`,
      format: header.field !== 'name' && header.field !== 'glCode' ? true : false,
    };
    names.push(header.headerName);
  });
  return columnNamesMapping;
};

export const columnNamesMappingComparison = (subHeaders) => {
  let columnNamesMapping = {};
  let names = [];
  subHeaders?.map((header, index) => {
    columnNamesMapping[header.field] = {
      name: !names.includes(header.headerName) ? header.headerName : `${header.headerName}:${index}`,
      format: header.field !== 'name' && header.field !== 'glCode' ? true : false,
    };
    names.push(header.headerName);
  });
  return columnNamesMapping;
};

export const prepareDataForPnLCommissionCalculator = (calculations, commissions, handleAction) => {
  let subHeaders = [];
  const listData = [];

  // add more conditions here if needed
  if (!calculations || (Array.isArray(calculations) && !calculations?.length)) {
    return { subHeaders: [], listData: [] };
  }

  calculations?.items?.forEach((item, index) => {
    const formula = commissions?.[index]?.formula;
    const matchingCommision = commissions?.find((obj) => obj.id === item.id);
    const singleDisplayRow = {
      id: item?.id,
      description: matchingCommision?.description,
      formula:
        formula?.charAt(0) === '[' && formula?.charAt(formula.length - 1) === ']' ? formula.slice(1, -1) : formula,
      amount: item?.amount,
      commissionPercentage: matchingCommision?.commissionPercentage,
      commissionAmount: item?.commissionAmount,
      valueTypeId: item?.valueTypeId || valueTypes.CURRENCY, // will see about this...
    };
    listData.push(singleDisplayRow);
  });

  // map your data here for recursive table
  subHeaders = mapPnLCommissionsCalcColumns(handleAction);

  return { subHeaders, listData };
};

export const downloadExcelFile = (value, state) => {
  if (state?.listData?.length > 0) {
    let excelData = [];
  }

  /**
   * create your own excel mapping here
   * This is just an example
   *
   * */

  return null;
};

export const prepareDataForPnlViewListState = (data, userSettingsData, appPages) => {
  let listData = [];
  let standardData = [];
  let customData = [];
  let pnlViewsData = [];
  let defaultViewId = null;

  if (Array.isArray(data) && data?.length) {
    defaultViewId =
      userSettingsData?.find((setting) => setting.settingCode === 'reports:pnl:settings:defaultViewId')
        ?.userSettingValue || OWNERS_VIEW_ID;

    const sectionRowStandard = {
      name: getText(`Standard Views`),
      hasHorizontalBottomBorder: true,
      id: 'standardView',
      section: true,
    };

    const sectionRowCustom = {
      name: getText(`Custom Views`),
      hasHorizontalBottomBorder: true,
      id: 'customView',
      section: true,
    };

    data.forEach((obj, index) => {
      const singleDisplayRow = {
        id: obj.id ?? index,
        name: obj.viewName,
        permissionUpdate: obj.permissions?.includes('update') ? true : false,
        permissionDelete: obj.permissions?.includes('remove') ? true : false,
        defaultViewId: obj.id === defaultViewId ? true : false,
        standard: !obj.permissions?.includes('update') && !obj.permissions?.includes('remove'),
      };

      if (!singleDisplayRow.permissionUpdate && !singleDisplayRow.permissionDelete) {
        standardData.push(singleDisplayRow);
      } else {
        customData.push(singleDisplayRow);
      }
    });

    listData = [sectionRowStandard, ...standardData];

    if (customData.length) {
      listData = [...listData, sectionRowCustom, ...customData];
    }

    pnlViewsData = [...standardData, ...customData].map((obj) => {
      return {
        label: obj.name,
        value: obj.id,
      };
    });

    if (appPages?.keys['pnl-view']?.url) {
      pnlViewsData = [...pnlViewsData, { label: getText('pnl.addCustomView'), value: ADD_CUSTOM_VIEW }];
    }
  }

  return { listData, pnlViewsData, defaultViewId };
};
