import React from 'react';
import { action } from '@storybook/addon-actions';
import { ButtonCsvUpload } from './ButtonCsvUpload';

export const CsvUploadButtonComponent = (args) => {
  return <ButtonCsvUpload {...args} onUploadAccepted={action('Upload')} onRemoveFile={action('Removed')} />;
};

export default {
  title: 'Components/FormElements/ButtonCsvUpload',
  component: ButtonCsvUpload,
  argTypes: {
    error: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
  },
};
