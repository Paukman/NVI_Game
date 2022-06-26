const FILE_NAMES = {
  HOOK: 'HOOK',
  HOOK_INDEX: 'HOOK_INDEX',
  CONSTANTS: 'CONSTANTS',
  STYLED: 'STYLED',
  UTILS: 'UTILS',
  MAIN_PAGE: 'MAIN_PAGE',
  MAIN_PAGE_INDEX: 'MAIN_PAGE_INDEX',
};

const fileConfig = (names, moduleConfiguration) => {
  const fileConfiguration = [
    {
      name: FILE_NAMES.HOOK,
      template: 'hook.txt',
      fileName: `use${names.moduleNameCaps}.js`,
      path: `src/pages/${names.pageDirCaps}/hooks/`,
    },
    {
      name: FILE_NAMES.HOOK_INDEX,
      template: 'hookIndex.txt',
      fileName: `index.js`,
      path: `src/pages/${names.pageDirCaps}/hooks/`,
    },
    {
      name: FILE_NAMES.CONSTANTS,
      template: 'constants.txt',
      fileName: `constants.js`,
      path: `src/pages/${names.pageDirCaps}/`,
    },
    {
      name: FILE_NAMES.STYLED,
      template: 'styled.txt',
      fileName: `styled.js`,
      path: `src/pages/${names.pageDirCaps}/`,
    },
    {
      name: FILE_NAMES.UTILS,
      template: 'utils.txt',
      fileName: `utils.js`,
      path: `src/pages/${names.pageDirCaps}/`,
    } /*
    {
      template: 'provider.txt',
      fileName: `${names.providerName}Provider.js`,
      path: `src/providers/`,
    }, */,

    {
      name: FILE_NAMES.MAIN_PAGE,
      template: 'mainPage.txt',
      fileName: moduleConfiguration.provider.useProvider
        ? `${names.moduleNameCaps}Page.js`
        : `${names.moduleNameCaps}.js`,
      path: `src/pages/${names.pageDirCaps}/`,
    },
    {
      name: FILE_NAMES.MAIN_PAGE_INDEX,
      template: 'mainPageIndex.txt',
      fileName: `index.js`,
      path: `src/pages/${names.pageDirCaps}/`,
    } /*
    {
      template: 'providerWrapperPage.txt',
      fileName: `${names.moduleNameCaps}.js`,
      path: `src/pages/${names.pageDirCaps}/`,
    },*/,
  ];

  // quick and dirty way to add another needed page , needs some work...
  const addEditPage = [
    {
      template: 'addEditPage.txt',
      fileName: `SalesManagerAddEdit.js`,
      path: `src/pages/${names.pageDirCaps}/`,
    },
    {
      template: 'SalesManagersImport.txt',
      fileName: `SalesManagersImport.js`,
      path: `src/pages/${names.pageDirCaps}/`,
    },
  ];

  let ret = fileConfiguration;
  if (moduleConfiguration.addEdit.useAddEdit) {
    ret = [...fileConfiguration, ...addEditPage];
  }
  return ret;
};

