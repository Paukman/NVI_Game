import { createDownloadFile } from './downloadHelpers';
import { VALUE_TYPES } from 'config/constants';

describe('Testing createDownloadFile', () => {
  it('should return proper data for garbage', () => {
    let data = createDownloadFile({ data: null });
    expect(data).toEqual([]);
    data = createDownloadFile({ data: undefined });
    expect(data).toEqual([]);
    data = createDownloadFile({ data: '' });
    expect(data).toEqual([]);
    data = createDownloadFile({ data: [] });
    expect(data).toEqual([]);
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
    const rowFields = ['id', 'name'];
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
    const rowFields = ['id', 'name'];
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
    const rowFields = ['id', 'name'];
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

    const rowFields = ['id', 'name'];
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

    const rowFields = ['id', 'name'];
    const rowNamesMapping = {
      id: { name: 'Id' },
    };
    let data = createDownloadFile({ data: inputData, rowFields, rowNamesMapping });
    expect(data).toEqual([
      { Id: 'id1', name: 'name1' },
      { Id: 'id2', name: 'name2' },
    ]);
  });

  it('should return proper formatted data', () => {
    const inputData = [
      {
        children: [
          { id: 'id1', name: 'name1', budget: 0.2312, valueType: VALUE_TYPES.PERCENTAGE },
          { id: 'id2', name: 'name2', budget: 1123.23, valueType: VALUE_TYPES.CURRENCY },
        ],
      },
    ];

    const rowFields = ['id', 'name', 'budget'];
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
    const rowFields = ['id', 'name'];
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
