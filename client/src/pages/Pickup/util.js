export const columnNamesMappingPickup = (subHeaders) => {
  let columnNamesMapping = {};
  let names = [];
  subHeaders?.map((header,index) => {
    columnNamesMapping[header.field] = {
      name: !names.includes(header.headerName) ? header.headerName : `${header.headerName}:${index}`,
      format: header.field !== 'name' ? true : false,
    };
    names.push(header.headerName);
  });
  return columnNamesMapping;
};
