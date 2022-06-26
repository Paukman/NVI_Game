const formatPercentage = (value, fixedTo = 2) =>
  Number.isFinite(value) ? `${Number(value).toFixed(fixedTo)}%` : "";

export { formatPercentage };
