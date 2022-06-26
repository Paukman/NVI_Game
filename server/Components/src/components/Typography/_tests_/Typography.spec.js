import React from 'react';
import { Typography } from '../Typography';

describe('Testing Typography component', () => {
  beforeEach(() => {
    cleanup();
  });

  it('render typography component with h1 variant', () => {
    const { container } = render(<Typography variant='h1'>H1 Tag</Typography>);
    expect(container).toBeInTheDocument();
  });
  it('render typography component with h2 variant', () => {
    const { container } = render(<Typography variant='h2'>H2 Tag</Typography>);
    expect(container).toBeInTheDocument();
  });

  it('render typography component with h3 variant', () => {
    const { container } = render(<Typography variant='h3'>H3 Tag</Typography>);
    expect(container).toBeInTheDocument();
  });
  it('render typography component with h4 variant', () => {
    const { container } = render(<Typography variant='h4'>H4 Tag</Typography>);
    expect(container).toBeInTheDocument();
  });
  it('render typography component with h5 variant', () => {
    const { container } = render(<Typography variant='h5'>H5 Tag</Typography>);
    expect(container).toBeInTheDocument();
  });
});
