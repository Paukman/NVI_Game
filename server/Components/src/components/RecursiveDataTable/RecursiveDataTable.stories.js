import React from 'react';
import PropTypes from 'prop-types';
import { RecursiveDataTable } from './RecursiveDataTable';
import { SearchableDropdown } from '../FormElements/SearchableDropdown';
import { colors } from '../../theme/colors';
import { Currency } from '../Currency';
import { Dropdown } from '../FormElements/Dropdown';
import { TableRow, TableCell } from '@material-ui/core';
import { data } from './data';

import styled from 'styled-components';
import { Icon } from '../Icon';

const DisplayColumn = (props) => {
  const { value } = props || {};
  return <Currency value={value} />;
};
const SearchableDropdownItems = [
  {
    label: 'The Shawshank Redemption',
    name: 'The Shawshank Redemption (Name)',
    value: '1',
  },
  {
    label: 'The Godfather',
    name: 'The Godfather (Name)',
    value: '2',
  },
  {
    label: 'Apple Godfather',
    name: 'Apple Godfather (Name)',
    value: '3',
  },
  {
    label: 'The Dark Knight',
    name: 'The Dark Knight (Name)',
    value: '4',
  },
];

const DisplaySearchableDropdown = (props) => {
  const { value } = props || {};

  return <SearchableDropdown value={value} items={SearchableDropdownItems} />;
};

DisplaySearchableDropdown.protoTypes = {
  value: PropTypes.any,
};

DisplayColumn.propTypes = {
  value: PropTypes.any,
};

DisplaySearchableDropdown.displayName = 'DisplaySearchableDropdown';

DisplayColumn.displayName = 'DisplayColumn';

const dropDownItems = [
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
];

const subHeaders = [
  {
    field: 'title',
    headerName: 'Name',
    width: '250px',
    minWidth: '250px',
    //maxWidth: '250px',
    headerClassName: '',
    headerAlign: 'left',
    align: 'left',
    showTooltipIfLongerThan: true,
  },
  {
    field: 'glCode',
    headerName: 'GL Code',
    width: '120px',
    minWidth: '120px',
    headerClassName: '',
    headerAlign: 'left',
    align: 'left',
    color: `${colors.blue}`,
    background: 'white',
  },
  {
    field: 'jan',
    headerName: 'Jan',
    width: '80px',
    minWidth: '80px',
    maxWidth: '50px',
    headerClassName: '',
    headerAlign: 'center',
    align: 'left',
    onRender: DisplayColumn,
    hasBorder: true,
    maxColor: colors.red,
    mediumColor: colors.orange,
  },
  {
    field: 'feb',
    headerName: 'Feb',
    width: '80px',
    minWidth: '80px',
    headerClassName: '',
    headerAlign: 'center',
    align: 'center',
    onRender: DisplayColumn,
    align: 'left',
  },
  {
    field: 'mar',
    headerName: 'Mar',
    width: '80px',
    minWidth: '80px',
    headerClassName: '',
    headerAlign: 'center',
    align: 'center',
    onRender: DisplayColumn,
    hasBorder: true,
    hasVerticalBorder: true,
    maxColor: colors.red,
    mediumColor: colors.orange,
  },
  {
    field: 'apr',
    headerName: 'Apr',
    width: '80px',
    minWidth: '80px',
    headerClassName: '',
    headerAlign: 'center',
    align: 'left',
    onRender: DisplayColumn,
  },
  {
    field: 'may',
    headerName: 'May',
    width: '80px',
    minWidth: '80px',
    headerClassName: '',
    headerAlign: 'center',
    align: 'left',
    onRender: DisplayColumn,
  },
  {
    field: 'jun',
    headerName: 'Jun',
    width: '80px',
    minWidth: '80px',
    headerClassName: '',
    headerAlign: 'center',
    align: 'left',
    onRender: DisplayColumn,
  },
  {
    field: 'jul',
    headerName: 'Jul',
    width: '80px',
    minWidth: '80px',
    headerClassName: '',
    headerAlign: 'center',
    align: 'left',
    onRender: DisplayColumn,
  },
  {
    field: 'aug',
    headerName: 'Aug',
    width: '80px',
    minWidth: '80px',
    headerClassName: '',
    headerAlign: 'center',
    align: 'left',
    onRender: DisplayColumn,
  },
  {
    field: 'sep',
    headerName: 'Sep',
    width: '80px',
    minWidth: '80px',
    headerClassName: '',
    headerAlign: 'center',
    align: 'left',
    onRender: DisplayColumn,
  },
  {
    field: 'oct',
    headerName: 'Oct',
    width: '80px',
    minWidth: '80px',
    headerClassName: '',
    headerAlign: 'center',
    align: 'left',
    onRender: DisplayColumn,
  },
  {
    field: 'nov',
    headerName: 'Nov',
    width: '80px',
    minWidth: '80px',
    headerClassName: '',
    headerAlign: 'center',
    align: 'left',
    onRender: DisplayColumn,
  },
  {
    field: 'dec',
    headerName: '',
    width: '80px',
    minWidth: '80px',
    headerClassName: '',
    headerAlign: 'center',
    align: 'left',
    onRender: DisplayColumn,
  },
  {
    field: 'total',
    headerName: 'Total',
    width: '80px',
    minWidth: '80px',
    headerClassName: '',
    headerAlign: 'left',
    align: 'left',
    onRender: DisplayColumn,
    maxColor: colors.red,
    mediumColor: colors.orange,
  },
  {
    field: 'compareTo',
    headerName: 'Compare',
    width: '80px',
    minWidth: '80px',
    headerClassName: '',
    headerAlign: 'left',
    align: 'left',
    onRender: DisplayColumn,
  },
  {
    field: 'variance',
    headerName: 'Variance',
    width: '80px',
    minWidth: '80px',
    headerClassName: '',
    headerAlign: 'left',
    align: 'left',
    onRender: DisplayColumn,
    maxColor: colors.red,
    mediumColor: colors.orange,
  },
  {
    field: 'dropdown',
    headerName: 'DropDown',
    minWidth: '120px',
    headerAlign: 'left',
    align: 'left',
    onRender: DisplayDropdown,
  },
  {
    field: 'serchabledropdown',
    headerName: 'SearchableDropDown',
    minWidth: '120px',
    headerAlign: 'left',
    align: 'left',
    onRender: DisplaySearchableDropdown,
  },
];

