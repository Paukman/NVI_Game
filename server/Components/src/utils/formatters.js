/**
 * Maps array of objects by given mapBy field or array of fields
 * Example:
 * const arr = [{ a: 'AAA', b: 'BBB'}, { a: 'CCC', b: 'DDD' }]
 * const map1 = mapArrayBy(arr, 'a'); =>
 *  {
 *    AAA: { a: 'AAA', b: 'BBB'},
 *    CCC: { a: 'CCC', b: 'DDD' }
 *  }
 * const map2 = mapArrayBy(arr, ['a', 'b']); =>
 *  {
 *    a: { AAA: { a: 'AAA', b: 'BBB'}, CCC: { a: 'CCC', b: 'DDD' } },
 *    b: { BBB: { a: 'AAA', b: 'BBB'}, DDD: { a: 'CCC', b: 'DDD' } }
 *  }
 * @param {object[]} arr
 * @param {string|string[]} mapBy
 * @param {obj} opt Additional options: multiple - if true then the value of the map object is an array of items with similar key
 */
export const mapArrayBy = (arr, mapBy, opt) => {
  const isArray = Array.isArray(mapBy);
  const { multiple } = opt || {};

  if (isArray) {
    const emptyObj = mapBy.reduce((acc, item) => {
      acc[item] = {};
      return acc;
    }, {});

    return arr.reduce((acc, item) => {
      mapBy.forEach((mapByItem) => {
        if (multiple) {
          if (!acc[mapByItem][item[mapByItem]]) {
            acc[mapByItem][item[mapByItem]] = [];
          }
          acc[mapByItem][item[mapByItem]].push(item);
        } else {
          acc[mapByItem][item[mapByItem]] = item;
        }
      });

      return acc;
    }, emptyObj);
  } else {
    return arr.reduce((acc, item) => {
      if (multiple) {
        if (!acc[item[mapBy]]) {
          acc[item[mapBy]] = [];
        }
        acc[item[mapBy]].push(item);
      } else {
        acc[item[mapBy]] = item;
      }

      return acc;
    }, {});
  }
};

export const arrayToMap = (arr) => {
  if (Array.isArray(arr)) {
    return arr.reduce((acc, item) => {
      acc[`${item}`] = item;
      return acc;
    }, {});
  }

  return arr;
};

export const isIdEmpty = (value) => {
  return !value || value === '0';
};

export const buildHierarchy = (arr, idField, parentIdField, nameForChildren) => {
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

export const getLowestLevelItems = (arr, idField, parentIdField, nameForChildren, setRoot) => {
  const [hierarchy] = buildHierarchy(arr, idField, parentIdField, nameForChildren);
  const items = [];

  const recursion = (children, rootId) => {
    children.forEach((child) => {
      if (Array.isArray(child[nameForChildren]) && child[nameForChildren].length > 0) {
        recursion(child[nameForChildren], !rootId ? child[idField] : rootId);
      } else {
        if (setRoot === true) {
          child['rootId'] = rootId;
        }
        items.push(child);
      }
    });
  };

  recursion(hierarchy);

  return items;
};
