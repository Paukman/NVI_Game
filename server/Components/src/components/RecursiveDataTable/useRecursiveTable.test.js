import { renderHook, act } from '@testing-library/react-hooks';
import { createDownloadFile, VALUE_TYPES, useRecursiveTable } from './useRecursiveTable';

describe('Testing createDownloadFile', () => {
  it('should return proper data for garbage', () => {
    let resultData = createDownloadFile({ data: null });
    expect(resultData).toEqual([]);
    resultData = createDownloadFile({ data: undefined });
    expect(resultData).toEqual([]);
    resultData = createDownloadFile({ data: '' });
    expect(resultData).toEqual([]);
    resultData = createDownloadFile({ data: [] });
    expect(resultData).toEqual([]);
  });

  it('should return proper data for not nested data', () => {
    const inputData = [
      {
        children: [
          { id: 'id1', name: 'name1' },
          { id: 'id2', name: 'name2' },
        ],
      },
    ];
    const rowFields = [{ field: 'id' }, { field: 'name' }];
    let data = createDownloadFile({ data: inputData, rowFields });
    expect(data).toEqual([
      { id: 'id1', name: 'name1' },
      { id: 'id2', name: 'name2' },
    ]);
  });
  it('should return proper data if no row fields', () => {
    const inputData = [
      {
        children: [
          { id: 'id1', name: 'name1' },
          { id: 'id2', name: 'name2' },
        ],
      },
    ];
    let data = createDownloadFile({ data: inputData });
    expect(data).toEqual([]);
  });
  it('should return proper data for nested data', () => {
    const inputData = [
      {
        children: [
          { id: 'id1', name: 'name1' },
          { id: 'id2', name: 'name2' },
          {
            id: 'id3',
            name: 'name3',
            children: [
              { id: 'id31', name: 'name31' },
              { id: 'id32', name: 'name32' },
            ],
          },
        ],
      },
    ];
    const rowFields = [{ field: 'id' }, { field: 'name' }];
    const expandedRows = { id3: true, id32: true };
    let data = createDownloadFile({ data: inputData, rowFields, expandedRows });
    expect(data).toEqual([
      { id: 'id1', name: 'name1' },
      { id: 'id2', name: 'name2' },
      { id: 'id3', name: 'name3' },
      { id: 'id31', name: 'name31' },
      { id: 'id32', name: 'name32' },
    ]);
  });

  it('should return proper data for nested data with multiple nestings', () => {
    const inputData = [
      {
        children: [
          { id: 'id1', name: 'name1' },
          { id: 'id2', name: 'name2' },
          {
            id: 'id3',
            name: 'name3',
            children: [
              { id: 'id31', name: 'name31' },
              {
                id: 'id32',
                name: 'name32',
                children: [
                  { id: 'id321', name: 'name321' },
                  { id: 'id322', name: 'name322' },
                ],
              },
            ],
          },
        ],
      },
    ];
    const rowFields = [{ field: 'id' }, { field: 'name' }];
    const expandedRows = { id3: true, id32: true };

    let data = createDownloadFile({ data: inputData, rowFields, expandedRows });
    expect(data).toEqual([
      { id: 'id1', name: 'name1' },
      { id: 'id2', name: 'name2' },
      { id: 'id3', name: 'name3' },
      { id: 'id31', name: 'name31' },
      { id: 'id32', name: 'name32' },
      { id: 'id321', name: 'name321' },
      { id: 'id322', name: 'name322' },
    ]);
  });
  it('should return proper data for proper mapping', () => {
    const inputData = [
      {
        children: [
          { id: 'id1', name: 'name1' },
          { id: 'id2', name: 'name2' },
        ],
      },
    ];

    const rowFields = [{ field: 'id' }, { field: 'name' }];
    const rowNamesMapping = {
      id: { name: 'Id' },
      name: { name: 'Name' },
    };
    let data = createDownloadFile({ data: inputData, rowFields, rowNamesMapping });
    expect(data).toEqual([
      { Id: 'id1', Name: 'name1' },
      { Id: 'id2', Name: 'name2' },
    ]);
  });

  it('should return proper data for partial mapping', () => {
    const inputData = [
      {
        children: [
          { id: 'id1', name: 'name1' },
          { id: 'id2', name: 'name2' },
        ],
      },
    ];

    const rowFields = [{ field: 'id' }, { field: 'name' }];
    const rowNamesMapping = {
      id: { name: 'Id' },
    };
    let data = createDownloadFile({ data: inputData, rowFields, rowNamesMapping });
    expect(data).toEqual([
      { Id: 'id1', name: 'name1' },
      { Id: 'id2', name: 'name2' },
    ]);
  });

  it('should return proper formatted data for row types', () => {
    const inputData = [
      {
        children: [
          { id: 'id1', name: 'name1', budget: 0.2312, valueType: VALUE_TYPES.PERCENTAGE },
          { id: 'id2', name: 'name2', budget: 1123.23, valueType: VALUE_TYPES.CURRENCY },
        ],
      },
    ];

    const rowFields = [{ field: 'id' }, { field: 'name' }, { field: 'budget' }];
    const rowNamesMapping = {
      id: { name: 'Id', format: false },
      name: { name: 'Name', format: false },
      budget: { name: 'Budget' },
    };
    let data = createDownloadFile({ data: inputData, rowFields, rowNamesMapping });
    expect(data).toEqual([
      { Id: 'id1', Name: 'name1', Budget: '23.12%' },
      { Id: 'id2', Name: 'name2', Budget: '$1,123.23' },
    ]);
  });

  it('should return proper formatted data for column types', () => {
    const inputData = [
      {
        children: [
          { id: 'id1', name: 'name1', budget: 2312 },
          { id: 'id2', name: 'name2', budget: 1123.23 },
        ],
      },
    ];

    const rowFields = [{ field: 'id' }, { field: 'name' }, { field: 'budget', valueType: VALUE_TYPES.CURRENCY }];
    const rowNamesMapping = {
      id: { name: 'Id', format: false },
      name: { name: 'Name', format: false },
      budget: { name: 'Budget' },
    };
    let data = createDownloadFile({ data: inputData, rowFields, rowNamesMapping });
    expect(data).toEqual([
      { Id: 'id1', Name: 'name1', Budget: '$2,312.00' },
      { Id: 'id2', Name: 'name2', Budget: '$1,123.23' },
    ]);
  });

  it('should return proper data for nested data and expanded rows', () => {
    const inputData = [
      {
        children: [
          { id: 'id1', name: 'name1' },
          { id: 'id2', name: 'name2' },
          {
            id: 'id3',
            name: 'name3',
            children: [
              { id: 'id31', name: 'name31' },
              {
                id: 'id32',
                name: 'name32',
                children: [
                  { id: 'id321', name: 'name321' },
                  { id: 'id322', name: 'name322' },
                ],
              },
            ],
          },
        ],
      },
    ];
    const rowFields = [{ field: 'id' }, { field: 'name' }];
    const expandedRows = { id3: true };
    const allExpanderRows = { id3: true, id32: true };

    let data = createDownloadFile({ data: inputData, rowFields, expandedRows });
    expect(data).toEqual([
      { id: 'id1', name: 'name1' },
      { id: 'id2', name: 'name2' },
      { id: 'id3', name: 'name3' },
      { id: 'id31', name: 'name31' },
      { id: 'id32', name: 'name32' },
    ]);
    data = createDownloadFile({ data: inputData, rowFields, expandedRows: allExpanderRows });
    expect(data).toEqual([
      { id: 'id1', name: 'name1' },
      { id: 'id2', name: 'name2' },
      { id: 'id3', name: 'name3' },
      { id: 'id31', name: 'name31' },
      { id: 'id32', name: 'name32' },
      { id: 'id321', name: 'name321' },
      { id: 'id322', name: 'name322' },
    ]);
  });
});

