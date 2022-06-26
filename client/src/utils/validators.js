export const isDateValid = (date) => {
  if (new Date('1900-01-01') > new Date(date) || new Date('2100-01-01') < new Date(date)) {
    return false;
  }
  return ['Invalid Date', 'null'].indexOf(String(date)) === -1;
};

export const isDashboardDateValid = (date) => {
  return ['Invalid Date', 'null'].indexOf(String(date)) === -1;
};
