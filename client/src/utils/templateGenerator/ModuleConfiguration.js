const config = {
  moduleName: 'ModuleName',
  pageDirectory: 'ModuleName',
  graphQL: {
    fileName: 'useGraphQLName',
    graphQLmethods: ['ModuleName', 'listModuleName', 'removeAccount', 'editModuleName'],
  },
  replacement: {
    hook: {
      globals: true,
      hotelId: false,
      groupId: true,
      date: false,
      fromDate: false,
      toDate: false,
      download: true,
      add: true,
      remove: true,
      order: true,
      search: true,
      modes: true,
      upload: true,
    },
    mainPage: {
      hotel: false,
      groups: true,
      portfolio: false,
      date: false,
      fromDate: false,
      toDate: false,
      goButton: false,
      modes: true,
      download: true,
      upload: true,
      addNew: true,
      search: true,
      order: false,
    },
  },
  provider: {
    useProvider: false,
    providerName: 'ModuleName',
  },
  drawer: {
    drawerConfig: null, // Point to the config file
  },
  addEdit: {
    name: 'ModuleNameAddEdit',
    useAddEdit: false,
    editConfig: null, // Point to the config file
  },
  hook: {
    globals: true,
    order: true,
  },
  mainPage: {
    property: false,
    groups: true,
    portfolio: false,
    date: false,
    fromDate: false,
    toDate: false,
    goButton: true,
    downloadButton: true,
    uploadButton: true,
    addEditButton: true,
    search: true,
  },
};

module.exports = {
  config,
};
