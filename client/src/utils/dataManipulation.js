import { buildHierarchy } from 'mdo-react-components';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getText } from './localesHelpers';
import { maxAndMedium } from '../pages/AccountsReceivable/boundries';
import logger from 'utils/logger';
import { isEqual } from 'lodash';

dayjs.extend(utc);

export const parseJsonSafe = (str, defaultValue = {}) => {
  try {
    const type = typeof str;
    switch (type) {
      case 'object':
        return str;

      case 'string':
        return str.length > 0 ? JSON.stringify(str) : {};

      default:
        return defaultValue;
    }
  } catch (ex) {
    console.error('Failed to parse JSON from the source', str, ex);
    return defaultValue;
  }
};

const convertFieldToLabel = (field) => {
  let label;
  switch (field) {
    case 'due030':
      label = '30 Days';
      break;
    case 'due3160':
      label = '60 Days';
      break;
    case 'due6190':
      label = '90 Days';
      break;
    case 'due91120':
      label = '120 Days';
      break;
    case 'dueOver120':
      label = '120+';
      break;
  }
  return label;
};

export const valueOfFields = (data, colors) => {
  const { total, max, highlights, hotel, hotelId, ...rest } =
    data.length != 0 && data.find((item) => item?.hotel?.hotelName == 'Totals');

  return (
    rest &&
    Object.keys(rest).map((key, index) => ({ label: convertFieldToLabel(key), value: rest[key], color: colors[index] }))
  );
};

export const maxAndMediumValues = (data, values) => {
  let total = [];
  let otherColumns = [];
  const rest = data.filter((element, index) => index < data.length - 1);

  values.forEach((column) => {
    if (column.field === 'total') {
      total = [
        ...total,
        ...rest.reduce((acc, array) => {
          if (column.field === 'hotelId' || column.field === 'sourceAccountName') acc = [...acc];
          else acc = [...acc, array[column.field]];
          return [...acc];
        }, []),
      ];
    } else {
      otherColumns = [...otherColumns, ...rest.map((array) => array[column.field])];
    }
  });

  const maxValueTotal = Math.max(...total);
  const maxValueOtherColumns = Math.max(...otherColumns);
  const maxValues = [
    ...total.filter((value) => value >= maxValueTotal * maxAndMedium.MAX_LEVEL),
    ...otherColumns.filter((value) => value >= maxValueOtherColumns * maxAndMedium.MAX_LEVEL),
  ];
  const mediumValues = [
    ...total.filter(
      (value) => value < maxValueTotal * maxAndMedium.MAX_LEVEL && maxValueTotal * maxAndMedium.MEDIUM_LEVEL <= value,
    ),
    ...otherColumns.filter(
      (value) =>
        value < maxValueOtherColumns * maxAndMedium.MAX_LEVEL &&
        maxValueOtherColumns * maxAndMedium.MEDIUM_LEVEL <= value,
    ),
  ];
  return { maxValues: maxValues, mediumValues: mediumValues };
};

export const footer = (data, reportType) => {
  if (data[data.length - 1]) {
    data[data.length - 1] = {
      ...data[data.length - 1],
      ...(reportType === 'Property'
        ? {
            hotelClientAccount: {
              accountName: getText('arAging.totals'),
            },
            valueType: 'CURRENCY',
          }
        : {
            hotel: {
              id: null,
              hotelName: getText('arAging.totals'),
            },
          }),
    };
  }

  return data;
};

//This function getting index which belong to Totals row which is property name in table
export const findIndexOfTotals = (data, property, location) =>
  data.findIndex((element) =>
    location === 'calendar'
      ? element?.property === property
      : location == 'primary'
      ? element?.name === property
      : element?.hotel?.hotelName === property || element?.hotelClientAccount?.accountName === property,
  );

// This function keeps the index which is coming from findIndexOfTotals as a last row
export const newPositionOfElement = (data, property, location) => {
  if (data.length - 1 >= data.length) {
    let k = data.length - 1 - data.length + 1;
    while (k--) {
      data.push(undefined);
    }
  }
  data.splice(data.length - 1, 0, data.splice(findIndexOfTotals(data, property, location), 1)[0]);

  return data;
};

export const formatDateForApi = (date) => {
  return dayjs(date).format('YYYY-MM-DD');
};

