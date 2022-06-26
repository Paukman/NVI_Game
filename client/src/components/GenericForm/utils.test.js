import React from 'react';
import {
  prepareConfigurationForRender,
  mapDataConfiguration,
  mapObjectConfigurationToArray,
  updateDataCfg,
  prepareSubmitData,
  isConfigValid,
} from './utils';
import { InputField } from 'mdo-react-components';

const inputData = {
  column1: 'Name',
  column2: 'Name 2',
};

export const errors = {
  column1: 'This field is required',
};

const configuration = [
  {
    name: 'column1',
    attrs: {
      label: 'Column 1',
      helperText: 'Required',
    },
    component: <div />,
    visible: true,
    assignHelperTextAndError: true,
  },
  {
    name: 'column2',
    attrs: {
      label: 'Column 2',
      helperText: 'Required',
    },
    component: <br />,
    visible: true,
    assignHelperTextAndError: true,
  },
];
describe('Testing prepareConfigurationForRender', () => {
  it('should return null on empty configuration', () => {
    const { formConfig, dataCfg } = prepareConfigurationForRender(configuration, inputData, errors);
    expect(dataCfg).toEqual([
      {
        name: 'column1',
        value: 'Name',
        visible: true,
        show: true,
        allowNullValue: false,
        regex: undefined,
      },
      {
        name: 'column2',
        value: 'Name 2',
        visible: true,
        show: true,
        allowNullValue: false,
        regex: undefined,
      },
    ]);
    expect(formConfig[0]).toEqual(
      expect.objectContaining({
        name: 'column1',
        attrs: {
          label: 'Column 1',
          name: 'column1',
          dataEl: 'div-column1',
          error: true,
          helperText: 'This field is required',
        },
        component: expect.objectContaining({ type: 'div' }),
        fieldMargin: undefined,
        singleRowElement: true,
      }),
    );
    expect(formConfig[1]).toEqual(
      expect.objectContaining({
        name: 'column2',
        assignHelperTextAndError: true,
        attrs: {
          label: 'Column 2',
          name: 'column2',
          dataEl: 'br-column2',
          error: false,
          helperText: '', // ATTODO need to fix this
        },
        component: expect.objectContaining({ type: 'br' }),
      }),
    );
  });
});

describe('Testing updateDataCfg', () => {
  const prevElement = null;

  it('should return same configuration when previoius element is not available', () => {
    const res = updateDataCfg('some configuration', prevElement);
    expect(res).toEqual('some configuration');
  });
  it('should update configuration', () => {
    const prevElement = { name: 'col1', visible: true, value: 'Value1' };
    const configuration = [
      { name: 'col2', visible: true, value: 'Value2' },
      { name: 'col3', value: 'Value3', visible: { dependants: ['col1'], calc: (value) => value === 'Value2' } },
    ];
    const res = updateDataCfg(configuration, prevElement);
    // cannot compare whole object since you have function in it and it will lead
    // to 'serializes to the same string' error
    expect(res[0]).toEqual(configuration[0]);
    expect(res[1]).toEqual(
      expect.objectContaining({
        name: 'col3',
        value: '',
        show: false,
      }),
    );

    // now make match true
    const difConfig = [
      { name: 'col3', value: 'Value3', visible: { dependants: ['col1'], calc: (value) => value === 'Value1' } },
    ];
    const difRes = updateDataCfg(difConfig, prevElement);
    expect(difRes[0]).toEqual(
      expect.objectContaining({
        name: 'col3',
        value: 'Value3',
        show: true,
      }),
    );
  });
});

describe('Testing data mapping', () => {
  it('should map data configuration to array', () => {
    const config = {
      fieldName: {
        value: 'Freddy Mercury',
        show: 'I am showing',
        visible: 'I am visible',
      },
    };
    const res = mapObjectConfigurationToArray(config, 'fieldName', 'Queen');
    expect(res).toEqual([
      {
        name: 'fieldName',
        show: 'I am showing',
        value: 'Queen',
        visible: 'I am visible',
        allowNullValue: undefined,
        regex: undefined,
      },
    ]);
  });
  it('should update data configuration with caluclation', () => {
    const arrayConfig = [
      { name: 'field1', show: true, value: 'Queen', visible: true },
      {
        name: 'field2',
        show: false,
        value: '',
        visible: { dependants: ['field1'], calc: (value) => value === 'Queen' },
      },
    ];

    // will change show based on calculation
    const { data } = mapDataConfiguration(arrayConfig);
    expect(data.field2).toEqual(
      expect.objectContaining({
        show: true,
      }),
    );
  });
  it('should update data configuration without calculation', () => {
    const arrayConfig = [
      { name: 'field1', show: true, value: 'Queen', visible: true },
      { name: 'field2', show: true, value: 'Freddy', visible: true },
    ];
    const { data } = mapDataConfiguration(arrayConfig);
    expect(data).toEqual({
      field1: { show: true, value: 'Queen', visible: true },
      field2: { show: true, value: 'Freddy', visible: true },
    });
  });
});

describe('Testing prepareSubmitData', () => {
  it('should prepare submit data', () => {
    const data = {
      field1: { show: true, value: 'Queen', visible: true },
      field2: { show: true, value: 'Freddy', visible: true },
    };
    const res = prepareSubmitData(data);
    expect(res).toEqual({ field1: 'Queen', field2: 'Freddy' });
  });
});

describe('Testing isConfigValid', () => {
  it('should return false for missing namea', () => {
    const res = isConfigValid([
      {
        component: <InputField />,
        visible: true,
      },
    ]);
    expect(res).toEqual(false);
  });
  it('should return false for missing component', () => {
    const res = isConfigValid([
      {
        name: 'columnFilter',
        visible: true,
      },
    ]);
    expect(res).toEqual(false);
  });
  it('should return false for missing visible flag', () => {
    const res = isConfigValid([
      {
        name: 'columnFilter',
        component: <InputField />,
      },
    ]);
    expect(res).toEqual(false);
  });
  it('should return false for missing visible dependats or calc', () => {
    let res = isConfigValid([
      {
        name: 'columnFilter',
        component: <InputField />,
        visible: {
          calc: (value) => value === 'amountType',
        },
      },
    ]);
    expect(res).toEqual(false);
    res = isConfigValid([
      {
        name: 'columnFilter',
        component: <InputField />,
        visible: {
          dependants: ['amountTypeKPI'],
        },
      },
    ]);
    expect(res).toEqual(false);
  });
  it('should return false for duplicate name field', () => {
    const res = isConfigValid([
      {
        name: 'columnFilter',
        component: <InputField />,
        visible: true,
      },
      {
        name: 'columnFilter',
        component: <InputField />,
        visible: true,
      },
    ]);
    expect(res).toEqual(false);
  });
});
