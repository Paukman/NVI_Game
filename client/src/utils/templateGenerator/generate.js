const { fileConfig, fileTemplates, FILE_NAMES } = require('./config');
let configFile = '';
process.argv.forEach(function (val, index, array) {
  if (index === 2) {
    configFile = val;
  }
});

const { config: moduleConfiguration } = require(`./PageConfigs/${configFile}.js`);
const { replacements } = require(`./defaults.js`);

let moduleName = moduleConfiguration.moduleName;
let pageDir = moduleConfiguration.pageDirectory;
let graphQLFile = moduleConfiguration.graphQL.fileName;
let provider = moduleConfiguration.provider?.providerName;

const moduleNameCaps = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
const moduleNameSmall = moduleName.charAt(0).toLowerCase() + moduleName.slice(1);
const pageDirCaps = pageDir.charAt(0).toUpperCase() + pageDir.slice(1);
const graphQLhook = graphQLFile.charAt(0).toLowerCase() + graphQLFile.slice(1);
const providerName = provider?.charAt(0).toUpperCase() + provider?.slice(1);
const moduleNameCapsPage = moduleConfiguration.provider?.useProvider ? `${moduleNameCaps}Page` : moduleNameCaps;

const fileStructure = fileConfig(
  { moduleNameCaps, moduleNameSmall, pageDirCaps, graphQLhook, providerName },
  moduleConfiguration,
);

const fse = require('fs-extra');

fileStructure.forEach((obj) => {
  // if not creating...
  if (!moduleConfiguration.createPages.includes(obj.name)) {
    console.log('NOT creating page ', obj.name);
    return;
  }
  console.log('CREATING page ', obj.name);
  // replace basics
  fse.readFile(`${__dirname}/${obj.template}`, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    let result = data;

    // replacements
    // hook, mainPage, etc...
    for (const [page, pageValues] of Object.entries(replacements)) {
      if (!moduleConfiguration?.replacement.hasOwnProperty(page)) {
        console.log(page, ' replacement is not in configuration');
        continue;
      }

      console.log('this is page: ', page, pageValues);
      // globals, date, hotel, etc...
      pageValues.forEach((arg) => {
        let replaceLiteral = `{{replacement.${page}.${arg}}}`;
        console.log(replaceLiteral);
        // if availalbe and true
        if (moduleConfiguration.replacement[page][arg]) {
          for (let i = 0; i < fileTemplates.replacement[page][arg]?.length; i++) {
            result = result.replace(replaceLiteral, fileTemplates.replacement[page][arg]?.[i]);
          }
        } else {
          const re = new RegExp(replaceLiteral, 'g');
          result = result.replace(re, '');
        }
      });
    }

    // graphQL
    if (moduleConfiguration.graphQL.graphQLmethods?.length) {
      // if availalbe and true
      let graphQLdestructure = '';
      moduleConfiguration.graphQL.graphQLmethods.map((method) => {
        graphQLdestructure = graphQLdestructure.concat(`${method}, `);
      });

      result = result.replace('{{graphQL.graphQLmethods}}', graphQLdestructure);

      if (moduleConfiguration.graphQL?.listState) {
        console.log('>>>>>>', moduleConfiguration.graphQL?.listState);
        result = result.replace(/{{graphQL.listState}}/g, moduleConfiguration.graphQL.listState);
      } else {
        result = result.replace(/{{graphQL.listState}}/g, moduleNameSmall);
      }
    }

    result = result
      .replace(/{{modesName}}/g, moduleConfiguration.modesName ?? 'modes')
      .replace(/{{moduleNameCaps}}/g, moduleNameCaps)
      .replace(/{{moduleNameSmall}}/g, moduleNameSmall)
      .replace(/{{pageDirCaps}}/g, pageDirCaps)
      .replace(/{{graphQLhook}}/g, graphQLhook)
      .replace(/{{providerName}}/g, providerName)
      .replace(/{{moduleNameCapsPage}}/g, moduleNameCapsPage)
      .replace(/{{addEditName}}/g, moduleConfiguration.addEdit.useAddEdit ? moduleConfiguration.addEdit.name : '');

    let fileName = `${obj.path}${obj.fileName}`;

    // append
    if (moduleConfiguration.appendPages.includes(obj.name)) {
      fse.appendFile(fileName, result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    }
    // create
    else {
      fse.outputFile(fileName, result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    }
  });
});
