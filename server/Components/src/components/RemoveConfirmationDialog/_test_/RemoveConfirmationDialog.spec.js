import React from 'react';
import { RemoveConfirmationDialog } from '../RemoveConfirmationDialog';

describe('RemoveConfirmationDialog component', () => {
  const mockedOnClick = jest.fn();
  it('Renders RemoveConfirmationDialog with description', () => {
    const props = {
      onCancel: { mockedOnClick },
      onConfirm: { mockedOnClick },
      okText: 'OK',
      cancelText: 'Cancel',
      description: 'This place is for description of removing item',
      open: true,
      onClose: { mockedOnClick },
    };
    const { getByText } = render(<RemoveConfirmationDialog {...props} />);
    expect(getByText(/This place is for description of removing item/i)).toBeInTheDocument();
  });

  it('Renders RemoveConfirmationDialog without description', () => {
    const props = {
      onCancel: { mockedOnClick },
      onConfirm: { mockedOnClick },
      okText: 'OK',
      cancelText: 'Cancel',
      open: true,
      onClose: { mockedOnClick },
    };
    const { queryByText } = render(<RemoveConfirmationDialog {...props} />);
    expect(queryByText(/This place is for description of removing item/i)).not.toBeInTheDocument();
  });
});
