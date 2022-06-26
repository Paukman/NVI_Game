import { formatValue } from './formatValue';

describe('Testing formatValue', () => {
  it('should return no value string if value is missing', () => {
    const noValueStr = 'Not my value';
    let result = formatValue({
      value: null,
      noValueStr,
    });
    expect(result).toEqual(noValueStr);

    result = formatValue({
      value: undefined,
      noValueStr,
    });
    expect(result).toEqual(noValueStr);
    result = formatValue({
      noValueStr,
    });
    expect(result).toEqual(noValueStr);
  });

  test.each`
    valueDecimals | valueFormat   | valueTypeId | displaySize | value          | expected
    ${1}          | ${''}         | ${1}        | ${'auto'}   | ${10000.1234}  | ${'10.0k'}
    ${2}          | ${''}         | ${1}        | ${'auto'}   | ${10000.1234}  | ${'10.00k'}
    ${3}          | ${''}         | ${1}        | ${'auto'}   | ${10000.1234}  | ${'10.000k'}
    ${3}          | ${''}         | ${1}        | ${'as-is'}  | ${-10000.1234} | ${'-10000.123'}
    ${4}          | ${''}         | ${1}        | ${'as-is'}  | ${10000.1234}  | ${'10000.1234'}
    ${1}          | ${'0.0'}      | ${1}        | ${'auto'}   | ${10000.1234}  | ${'10.0k'}
    ${2}          | ${'0.00'}     | ${1}        | ${'auto'}   | ${-10000.1234} | ${'-10.00k'}
    ${3}          | ${'0.000'}    | ${1}        | ${'auto'}   | ${10000.1234}  | ${'10.000k'}
    ${4}          | ${'0'}        | ${1}        | ${'auto'}   | ${10000.1234}  | ${'10k'}
    ${4}          | ${'0.00'}     | ${1}        | ${'as-is'}  | ${10000.1234}  | ${'10000.12'}
    ${4}          | ${'0,000.00'} | ${1}        | ${'as-is'}  | ${10000.1234}  | ${'10,000.12'}
    ${4}          | ${'0,000.00'} | ${2}        | ${'as-is'}  | ${10000.1234}  | ${'$10,000.12'}
    ${4}          | ${'0.00'}     | ${2}        | ${'as-is'}  | ${10000.1234}  | ${'$10000.12'}
    ${4}          | ${'0.00'}     | ${3}        | ${'as-is'}  | ${0.1234567}   | ${'12.35%'}
    ${4}          | ${'0.00'}     | ${1}        | ${'auto'}   | ${10000.1234}  | ${'10.00k'}
    ${4}          | ${'0.00'}     | ${2}        | ${'auto'}   | ${12.34}       | ${'$12.34'}
    ${4}          | ${'0.00'}     | ${3}        | ${'auto'}   | ${0.1234}      | ${'12.34%'}
    ${4}          | ${'0.00'}     | ${1}        | ${'auto'}   | ${10000.1234}  | ${'10.00k'}
    ${4}          | ${'0,000.00'} | ${1}        | ${'auto'}   | ${10000.1234}  | ${'10.00k'}
    ${4}          | ${'0,000.00'} | ${1}        | ${'as-is'}  | ${10000.1234}  | ${'10,000.12'}
    ${4}          | ${'0,000.00'} | ${1}        | ${'k'}      | ${10000.1234}  | ${'10.00k'}
    ${4}          | ${'0,000.00'} | ${1}        | ${'m'}      | ${10000.1234}  | ${'0.01m'}
    ${''}         | ${'0.00'}     | ${1}        | ${'as-is'}  | ${-10000.1234} | ${'-10000.12'}
    ${''}         | ${'0.00'}     | ${2}        | ${'as-is'}  | ${-10000.1234} | ${'($10000.12)'}
    ${''}         | ${'0.00'}     | ${3}        | ${'as-is'}  | ${-0.1234}     | ${'-12.34%'}
  `(
    'returns format $expected on given configuration $value (dec:$valueDecimals; format:$valueFormat; type:$valueTypeId; size:$displaySize for numeral conversion',
    ({ expected, valueDecimals, valueFormat, valueTypeId, displaySize, value }) => {
      const result = formatValue({
        value,
        valueTypeId,
        valueFormat,
        valueDecimals,
        noValueStr: null,
        displaySize,
      });
      expect(result).toEqual(expected);
    },
  );

  test.each`
    valueDecimals | valueFormat   | valueTypeId | displaySize | value          | ignoreFormatSign | expected
    ${1}          | ${''}         | ${1}        | ${'auto'}   | ${10000.1234}  | ${true}          | ${'10.0k'}
    ${2}          | ${''}         | ${1}        | ${'auto'}   | ${10000.1234}  | ${true}          | ${'10.00k'}
    ${3}          | ${''}         | ${1}        | ${'auto'}   | ${10000.1234}  | ${true}          | ${'10.000k'}
    ${3}          | ${''}         | ${1}        | ${'as-is'}  | ${-10000.1234} | ${true}          | ${'-10000.123'}
    ${4}          | ${''}         | ${1}        | ${'as-is'}  | ${10000.1234}  | ${true}          | ${'10000.1234'}
    ${1}          | ${'0.0'}      | ${1}        | ${'auto'}   | ${10000.1234}  | ${true}          | ${'10.0k'}
    ${2}          | ${'0.00'}     | ${1}        | ${'auto'}   | ${-10000.1234} | ${true}          | ${'-10.00k'}
    ${3}          | ${'0.000'}    | ${1}        | ${'auto'}   | ${10000.1234}  | ${true}          | ${'10.000k'}
    ${4}          | ${'0'}        | ${1}        | ${'auto'}   | ${10000.1234}  | ${true}          | ${'10k'}
    ${4}          | ${'0.00'}     | ${1}        | ${'as-is'}  | ${10000.1234}  | ${true}          | ${'10000.12'}
    ${4}          | ${'0,000.00'} | ${1}        | ${'as-is'}  | ${10000.1234}  | ${true}          | ${'10,000.12'}
    ${4}          | ${'0,000.00'} | ${2}        | ${'as-is'}  | ${10000.1234}  | ${false}         | ${'$10,000.12'}
    ${4}          | ${'0,000.00'} | ${2}        | ${'as-is'}  | ${10000.1234}  | ${true}          | ${'10,000.12'}
    ${4}          | ${'0.00'}     | ${2}        | ${'auto'}   | ${10000.1234}  | ${false}         | ${'$10.00k'}
    ${4}          | ${'0.00'}     | ${2}        | ${'auto'}   | ${10000.1234}  | ${true}          | ${'10.00k'}
    ${4}          | ${'0.00'}     | ${2}        | ${'as-is'}  | ${10000.1234}  | ${false}         | ${'$10000.12'}
    ${4}          | ${'0.00'}     | ${2}        | ${'as-is'}  | ${10000.1234}  | ${true}          | ${'10000.12'}
    ${4}          | ${'0.00'}     | ${3}        | ${'as-is'}  | ${0.1234567}   | ${false}         | ${'12.35%'}
    ${4}          | ${'0.00'}     | ${3}        | ${'as-is'}  | ${0.1234567}   | ${true}          | ${'12.35'}
    ${4}          | ${'0.00'}     | ${1}        | ${'auto'}   | ${10000.1234}  | ${false}         | ${'10.00k'}
    ${4}          | ${'0.00'}     | ${2}        | ${'auto'}   | ${12.34}       | ${false}         | ${'$12.34'}
    ${4}          | ${'0.00'}     | ${2}        | ${'auto'}   | ${12.34}       | ${true}          | ${'12.34'}
    ${4}          | ${'0.00'}     | ${3}        | ${'auto'}   | ${0.1234}      | ${false}         | ${'12.34%'}
    ${4}          | ${'0.00'}     | ${3}        | ${'auto'}   | ${0.1234}      | ${true}          | ${'12.34'}
    ${4}          | ${'0.00'}     | ${1}        | ${'auto'}   | ${10000.1234}  | ${true}          | ${'10.00k'}
    ${4}          | ${'0,000.00'} | ${1}        | ${'auto'}   | ${10000.1234}  | ${true}          | ${'10.00k'}
    ${4}          | ${'0,000.00'} | ${1}        | ${'as-is'}  | ${10000.1234}  | ${true}          | ${'10,000.12'}
    ${4}          | ${'0,000.00'} | ${1}        | ${'k'}      | ${10000.1234}  | ${true}          | ${'10.00k'}
    ${4}          | ${'0,000.00'} | ${1}        | ${'m'}      | ${10000.1234}  | ${true}          | ${'0.01m'}
    ${''}         | ${'0.00'}     | ${1}        | ${'as-is'}  | ${-10000.1234} | ${true}          | ${'-10000.12'}
    ${''}         | ${'0.00'}     | ${2}        | ${'as-is'}  | ${-10000.1234} | ${true}          | ${'(10000.12)'}
    ${''}         | ${'0.00'}     | ${3}        | ${'as-is'}  | ${-0.1234}     | ${false}         | ${'-12.34%'}
    ${''}         | ${'0.00'}     | ${3}        | ${'as-is'}  | ${-0.1234}     | ${true}          | ${'-12.34'}
  `(
    'returns format $expected on given configuration $value (dec:$valueDecimals; format:$valueFormat; type:$valueTypeId; size:$displaySize; ignoreSign:$ignoreFormatSign ) for numeral conversion',
    ({ expected, valueDecimals, valueFormat, valueTypeId, displaySize, value, ignoreFormatSign = false }) => {
      const result = formatValue({
        value,
        valueTypeId,
        valueFormat,
        valueDecimals,
        noValueStr: null,
        displaySize,
        ignoreFormatSign,
      });
      expect(result).toEqual(expected);
    },
  );

  // test.each`
  //   valueDecimals | valueFormat   | valueTypeId | displaySize | value         | ignoreFormatSign | removeZeros | expected
  //   ${4}          | ${'0,000.00'} | ${2}        | ${'as-is'}  | ${`10000.00`} | ${false}         | ${true}     | ${'$10,000'}
  //   ${4}          | ${'0,000.00'} | ${2}        | ${'as-is'}  | ${`10000.00`} | ${false}         | ${false}    | ${'$10,000.00'}
  //   ${4}          | ${'0,000.00'} | ${2}        | ${'as-is'}  | ${`10000.10`} | ${false}         | ${true}     | ${'$10,000.1'}
  //   ${4}          | ${'0,000.00'} | ${2}        | ${'auto'}   | ${`10000.00`} | ${false}         | ${true}     | ${'$10.00k'}
  //   ${4}          | ${'0,000.00'} | ${2}        | ${'auto'}   | ${`1000.00`}  | ${false}         | ${true}     | ${'$10.00k'}
  //   ${4}          | ${'0,000.00'} | ${2}        | ${'auto'}   | ${`100.10`}   | ${false}         | ${true}     | ${'$100.1'}
  //   ${4}          | ${'0,000.00'} | ${2}        | ${'as-is'}  | ${`10000.00`} | ${false}         | ${true}     | ${'$10,000'}
  //   ${4}          | ${'0,000.00'} | ${2}        | ${'as-is'}  | ${`10000.00`} | ${false}         | ${false}    | ${'$10,000.00'}
  //   ${4}          | ${'0,000.00'} | ${2}        | ${'as-is'}  | ${`10000.10`} | ${false}         | ${true}     | ${'$10,000.1'}
  // `(
  //   'returns format $expected on given configuration $value (dec:$valueDecimals; format:$valueFormat; type:$valueTypeId; size:$displaySize; ignoreSign:$ignoreFormatSign removeZeros:$removeZeros ) for numeral conversion',
  //   ({ expected, valueDecimals, valueFormat, valueTypeId, displaySize, value, ignoreFormatSign, removeZeros }) => {
  //     const result = formatValue({
  //       value,
  //       valueTypeId,
  //       valueFormat,
  //       valueDecimals,
  //       noValueStr: null,
  //       displaySize,
  //       ignoreFormatSign,
  //       removeTrailingDecimalZeros: removeZeros,
  //     });
  //     expect(result).toEqual(expected);
  //   },
  // );
});
