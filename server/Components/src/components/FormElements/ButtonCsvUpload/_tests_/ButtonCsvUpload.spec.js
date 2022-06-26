import { fireEvent } from '@testing-library/react';
import React from 'react';
import { ButtonCsvUpload } from '../ButtonCsvUpload';

describe('Csv upload button', () => {
  beforeEach(() => {
    cleanup();
  });

  it('Check place older text is applied', () => {
    render(<ButtonCsvUpload />);
    const Placeholder = Screen.getByText('Upload or Drop file here');
    expect(Placeholder).toBeInTheDocument();
  });
});
