import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Card } from '../../components/Card';
import { SearchableDropdown } from '../../components/FormElements/SearchableDropdown';
import { Search } from '../../components/FormElements/Search';
import { Toggle } from '../../components/FormElements/Toggle';
import { Button } from '../../components/FormElements/Button';
import { LinkActions } from '../../components/LinkActions';
import { ToolBar, ToolBarItem } from '../../components/ToolBar';

import styled from 'styled-components';

const Container = styled.div`
  .formElements {
    display: flex;
    flex-direction: row;
    width: 100%;
  }
`;

const ToolBarInputsDemo = memo((props) => {
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
            <ToolBarItem toTheRight>
              <Toggle onChange={() => {}} value={[0]}>
                <span>React</span>
                <span>Redux</span>
              </Toggle>
            </ToolBarItem>
          </React.Fragment>
        </ToolBar>
        <ToolBar id='toolbar_1'>
          <React.Fragment key='.0'>
            <ToolBarItem>
              <div className='formElements'>
                <span>Bulk Actions :</span>
                <LinkActions
                  items={[
                    {
                      text: 'Edit',
                    },
                    {
                      text: 'Delete',
                    },
                  ]}
                  onClick={() => {}}
                />
              </div>
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

ToolBarInputsDemo.displayName = 'ToolBarInputsDemo';

ToolBarInputsDemo.propTypes = {};

export default ToolBarInputsDemo;
