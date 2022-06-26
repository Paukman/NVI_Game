import React from 'react';
import Modal from '../Modal';

describe('Modal Component', () => {
  beforeEach(() => {
    cleanup();
  });
  it('renders modal component with p tag as children', () => {
    const { getByText } = render(
      <Modal open={true}>
        <p>Sample Modal Component</p>
      </Modal>,
    );
    expect(getByText('Sample Modal Component')).toBeInTheDocument();
  });
  it("shouldn't render p tag as children when the modal component was destroyed", () => {
    render(
      <Modal open={false}>
        <p>Sample Modal Component</p>
      </Modal>,
    );
    expect(Screen.queryByText('Sample Modal Component')).not.toBeInTheDocument();
  });
});
