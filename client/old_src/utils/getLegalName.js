export const getLegalName = (state, customerName) => {
  let legalName = state.recipientName;
  let middleName = ""; // optional
  if (customerName?.legalName?.retailName?.middleName) {
    middleName = ` ${customerName?.legalName?.retailName?.middleName}`;
  }

  if (
    customerName?.legalName?.retailName?.firstName &&
    customerName?.legalName?.retailName?.lastName
  ) {
    legalName = `${customerName.legalName.retailName.firstName}${middleName} ${customerName.legalName.retailName.lastName}`;
  }
  return legalName;
};
