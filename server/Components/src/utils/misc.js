export const search = (str, pattern = '') => {
  if (!str || !pattern) {
    return -1;
  }

  const pattern2use = (pattern || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return str.search(new RegExp(pattern2use, 'i'));
};
