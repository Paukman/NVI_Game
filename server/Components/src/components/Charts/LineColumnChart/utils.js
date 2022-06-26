export const dataTypeId = {
  column: 3,
  line: 2,
};

export const axisValues = {
  x: 'x',
  y: 'y',
};

export const getPointsQtyDataForColumns = (data, dataPointsQty) => {
  const interval = (data.length - 1) / (dataPointsQty === 1 ? dataPointsQty : dataPointsQty - 1);
  const seriesData = [];
  for (let index = 0; index < dataPointsQty; index++) {
    let nearestIntervalIndex = Math.round(index * interval);
    seriesData.push(data[nearestIntervalIndex]);
  }
  return seriesData;
};