export const formatDateForDownloading = (date) => {
  return dayjs(date || new Date()).format('YYYYMMDD');
};

export const checkStringTypeAndConvert = (value) => {
  const value2use = typeof value === 'string' ? value.toLowerCase() : '';

  if (value2use === 'true') {
    return true;
  } else if (value2use === 'false') {
    return false;
  } else if (!isNaN(value) && value != null) {
    return Number(value2use);
  }

  return value;
};

export const formatQueryErrors = (querryErrors) => {
  if (!querryErrors || (Array.isArray(querryErrors) && querryErrors.length === 0)) {
    return {};
  }

  let errors = {};
  (querryErrors || []).forEach((querryError) => {
    errors[querryError.name] = `${querryError.messages.join('. ')}`;
  });

  return errors;
};

export const removeElementFromArray = (arr, element) =>
  arr.reduce((acc, item) => {
    if (item == element) acc = [...acc];
    else acc = [...acc, item];
    return acc;
  }, []);

export const percDiff = (value1, value2) => {
  //This is for preventing division by zero error
  if (value2 === 0) {
    return 0;
  }
  // If any value is a null, it will be return null to prevent showing 0%.
  if (value1 == null || value2 == null) {
    return null;
  }
  // if any value is a string, it will be return null.
  if (isNaN(value1) || isNaN(value2)) {
    return null;
  }

  return (value1 - value2) / value2;
};

export const normalizePermissions = (permissions) => {
  if (!permissions) {
    return null;
  }
  let normalizedPermissions = {};
  permissions?.permissionEntities?.map((entity) => {
    normalizedPermissions[entity.permissionEntityId] = {};
    entity?.references?.map((ref) => {
      normalizedPermissions[entity.permissionEntityId][ref.referenceId] = ref.permissionTypeIds;
    });
  });
  return normalizedPermissions;
};

const returnItems = (items) => {
  if (!items?.length) {
    return items;
  }
  const recursiveItems = [];

  let tempItems = [];
  if (items && items?.length) {
    tempItems = items.reduce((acc, cur) => {
      const childrenItems = returnItems(cur.items);
      if (!childrenItems?.length && !cur.pageKey) {
        return acc;
      } else acc.push(cur);
      return acc;
    }, []);
  }
  recursiveItems.push(...tempItems);
  return recursiveItems;
};

/**
 *
 * @param {permissions object for dashboard} dashboard
 * @returns true or false if any of dashboard items has a view permission.
 */
const isDashboardItemsAvailable = (dashboard) => {
  let isAvailalbe = false;
  if (dashboard) {
    for (const [key, _] of Object.entries(dashboard)) {
      if (dashboard[key]?.includes('view')) {
        isAvailalbe = true;
        break;
      }
    }
  }
  logger.debug('Any permissions for dashboard: ', isAvailalbe);
  return isAvailalbe;
};

export const applyPersmissionsForSideBarItems = (sideBarItems, permissions) => {
  if (!sideBarItems || !sideBarItems?.length) {
    return [];
  }
  const items = sideBarItems?.reduce((acc, cur) => {
    if (!cur.pageKey) {
      acc.push(cur);
    } else if (cur.pageKey && permissions?.page?.[cur.pageKey]?.includes('view')) {
      acc.push(cur);
    }
    return acc;
  }, []);

  const [tree, orphans] = buildHierarchy(items, 'id', 'parentId', 'items');
  let sidebarMenu = [...tree, ...orphans];

  sidebarMenu = sidebarMenu?.reduce((acc, cur) => {
    const items = returnItems(cur.items);
    if (cur.alt === 'Dashboard' && isDashboardItemsAvailable(permissions?.dashboard)) {
      acc.push(cur);
    } else if (!items?.length && !cur.pageKey) {
      return acc;
    } else {
      acc.push(cur);
    }
    return acc;
  }, []);

  logger.log('Permissions handling: ', { items, sideBarItems, permissions, sidebarMenu });

  return [...sidebarMenu, { id: 4, divider: true }];
};

export const numberOfChangedFilters = (filters, DEFAULT_FILTERS) => {
  let filtersChanged = 0;
  for (const [key, value] of Object.entries(DEFAULT_FILTERS)) {
    if (!isEqual(filters[key], value)) {
      filtersChanged++;
    }
  }

  return filtersChanged;
};
