const { FILE_NAMES } = require('../config');

const config = {
  moduleName: 'HealthScorecard',
  pageDirectory: 'HealthScorecard',
  graphQL: {
    fileName: 'useHealthScoreCard',
    graphQLmethods: ['healthScoreCard', 'healthScoreCardGet'],
  },
  replacement: {
    hook: {
      globals: true,
      hotelId: false,
      groupId: true,
      date: true,
      fromDate: false,
      toDate: false,
      download: true,
      add: false,
      remove: false,
      order: false,
      search: false,
      modes: false,
      upload: true,
      periodSelector: true,
      edit: true,
      manualEntry: true,
    },
    mainPage: {
      hotel: false,
      groups: true,
      portfolio: false,
      date: true,
      fromDate: false,
      toDate: false,
      goButton: true,
      modes: false,
      download: true,
      upload: true,
      addNew: false,
      search: false,
      order: false,
      periodSelector: true,
      year: false,
      unmappedSelector: false,
      buttonDropdown: false,
      edit: true,
      manualEntry: true,
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
  addPages: [],
  skipPages: [FILE_NAMES.MAIN_PAGE_INDEX],
};

module.exports = {
  config,
};
