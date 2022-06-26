import React from 'react';
import { YearSelector } from '../YearSelector';

const defaultYearsQty = 10;
const props = {
  label: 'Year',
  id: 'dropdown-box-test-id',
  yearsSince: new Date().getFullYear() - defaultYearsQty,
  yearsTo: new Date().getFullYear(),
  years: [],
};

describe('YearSelector', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should render not null value', async () => {
    const mockedOnChange = jest.fn();
    const items = [];
    if (!Array.isArray(props.years) || props.years.length == 0) {
      var end = props.yearsTo == undefined ? new Date().getFullYear() : props.yearsTo;
      var start = props.yearsSince == undefined ? end - defaultYearsQty : props.yearsSince;
      while (start <= end) {
        items.push({ label: start, value: start });
        start += 1;
      }
    } else {
      props.years.forEach((year) => {
        items.push({ label: year, value: year });
      });
    }
    render(<YearSelector {...props} items={items} />);
    const selectComponent = document.querySelector('#dropdown-box-test-id');
    expect(selectComponent).toBeDefined();
    expect(mockedOnChange.mock.calls).not.toBeNull();
  });
});
