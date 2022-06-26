import {
  direction,
  switchDirection,
  stableSort,
  getComparator,
  lowerCaseComparator,
  getCustomComparator,
  numberComparator,
} from './pageHelpers';

describe('Testing stableSort', () => {
  const data = [
    { name: '33 MxM' },
    { name: '01 MxM' },
    { name: 'Yaniv MxM' },
    { name: 'NEP MxM' },
    { name: 'Avant MxM' },
    { name: '02. MxM' },
    { name: '02 MxM' },
    { name: '01. MxM' },
  ];

  const expectedDescData = [
    { name: 'Yaniv MxM' },
    { name: 'NEP MxM' },
    { name: 'Avant MxM' },
    { name: '33 MxM' },
    { name: '02. MxM' },
    { name: '02 MxM' },
    { name: '01. MxM' },
    { name: '01 MxM' },
  ];

  it('Sholud return proper sorting ascending', () => {
    const sortedArray = stableSort(
      data,
      getCustomComparator({ order: direction.ASC, orderBy: 'name', comparator: lowerCaseComparator }),
    );
    const expectedAscData = [
      { name: '01 MxM' },
      { name: '01. MxM' },
      { name: '02 MxM' },
      { name: '02. MxM' },
      { name: '33 MxM' },
      { name: 'Avant MxM' },
      { name: 'NEP MxM' },
      { name: 'Yaniv MxM' },
    ];
    expect(sortedArray).toEqual(expectedAscData);
  });

  it('Sholud return proper sorting descending', () => {
    const sortedArray = stableSort(
      data,
      getCustomComparator({ order: direction.DESC, orderBy: 'name', comparator: lowerCaseComparator }),
    );
    const expectedDescData = [
      { name: 'Yaniv MxM' },
      { name: 'NEP MxM' },
      { name: 'Avant MxM' },
      { name: '33 MxM' },
      { name: '02. MxM' },
      { name: '02 MxM' },
      { name: '01. MxM' },
      { name: '01 MxM' },
    ];
    expect(sortedArray).toEqual(expectedDescData);
  });

  it('Sholud return proper sorting mixes', () => {
    const mixedData = [{ name: '$11.00' }, { name: '10' }, { name: '0.1' }, { name: '33 MxM' }];
    let sortedArray = stableSort(
      mixedData,
      getCustomComparator({ order: direction.ASC, orderBy: 'name', comparator: lowerCaseComparator }),
    );
    expect(sortedArray).toEqual([{ name: '0.1' }, { name: '10' }, { name: '$11.00' }, { name: '33 MxM' }]);

    sortedArray = stableSort(
      mixedData,
      getCustomComparator({ order: direction.DESC, orderBy: 'name', comparator: lowerCaseComparator }),
    );
    expect(sortedArray).toEqual([{ name: '33 MxM' }, { name: '$11.00' }, { name: '10' }, { name: '0.1' }]);

    sortedArray = stableSort(
      mixedData,
      getCustomComparator({
        order: direction.DESC,
        orderBy: 'name',
        comparator: lowerCaseComparator,
        ignoreList: null,
      }),
    );
    expect(sortedArray).toEqual([{ name: '33 MxM' }, { name: '10' }, { name: '0.1' }, { name: '$11.00' }]);

    sortedArray = stableSort(
      [{ name: '$11.00' }, { name: '10%' }, { name: '0.1%' }, { name: '33 MxM' }],
      getCustomComparator({ order: direction.ASC, orderBy: 'name', comparator: lowerCaseComparator }),
    );
    expect(sortedArray).toEqual([{ name: '0.1%' }, { name: '10%' }, { name: '$11.00' }, { name: '33 MxM' }]);
  });

  it('Sholud return proper sorting numbers', () => {
    const numberData = [{ value: 1 }, { value: 25.34 }, { value: 0.001 }, { value: 9 }, { value: -9 }];
    let sortedArray = stableSort(
      numberData,
      getCustomComparator({ order: direction.ASC, orderBy: 'value', comparator: numberComparator }),
    );
    expect(sortedArray).toEqual([{ value: -9 }, { value: 0.001 }, { value: 1 }, { value: 9 }, { value: 25.34 }]);

    sortedArray = stableSort(
      numberData,
      getCustomComparator({ order: direction.DESC, orderBy: 'value', comparator: numberComparator }),
    );
    expect(sortedArray).toEqual([{ value: 25.34 }, { value: 9 }, { value: 1 }, { value: 0.001 }, { value: -9 }]);
  });

  it('Sholud return proper sorting numbers wil nulls', () => {
    const numberData = [{ value: 1 }, { value: null }, { value: 0.001 }, { value: null }, { value: -9 }];
    let sortedArray = stableSort(
      numberData,
      getCustomComparator({ order: direction.ASC, orderBy: 'value', comparator: numberComparator }),
    );
    const expectedResultDesc = [{ value: -9 }, { value: 0.001 }, { value: 1 }, { value: null }, { value: null }];
    expect(sortedArray).toEqual(expectedResultDesc);

    sortedArray = stableSort(
      numberData,
      getCustomComparator({ order: direction.DESC, orderBy: 'value', comparator: numberComparator }),
    );
    const expectedResultAsc = [{ value: 1 }, { value: 0.001 }, { value: -9 }, { value: null }, { value: null }];
    expect(sortedArray).toEqual(expectedResultAsc);
  });
  it('Sholud return proper sorting numbers wil zeros', () => {
    const numberData = [{ value: -25 }, { value: 0 }, { value: 0 }];
    let sortedArray = stableSort(
      numberData,
      getCustomComparator({ order: direction.ASC, orderBy: 'value', comparator: numberComparator }),
    );
    const expectedResultDesc = [{ value: -25 }, { value: 0 }, { value: 0 }];
    expect(sortedArray).toEqual(expectedResultDesc);

    sortedArray = stableSort(
      numberData,
      getCustomComparator({ order: direction.DESC, orderBy: 'value', comparator: numberComparator }),
    );
    const expectedResultAsc = [{ value: 0 }, { value: 0 }, { value: -25 }];
    expect(sortedArray).toEqual(expectedResultAsc);
  });
});
