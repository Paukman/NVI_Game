function ijCalculations(summaryvalues) {
  summaryvalues.forEach((element, index) => {
    if (index === 0) {
      let sum = 0;
      let ajustment = 0;
      let amount = 0;
      element.children.forEach((revenue) => {
        sum += Number(revenue.total);
        ajustment += Number(revenue.amountAdjustment);
        amount += Number(revenue.amount);
      });
      element.total = sum;
      element.totalAdjustment = ajustment;
      element.totalAmount = amount;
    }
    if (index === 1) {
      let sum = 0;
      let ajustment = 0;
      let amount = 0;
      element.children.forEach((taxes) => {
        sum += Number(taxes.total);
        ajustment += Number(taxes.amountAdjustment);
        amount += Number(taxes.amount);
      });
      element.total = sum;
      element.totalAdjustment = ajustment;
      element.totalAmount = amount;
    }
    if (index === 2) {
      element.total = Number(summaryvalues[0].total) + Number(summaryvalues[1].total);
      element.totalAdjustment = Number(summaryvalues[0].totalAdjustment) + Number(summaryvalues[1].totalAdjustment);
      element.totalAmount = Number(summaryvalues[0].totalAmount) + Number(summaryvalues[1].totalAmount);
    }
    if (index === 3) {
      let sum = 0;
      let ajustment = 0;
      let amount = 0;
      element.children.forEach((settlement) => {
        sum += Number(settlement.total);
        ajustment += Number(settlement.amountAdjustment);
        amount += Number(settlement.amount);
      });
      element.total = sum;
      element.totalAdjustment = ajustment;
      element.totalAmount = amount;
    }
    if (index === 4) {
      element.total = Number(summaryvalues[2].total) - Number(summaryvalues[3].total);
      element.totalAdjustment = Number(summaryvalues[2].totalAdjustment) - Number(summaryvalues[3].totalAdjustment);
      element.totalAmount = Number(summaryvalues[2].totalAmount) - Number(summaryvalues[3].totalAmount);
    }
  });
  return summaryvalues;
}

export { ijCalculations };
