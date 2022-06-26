const { FILE_NAMES } = require('../config');

const config = {
  moduleName: 'PrimaryTableColumnAddEdit',
  pageDirectory: 'Dashboards',
  graphQL: {
    fileName: 'useCustomTableRowColumn',
    graphQLmethods: [
      'customTableRowColumnGet',
      'customTableRowColumnCreate',
      'customTableRowColumnUpdate',
      'customTableRowColumnRemove',
      'customTableRowColumn',
    ],
  },
  replacement: {
    hook: {
      globals: false,
      hotelId: false,
      groupId: false,
      date: false,
      fromDate: false,
      toDate: false,
      download: false,
      add: false,
      remove: false,
      order: false,
      search: false,
      modes: false,
      upload: false,
      periodSelector: false,
      edit: false,
      manualEntry: false,
      genericForm: true,
    },
    mainPage: {
      hotel: false,
      groups: false,
      portfolio: false,
      date: false,
      fromDate: false,
      toDate: false,
      goButton: false,
      modes: false,
      download: false,
      upload: false,
      addNew: false,
      search: false,
      order: false,
      periodSelector: false,
      year: false,
      unmappedSelector: false,
      buttonDropdown: false,
      edit: false,
      manualEntry: false,
      genericForm: true,
    },
    constants: {
      periodSelector: true,
    },
  },
  provider: {
    useProvider: false,
    providerName: '',
  },
  drawer: {
    drawerConfig: null, // Point to the config file
  },
  addEdit: {
    name: '',
    useAddEdit: false,
    editConfig: null, // Point to the config file
  },
  addPages: [],
  skipPages: [
    FILE_NAMES.MAIN_PAGE_INDEX,
    FILE_NAMES.HOOK_INDEX,
    FILE_NAMES.STYLED,
    FILE_NAMES.UTILS,
    FILE_NAMES.CONSTANTS,
  ],
};

module.exports = {
  config,
};
