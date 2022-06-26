import React from 'react';
import PropTypes from 'prop-types';
import { ToastAlert } from './index';

const TestToastAlert = (props) => {
  const { message } = props;
  return <ToastAlert {...props}>{message}</ToastAlert>;
};

export const ToastAlertComponent = (args) => {
  return <TestToastAlert {...args} />;
};

TestToastAlert.propTypes = {
  message: PropTypes.string,
};

export default {
  title: 'Components/ToastAlert',
  component: ToastAlert,
  argTypes: {
    message: {
      control: {
        type: 'text',
      },
      defaultValue: 'Successful',
    },
    severity: {
      options: ToastAlert.severities,
      control: {
        type: 'radio',
      },
      defaultValue: ToastAlert.severities[0],
    },
    variant: {
      options: ToastAlert.variants,
      control: {
        type: 'radio',
      },
      defaultValue: ToastAlert.variants[0],
    },
    elevation: {
      control: {
        type: 'number',
      },
      defaultValue: 6,
    },
  },
};
