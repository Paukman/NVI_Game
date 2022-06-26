export const items = [
  {
    id: 1,
    primary: '10011000',
    secondary: 'Retail',
  },
  {
    id: 2,
    primary: '10011010',
    secondary: 'Consortia',
  },
  {
    id: 3,
    primary: '10011020',
    secondary: 'Member exclusive rates',
  },
  {
    id: 4,
    primary: '10011030',
    secondary: 'Packages',
  },
  {
    id: 5,
    primary: '10011040',
    secondary: 'Extended stay',
  },
  {
    id: 6,
    primary: '10011050',
    secondary: 'Discount miscellaneous',
  },
];

export const generateItems = (cnt) => {
  return Array.from({ length: cnt }).map((item, idx) => {
    return {
      id: idx + 1,
      primary: `${1000000 + idx}`,
      secondary: `This is some text here ${idx}`,
    };
  });
};
