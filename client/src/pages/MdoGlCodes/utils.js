import { sortBy } from 'lodash';

export const generateParentList = (data) => {
  if (!data) {
    return [];
  }
  const parentTree = {};

  const getParent = (parent) => {
    if (!parent) {
      return;
    }

    parent.map((item) => {
      if (item.children.length > 0) {
        if (!parentTree[item.id]) {
          parentTree[item.id] = [];
        }
        return getParent(item.children);
      } else {
        parentTree[item.parentId] === undefined
          ? (parentTree[item.parentId] = [Number(item.id)])
          : parentTree[item.parentId].push(Number(item.id));
        if (parentTree[item.parentId] !== undefined && parentTree[item.parentId].length > 1 && item?.path) {
          const parentArray = item?.path?.split('/');

          parentArray.slice(0, -1).map((account) => {
            parentTree[account] === undefined
              ? (parentTree[account] = [Number(item.id)])
              : parentTree[account].includes(Number(item.id)) === false
              ? parentTree[account].push(Number(item.id))
              : false;
          });
        }
      }
    });
  };

  getParent(data);
  return {
    parentTree,
  };
};

export const updateTreeWithDepartmentNames = (data, departmentNames) => {
  if (!data) {
    return [];
  }

  const updateRow = (row) => {
    if (!row) {
      return [];
    }

    let updatedRow = { ...row };
    // add department here
    if (departmentNames[row.id]) {
      updatedRow = { ...row, department: departmentNames[row.id] };
    }

    let tempRowsChildren = [];
    if (row.children?.length) {
      tempRowsChildren = row.children.map((singleChildRow) => {
        return updateRow(singleChildRow);
      });
      updatedRow.children = [...tempRowsChildren];
    }
    return updatedRow;
  };

  const resultData = data.map((row) => {
    return updateRow(row);
  });

  return resultData;
};

export const getEditCode = (value, id, start, end) => {
  return value !== null ? value : !isNaN(id) ? id.slice(start, end).toString() : '';
};

export const getPath = (path) => {
  const newPath = path.split('/');
  newPath.pop();
  return newPath.join('/');
};

export const generateGlCode = (departmentId, accountTypeCode, accountNo) => {
  let gl = '';
  if (departmentId?.length > 0) {
    gl = `${departmentId.slice(0, 3)}${accountTypeCode}${accountNo.toString().slice(-4)}`;
  }
  return gl;
};

export const getLargestAccountNo = (parentId, departmentId, parentObject, editData) => {
  let parentHighestAccountNo = '';
  if (parentId === departmentId) {
    let resultArray = [];

    Object.entries(parentObject).forEach(([key, value]) => {
      resultArray = typeof value === 'number' ? [...resultArray, value] : [...resultArray, ...value];
    });
    resultArray = sortBy(resultArray);
    parentHighestAccountNo = resultArray;
  } else {
    parentHighestAccountNo = sortBy(parentObject[parentId]);
  }

  let accountTypeCode = 0;
  let newParentAccountNo = '0000';
  if (parentHighestAccountNo && parentHighestAccountNo.length) {
    accountTypeCode = parentHighestAccountNo.slice(-1)[0].toString().charAt(3);
    newParentAccountNo = editData?.parentId === parentId ? editData?.id : parentHighestAccountNo.slice(-1)[0] + 1;
  }
  return {
    accountTypeCode,
    newParentAccountNo,
  };
};

export const isGraphQLError = (err) => {
  const errorArray = Object.keys(err);
  const fieldArray = ['displayName', 'mdoGlCodeDepartmentId', 'accountType', 'parentId', 'valueTypeId'];
  return fieldArray.some((value) => errorArray.includes(value));
};

export const columnNamesMapping = {
  id: { name: 'MDO GL Code', format: false },
  displayName: { name: 'Description', format: false },
  department: { name: 'Department', format: false },
};
