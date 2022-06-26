import { fireEvent } from '@testing-library/dom';
import React from 'react';
import { ButtonsConfirmCancel } from '../ButtonsConfirmCancel';

describe('ButtonsConfirmCancel component', () => {
  it('Renders ButtonsConfirmCancel with 2 buttons', () => {
    render(<ButtonsConfirmCancel />);
    expect(document.getElementsByTagName('button').length).toEqual(2);
  });

  it('Renders ButtonsConfirmCancel with Confirm button', async () => {
    const { getByText } = render(<ButtonsConfirmCancel />);
    expect(getByText('Confirm')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
  });
  it('should call callbacks', async () => {
    const props = {
      onConfirm: jest.fn(),
      onCancel: jest.fn(),
    };

    const { getByText } = render(<ButtonsConfirmCancel {...props} />);

    fireEvent.click(getByText('Cancel'));
    expect(props.onCancel).toHaveBeenCalledWith({ clickId: 'cancel', text: 'Cancel', variant: 'default' });

    fireEvent.click(getByText('Confirm'));
    expect(props.onConfirm).toHaveBeenCalledWith({ clickId: 'confirm', text: 'Confirm', variant: 'success' });
  });
});
