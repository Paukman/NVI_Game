import numeral from "numeral";

const formatCurrency = (number, currency) => {
  if (number === "") {
    return "";
  }

  const formattedAmount = numeral(number).format("$0,0.00");

  const formattedCurrency =
    currency && currency !== "CAD" ? ` ${currency}` : "";
  return `${formattedAmount}${formattedCurrency}`;
};

const formatCurrencyInText = name => {
  const splittedString = name.split("$");
  return `${splittedString[0]}${formatCurrency(splittedString[1])}`;
};

export { formatCurrency, formatCurrencyInText };
