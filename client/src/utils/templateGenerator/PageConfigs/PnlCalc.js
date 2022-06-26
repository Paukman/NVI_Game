const { FILE_NAMES } = require('../config');

const config = {
  moduleName: 'CommissionsCalculator',
  pageDirectory: 'ProfitAndLoss',
  graphQL: {
    fileName: 'usePnLCommissionCalculator',
    graphQLmethods: [
      'pnlCommissionCalculatorGet',
      'pnlCommissionCalculatorGetLoading',
      'pnlCommissionCalculatorGetState',
      'pnlCommissionCalculatorList',
      'pnlCommissionCalculatorListState',
      'pnlCommissionCalculatorListLoading',
    ],
    listState: 'pnlCommissionCalculatorListState',
  },
  replacement: {
    hook: {
      globals: true,
      portfolio: true,
      date: true,
      download: true,
      add: true,
      remove: true,
      periodSelector: true,
      edit: true,
    },
    mainPage: {
      portfolio: true,
      date: true,
      goButton: true,
      addNew: true,
      periodSelector: true,
      edit: true,
    },
    constants: {
      periodSelector: true,
    },
  },
  provider: {
    useProvider: false,
    providerName: 'HealthScorecard',
  },
  drawer: {
    drawerConfig: null, // Point to the config file
  },
  addEdit: {
    name: 'SalesManagerAddEdit',
    useAddEdit: false,
    editConfig: null, // Point to the config file
  },
  addPages: [FILE_NAMES.HOOK_INDEX, FILE_NAMES.STYLED, FILE_NAMES.CONSTANTS, FILE_NAMES.UTILS],
  skipPages: [FILE_NAMES.MAIN_PAGE_INDEX],
};

module.exports = {
  config,
};