describe('testing useRecursiveTable', () => {
  const inputData = [
    {
      children: [
        { id: 'id1', name: 'name1' },
        { id: 'id2', name: 'name2' },
      ],
    },
  ];
  it('should map properly', async () => {
    const subHeaders = [
      { field: 'id', headerName: 'Id' },
      { field: 'name', headerName: 'Name' },
    ];
    let hook;
    await act(async () => {
      hook = renderHook(() => useRecursiveTable({ data: inputData, subHeaders }));
    });

    const { result } = hook;
    const dataState = result.current.dataState;

    expect(dataState.rowNamesMapping).toEqual({ id: { name: 'Id' }, name: { name: 'Name' } });
    expect(dataState.resultData).toEqual([
      { Id: 'id1', Name: 'name1' },
      { Id: 'id2', Name: 'name2' },
    ]);
  });

  it('should set state properly for same headerNames withouth mapping', async () => {
    let hook;
    const subHeaders = [
      { field: 'id', headerName: 'Same' },
      { field: 'name', headerName: 'Same' },
      { field: 'budget', headerName: 'Same' },
    ];
    await act(async () => {
      hook = renderHook(() =>
        useRecursiveTable({
          data: inputData,
          subHeaders,
        }),
      );
    });

    const { result } = hook;
    const dataState = result.current.dataState;

    expect(dataState.rowNamesMapping).toEqual({
      id: { name: 'Same' },
      name: { name: 'Same1' },
      budget: { name: 'Same2' },
    });
    expect(dataState.resultData).toEqual([
      { Same: 'id1', Same1: 'name1', Same2: '' },
      { Same: 'id2', Same1: 'name2', Same2: '' },
    ]);
  });

  it('should set state properly for same headerNames with mapping', async () => {
    let hook;
    const subHeaders = [
      { field: 'id', headerName: 'Same' },
      { field: 'name', headerName: 'Same' },
      { field: 'budget', headerName: 'Same' },
    ];
    const columnNamesMapping = {
      id: { name: 'Id' },
      name: { name: 'Name' },
      budget: { name: 'Budget' },
    };
    await act(async () => {
      hook = renderHook(() =>
        useRecursiveTable({
          data: inputData,
          subHeaders,
          columnNamesMapping,
        }),
      );
    });

    const { result } = hook;
    const dataState = result.current.dataState;

    expect(dataState.rowNamesMapping).toEqual({
      id: { name: 'Id' },
      name: { name: 'Name' },
      budget: { name: 'Budget' },
    });
    expect(dataState.resultData).toEqual([
      { Id: 'id1', Name: 'name1', Budget: '' },
      { Id: 'id2', Name: 'name2', Budget: '' },
    ]);
  });
  it('should set state properly for row format', async () => {
    let hook;
    const inputData = [
      {
        children: [
          { id: 'id1', budget: 23452.12, valueType: VALUE_TYPES.CURRENCY },
          { id: 'id2', budget: 223333.22 },
        ],
      },
    ];
    const subHeaders = [
      { field: 'id', headerName: 'Id' },
      { field: 'budget', headerName: 'Budget' },
    ];
    await act(async () => {
      hook = renderHook(() =>
        useRecursiveTable({
          data: inputData,
          subHeaders,
        }),
      );
    });

    const { result } = hook;
    const dataState = result.current.dataState;

    expect(dataState.resultData).toEqual([
      { Id: 'id1', Budget: '$23,452.12' },
      { Id: 'id2', Budget: '223333.22' },
    ]);
  });
  it('should set state properly for column format', async () => {
    let hook;
    const inputData = [
      {
        children: [
          { id: 'id1', budget: 23452.12 },
          { id: 'id2', budget: -223333.22 },
        ],
      },
    ];
    const subHeaders = [
      { field: 'id', headerName: 'Id' },
      { field: 'budget', headerName: 'Budget', valueType: VALUE_TYPES.CURRENCY },
    ];
    await act(async () => {
      hook = renderHook(() =>
        useRecursiveTable({
          data: inputData,
          subHeaders,
        }),
      );
    });

    const { result } = hook;
    const dataState = result.current.dataState;

    expect(dataState.resultData).toEqual([
      { Id: 'id1', Budget: '$23,452.12' },
      { Id: 'id2', Budget: '($223,333.22)' },
    ]);
  });
  it('should set state properly for header mapping', async () => {
    let hook;
    const inputData = [
      {
        children: [
          { id: 'id1', budget: 23452.12 },
          { id: 'id2', budget: -223333.22 },
        ],
      },
    ];
    const subHeaders = [
      { field: 'id', headerName: '' },
      { field: 'budget', headerName: 'Budget', valueType: VALUE_TYPES.CURRENCY },
    ];
    await act(async () => {
      hook = renderHook(() =>
        useRecursiveTable({
          data: inputData,
          subHeaders,
          columnNamesMapping: {
            id: { name: 'Name', format: false },
            budget: { name: 'Amount' },
          },
        }),
      );
    });

    const { result } = hook;
    const dataState = result.current.dataState;

    expect(dataState.resultData).toEqual([
      { Name: 'id1', Amount: '$23,452.12' },
      { Name: 'id2', Amount: '($223,333.22)' },
    ]);
  });
});
