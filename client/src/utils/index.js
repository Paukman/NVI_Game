import logger from './logger';

// date logger
export { logger };

// api helpers
export { buildErrors } from './apiHelpers';

// data manipulation
export {
  parseJsonSafe,
  valueOfFields,
  maxAndMediumValues,
  footer,
  newPositionOfElement,
  formatDateForApi,
  formatDateForDownloading,
  checkStringTypeAndConvert,
  formatQueryErrors,
  removeElementFromArray,
  percDiff,
  normalizePermissions,
  applyPersmissionsForSideBarItems,
  numberOfChangedFilters,
} from './dataManipulation';

// dom helpers
export { isElementInView } from './domHelpers';

// download helpers
export {
  buildDownloadData,
  findDepth,
  exportToXLSX,
  buildReportFilename,
  buildDownloadableFilename,
  createDownloadFile,
  buildMissingDateFileName,
} from './downloadHelpers';

// format helpers
export {
  strReplace,
  numberFilter,
  formatPrice,
  formatPercentage,
  formatCurrency,
  timestampToShortLocal,
  timestampNoSeparators,
  timestampToMonthDay,
  valueConvertor,
  toNumber,
  isValidDate,
  isCurrentYear,
  calcPxSize,
  formatPercentageWithThousandSeparator,
} from './formatHelpers';

// IJ helpers
export { ijCalculations } from './ijHelpers';

// locales halpers
export { getText, capitalize, search, isZeroConditionExluded } from './localesHelpers';

// page helpers
export {
  buildAddressString,
  compareValuesForSort,
  getComparator,
  stableSort,
  direction,
  switchDirection,
  findInObject,
  isKeyPresent,
  lowerCaseComparator,
  getCustomComparator,
  numberComparator,
} from './pageHelpers';

// validators
export { isDateValid, isDashboardDateValid } from './validators';

// test utils
export { RenderWithProviders } from './testUtils';
