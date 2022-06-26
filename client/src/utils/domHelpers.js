export const isElementInView = (parent, element, fullyInView) => {
  if (!parent || !element) {
    return false;
  }
  const pageTop = parent.scrollTop;
  const pageBottom = pageTop + parent.clientHeight;
  const elementTop = element.offsetTop;
  const elementBottom = elementTop + element.clientHeight;

  if (fullyInView === true) {
    return pageTop < elementTop && pageBottom > elementBottom;
  } else {
    return elementTop <= pageBottom && elementBottom >= pageTop;
  }
};
