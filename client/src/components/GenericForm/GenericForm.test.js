import React from 'react';
import { GenericForm } from './GenericForm';
import { InputField } from 'mdo-react-components';
import { fireEvent } from '@testing-library/dom';

describe('Testing GenericForm', () => {
  const formConfiguration = {
    items: [
      {
        name: 'name', // mandatory
        attrs: {
          dataEl: 'myIdentifier',
        },
        component: <InputField />, // mandatory
        visible: true, // mandatory
      },
    ],
  };

  it('should return null on missing configuration', () => {
    const { container } = render(<GenericForm />);
    expect(container.firstChild).toBeNull();
  });
  it('should return null on null configuration', () => {
    const { container } = render(<GenericForm formConfig={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render minimum configuration', () => {
    render(<GenericForm formConfig={formConfiguration} />);
    expect(document.querySelector("div[data-el='myIdentifier']")).toBeTruthy();
    expect(document.querySelector("input[name='name']")).toBeTruthy();
    expect(document.querySelector("input[value='']")).toBeTruthy();
  });
  it('should show value from data', () => {
    render(<GenericForm formConfig={formConfiguration} data={{ name: 'Some name value' }} />);
    expect(document.querySelector("div[data-el='myIdentifier']")).toBeTruthy();
    expect(document.querySelector("input[value='Some name value']")).toBeTruthy();
  });
  it('should verify button callbacks', () => {
    const onCancel = jest.fn();
    const onSubmit = jest.fn();
    const expandedConfig = {
      ...formConfiguration,
      buttons: [
        {
          clickId: 'cancel', // this is mandatory for cancel button
          text: 'Cancel',
          variant: 'default',
          dataEl: 'cancelButton',
          onHandleClick: onCancel,
        },
        {
          clickId: 'save', // this is mandatory for submit buttons
          text: 'Save',
          variant: 'success',
          dataEl: 'submitButton',
          onHandleClick: onSubmit,
          submitButton: true,
        },
      ],
      displayConfig: {
        onXCancelButton: onCancel,
      },
    };
    render(<GenericForm formConfig={expandedConfig} data={{ name: 'This is input value' }} />);
    fireEvent.click(document.querySelector("button[data-el='submitButton']"));
    expect(onSubmit).toBeCalledWith(
      {
        name: 'This is input value',
      },
      // return input
      {
        name: 'This is input value',
      },
      // return button value
      {
        clickId: 'save',
        dataEl: 'submitButton',
        onHandleClick: onSubmit,
        text: 'Save',
        variant: 'success',
        submitButton: true,
      },
    );
    fireEvent.click(document.querySelector("button[data-el='cancelButton']"));
    expect(onCancel).toBeCalledTimes(1);

    // click on x cancel button with same callback
    fireEvent.click(document.querySelector("button[data-el='cancelButton']"));
    expect(onCancel).toBeCalledTimes(2);
  });
});
