import { render } from '@testing-library/react';
import { CreateHeaders } from './utils';

const subHeaders = [{ headerName: '' }, { headerName: 'column1', bgcolor: true }];

describe('Testing CreateHeaders', () => {
  it('should return subheaders', () => {
    const res = CreateHeaders({ subHeaders: subHeaders });
    expect(res).toMatchInlineSnapshot(`
      Array [
        Object {
          "single": true,
          "span": 1,
        },
        Object {
          "backgroundColor": "#fff",
          "borderRight": "#fff",
          "content": <styled.div>
            <styled.button
              data-el="button-drag-column1"
              onClick={[Function]}
            />
            <styled.div>
              <styled.button
                data-el="button-edit-column1"
                onClick={[Function]}
              >
                <Styled(Component)
                  name="Settings"
                />
              </styled.button>
              <styled.button
                data-el="button-delete-column1"
                onClick={[Function]}
              >
                <Styled(Component)
                  name="Delete"
                />
              </styled.button>
            </styled.div>
          </styled.div>,
          "span": 1,
        },
      ]
    `);
  });
  /*it('should call proper callbacks on icon clicks', () => {
    const onDragColumn = jest.fn();
    const onEditColumn = jest.fn();
    const onDeleteColumn = jest.fn();
    const props = {
      onDragColumn,
      onEditColumn,
      onDeleteColumn,
      subHeaders: subHeaders,
    };
    render(CreateHeaders(props));

    fireEvent.click(document.querySelector("button[data-el='button-drag-column1']"));
    expect(onDragColumn).toHaveBeenCalledWith({ headerName: 'column1', bgcolor: true }, 1);

    fireEvent.click(document.querySelector("button[data-el='button-edit-column1']"));
    expect(onEditColumn).toHaveBeenCalledWith({ headerName: 'column1', bgcolor: true }, 1);

    fireEvent.click(document.querySelector("button[data-el='button-delete-column1']"));
    expect(onDeleteColumn).toHaveBeenCalledWith({ headerName: 'column1', bgcolor: true }, 1);
  });
  */
});
