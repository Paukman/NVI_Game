export const singleData = (days, multiplyBy = 10000, negValueMultiplier = -1) => {
  const data = [];
  var precision = 1000;
  for (let i = 0; i < days; i++) {
    const randomnum =
      Math.floor(Math.random() * (multiplyBy * precision - 1 * precision) + 1 * precision) / (1 * precision);
    data.push({
      value: Math.random() < 0.5 ? randomnum : randomnum * negValueMultiplier,
      date: new Date(2018, 0, i + 1),
    });
  }
  return data;
};

export const singleIncompleteData = (days, multiplyBy = 10000, negValueMultiplier = -1) => {
  const data = [];
  var precision = 10000;
  for (let i = 0; i < days; i++) {
    const random = Math.random();
    if (random < 0.2) {
      data.push({ value: undefined, date: new Date(2018, 0, i + 1) });
    } else if (random < 0.4) {
      data.push({ date: new Date(2018, 0, i + 1) });
    } else {
      const randomnum =
        Math.floor(Math.random() * (multiplyBy * precision - 1 * precision) + 1 * precision) / (1 * precision);
      data.push({
        value: Math.random() < 0.5 ? randomnum : randomnum * negValueMultiplier,
        date: new Date(2018, 0, i + 1),
      });
    }
  }
  return data;
};

export const singlePartialData = (days, multiplyBy = 10000, negValueMultiplier = -1) => {
  const data = [];
  var precision = 1000;
  for (let i = 0; i < days; i++) {
    if (Math.random() > 0.6) {
      const randomnum =
        Math.floor(Math.random() * (multiplyBy * precision - 1 * precision) + 1 * precision) / (1 * precision);
      data.push({
        value: Math.random() < 0.5 ? randomnum : randomnum * negValueMultiplier,
        date: new Date(2018, 0, i + 1),
      });
    } else if (Math.random() < 0.3) {
      data.push({
        value: 0,
        date: new Date(2018, 0, i + 1),
      });
    }
  }
  return data;
};
