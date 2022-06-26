let SingleLineData = [];
let MultipleLineData = [];
let visits = 10;

for (let i = 1; i < 20; i++) {
  visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
  SingleLineData.push({ date: new Date(2018, 0, i), value: visits });
  MultipleLineData.push({ date: new Date(2018, 0, i), value1: visits, value2: visits + 5 });
}

export { SingleLineData, MultipleLineData };
