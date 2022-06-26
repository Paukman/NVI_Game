import React from 'react';
import { DataTable } from './DataTable';
import { Dropdown } from '../FormElements/Dropdown/Dropdown';
import { Switch } from '../FormElements/Switch/Switch';
import { ButtonDropdown } from '../FormElements/ButtonDropdown/ButtonDropdown';
import { action } from '@storybook/addon-actions';

const departmentList = {
  onClick: action('Dropdown clicked'),
  items: [{ label: 'HR' }, { label: 'Engineering' }, { label: 'Design' }],
};

const mdoGlCodeList = {
  onClick: action('Dropdown clicked'),
  items: [{ label: 'MDO01' }, { label: 'MDO02' }, { label: 'MDO03' }],
};

export const DataTableComponent = (args) => {
  return (
    <DataTable
      {...args}
      rows={[
        {
          id: 1,
          hmgGlCode: 'MOGOP01',
          glDescription: 'Total Rooms Revenue',
          mdoGlCode: 'MDO01',
          department: 'HR',
          status: true,
          amount: 35,
          colAction: 'Edit | Delete',
        },
        {
          id: 2,
          hmgGlCode: 'MOGOP02',
          glDescription: 'Total Room Retail',
          mdoGlCode: 'MDO02',
          department: 'Engineering',
          status: false,
          amount: 234,
          colAction: 'Edit | Delete',
        },
        {
          id: 3,
          hmgGlCode: 'MOGOP03',
          glDescription: 'Packages',
          mdoGlCode: 'MDO03',
          department: 'Design',
          status: false,
          amount: 543,
          colAction: 'Edit | Delete',
        },
        {
          id: 4,
          hmgGlCode: 'MOGOP01',
          glDescription: 'Extended Stay',
          mdoGlCode: 'MDO02',
          department: '',
          status: false,
          amount: 543,
          colAction: 'Edit | Delete',
        },
        {
          id: 5,
          hmgGlCode: 'MOGOP02',
          glDescription: 'Average Daily Revenue',
          mdoGlCode: 'MDO03',
          department: 'Engineering',
          status: true,
          amount: 5432,
          colAction: 'Edit | Delete',
        },
        {
          id: 6,
          hmgGlCode: 'MOGOP01',
          glDescription: 'Test Desc',
          mdoGlCode: 'MDO01',
          department: '',
          status: true,
          amount: 5431,
          colAction: 'Edit | Delete',
        },
        {
          id: 7,
          hmgGlCode: 'MOGOP01',
          glDescription: 'Hello Desc',
          mdoGlCode: 'MDO03',
          department: 'HR',
          status: false,
          amount: 5434,
          colAction: 'Edit | Delete',
        },
      ]}
      columns={[
        {
          field: 'id',
          headerName: 'ID',
          width: 100,
          headerClassName: 'dataTableHeader',
          headerAlign: 'left',
          cellClassName: 'firstColumn',
          align: 'left',
        },
        {
          field: 'hmgGlCode',
          headerName: 'HMG GL Code',
          width: 160,
          headerClassName: 'dataTableHeader',
          headerAlign: 'center',
          cellClassName: 'evenColumn',
          align: 'center',
        },
        {
          field: 'glDescription',
          headerName: 'GL Description',
          width: 200,
          headerClassName: 'dataTableHeader',
          headerAlign: 'left',
          align: 'left',
        },
        {
          field: 'mdoGlCode',
          headerName: 'MDO GL Code',
          width: 160,
          headerClassName: 'dataTableHeader',
          headerAlign: 'center',
          align: 'center',
        },
        {
          field: 'mdoGlCode',
          headerName: 'MDO GL Code',
          width: 160,
          headerClassName: 'dataTableHeader',
          headerAlign: 'center',
          cellClassName: 'evenColumn',
          align: 'center',
          sortable: false,
          renderHeader: (headerValues) => {
            if (headerValues) return <ButtonDropdown text='MDO GL Code' variant='none' {...mdoGlCodeList} />;
          },
        },
        {
          field: 'department',
          headerName: 'Department',
          width: 200,
          headerClassName: 'dataTableHeader',
          headerAlign: 'left',
          align: 'left',
          sortable: false,
          renderHeader: (headerValues) => {
            if (headerValues) return <ButtonDropdown text='Department' variant='none' {...departmentList} />;
          },
          renderCell: (cellValues) => {
            if (!cellValues.value)
              return (
                <Dropdown
                  onChange={(e) => {}}
                  items={[
                    {
                      label: 'HR',
                      value: 'HR',
                    },
                    {
                      label: 'Engineering',
                      value: 'Engineering',
                    },
                    {
                      label: 'Design',
                      value: 'Design',
                    },
                  ]}
                />
              );
          },
        },
        {
          field: 'status',
          headerName: 'Status',
          width: 100,
          type: 'boolean',
          headerClassName: 'dataTableHeader',
          headerAlign: 'center',
          cellClassName: 'evenColumn',
          align: 'center',
          renderCell: (cellValues) => {
            if (cellValues) return <Switch value={cellValues.value} />;
          },
        },
        {
          field: 'amount',
          headerName: 'Amount',
          width: 100,
          type: 'boolean',
          headerClassName: 'dataTableHeader',
          headerAlign: 'right',
          align: 'right',
        },
        {
          field: 'colAction',
          headerName: 'Action',
          width: 160,
          headerClassName: 'dataTableHeader',
          headerAlign: 'center',
          align: 'center',
          renderCell: (cellValues) => {
            if (cellValues) return <Switch value={cellValues.value} />;
          },
        },
        {
          field: 'amount',
          headerName: 'Amount',
          width: 100,
          type: 'number',
          headerClassName: 'dataTableHeader',
          headerAlign: 'right',
          align: 'right',
        },
        {
          field: 'colAction',
          headerName: 'Action',
          width: 160,
          headerClassName: 'dataTableHeader',
          headerAlign: 'center',
          align: 'center',
          sortable: false,
        },
      ]}
    />
  );
};

export default {
  title: 'Components/DataTable',
  component: DataTable,
  argTypes: {
    checkboxSelection: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
  },
};
