import React from 'react';
import { DataTable } from '../DataTable';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) => `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

describe('Data Table Component', () => {
  beforeEach(() => {
    cleanup();
  });
  it('renders data table component with props', () => {
    const { container } = render(<DataTable rows={[]} columns={[]} />);
    expect(container.getElementsByClassName('MuiDataGrid-main')[0]).toBeInTheDocument();
  });
  it('should render table header', () => {
    const { container } = render(<DataTable rows={rows} columns={columns} autoHeight pageSize={5} checkboxSelection />);
    expect(container.getElementsByClassName('MuiDataGrid-columnsContainer')[0]).toBeInTheDocument();
  });
  it('should not render checkboxes', () => {
    const { container } = render(<DataTable rows={rows} columns={columns} autoHeight pageSize={5} />);
    expect(container.querySelectorAll('[type="checkbox"]')).toHaveLength(0);
  });
});
