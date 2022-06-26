const setTitleId = (title, id) => {
  let titleId;

  switch (title) {
    case "Pending transactions":
      titleId = `${id}-title-pending`;
      break;
    case "Posted transactions":
      titleId = `${id}-title-posted`;
      break;
    default:
      titleId = `${id}-title`;
      break;
  }

  return titleId;
};

module.exports = { setTitleId };
