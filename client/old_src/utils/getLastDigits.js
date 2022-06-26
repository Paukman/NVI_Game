const getLastDigits = numbers => {
  if (numbers?.length > 4) {
    return numbers.slice(-4);
  }

  return numbers;
};

module.exports = { getLastDigits };
