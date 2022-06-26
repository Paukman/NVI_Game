import { adjustDataForTrend, isDataAvailable, noOfColumnsToSkip } from './utils';
import { WIDGET_ID } from './constants';

describe('Testing adjustDataForTrend', () => {
  const data = [
    [
      { date: '10/10/2021', value: 10 },
      { date: '10/11/2021', value: 20 },
    ],
    [
      { date: '10/10/2021', value: 5 },
      { date: '10/11/2021', value: 10 },
    ],
  ];

  const expectedData = [
    [
      { date: '10/10/2021', value: 10 },
      { date: '10/11/2021', value: 20 },
    ],
    [
      { date: '10/10/2021', value: 5 },
      { date: '10/11/2021', value: 10 },
    ],
  ];

  const dataForTwoYears = [
    [
      { date: '12/31/2020', value: 20 },
      { date: '01/01/2021', value: 10 },
    ],
    [
      { date: '12/31/2019', value: 10 },
      { date: '01/01/2020', value: 5 },
    ],
  ];
  const expectedDataForTwoYears = [
    [
      { date: '12/31/2020', value: 20 },
      { date: '01/01/2021', value: 10 },
    ],
    [
      { date: '12/31/2020', value: 10 },
      { date: '01/01/2021', value: 5 },
    ],
  ];

  it('should return same data', () => {
    let res = adjustDataForTrend(data, '10/11/2021', '10/10/2020');
    expect(res).toEqual(data);
  });
  it('should return proper data if trending', () => {
    let res = adjustDataForTrend(data, '10/11/2021', '10/10/2020');
    expect(res).toEqual(expectedData);
    res = adjustDataForTrend([...data, []], '10/11/2021', '10/10/2020');
    expect(res).toEqual([...expectedData, []]);
    res = adjustDataForTrend(dataForTwoYears, '01/01/2021', '12/31/2019');
    expect(res).toEqual(expectedDataForTwoYears);
  });
  it('should return empty array if data is wrong', () => {
    let res = adjustDataForTrend(null, '10/11/2021', '10/10/2020');
    expect(res).toEqual([]);
    res = adjustDataForTrend(undefined, '10/11/2021', '10/10/2020');
    expect(res).toEqual([]);
    res = adjustDataForTrend(data, 'notValidDate', '10/10/2020');
    expect(res).toEqual([]);
    res = adjustDataForTrend(data, '10/10/2020', 'notValidDate');
    expect(res).toEqual([]);
    res = adjustDataForTrend([], '10/10/2020', 'notValidDate');
    expect(res).toEqual([]);
  });
});

describe('Testing isDataAvailable', () => {
  it('should return false', () => {
    let res = isDataAvailable([], false);
    expect(res).toEqual(false);
    res = isDataAvailable([{ value: null }], false);
    expect(res).toEqual(false);
    res = isDataAvailable([{ value: undefined }], false);
    expect(res).toEqual(false);
    res = isDataAvailable([{ value: undefined }, { value: 1 }], false);
    expect(res).toEqual(true);
    res = isDataAvailable([[{ value: undefined }]], true);
    expect(res).toEqual(false);
    res = isDataAvailable([[{ value: undefined }, { value: undefined }, { value: undefined }]], true);
    expect(res).toEqual(false);
    res = isDataAvailable([[{ value: 1 }, { value: undefined }, { value: undefined }]], true);
    expect(res).toEqual(true);
  });
});

// TODO figure out different tests, time is always executed localy, but dates and test dates must be in utc...om
// describe('Testing prepareDataForRollingRevenue', () => {
//   it('should return false', () => {
//     const validData = {
//       data: [
//         {
//           values: [
//             {
//               data: [
//                 { value: 1, date: '1637625600000', valueTypeId: 1 },
//                 { value: 2, date: '1637712000000', valueTypeId: 1 },
//               ],
//             },
//             {
//               data: [
//                 { value: 3, date: '1606089600000', valueTypeId: 1 },
//                 { value: 4, date: '1606176000000', valueTypeId: 1 },
//               ],
//             },
//           ],
//         },
//       ],
//     };
//     let res = prepareDataForRollingRevenue(validData);
//     expect(res).toEqual({
//       data: [
//         [
//           { date: '11/22/2021', value: 1 },
//           { date: '11/23/2021', value: 2 },
//         ],
//         [
//           { date: '11/22/2020', value: 3 },
//           { date: '11/23/2020', value: 4 },
//         ],
//       ],
//       earliestDate: '11/22/2020',
//       latestDate: '11/23/2021',
//       valueTypeIds: [1, 1],
//     });
//   });
// });

describe('Testing noOfColumnsToSkip on customizable table', () => {
  it('should return proper number of columns to skip', () => {
    let result = noOfColumnsToSkip('garbage');
    expect(result).toBe(1);
    result = noOfColumnsToSkip(WIDGET_ID.BY_REVENUE);
    expect(result).toBe(1);
    result = noOfColumnsToSkip(WIDGET_ID.BY_PROPERTY);
    expect(result).toBe(2);
    result = noOfColumnsToSkip(WIDGET_ID.BY_PROPERTY, true);
    expect(result).toBe(3);
    result = noOfColumnsToSkip(WIDGET_ID.BY_PROPERTY, false);
    expect(result).toBe(2);
  });
});
