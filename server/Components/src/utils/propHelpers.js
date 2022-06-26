export const calcCssSize = (value) => {
  return isNaN(Number(value)) ? value || '0' : `${value}px`;
};

export const getSizeInPx = (value) => {
  if (!value) {
    return null;
  }
  const regex = new RegExp(/^[0-9]*px*$/);
  if (regex.test(value)) {
    // string with px at the end
    return value;
  }
  return isNaN(Number(value)) ? null : `${value}px`;
};

export const boxShadow = (elevation) => {
  return elevation === 1 ? '0px 0px 5px #808080' : null;
};
