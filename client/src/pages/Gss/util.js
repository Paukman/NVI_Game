export const columnNamesMappingGssPriority = (subHeaders, filters) => {
  let columnNamesMapping = {};
  let names = [];
  subHeaders?.map((header, index) => {
    const headerName = filters?.showDescription ? header?.dhn : header.headerName;
    columnNamesMapping[header.field] = {
      name: !names.includes(headerName) ? headerName : `${headerName}:${index}`,
      format: header.field !== 'name' ? true : false,
    };
    names.push(headerName);
  });
  return columnNamesMapping;
};

export const columnNamesMappingGssMedallia = (subHeaders) => {
  let columnNamesMapping = {};
  let names = [];
  subHeaders?.map((header, index) => {
    const headerName = header.headerName;
    columnNamesMapping[header.field] = {
      name: !names.includes(headerName) ? headerName : `${headerName}:${index}`,
      format: header.field !== 'name' ? true : false,
    };
    names.push(headerName);
  });
  return columnNamesMapping;
};
