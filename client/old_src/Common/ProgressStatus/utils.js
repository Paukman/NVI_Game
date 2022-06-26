export const getPercentage = status => {
  switch (status) {
    case 0:
      return 33.33;
    case 1:
      return 66.66;
    case 2:
      return 100;
    default:
      return 0;
  }
};
