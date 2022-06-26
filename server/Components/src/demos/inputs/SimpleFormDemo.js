import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem } from '../../components/Grid';
import { SearchableDropdown } from '../../components/FormElements/SearchableDropdown';
import { Button } from '../../components/FormElements/Button';
import { InputField } from '../../components/FormElements/InputField';
import { Checkbox } from '../../components/FormElements/Checkbox';
import { Dropdown } from '../../components/FormElements/Dropdown';
import styled from 'styled-components';

const Container = styled.div`
  .btnGroup {
    display: flex;
    align-items: center;
    justify-content: center;
    & > * {
      margin: 0 10px;
      width: 120px;
    }
  }
`;

const SimpleFormDemo = memo((props) => {
  const { onClick, onCancel } = props;
  const [state, setState] = useState({});

  const handleChange = (name, value) => {
    const newState = {
      ...state,
      [name]: value,
    };

    setState(newState);
  };

  const onSubmit = () => {
    if (typeof onClick === 'function') {
      onClick(state);
    }
  };

  return (
    <Container>
      <form>
        <Grid direction='column' justify='flex-start' alignItems='center' spacing={2}>
          <GridItem xs={12} sm={12} md={4} lg={3}>
            <InputField
              helperText='HelperText/Hint'
              name='username'
              label='Input'
              onChange={handleChange}
              variant='standard'
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4} lg={3}>
            <InputField
              helperText='HelperText/Hint'
              name='username2'
              label='Multiline'
              multiline
              onChange={handleChange}
              variant='standard'
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4} lg={3}>
            <SearchableDropdown
              label='Select'
              name='hotelName'
              size='100%'
              onChange={handleChange}
              items={[
                {
                  label: 'Hotel 1',
                  value: 'Hotel 1',
                },
                {
                  label: 'Hotel 2',
                  value: 'Hotel 2',
                },
                {
                  label: 'Hotel 3',
                  value: 'Hotel 3',
                },
              ]}
            />{' '}
          </GridItem>
          <GridItem xs={12} sm={12} md={4} lg={3}>
            <Dropdown
              items={[
                {
                  label: 'React',
                  value: 'React',
                },
                {
                  label: 'Redux',
                  value: 'Redux',
                },
                {
                  label: 'Flux',
                  value: 'Flux',
                },
              ]}
              label='Libraries'
              name='dropdown'
              onChange={handleChange}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4} lg={3}>
            <p>
              <Checkbox name='check' onChange={handleChange} />
              Lorem Ipsum is simply
            </p>
          </GridItem>
          <GridItem xs={12} sm={12} md={4} lg={3}>
            <div className='btnGroup'>
              <Button onClick={onCancel} text='Cancel' variant='default' />
              <Button onClick={onSubmit} text='Save' variant='success' />
            </div>
          </GridItem>
        </Grid>
      </form>
    </Container>
  );
});

SimpleFormDemo.displayName = 'SimpleFormDemo';

SimpleFormDemo.propTypes = {
  onClick: PropTypes.func,
  onCancel: PropTypes.func,
};

export default SimpleFormDemo;
