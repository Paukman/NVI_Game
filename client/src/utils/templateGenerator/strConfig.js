const config = {
  moduleName: 'StrDefault',
  pageDirectory: 'StrReports',
  graphQL: {
    fileName: 'useStrReport',
    graphQLmethods: ['strDefaultReport', 'strDefaultReportGet'],
  },
  replacement: {
    globals: true,
    order: false,
    property: true,
    portfolio: false,
    date: true,
    fromDate: false,
    toDate: false,
    downloadButton: true,
    addEditButton: false,
    search: false,
  },
  provider: {
    useProvider: true,
    providerName: 'Str',
  },
  drawer: {
    drawerConfig: null, // Point to the config file
  },
  addEdit: {
    editConfig: null, // Point to the config file
  },
  hook: {
    globals: true,
    order: true,
  },
  mainPage: {
    property: true,
    portfolio: false,
    date: true,
    fromDate: false,
    toDate: false,
    downloadButton: true,
    addEditButton: false,
    search: false,
  },
};

module.exports = {
  config,
};
