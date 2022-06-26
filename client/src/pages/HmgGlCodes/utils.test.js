import { remapHierarchyTableData } from './utils';
import { getText } from 'utils';

describe('Testing remapHierarchyTableData', () => {
  // test garbage first
  test.each`
    data         | expected
    ${null}      | ${[]}
    ${undefined} | ${[]}
    ${''}        | ${[]}
    ${'garbage'} | ${[]}
    ${{}}        | ${[]}
    ${[]}        | ${[]}
  `('should returns an empty array for value $data ', ({ data, expected }) => {
    const result = remapHierarchyTableData(data);
    expect(result).toEqual(expected);
  });

  it('should return proper data for excel download', () => {
    const data = [
      { id: 1, ['GL Code']: '', statusId: 100, parentId: null },
      { id: 2, ['GL Code']: '', statusId: 0, parentId: null },
      { id: 3, ['GL Code']: '', statusId: 100, parentId: 'someParent' },
      { id: 4, ['GL Code']: '', statusId: 0, parentId: 'someParent' },
      { id: 5, ['GL Code']: 'GL_Code', statusId: 100, parentId: 'someParent' },
      { id: 6, ['GL Code']: 'GL_Code', statusId: 0, parentId: 'someParent' },
    ];
    const result = remapHierarchyTableData(data);
    expect(result).toEqual([
      { 'GL Code': '', Status: 'Active', id: 1 },
      { 'GL Code': '', Status: 'Inactive', id: 2 },
      { 'GL Code': '', Status: 'Inactive', id: 3 },
      { 'GL Code': '', Status: 'Inactive', id: 4 },
      { 'GL Code': 'GL_Code', Status: 'Active', id: 5 },
      { 'GL Code': 'GL_Code', Status: 'Inactive', id: 6 },
    ]);
  });
});
