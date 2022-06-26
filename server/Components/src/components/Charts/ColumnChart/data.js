import { colors as themeColors } from '../../../theme/colors';
export const chartData = [
  {
    label: 'Netherlands',
    value: 40,
    color: '#3B6CB4',
  },

  {
    label: 'South Africa',
    value: 20,
    color: '#B64172',
  },

  {
    label: 'Sri Lanka',
    value: 25,
  },
  {
    label: 'India',
    value: 35,
  },
];

export const dynamicData = (multiplyBy = 1) => {
  const lables = ['Actual', 'Last Year', '2019', 'Budget', 'Forecast'];
  const values = [0.456367, 0.345265, -0.49016, 0.932212, -0.002335];

  let data = [];

  for (let i = 0; i < 5; i++) {
    data.push({
      label: lables[i],
      value: values[i] * multiplyBy,
    });
  }
  return data;
};

export const chartMultiData = [
  {
    label: 'USA',
    value1: 2025,
    value2: 1025,
    value3: 3025,
  },
  {
    label: 'China',
    value1: 1882,
    value2: 1862,
    value3: 1282,
  },
  {
    label: 'Japan',
    value1: 1322,
    value2: 1862,
    value3: 1382,
  },
  {
    label: 'Germany',
    value1: 2025,
    value2: 1025,
    value3: 3025,
  },
  {
    label: 'UK',
    value1: 1882,
    value2: 1862,
    value3: 1282,
  },
  {
    label: 'France',
    value1: 1322,
    value2: 1862,
    value3: 1382,
  },
  {
    label: 'India',
    value1: 2025,
    value2: 1025,
    value3: 3025,
  },
  {
    label: 'Spain',
    value1: 1882,
    value2: 1862,
    value3: 1282,
  },
  {
    label: 'Netherlands',
    value1: 1322,
    value2: 1862,
    value3: 1382,
  },
  {
    label: 'Russia',
    value1: 2025,
    value2: 1025,
    value3: 3025,
  },
  {
    label: 'South Korea',
    value1: 1882,
    value2: 1862,
    value3: 1282,
  },
  {
    label: 'Canada',
    value1: 1322,
    value2: 1862,
    value3: 1382,
  },
  {
    label: 'Brazil',
    value1: 2025,
    value2: 1025,
    value3: 3025,
  },
];
