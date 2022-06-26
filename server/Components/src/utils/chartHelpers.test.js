import { getNumberFormats } from './chartHelpers';

describe('Testing getNumberFormats', () => {
  test.each`
    valueDecimals | valueFormat | valueTypeId | displaySize | expected
    ${null}       | ${''}       | ${1}        | ${'auto'}   | ${'0.a'}
    ${undefined}  | ${''}       | ${1}        | ${'auto'}   | ${'0.a'}
    ${null}       | ${null}     | ${1}        | ${'auto'}   | ${'0.a'}
    ${null}       | ${'0.00'}   | ${1}        | ${'auto'}   | ${'0.00a'}
    ${null}       | ${'0.00'}   | ${null}     | ${'auto'}   | ${'0.00a'}
    ${null}       | ${null}     | ${null}     | ${'as-is'}  | ${'0.'}
    ${null}       | ${null}     | ${null}     | ${null}     | ${'0.'}
  `(
    'returns format $expected on given configuration $value (dec:$valueDecimals; format:$valueFormat; type:$valueTypeId; size:$displaySize for missing values',
    ({ expected, valueDecimals, valueFormat, valueTypeId, displaySize }) => {
      const result = new getNumberFormats({
        config: {
          valueDecimals,
          valueFormat,
          valueTypeId,
          displaySize,
        },
        amchartUse: false,
      });
      expect(result.numberFormat).toEqual(expected);
    },
  );

  test.each`
    valueDecimals | valueFormat   | valueTypeId | displaySize | expected
    ${1}          | ${''}         | ${1}        | ${'auto'}   | ${'0.0a'}
    ${2}          | ${''}         | ${1}        | ${'auto'}   | ${'0.00a'}
    ${3}          | ${''}         | ${1}        | ${'auto'}   | ${'0.000a'}
    ${3}          | ${''}         | ${1}        | ${'as-is'}  | ${'0.000'}
    ${4}          | ${''}         | ${1}        | ${'auto'}   | ${'0.0000a'}
    ${1}          | ${'0.0'}      | ${1}        | ${'auto'}   | ${'0.0a'}
    ${2}          | ${'0.00'}     | ${1}        | ${'auto'}   | ${'0.00a'}
    ${3}          | ${'0.000'}    | ${1}        | ${'auto'}   | ${'0.000a'}
    ${4}          | ${'0'}        | ${1}        | ${'auto'}   | ${'0.a'}
    ${4}          | ${'0.00'}     | ${1}        | ${'as-is'}  | ${'0.00'}
    ${4}          | ${'0.00'}     | ${2}        | ${'as-is'}  | ${'($0.00)'}
    ${4}          | ${'0.00'}     | ${3}        | ${'as-is'}  | ${'0.00%'}
    ${4}          | ${'0.00'}     | ${1}        | ${'auto'}   | ${'0.00a'}
    ${4}          | ${'0.00'}     | ${2}        | ${'auto'}   | ${'($0.00a)'}
    ${4}          | ${'0.00'}     | ${3}        | ${'auto'}   | ${'0.00%'}
    ${4}          | ${'0.00'}     | ${1}        | ${'auto'}   | ${'0.00a'}
    ${4}          | ${'0,000.00'} | ${1}        | ${'auto'}   | ${'0,000.00a'}
    ${4}          | ${'0,000.00'} | ${1}        | ${'as-is'}  | ${'0,000.00'}
    ${4}          | ${'0,000.00'} | ${1}        | ${'k'}      | ${'0,000.00'}
    ${4}          | ${'0,000.00'} | ${1}        | ${'m'}      | ${'0,000.00'}
  `(
    'returns format $expected on given configuration $value (dec:$valueDecimals; format:$valueFormat; type:$valueTypeId; size:$displaySize for numeral conversion',
    ({ expected, valueDecimals, valueFormat, valueTypeId, displaySize }) => {
      const result = new getNumberFormats({
        config: {
          valueDecimals,
          valueFormat,
          valueTypeId,
          displaySize,
        },
        amchartUse: false,
      });
      expect(result.numberFormat).toEqual(expected);
    },
  );

  test.each`
    valueDecimals | valueFormat   | valueTypeId | displaySize | expected
    ${1}          | ${''}         | ${1}        | ${'auto'}   | ${'#.#a|[red]#.#a'}
    ${2}          | ${''}         | ${1}        | ${'auto'}   | ${'#.##a|[red]#.##a'}
    ${3}          | ${''}         | ${1}        | ${'auto'}   | ${'#.###a|[red]#.###a'}
    ${3}          | ${''}         | ${1}        | ${'as-is'}  | ${'#.###|[red]#.###'}
    ${4}          | ${''}         | ${1}        | ${'auto'}   | ${'#.####a|[red]#.####a'}
    ${1}          | ${'0.0'}      | ${1}        | ${'auto'}   | ${'#.0a|[red]#.0a'}
    ${2}          | ${'0.00'}     | ${1}        | ${'auto'}   | ${'#.00a|[red]#.00a'}
    ${3}          | ${'0.000'}    | ${1}        | ${'auto'}   | ${'#.000a|[red]#.000a'}
    ${4}          | ${'0'}        | ${1}        | ${'auto'}   | ${'#.a|[red]#.a'}
    ${4}          | ${'0.00'}     | ${1}        | ${'as-is'}  | ${'#.00|[red]#.00'}
    ${4}          | ${'0.00'}     | ${2}        | ${'as-is'}  | ${'$#.00|[red]($#.00s)'}
    ${4}          | ${'0.00'}     | ${3}        | ${'as-is'}  | ${'#.00%|[red]#.00%'}
    ${4}          | ${'0.00'}     | ${1}        | ${'auto'}   | ${'#.00a|[red]#.00a'}
    ${4}          | ${'0.00'}     | ${2}        | ${'auto'}   | ${'$#.00a|[red]($#.00sa)'}
    ${4}          | ${'0.00'}     | ${3}        | ${'auto'}   | ${'#.00%|[red]#.00%'}
    ${4}          | ${'0.00'}     | ${1}        | ${'auto'}   | ${'#.00a|[red]#.00a'}
    ${4}          | ${'0,000.00'} | ${1}        | ${'auto'}   | ${'#,###.00a|[red]#,###.00a'}
    ${4}          | ${'0,000.00'} | ${1}        | ${'as-is'}  | ${'#,###.00|[red]#,###.00'}
    ${4}          | ${'0,000.00'} | ${1}        | ${'k'}      | ${'#,###.00a|[red]#,###.00a'}
    ${4}          | ${'0,000.00'} | ${1}        | ${'m'}      | ${'#,###.00a|[red]#,###.00a'}
  `(
    'returns format $expected on given configuration $value (dec:$valueDecimals; format:$valueFormat; type:$valueTypeId; size:$displaySize for amchart conversion',
    ({ expected, valueDecimals, valueFormat, valueTypeId, displaySize }) => {
      const result = new getNumberFormats({
        config: {
          valueDecimals,
          valueFormat,
          valueTypeId,
          displaySize,
        },
        amchartUse: true,
      });
      expect(result.numberFormat).toEqual(expected);
    },
  );

  test.each`
    valueDecimals | valueFormat | valueTypeId | displaySize | applyCurrencyFormat | expected
    ${1}          | ${'0.0'}    | ${2}        | ${'auto'}   | ${null}             | ${'$#.0a|[red]($#.0sa)'}
    ${2}          | ${'0.00'}   | ${2}        | ${'auto'}   | ${undefined}        | ${'$#.00a|[red]($#.00sa)'}
    ${3}          | ${'0.000'}  | ${2}        | ${'auto'}   | ${'0,000..00'}      | ${'$#.000a|[red]($#.000sa)'}
    ${1}          | ${'0.0'}    | ${2}        | ${'auto'}   | ${'0,000.00'}       | ${'$#,###.00a|[red]($#,###.00sa)'}
    ${2}          | ${'0.00'}   | ${2}        | ${'auto'}   | ${'0,000.00'}       | ${'$#,###.00a|[red]($#,###.00sa)'}
    ${3}          | ${'0.000'}  | ${2}        | ${'auto'}   | ${'0,000.00'}       | ${'$#,###.00a|[red]($#,###.00sa)'}
  `(
    'returns format $expected on given configuration $value (dec:$valueDecimals; format:$valueFormat; type:$valueTypeId; size:$displaySize; currencyFormat:$applyCurrencyFormat for amchart conversion',
    ({ expected, valueDecimals, valueFormat, valueTypeId, displaySize, applyCurrencyFormat }) => {
      const result = new getNumberFormats({
        config: {
          valueDecimals,
          valueFormat,
          valueTypeId,
          displaySize,
          applyCurrencyFormat,
        },
        amchartUse: true,
      });
      expect(result.numberFormat).toEqual(expected);
    },
  );
});