const DisplayDropdown = (props) => {
  const { value } = props || {};
  return <Dropdown value={value} items={dropDownItems} />;
};

DisplayDropdown.propTypes = {
  value: PropTypes.any,
};

DisplayDropdown.displayName = 'DisplayDropdown';

const maxValues = [33114, 9.528082930157279];
const mediumValues = [3188.48, 0, 3404.03, 37419.61, 0];

const headers = (
  <TableRow>
    <TableCell>ACTUAL</TableCell>
  </TableRow>
);

const RightIcons = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const InnerContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

const IconButton = styled.button`
  border: none;
  background-color: transparent;
  color: currentColor;
  cursor: pointer;
  align-items: center;
  flex-direction: row;
  padding: 0px 0px;
`;

const StyledIcon = styled(({ name }) => <Icon size='20px' color={colors.customTableIconColor} name={name} />)``;

const customElement = () => {
  return (
    <InnerContent>
      <IconButton onClick={() => {}}>
        <StyledIcon name='DragHandle' />
      </IconButton>
      <RightIcons>
        <IconButton onClick={() => {}}>
          <StyledIcon name='Settings' />
        </IconButton>
        <IconButton onClick={() => {}}>
          <StyledIcon name='Delete' />
        </IconButton>
      </RightIcons>
    </InnerContent>
  );
};

const oneHeader = [
  [
    { span: 1, single: true },
    { span: 1, content: 'One' },
    { span: 1, content: customElement(), backgroundColor: colors.lightGreen },
    { span: 1, content: '2', align: 'right' },
    { span: 1, content: '3', backgroundColor: colors.red },
    { span: 1, content: '4' },
    { span: 1, content: 'Five', textColor: colors.black },
    { span: 6, content: 'Different Months' },
    { span: 6, content: 'Extras' },
  ],
];

const twoHeaders = [
  [
    { span: 2, single: true },
    { span: 3, content: 'one-1' },
    { span: 3, content: 'one-2' },
  ],
  [
    { span: 2, single: true },
    { span: 5, content: 'One' },
    { span: 5, content: 'Two' },
  ],
];

const customHeaders = { oneHeader, twoHeaders };

export const RecursiveDataTableComponent = (args) => {
  return <RecursiveDataTable {...args} />;
};

export const RecursiveDataTableComponentWithFreezeColumns = (args) => {
  return <RecursiveDataTable headers={oneHeader} {...args} />;
};

export const RecursiveDataTableComponentWithTwoHeades = (args) => {
  return <RecursiveDataTable headers={twoHeaders} {...args} />;
};

export default {
  title: 'Components/RecursiveDataTable',
  component: RecursiveDataTable,
  argTypes: {
    data: {
      control: {
        type: 'object',
      },
      defaultValue: [...data],
    },
    dataIdField: {
      control: {
        type: 'text',
      },
      defaultValue: 'id',
    },
    expandIconName: {
      control: {
        type: 'text',
      },
      defaultValue: 'ArrowRight',
    },
    collapseIconName: {
      control: {
        type: 'text',
      },
      defaultValue: 'ArrowDropDown',
    },
    expandCollapePlacement: {
      control: {
        type: 'number',
      },
      defaultValue: 0,
    },
    noHeaders: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    noSubHeaders: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    indentStep: {
      control: {
        type: 'number',
      },
      defaultValue: 15,
    },
    expandAllLabel: {
      control: {
        type: 'text',
      },
      defaultValue: '',
    },
    collapseAllLabel: {
      control: {
        type: 'text',
      },
      defaultValue: '',
    },
    hasStripes: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    footer: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    withPadding: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    showTooltipIfLongerThan: {
      control: {
        type: 'number',
      },
      defaultValue: 100,
    },
    freezeColumns: {
      control: {
        type: 'select',
        options: [undefined, 0, 1],
      },
      defaultValue: 0,
    },
    stickyHeaders: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    subHeaders: {
      control: {
        type: 'object',
      },
      defaultValue: [...subHeaders],
    },
    maxValues: {
      control: {
        type: 'array',
      },
      defaultValue: [...maxValues],
    },
    mediumValues: {
      control: {
        type: 'array',
      },
      defaultValue: [...mediumValues],
    },
  },
};
