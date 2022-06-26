export const buildErrors = (result) => {
  const errors = Array.isArray(result?.errors) ? result.errors : [];
  const errorsMap = errors.reduce((acc, error) => {
    acc[error.name] = `${error.messages.join('. ')}`;
    return acc;
  }, {});

  return {
    errors,
    errorsMap,
  };
};
