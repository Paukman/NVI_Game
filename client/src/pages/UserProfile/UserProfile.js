import React, { memo, useState } from 'react';
import { Button, Checkbox, Grid, GridItem, InputField, SearchableDropdown, Switch } from 'mdo-react-components';
import { getText } from '../../utils/localesHelpers';
import { WrapperCheckbox } from './styled';

const UserProfile = memo(() => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [active, setActive] = useState({
    'checkbox-3': true,
  });
  const [email, setEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [homePhone, setHomePhone] = useState('');
  const [cellPhone, setCellPhone] = useState('');
  const [faxNumber, setFaxNumber] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [streetAddress1, setStreetAddress1] = useState('');
  const [streetAddress2, setStreetAddress2] = useState('');

  const handleSubmit = () => {
    console.log('First Name = ' + firstName);
    console.log('Last Name = ' + lastName);
    console.log('Gender = ' + gender);
    console.log('Email = ' + email);
    console.log('Business Phone = ' + businessPhone);
    console.log('Home Phone = ' + homePhone);
    console.log('Cell Phone = ' + cellPhone);
    console.log('Fax Number = ' + faxNumber);
    console.log('Country = ' + country);
    console.log('State = ' + state);
    console.log('City = ' + city);
    console.log('Street Address 2 = ' + streetAddress1);
    console.log('Street Address 2 = ' + streetAddress2);
  };

  return (
    <div>
      <p>Implement User Profile here.</p>
      <Grid spacing={2}>
        <GridItem md={6} lg={3}>
          <InputField
            variant='outlined'
            label='First Name'
            multiline={false}
            value={firstName}
            onChange={(name, value) => {
              setFirstName(value);
            }}
          />
        </GridItem>
        <GridItem md={6} lg={3}>
          <InputField
            variant='outlined'
            label='Last Name'
            multiline={false}
            value={lastName}
            onChange={(name, value) => {
              setLastName(value);
            }}
          />
        </GridItem>
        <GridItem md={6} lg={3}>
          <WrapperCheckbox>
            Male <Checkbox checked={true} />
            Female <Checkbox checked={false} />
          </WrapperCheckbox>
        </GridItem>
        <GridItem md={6} lg={3}>
          <InputField
            variant='outlined'
            label='Email'
            multiline={false}
            value={email}
            onChange={(name, value) => {
              setEmail(value);
            }}
          />
        </GridItem>
        <GridItem md={6} lg={3}>
          <InputField
            variant='outlined'
            label='Business Phone Number'
            multiline={false}
            value={businessPhone}
            onChange={(name, value) => {
              setBusinessPhone(value);
            }}
          />
        </GridItem>
        <GridItem md={6} lg={3}>
          <InputField
            variant='outlined'
            label='Home Phone Number'
            multiline={false}
            value={homePhone}
            onChange={(name, value) => {
              setHomePhone(value);
            }}
          />
        </GridItem>
        <GridItem md={6} lg={3}>
          <InputField
            variant='outlined'
            label='Cell Phone Number'
            multiline={false}
            value={cellPhone}
            onChange={(name, value) => {
              setCellPhone(value);
            }}
          />
        </GridItem>
        <GridItem md={6} lg={3}>
          <InputField
            variant='outlined'
            label='Fax Number'
            multiline={false}
            value={faxNumber}
            onChange={(name, value) => {
              setFaxNumber(value);
            }}
          />
        </GridItem>
        <GridItem md={6} lg={3}>
          <SearchableDropdown
            label='Country'
            items={[
              {
                label: 'Canada',
                name: 'Canada',
                value: '1',
              },
              {
                label: 'India',
                name: 'India',
                value: '2',
              },
              {
                label: 'Sri Lanka',
                name: 'Sri Lanka',
                value: '3',
              },
              {
                label: 'USA',
                name: 'United States',
                value: '4',
              },
            ]}
            value={country}
            onChange={(name, value) => {
              setCountry(value);
            }}
          />
        </GridItem>
        <GridItem md={6} lg={3}>
          <SearchableDropdown
            label='State'
            items={[
              {
                label: 'State 1',
                name: 'State 1',
                value: '1',
              },
              {
                label: 'State 2',
                name: 'State 2',
                value: '2',
              },
              {
                label: 'State 3',
                name: 'State 3',
                value: '3',
              },
              {
                label: 'State 4',
                name: 'State 4',
                value: '4',
              },
            ]}
            value={state}
            onChange={(name, value) => {
              setState(value);
            }}
          />
        </GridItem>
        <GridItem md={6} lg={3}>
          <InputField
            variant='outlined'
            label='City'
            multiline={false}
            value={city}
            onChange={(name, value) => {
              setCity(value);
            }}
          />
        </GridItem>
        <GridItem md={6} lg={6}>
          <InputField
            variant='outlined'
            label='Street address 1'
            multiline={false}
            value={streetAddress1}
            onChange={(name, value) => {
              setStreetAddress1(value);
            }}
          />
        </GridItem>
        <GridItem md={6} lg={6}>
          <InputField
            variant='outlined'
            label='Street address 2'
            multiline={false}
            value={streetAddress2}
            onChange={(name, value) => {
              setStreetAddress2(value);
            }}
          />
        </GridItem>
        <GridItem>
          <Button
            variant='primary'
            text={'Submit'}
            onClick={() => {
              handleSubmit();
            }}
          />
        </GridItem>
      </Grid>
    </div>
  );
});

UserProfile.displayName = 'UserProfile';

export { UserProfile };
