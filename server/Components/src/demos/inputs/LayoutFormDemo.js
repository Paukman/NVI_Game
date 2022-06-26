import React, { memo } from 'react';
import { SearchableDropdown } from '../../components/FormElements/SearchableDropdown';
import { Search } from '../../components/FormElements/Search';
import { Checkbox } from '../../components/FormElements/Checkbox';
import { YearSelector } from '../../components/FormElements/YearSelector';
import { Button } from '../../components/FormElements/Button';
import { InputDate } from '../../components/FormElements/InputDate';
import { Dropdown } from '../../components/FormElements/Dropdown';
import { InputField } from '../../components/FormElements/InputField';
import { ButtonDownloadAs } from '../../components/FormElements/ButtonDownloadAs';
import { ButtonDropdown } from '../../components/FormElements/ButtonDropdown';
import { Switch } from '../../components/FormElements/Switch';
import { ToolBar, ToolBarItem } from '../../components/ToolBar';
import { Toggle } from '../../components/FormElements/Toggle';
import { Typography } from '../../components/Typography';
import { LinkActions } from '../../components/LinkActions';

import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: 20px;
`;

const Card = styled.div`
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid #cad3da;
  border-radius: 20px;
  box-shadow: 0px 0px 5px #cad3da;
  width: 100%;
  -webkit-flex: 1 1;
  -ms-flex: 1 1;
  flex: 1 1;
  padding: 15px;
  box-sizing: border-box;
