import React from 'react';
import Modal from './Modal';

export const ModalComponent = (args) => {
  return (
    <div>
      <Modal open={open} {...args}>
        <p>{args.text}</p>
      </Modal>
    </div>
  );
};

export default {
  title: 'Components/Modal',
  component: Modal,
  argTypes: {
    open: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    text: {
      control: {
        type: 'text',
      },
      defaultValue: 'This is the modal content. It could be a dialog, or something else.',
    },
    onClose: {
      control: {
        disabled: true,
      },
    },
  },
};
