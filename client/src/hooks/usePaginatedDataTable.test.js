import { renderHook } from '@testing-library/react-hooks';
import produce from 'immer';
import { usePaginatedDataTable } from './usePaginatedDataTable';
describe('Testing usePaginatedDataTable', () => {
  const items = [
    { id: 'id0', value: 'value00' },
    { id: 'id1', value: 'value01' },
    { id: 'id2', value: 'value02' },
    { id: 'id3', value: 'value03' },
    { id: 'id4', value: 'value04' },
    { id: 'id5', value: 'value05' },
    { id: 'id6', value: 'value06' },
    { id: 'id7', value: 'value07' },
    { id: 'id8', value: 'value08' },
    { id: 'id9', value: 'value09' },
    { id: 'id10', value: 'value10' },
  ];
  it('should return state properly on initial data', async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => usePaginatedDataTable({ items, pageSize: 3 }));
    });

    const { result } = hook;
    expect(result.current.pageState).toEqual(
      expect.objectContaining({
        page: 1,
        pagesCount: 4,
        data: [
          { id: 'id0', value: 'value00' },
          { id: 'id1', value: 'value01' },
          { id: 'id2', value: 'value02' },
        ],
        previousPage: 1,
        maintainPageOnUpdate: false,
        keyword: undefined,
      }),
    );
  });
  it('should return properly on partially defined params', async () => {
    let hook;
    await act(async () => {
      hook = renderHook(
        ({ items, pageSize, maintainPageOnUpdate }) => usePaginatedDataTable({ items, pageSize, maintainPageOnUpdate }),
        {
          initialProps: { items: items, pageSize: 3, maintainPageOnUpdate: undefined },
        },
      );
    });

    const { result, rerender, waitForNextUpdate } = hook;
    expect(result.current.pageState).toEqual(
      expect.objectContaining({
        page: 1,
        pagesCount: 4,
        maintainPageOnUpdate: false,
        keyword: undefined,
      }),
    );

    rerender({ items: [{ id: 'id4', value: 'value04' }], pageSize: 3, maintainPageOnUpdate: true });
    expect(result.current.pageState).toEqual(
      expect.objectContaining({
        page: 1,
        pagesCount: 1,
        maintainPageOnUpdate: true,
        keyword: undefined,
      }),
    );
  });

  it('should return properly on fully defined params', async () => {
    let hook;
    await act(async () => {
      hook = renderHook(
        ({ items, pageSize, maintainPageOnUpdate, keyword }) =>
          usePaginatedDataTable({ items, pageSize, maintainPageOnUpdate, keyword }),
        {
          initialProps: { items: items, pageSize: 3, maintainPageOnUpdate: true, keyword: undefined },
        },
      );
    });

    const { result, rerender, waitForNextUpdate } = hook;
    expect(result.current.pageState).toEqual(
      expect.objectContaining({
        page: 1,
        pagesCount: 4,
        maintainPageOnUpdate: true,
        keyword: undefined,
      }),
    );

    rerender({ items: items, pageSize: 3, keyword: 'value', maintainPageOnUpdate: true });
    expect(result.current.pageState).toEqual(
      expect.objectContaining({
        page: 1,
        pagesCount: 4,
        maintainPageOnUpdate: true,
        keyword: 'value',
      }),
    );

    //simulate moving to a different page in search
    await act(async () => {
      result.current.preparePage(3);
    });
    expect(result.current.pageState).toEqual(
      expect.objectContaining({
        page: 3,
        pagesCount: 4,
        maintainPageOnUpdate: true,
        keyword: 'value',
      }),
    );

    // now change something in data
    const updatedItems = produce(items, (draft) => {
      draft[7].value = 'value_JamesBond_007';
    });
    rerender({ items: updatedItems, pageSize: 3, keyword: 'value', maintainPageOnUpdate: true });
    expect(result.current.pageState).toEqual(
      expect.objectContaining({
        page: 3,
        pagesCount: 4,
        maintainPageOnUpdate: true,
        keyword: 'value',
        data: [
          { id: 'id6', value: 'value06' },
          { id: 'id7', value: 'value_JamesBond_007' },
          { id: 'id8', value: 'value08' },
        ],
      }),
    );
  });
});