`;

const LayoutFormDemo = memo((props) => {
  return (
    <Container>
      <Card>
        <ToolBar id='toolbar'>
          <React.Fragment key='.0'>
            <ToolBarItem>
              <SearchableDropdown
                label='Select'
                size='100%'
                onChange={(e) => {}}
                items={[
                  {
                    label: 'The Shawshank Redemption',
                    value: 'The Shawshank Redemption',
                  },
                  {
                    label: 'The Godfather',
                    value: 'The Godfather',
                  },
                  {
                    label: 'Apple Godfather',
                    value: 'Apple Godfather',
                  },
                  {
                    label: 'The Dark Knight',
                    value: 'The Dark Knight',
                  },
                  {
                    label: '12 Angry Men',
                    value: '12 Angry Men',
                  },
                  {
                    label: "Schindler's List",
                    value: "Schindler's List",
                  },
                  {
                    label: 'Pulp Fiction',
                    value: 'Pulp Fiction',
                  },
                  {
                    label: 'The Lord of the Rings: The Return of the King',
                    value: 'The Lord of the Rings: The Return of the King',
                  },
                  {
                    label: 'The Good, the Bad and the Ugly',
                    value: 'The Good, the Bad and the Ugly',
                  },
                ]}
              />{' '}
            </ToolBarItem>
            <ToolBarItem>
              <Search label='Search' name='search' onChange={() => {}} />
            </ToolBarItem>
            <ToolBarItem>
              <InputDate label='InputDate' onChange={() => {}} />
            </ToolBarItem>
            <ToolBarItem toTheRight>
              <ButtonDownloadAs exclude={[]} />
            </ToolBarItem>
            <ToolBarItem>
              <Switch name='switch' onChange={() => {}} />
            </ToolBarItem>
          </React.Fragment>
        </ToolBar>
      </Card>
      <Card>
        <ToolBar id='toolbar_1'>
          <React.Fragment key='.0'>
            <ToolBarItem>
              <SearchableDropdown
                label='Select'
                size='100%'
                onChange={(e) => {}}
                items={[
                  {
                    label: 'The Shawshank Redemption',
                    value: 'The Shawshank Redemption',
                  },
                  {
                    label: 'The Godfather',
                    value: 'The Godfather',
                  },
                  {
                    label: 'Apple Godfather',
                    value: 'Apple Godfather',
                  },
                  {
                    label: 'The Dark Knight',
                    value: 'The Dark Knight',
                  },
                  {
                    label: '12 Angry Men',
                    value: '12 Angry Men',
                  },
                  {
                    label: "Schindler's List",
                    value: "Schindler's List",
                  },
                  {
                    label: 'Pulp Fiction',
                    value: 'Pulp Fiction',
                  },
                  {
                    label: 'The Lord of the Rings: The Return of the King',
                    value: 'The Lord of the Rings: The Return of the King',
                  },
                  {
                    label: 'The Good, the Bad and the Ugly',
                    value: 'The Good, the Bad and the Ugly',
                  },
                ]}
              />{' '}
            </ToolBarItem>
            <ToolBarItem>
              <Search label='Search' name='search' onChange={() => {}} />
            </ToolBarItem>
            <ToolBarItem toTheRight>
              <Switch name='switch' onChange={() => {}} />
            </ToolBarItem>
          </React.Fragment>
        </ToolBar>
      </Card>
      <Card>
        <ToolBar id='toolbar_2'>
          <React.Fragment key='.0'>
            <ToolBarItem>
              <Toggle onChange={() => {}} value={[0]}>
                <p
                  style={{
                    margin: 0,
                  }}
                >
                  Day
                </p>
                <p
                  style={{
                    margin: 0,
                  }}
                >
                  Month
                </p>
                <p
                  style={{
                    margin: 0,
                  }}
                >
                  Year
                </p>
              </Toggle>
            </ToolBarItem>
            <ToolBarItem>
              <SearchableDropdown
                label='Select'
                size='100%'
                onChange={(e) => {}}
                items={[
                  {
                    label: 'The Shawshank Redemption',
                    value: 'The Shawshank Redemption',
                  },
                  {
                    label: 'The Godfather',
                    value: 'The Godfather',
                  },
                  {
                    label: 'Apple Godfather',
                    value: 'Apple Godfather',
                  },
                  {
                    label: 'The Dark Knight',
                    value: 'The Dark Knight',
                  },
                  {
                    label: '12 Angry Men',
                    value: '12 Angry Men',
                  },
                  {
                    label: "Schindler's List",
                    value: "Schindler's List",
                  },
                  {
                    label: 'Pulp Fiction',
                    value: 'Pulp Fiction',
                  },
                  {
                    label: 'The Lord of the Rings: The Return of the King',
                    value: 'The Lord of the Rings: The Return of the King',
                  },
                  {
                    label: 'The Good, the Bad and the Ugly',
                    value: 'The Good, the Bad and the Ugly',
                  },
                ]}
              />{' '}
            </ToolBarItem>
            <ToolBarItem>
              <InputDate label='InputDate' onChange={() => {}} />
            </ToolBarItem>
          </React.Fragment>
        </ToolBar>
      </Card>
      <Card>
        <ToolBar id='toolbar_3'>
          <React.Fragment key='.0'>
            <ToolBarItem>
              <Typography>Header</Typography>
            </ToolBarItem>
            <ToolBarItem toTheRight>
              <YearSelector label='Year' onChange={() => {}} yearsSince={2011} yearsTo={2021} />
            </ToolBarItem>
            <ToolBarItem>
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
                onChange={() => {}}
                value=''
              />
            </ToolBarItem>
            <ToolBarItem>
              <Search label='Search' name='search' onChange={() => {}} />
            </ToolBarItem>
            <ToolBarItem>
              <ButtonDownloadAs exclude={[]} />
            </ToolBarItem>
          </React.Fragment>
        </ToolBar>
      </Card>
      <Card>
        <ToolBar id='toolbar_4'>
          <React.Fragment key='.0'>
            <ToolBarItem>
              <Toggle onChange={() => {}} value={[0]}>
                <p
                  style={{
                    margin: 0,
                  }}
                >
                  Day
                </p>
                <p
                  style={{
                    margin: 0,
                  }}
                >
                  Month
                </p>
                <p
                  style={{
                    margin: 0,
                  }}
                >
                  Year
                </p>
              </Toggle>
            </ToolBarItem>
            <ToolBarItem>
              <SearchableDropdown
                label='Select'
                size='100%'
                onChange={(e) => {}}
                items={[
                  {
                    label: 'The Shawshank Redemption',
                    value: 'The Shawshank Redemption',
                  },
                  {
                    label: 'The Godfather',
                    value: 'The Godfather',
                  },
                  {
                    label: 'Apple Godfather',
                    value: 'Apple Godfather',
                  },
                  {
                    label: 'The Dark Knight',
                    value: 'The Dark Knight',
                  },
                  {
                    label: '12 Angry Men',
                    value: '12 Angry Men',
                  },
                  {
                    label: "Schindler's List",
                    value: "Schindler's List",
                  },
                  {
                    label: 'Pulp Fiction',
                    value: 'Pulp Fiction',
                  },
                  {
                    label: 'The Lord of the Rings: The Return of the King',
                    value: 'The Lord of the Rings: The Return of the King',
                  },
                  {
                    label: 'The Good, the Bad and the Ugly',
                    value: 'The Good, the Bad and the Ugly',
                  },
                ]}
              />{' '}
            </ToolBarItem>
            <ToolBarItem>
              <InputDate label='InputDate' onChange={() => {}} />
            </ToolBarItem>
            <ToolBarItem>
              <Button iconName='' onClick={() => {}} text='Button' variant='default' />
            </ToolBarItem>
            <ToolBarItem toTheRight>
              <Button iconName='' onClick={() => {}} text='Button' variant='default' />
            </ToolBarItem>
            <ToolBarItem>
              <Button iconName='' onClick={() => {}} text='Button' variant='default' />
            </ToolBarItem>
            <ToolBarItem>
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
                onChange={() => {}}
              />
            </ToolBarItem>
          </React.Fragment>
        </ToolBar>
      </Card>
      <Card>
        <ToolBar id='toolbar_5'>
          <React.Fragment key='.0'>
            <ToolBarItem>
              <SearchableDropdown
                label='Select'
                size='100%'
                onChange={(e) => {}}
                items={[
                  {
                    label: 'The Shawshank Redemption',
                    value: 'The Shawshank Redemption',
                  },
                  {
                    label: 'The Godfather',
                    value: 'The Godfather',
                  },
                  {
                    label: 'Apple Godfather',
                    value: 'Apple Godfather',
                  },
                  {
                    label: 'The Dark Knight',
                    value: 'The Dark Knight',
                  },
                  {
                    label: '12 Angry Men',
                    value: '12 Angry Men',
                  },
                  {
                    label: "Schindler's List",
                    value: "Schindler's List",
                  },
                  {
                    label: 'Pulp Fiction',
                    value: 'Pulp Fiction',
                  },
                  {
                    label: 'The Lord of the Rings: The Return of the King',
                    value: 'The Lord of the Rings: The Return of the King',
                  },
                  {
                    label: 'The Good, the Bad and the Ugly',
                    value: 'The Good, the Bad and the Ugly',
                  },
                ]}
              />{' '}
            </ToolBarItem>
            <ToolBarItem>
              <InputField multiline onChange={() => {}} type='text' />
            </ToolBarItem>
            <ToolBarItem>
              <span>
                <Checkbox /> label
              </span>
            </ToolBarItem>
            <ToolBarItem toTheRight>
              <ButtonDropdown
                iconName='search'
                items={[
                  {
                    icon: 'search',
                    label: 'Email',
                  },
                  {
                    icon: 'Assignment',
                    label: 'KPI Hotel Revenue Graphical Interface',
                  },
                ]}
                onClick={() => {}}
                text='Action'
                variant='default'
              />
            </ToolBarItem>
          </React.Fragment>
        </ToolBar>
      </Card>
      <Card>
        <ToolBar id='toolbar_6'>
          <React.Fragment key='.0'>
            <ToolBarItem>
              <SearchableDropdown
                label='Select'
                size='100%'
                onChange={(e) => {}}
                items={[
                  {
                    label: 'The Shawshank Redemption',
                    value: 'The Shawshank Redemption',
                  },
                  {
                    label: 'The Godfather',
                    value: 'The Godfather',
                  },
                  {
                    label: 'Apple Godfather',
                    value: 'Apple Godfather',
                  },
                  {
                    label: 'The Dark Knight',
                    value: 'The Dark Knight',
                  },
                  {
                    label: '12 Angry Men',
                    value: '12 Angry Men',
                  },
                  {
                    label: "Schindler's List",
                    value: "Schindler's List",
                  },
                  {
                    label: 'Pulp Fiction',
                    value: 'Pulp Fiction',
                  },
                  {
                    label: 'The Lord of the Rings: The Return of the King',
                    value: 'The Lord of the Rings: The Return of the King',
                  },
                  {
                    label: 'The Good, the Bad and the Ugly',
                    value: 'The Good, the Bad and the Ugly',
                  },
                ]}
              />{' '}
            </ToolBarItem>
            <ToolBarItem>
              <Search label='Search' name='search' onChange={() => {}} />
            </ToolBarItem>
            <ToolBarItem>
              <span>
                <Checkbox /> label
              </span>
            </ToolBarItem>
            <ToolBarItem>
              <Button iconName='' onClick={() => {}} text='Button' variant='default' />
            </ToolBarItem>
            <ToolBarItem toTheRight>
              <Switch name='switch' onChange={() => {}} />
            </ToolBarItem>
          </React.Fragment>
        </ToolBar>
      </Card>
      <Card>
        <ToolBar id='toolbar_7'>
          <React.Fragment key='.0'>
            <ToolBarItem>
              <LinkActions
                items={[
                  {
                    iconName: 'calendar',
                    text: 'Edit',
                  },
                  {
                    iconName: 'dashboard',
                    text: 'Delete',
                  },
                ]}
                onClick={() => {}}
              />
            </ToolBarItem>
            <ToolBarItem toTheRight>
              <Button iconName='Add' onClick={() => {}} text='GL Code' variant='tertiary' />
            </ToolBarItem>
            <ToolBarItem>
              <Button iconName='Import' onClick={() => {}} text='Import' variant='tertiary' />
            </ToolBarItem>
            <ToolBarItem>
              <Button iconName='Export' onClick={() => {}} text='Download' variant='tertiary' />
            </ToolBarItem>
            <ToolBarItem>
              <Button iconName='Filter' onClick={() => {}} text='Filters' variant='tertiary' />
            </ToolBarItem>
          </React.Fragment>
        </ToolBar>
      </Card>
    </Container>
  );
});

LayoutFormDemo.displayName = 'LayoutFormDemo';

LayoutFormDemo.propTypes = {};

export default LayoutFormDemo;