const fileTemplates = {
  replacement: {
    hook: {
      portfolio: [
        `portfolio: portfolio,`,
        `if (name === 'portfolio') {
        updateHotelAndGroup({ value });
      }`,
      ],
      globals: [
        `GlobalFilterContext,`,
        `const { portfolio, assignGlobalValue } = useContext(GlobalFilterContext);
        const myGlobals = [globals.hotelId,globals.groupId, globals.date];`,
        `if (myGlobals.includes(name)) {
          assignGlobalValue(name, value); // keep globals up to date
        }`,
      ],
      hotel: [`hotelId: portfolio.hotelId, `],
      group: [`hotelGroupId: portfolio.hotelGroupId,`],
      date: [`date: portfolio.date,`],
      fromDate: [`fromDate: portfolio.fromDate,`],
      toDate: [`toDate: portfolio.toDate,`],
      order: [],
      search: [
        `listDataSorting: [], // keep a copy for sorting...`,
        `listDataSorting: listData, // keep a copy for sorting...`,
        `  const filterOutResults = (name, keyWord) => {
          let matchingList = {{moduleNameSmall}}State.listDataSorting;
      
          if (keyWord) {
            matchingList = {{moduleNameSmall}}State.listDataSorting.filter((item) => {
              return findInObject({
                predicate: (val) => {
                  return val.toLowerCase().includes(keyWord.toLowerCase());
                },
                object: item,
                exclude: ['id'], // don't look here...
              });
            });
          }
      
          updateState((state) => ({
            ...state,
            [name]: keyWord,
            listData: [...matchingList],
          }));
        };`,
        `, filterOutResults`,
      ],
      modes: [`, {{modesName}}`, `mode: {{modesName}}.MODE1.value,`],
      download: [
        `AppContext,`,
        `const { appPages } = useContext(AppContext);`,
        `const onHandleDownload = ({ value }) => {
          downloadExcelFile(value, appPages, {{moduleNameSmall}}State);
        };`,
        `, onHandleDownload`,
      ],
      upload: [
        `const onHandleUpload = () => {
          logger.debug("onHandleUpload");
        };`,
        `, onHandleUpload`,
      ],
      edit: [
        `const onHandleEdit = () => {
          logger.debug("onHandleEdit");
        };`,
        `, onHandleEdit`,
      ],
      manualEntry: [
        `const onHandleManualEntry = () => {
          logger.debug("onHandleManualEntry");
        };`,
        `, onHandleManualEntry`,
      ],
      add: [
        `const onHandleAddNew = () => {
          logger.debug("onHandleAddNew");
        };`,
        `, onHandleAddNew`,
      ],

      periodSelector: [`,PERIOD_ITEMS`, `period: PERIOD_ITEMS.MTD.value,`],
      drawer: [
        `drawerState: null,
         openDrawer: false,`,
        `const onCloseDrawer = () => {
          logger.debug("onHandleAddNew");
        };
        
         const onSaveDrawerState = () => {
          logger.debug("onHandleAddNew");
        };`,
        `, onCloseDrawer, onSaveDrawerState`,
      ],
      extraButton1: [
        `const onHandleExtraButton1 = () => {
          logger.debug("onHandleExtraButton1");
        };`,
        `, onHandleExtraButton1`,
      ],
      extraButton2: [
        `const onHandleExtraButton2 = () => {
          logger.debug("onHandleExtraButton2");
        };`,
        `, onHandleExtraButton2`,
      ],
      extraButton3: [
        `const onHandleExtraButton3 = () => {
          logger.debug("onHandleExtraButton3");
        };`,
        `, onHandleExtraButton3`,
      ],
    },
    mainPage: {
      portfolio: [
        `, onPortfolioUpdate`,
        `<ToolBarItem>
          <PortfolioSelector
            name='portfolio'
            value={state?.portfolio}
            onChange={onPortfolioUpdate}
            disabled={state?.pageState.LOADING}
            disableClearable
            allowAllGroups
            allowAllHotels
          />
        </ToolBarItem>`,
      ],
      hotel: [
        `<ToolBarItem>
          <HotelSelector
            value={state?.hotelId}
            name='hotelId'
            disableClearable
            disabled={state?.pageState.LOADING}
            onChange={onChange}
            helperText={state?.errors['hotelId'] || ''}
            error={!!state?.errors['hotelId']}
            required
          />
        </ToolBarItem>`,
      ],
      group: [
        `<ToolBarItem>
          <GroupOnlySelector
            name={'hotelGroupId'}
            value={state?.hotelGroupId}
            onChange={onChange}
            disabled={state?.pageState.LOADING}
            disableClearable
            helperText={state?.errors['hotelGroupId'] || ''}
            error={!!state?.errors['hotelGroupId']}
            allowAllGroups
            required
          />
        </ToolBarItem>`,
      ],
      goButton: [
        `, displayReport`,
        `<ToolBarItem>
          <Button
            iconName={state?.requestReport ? '' : 'Refresh'}
            text={state?.requestReport ? getText('generic.go') : ''}
            title={getText(\`generic.\${state?.requestReport ? 'refresh' : 'go'}\`)}
            variant='secondary'
            onClick={() => displayReport()}
            disabled={!isDateValid(state.date)}
            dataEl='buttonGo'
          />
        </ToolBarItem>`,
      ],
      modes: [
        `, {{modesName}}`,
        `<ToolBarItem toTheRight>
          <Toggle
            value={state?.mode}
            onChange={(value) => {
              onChange('mode', value);
            }}
            dataEl='toggleModes'
          >
            <div>{{{modesName}}.MODE1.label}</div>
            <div>{{{modesName}}.MODE2.label}</div>
          </Toggle>
        </ToolBarItem>`,
      ],
      download: [
        ', onHandleDownload',
        `<ToolBarItem toTheRight>
          <ButtonDownloadAs
            iconName='CloudDownloadSharp'
            text=''
            variant='tertiary'
            onClick={onHandleDownload}
            exclude={['pdf']}
            dataEl={'buttonDownloadAs'}
            disabled={state?.listData?.length ? false : true}
          />
        </ToolBarItem>`,
      ],
      upload: [
        `, onHandleUpload`,
        `<ToolBarItem toTheRight>
          <Button
            iconName='CloudUpload'
            variant='tertiary'
            title={getText('generic.import')}
            alt='buttonCreateKpi'
            onClick={onHandleUpload}
            disabled={false}  // add you condition
            dataE='buttonUpload'
          />
        </ToolBarItem>`,
      ],
      addNew: [
        `, onHandleAddNew`,
        `<ToolBarItem toTheRight>
          <Button
            iconName='Add'
            text=''
            variant='tertiary'
            title={getText('generic.add')}
            onClick={onHandleAddNew}
            disabled={false}  // add you condition
            dataEl='buttonAdd'
          />
        </ToolBarItem>`,
      ],
      search: [
        `, filterOutResults`,
        `<ToolBarItem width='316px'>
          <Search
            label={getText('kpi.search')}
            name='keyword'
            value={state?.keyword || ''}
            onChange={filterOutResults}
            dataEl='searchInput'
          />
        </ToolBarItem>`,
      ],
      year: [
        `<ToolBarItem>
          <YearSelector
            name='year'
            label='Year'
            value={state?.year}
            disabled={state?.pageState.LOADING}
            yearsSince={new Date().getFullYear() - 10}
            yearsTo={new Date().getFullYear()}
            onChange={onChange}
            helperText={state?.errors['year'] || ''}
            error={!!state?.errors['year']}
            dataEl='selectorYear'
            maxHeight={'200px'}
          />
        </ToolBarItem>`,
      ],
      unmappedSelector: [
        `<ToolBarItem>
          <PnLUnmappedSelector
            label='Unmapped Selector'
            name='hmgGlCodeStatus'
            value={state?.hmgGlCodeStatus}
            onChange={onChange}
            disabled={state?.pageState.LOADING}
            helperText={state?.errors['hmgGlCodeStatus'] || ''}
            error={!!state?.errors['hmgGlCodeStatus']}
          />
        </ToolBarItem>`,
      ],
      buttonDropdown: [
        `onHandleDropdownButton`,
        `<ToolBarItem toTheRight>
          <ButtonDropdown
            text="{getText('generic.button')}"
            name='dropdownButton'
            onClick={onHandleDropdownButton}
            items={state?.buttonDropdownItems}
            disabled={false}  // add you condition
            dataEl='buttonDropdown'
          />
        </ToolBarItem>`,
      ],
      periodSelector: [
        `import { PERIOD_ITEMS } from './constants'`,
        `<ToolBarItem>
          <PeriodSelector
            autoSelectOnNoValue
            name='period'
            label={getText('generic.period')}
            value={state?.period}
            items={PERIOD_ITEMS}
            onChange={onChange}
            disabled={state?.pageState.LOADING}
            dataEl='periodSelected'
            helperText={state?.errors['hmgGlCodeStatus'] || ''}
            error={!!state?.errors['hmgGlCodeStatus']}
          />
        </ToolBarItem>`,
      ],
      date: [
        `<ToolBarItem>
          <InputDate
            name='date'
            label={getText('generic.date')}
            value={state?.date}
            onChange={onChange}
            disabled={state?.pageState.LOADING}
            dataEl='inputDate'
            autoClose={true}
            errorMsg={getText('generic.dateErrorText')}
          />
        </ToolBarItem>`,
      ],
      toDate: [
        `<ToolBarItem>
          <InputDate
            name='toDate'
            label={getText('generic.toDate')}
            value={state?.toDate}
            onChange={onChange}
            disabled={state?.pageState.LOADING}
            dataEl='inputDateToDate'
            autoClose={true}
            errorMsg={getText('generic.dateErrorText')}
          />
        </ToolBarItem>`,
      ],
      fromDate: [
        `<ToolBarItem>
          <InputDate
            name='fromDate'
            label={getText('generic.fromDate')}
            value={state?.fromDate}
            onChange={onChange}
            disabled={state?.pageState.LOADING}
            dataEl='inputDateFromDate'
            autoClose={true}
            errorMsg={getText('generic.dateErrorText')}
          />
        </ToolBarItem>`,
      ],
      edit: [
        `, onHandleEdit`,
        `<ToolBarItem toTheRight>
          <Button
            variant='tertiary'
            text=''
            iconName='ViewWeekOutlined'
            title={getText('generic.editDescriptions')}
            onClick={onHandleEdit}
            dataEl='buttonEdit'
            disabled={false}  // add you condition
          />
        </ToolBarItem>`,
      ],
      manualEntry: [
        `, onHandleManualEntry`,
        `<ToolBarItem toTheRight>
          <Button
            variant='tertiary'
            text=''
            iconName='Keyboard'
            title={getText('generic.manualEntry')}
            onClick={onHandleManualEntry}
            dataEl='buttonManualEntry'
            disabled={false}  // add you condition
          />
        </ToolBarItem>`,
      ],
      genericForm: [
        `const { formConfig } = addEditColumnFormConfig(onCancel, onSave, onXCancelButton);`,
        `<GenericForm formConfig={formConfig} data={{state}} errors={{}} />;`,
      ],
      copy: [],
      drawer: [
        `, onCloseDrawer, onSaveDrawerState`,
        `<SlideBar
          title={"Drawer"} // add your title getText('module.drawerTitle')
          open={state?.openDrawer}
          onCancel={() => onCloseDrawer()}
          onSave={onSaveDrawerState}
          anchor={'right'}
          buttonSaveText={getText('generic.save')}
          buttonCancelText={getText('generic.cancel')}
        >
          {/* {darwerState?.drawerData?.length ? (
            <EditDrawer>
              <HealthScorecardEditDrawer onChange={onUpdateColumn} data={editState?.editData} />
            </EditDrawer>
          ) : null} 
          <>
          My component
          </> */}
        </SlideBar>`,
      ],

      extraButton1: [
        `, onHandleExtraButton1`,
        `<ToolBarItem toTheRight>
          <Button
            variant='tertiary'
            text=''
            iconName='Settings'
            title={getText('generic.settings')} // add your name
            onClick={onHandleExtraButton1}
            dataEl='buttonExtraButton1'
            disabled={false}  // add you condition
          />
        </ToolBarItem>`,
      ],
      extraButton2: [
        `, onHandleExtraButton2`,
        `<ToolBarItem toTheRight>
          <Button
            variant='tertiary'
            text=''
            iconName='Settings'
            title={getText('generic.settings')} // add your name
            onClick={onHandleExtraButton2}
            dataEl='buttonExtraButton2'
            disabled={false}  // add you condition
          />
        </ToolBarItem>`,
      ],
      extraButton3: [
        `, onHandleExtraButton3`,
        `<ToolBarItem toTheRight>
          <Button
            variant='tertiary'
            text=''
            iconName='Settings'
            title={getText('generic.settings')} // add your name
            onClick={onHandleExtraButton3}
            dataEl='buttonExtraButton3'
            disabled={false}  // add you condition
          />
        </ToolBarItem>`,
      ],
    },
    constants: {
      periodSelector: [
        `// replace with your items
export const PERIOD_ITEMS = {
  MTD: {
    label: 'MTD',
    value: getText('selectors.periods.MTD'),
  },
  YTD: {
    label: 'YTD',
    value: getText('selectors.periods.YTD'),
  },
  MONTH: {
    label: 'MONTH',
    value: getText('selectors.periods.MONTH'),
  },
  YEAR: {
    label: 'YEAR',
    value: getText('selectors.periods.YEAR'),
  },
};`,
      ],
      modes: [
        // add your names here
        `export const {{modesName}} = {
  MODE1: {
    value: 0,
    label: getText('mode.mode1'),
  },
  MODE2: {
    value: 1,
    label: getText('mode.mode2'),
  },
};`,
      ],
    },
  },
};

module.exports = {
  fileTemplates,
  fileConfig,
  FILE_NAMES,
};
