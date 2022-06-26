export const singleData = (size, multiply = 1) => {
  const data = [];
  for (let i = 0; i < size; i++) {
    data.push({
      value: Math.random() * 5 * multiply * (i + 1),
      date: new Date(2018, 0, i + 1),
    });
  }
  return data;
};

export const realTimeData = [
  [
    { value: 0.09595302619692864, date: '09/07/2021' },
    { value: 0.09664432529043789, date: '09/08/2021' },
    { value: 0.11076923076923077, date: '09/09/2021' },
    { value: 0.10327247191011237, date: '09/10/2021' },
    { value: 0.1048583180987203, date: '09/11/2021' },
    { value: 0.0969226750261233, date: '09/12/2021' },
    { value: 0, date: '09/13/2021' },
  ],
  [
    { value: 0.051789371038517794, date: '09/07/2021' },
    { value: 0.05272793759141882, date: '09/08/2021' },
    { value: 0.06892682926829269, date: '09/09/2021' },
    { value: 0.06725304878048781, date: '09/10/2021' },
    { value: 0.06994817073170732, date: '09/11/2021' },
    { value: 0.05655792682926829, date: '09/12/2021' },
    { value: 0, date: '09/13/2021' },
  ],
];
