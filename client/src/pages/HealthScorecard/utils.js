import dayjs from 'dayjs';

import { mapHealthScorecardColumns, pageState } from './constants';
import { getText } from 'utils/localesHelpers';
import { exportToXLSX } from 'utils/downloadHelpers';
import { buildDownloadableFilename } from '../../utils/downloadHelpers';
import logger from 'utils/logger';

export const prepareDataForEditDrawer = (allData) => {
  const data = allData?.filter((setting) => setting.settingTypeId === 1100);
  const editData = [];
  const falseValues = [];
  if (data && Array.isArray(data) && data.length) {
    /**
     * example of element
        "settingTypeId": 1100,
        "settingCode": "healthScorecard:columns:display:Budget:RoomAttendantProductivityVarianceToBudget",
        "settingName": "Budget:Room Attendant Productivity Variance to Budget",
        "userSettingValue": "true",
        "valueTypeId": 4
        },
     */

    const sections = {}; // will convert this to an array
    data.forEach((setting) => {
      const groupName = setting.settingCode?.split(':')?.[3];
      const itemName = setting.settingName?.split(':')?.[1];
      sections[groupName] = [...(sections[groupName] || []), { name: itemName, setting }];
    });

    for (const [key, value] of Object.entries(sections)) {
      editData.push({ type: 'group', name: key });
      value.map((item) => {
        editData.push({
          type: 'item',
          name: item.name,
          settingCode: item.setting.settingCode,
          userSettingValue: item.setting.userSettingValue === 'true' ? true : false,
        });
        if (item.setting.userSettingValue === 'false') {
          falseValues.push(item.setting.settingName);
        }
      });
    }
  }
  return { editData, falseValues };
};

export const prepareDataForHealthScorecard = (data, userSettings) => {
  const listData = [];
  const headers = [{ span: 1, single: true }];
  let subHeaders = [];

  const { falseValues } = prepareDataForEditDrawer(userSettings);

  const { columnsCfg, items } = data || {};

  // we will use title as a subheaded for data
  if (Array.isArray(columnsCfg) && columnsCfg.length) {
    let nf = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 10,
      minimumFractionDigits: 0,
    });
    items?.forEach((hotelData) => {
      const singleDisplayRow = { name: hotelData?.hotel?.hotelName, id: hotelData?.hotelId };

      columnsCfg.forEach((item, index) => {
        if (item.title && !falseValues.includes(item.title)) {
          singleDisplayRow[item.title] = !isNaN(hotelData?.columnsData?.[index])
            ? nf.format(hotelData?.columnsData?.[index])
            : hotelData?.columnsData?.[index];
        }
      });
      listData.push(singleDisplayRow);
    });

    // cannot get heades in one go
    // 1. get objects and increase span with same name
    const tempHeaders = {}; //name: span for now
    columnsCfg.forEach((item) => {
      if (!falseValues.includes(item.title)) {
        const headerName = item.title?.split(':')?.[0];

        if (!tempHeaders.hasOwnProperty(headerName)) {
          tempHeaders[headerName] = 1;
        } else tempHeaders[headerName] = tempHeaders[headerName] + 1;
      }
    });

    // 2. re-itterate and add spans to headers
    const borderIndexes = [];
    let spanIndex = 0;
    for (const [headerName, span] of Object.entries(tempHeaders)) {
      headers.push({
        content: headerName,
        span: span,
      });
      spanIndex = spanIndex + span;
      // only to know where to put borders in fields...
      borderIndexes.push(spanIndex);
    }

    // map your data here for recursive table
    const onlyAvailableColumns = columnsCfg.filter((item) => !falseValues.includes(item.title));
    subHeaders = mapHealthScorecardColumns(onlyAvailableColumns, borderIndexes);
  }

  return { subHeaders, listData, headers };
};

export const downloadExcelFile = (value, state) => {
  if (state?.listData?.length > 0) {
    let excelData = [];
    /**
     * create your own excel mapping here
     * This is just an example
     *
     * */
  }
  return null;
};

export const updatePageState = (updatedPageState, message = null) => {
  // remap to one currently used
  const pageStateMap = {};
  for (const key of Object.keys(pageState)) {
    pageStateMap[key] = updatedPageState === key ? message || true : false;
  }
  return pageStateMap;
};
