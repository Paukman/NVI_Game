import React, { Fragment } from 'react';
import { SlideBar } from '../SlideBar';
import { Button } from '../../FormElements/Button';
import { action } from '@storybook/addon-actions';
import { Typography } from '../../Typography';
import { FormState } from '../../FormState';
import { InputField } from '../../FormElements/InputField';
import { InputDate } from '../../FormElements/InputDate';
import { Grid, GridItem } from '../../Grid';

describe('Testing SlideBar component', () => {
  beforeEach(() => {
    cleanup();
  });

  it('Closed SideBar does not render when closed', () => {
    render(<SlideBar />);
    expect(document.querySelector('ul.MuiDrawer-root')).toEqual(null);
  });

  it('Button click SlideBar render', () => {
    const props = {
      open: false,
    };
    const mockedOnChange = jest.fn();
    render(
      <Fragment>
        <Button variant='secondary' onClick={mockedOnChange} text={props.open ? 'Close SlideBar' : 'Open SlideBar'} />
        <SlideBar open={props.open} class='sampleslidebar' />
      </Fragment>,
    );
    fireEvent.click(Screen.getByText('Open SlideBar'));
    expect(mockedOnChange).toHaveBeenCalledTimes(1);
    expect(props).toEqual(
      expect.objectContaining({
        open: false,
      }),
    );
  });

  it('SlideBar title render', () => {
    const props = {
      title: 'Text Slide Bar',
    };
    const { container } = render(<Typography variant='h3'>{props.title} </Typography>);
    expect(container).toBeInTheDocument();
  });

  it('Check children prop', () => {
    const data = {
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      birthday: '05/19/2021',
    };
    const props = {
      children: (
        <FormState
          data={data}
          onSubmit={(value) => {
            action('FormState Changed')(value);
          }}
        >
          {({ data, handleChange, submit }) => (
            <Grid spacing={2} lg={'50%'}>
              <InputField label='Username' name='username' value={data?.username} onChange={handleChange} />
              <InputField label='First Name' name='firstName' value={data?.firstName} onChange={handleChange} />
              <InputField label='Last Name' name='lastName' value={data?.lastName} onChange={handleChange} />
              <InputDate label='Birthday' name='birthday' value={data?.birthday} onChange={handleChange} />
              <Button text='Submit' onClick={submit} />
            </Grid>
          )}
        </FormState>
      ),
    };
    render(<SlideBar open={true}>{props.children}</SlideBar>);
    expect(document.querySelector('div.MuiGrid-root').childElementCount).toEqual(5);
  });

  it('onCancel is called', () => {
    const props = {
      buttonCancelText: 'Cancel',
    };
    const mockedOnChange = jest.fn();
    render(
      <SlideBar
        open={true}
        anchor={'right'}
        onSave={(newValue) => {
          action('User entered:')({ newValue });
        }}
        onCancel={mockedOnChange}
        {...props}
      />,
    );
    fireEvent.click(Screen.getByText('Cancel'));
    expect(mockedOnChange).toHaveBeenCalledTimes(1);
  });

  it('onSave is called', () => {
    const props = {
      buttonSaveText: 'Save',
    };
    const mockedOnChange = jest.fn();
    render(
      <SlideBar
        open={true}
        onCancel={action('User Cancel drower')}
        anchor={'right'}
        onSave={mockedOnChange}
        {...props}
      />,
    );
    fireEvent.click(Screen.getByText('Save'));
    expect(mockedOnChange).toHaveBeenCalledTimes(1);
  });
});
