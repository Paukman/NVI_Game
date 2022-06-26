import React from 'react';
import PageLoading from '../PageLoading';

const props = {
  type: 'circularProgress',
  size: '64px',
  open: true,
};

describe('PageLoading Component', () => {
  beforeEach(() => {
    cleanup();
  });
  it('check the arguments pass to the page loader', () => {
    const loader = jest.fn();
    render(<PageLoading open={props.open} type={props.type} size={props.size} />);
    expect(props.open).toBeTruthy();
    expect(props.type).toMatch('circularProgress');
  });
});
