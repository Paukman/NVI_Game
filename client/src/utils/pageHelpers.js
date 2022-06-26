import { search } from './localesHelpers';

export const buildAddressString = (address) => {
  const hotelAddress =
    (address?.address1 ? `${address?.address1} ` : '') + (address?.address2 ? `${address?.address2}` : '');
  return hotelAddress;
};

export const compareValuesForSort = (leftValue, rightValue, descending = false) => {
  const left = typeof leftValue === 'string' ? leftValue.toLowerCase() : leftValue;
  const right = typeof rightValue === 'string' ? rightValue.toLowerCase() : rightValue;

  if (left === right) {
    return 0;
  }

  if (descending) {
    return left > right ? -1 : 1;
  }

  return left < right ? -1 : 1;
};

const descendingComparator = (a, b, orderBy, ignoreNumbers) => {
  if (orderBy === 'accountName') {
    orderBy = 'sourceAccountName';
  }

  let aString = a[orderBy] && (a[orderBy].toString().replace('$', '') || a[orderBy].replace('%', ''));
  let bString = b[orderBy] && (b[orderBy].toString().replace('$', '') || b[orderBy].replace('%', ''));
  aString = aString && Number(aString.replace(/\,/g, ''));
  bString = bString && Number(bString.replace(/\,/g, ''));

  if (isNaN(aString)) {
    aString = a[orderBy];
  }
  if (isNaN(bString)) {
    bString = b[orderBy];
  }
  if (aString == null) {
    aString = a.hotelClientAccount?.accountName;
  }
  if (bString == null) {
    bString = b.hotelClientAccount?.accountName;
  }
  if (typeof aString === 'string') {
    aString = aString.toLowerCase();
  }
  if (typeof bString === 'string') {
    bString = bString.toLowerCase();
  }

  if (bString < aString) {
    return -1;
  }
  if (bString > aString) {
    return 1;
  }
  return 0;
};

export const getComparator = (order, orderBy, comparator) => {
  if (comparator) {
    return order === 'desc' ? (a, b) => comparator(a, b, orderBy) : (a, b) => -comparator(a, b, orderBy);
  }
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

export const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

export const direction = {
  ASC: 'asc',
  DESC: 'desc',
};

export const switchDirection = (dir) => {
  if (dir === direction.ASC) {
    return direction.DESC;
  }
  return direction.ASC;
};

export const findInObject = ({ predicate, object, exclude, include }) => {
  if (typeof object !== 'object') {
    return false;
  }
  let retValue = false;

  for (let key in object) {
    if (Array.isArray(exclude) && exclude.length && exclude.includes(key)) {
      continue;
    }
    if (Array.isArray(include) && include.length && !include.includes(key)) {
      continue;
    }

    const value = `${object[key]?.toString() || ''}`;
    if (value === null || value === undefined || value === '') {
      retValue = false;
      continue;
    } else if (typeof predicate === 'function') {
      if (predicate(value)) {
        retValue = true;
        break;
      }
    } else if (search(value, predicate) !== -1) {
      retValue = true;
      break;
    }
  }
  return retValue;
};

export const isKeyPresent = (appPages, key) => {
  if (appPages?.keys?.[key]?.url) {
    return true;
  }
  return false;
};

export const numberComparator = (a, b, { orderBy, order }) => {
  let aNumber = a?.[orderBy];
  let bNumber = b?.[orderBy];

  if (typeof aNumber !== 'number') {
    aNumber = a?.[orderBy] ? Number(a[orderBy]) : null;
  }
  if (typeof bNumber !== 'number') {
    bNumber = b?.[orderBy] ? Number(b[orderBy]) : null;
  }

  if (aNumber === null && bNumber === null) {
    return 0;
  }
  if (aNumber === null) {
    aNumber = order === 'desc' ? bNumber - 1 : bNumber + 1;
  }
  if (bNumber === null) {
    bNumber = order === 'desc' ? aNumber - 1 : aNumber + 1;
  }
  return bNumber - aNumber;
};

export const lowerCaseComparator = (a, b, { orderBy, ignoreList = ['$', '%'] }) => {
  let aString = a?.[orderBy] ? a[orderBy].toString().toLowerCase() : '';
  let bString = b?.[orderBy] ? b[orderBy].toString().toLowerCase() : '';

  if (Array.isArray(ignoreList) && ignoreList.length) {
    for (let i = 0; i < ignoreList.length; i++) {
      const re = new RegExp(`\\${ignoreList[i]}`, 'g');
      aString = aString.replace(re, '');
      bString = bString.replace(re, '');
    }
  }

  if (bString < aString) {
    return -1;
  }
  if (bString > aString) {
    return 1;
  }
  return 0;
};

export const getCustomComparator = ({ order, orderBy, comparator, ignoreList }) => {
  return order === 'desc'
    ? (a, b) => comparator(a, b, { order, orderBy, ignoreList })
    : (a, b) => -comparator(a, b, { order, orderBy, ignoreList });
};
