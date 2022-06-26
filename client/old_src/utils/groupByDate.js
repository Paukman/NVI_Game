function groupByDate(array) {
  return array.reduce((r, a) => {
    const date = a.transactionDate.slice(0, 10);
    r[date] = r[date] || [];
    r[date].push(a);
    return r;
  }, Object.create(null));
}

module.exports = { groupByDate };
