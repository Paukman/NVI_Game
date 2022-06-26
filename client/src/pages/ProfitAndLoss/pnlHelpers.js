export const addTopLevelHeadersToItems = (items) => {
  items.forEach((item) => {
    if (item.children && item.children.length) {
      addTopLevelHeadersToItems(item.children);
      item.subLevelHeaders = true;
    }
  });
};
