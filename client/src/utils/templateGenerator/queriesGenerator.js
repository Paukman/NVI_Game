const { queriesConfig } = require('./queriesConfig');
let configFile = '';
process.argv.forEach(function (val, index, array) {
  if (index === 2) {
    configFile = val;
  }
});

const { config: moduleConfiguration } = require(`./PageConfigs/${configFile}.js`);

let queryName = moduleConfiguration.name;
const queryNameCaps = queryName.charAt(0).toUpperCase() + queryName.slice(1);
const queryNameSmall = queryName.charAt(0).toLowerCase() + queryName.slice(1);

console.log('queryNameCaps, queryNameSmall ', queryNameCaps, queryNameSmall);

// hook file
let allStates = [];
let allQueryMethods = [];
let allMutationMethods = [];
let allQueryCallbacks = [];
let allMutationCallbacks = [];
let allReturns = [];

// query file
let allQueries = [];
let allMutations = [];
let allQueriesAndMutations = [];

moduleConfiguration.queries.forEach((query) => {
  const nameCaps = query.name.charAt(0).toUpperCase() + query.name.slice(1);
  const nameSmall = query.name.charAt(0).toLowerCase() + query.name.slice(1);

  console.log('nameCaps, nameSmall ', nameCaps, nameSmall);
  const thisIsQuery = query.query ? true : false;

  const method = query.method;
  const message = query.message;
  // all state
  let state = queriesConfig.hook.state
    .replace(/{{query.nameSmall}}/g, nameSmall)
    .replace(/{{query.nameCaps}}/g, nameCaps);
  allStates.push(state);

  // allqueryMethods
  if (thisIsQuery) {
    let queryMethod = queriesConfig.hook.query
      .replace(/{{query.nameSmall}}/g, nameSmall)
      .replace(/{{query.nameCaps}}/g, nameCaps)
      .replace(/{{query.methodSmall}}/g, method)
      .replace(/{{queryNameSmall}}/g, queryNameSmall)
      .replace(/{{query.message}}/g, message);
    allQueryMethods.push(queryMethod);

    let queryCallback = queriesConfig.hook.queryCallback
      .replace(/{{query.nameSmall}}/g, nameSmall)
      .replace(/{{query.nameCaps}}/g, nameCaps);
    allQueryCallbacks.push(queryCallback);
  }

  // allqueryMethods
  if (!thisIsQuery) {
    let mutationMethod = queriesConfig.hook.mutation
      .replace(/{{query.nameSmall}}/g, nameSmall)
      .replace(/{{query.nameCaps}}/g, nameCaps)
      .replace(/{{query.methodSmall}}/g, method)
      .replace(/{{queryNameSmall}}/g, queryNameSmall)
      .replace(/{{mutation.message}}/g, message);
    allMutationMethods.push(mutationMethod);

    let mutationCallback = queriesConfig.hook.mutationCallback
      .replace(/{{query.nameSmall}}/g, nameSmall)
      .replace(/{{query.nameCaps}}/g, nameCaps);
    allMutationCallbacks.push(mutationCallback);
  }

  let ret = queriesConfig.hook.export.replace(/{{query.nameSmall}}/g, nameSmall);
  allReturns.push(ret);

  // now do the same for queries...
  const queryNameParts = queryNameCaps.match(/[A-Z][a-z]+/g);
  let queriesName = queryNameParts[0].toUpperCase();
  queryNameParts.map((name, index) => {
    if (index > 0) {
      queriesName = (queriesName + `_${name}`).toUpperCase();
    }
  });
  queriesName = queriesName + `_${method}_${thisIsQuery ? 'QUERY' : 'MUTATION'}`.toUpperCase();
  console.log(queriesName);

  let queriesQuery = queriesConfig.hook.queriesQuery
    .replace(/{{queries.name}}/g, queriesName)
    .replace(/{{queries.body}}/g, thisIsQuery ? query.query : query.mutation);
  allQueries.push(queriesQuery);

  let queriesAction = `${method}: ${queriesName},`;
  allQueriesAndMutations.push(queriesAction);

  console.log(allQueriesAndMutations);
});

// now create the hook file
const fse = require('fs-extra');
fse.readFile(`${__dirname}/queriesHookPage.txt`, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  let result = data;
  result = result
    .replace(/{{queryNameSmall}}/g, queryNameSmall)
    .replace(/{{queryNameCaps}}/g, queryNameCaps)
    .replace(/{{allStates}}/g, allStates?.join('\n'))
    .replace(/{{allQueryMethods}}/g, allQueryMethods?.join('\n\n'))
    .replace(/{{allMutationMethods}}/g, allMutationMethods?.join('\n\n'))
    .replace(/{{allQueryCallbacks}}/g, allQueryCallbacks?.join('\n\n'))
    .replace(/{{allMutationCallbacks}}/g, allMutationCallbacks?.join('\n\n'))
    .replace(/{{allReturns}}/g, allReturns?.join('\n\n'));

  const fileQueryName = `src/graphql/use${queryNameCaps}.js`;

  fse.outputFile(fileQueryName, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});

// create queries file
fse.readFile(`${__dirname}/queriesPage.txt`, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  let result = data;
  result = result
    .replace(/{{allQueries}}/g, allQueries?.join('\n\n'))
    .replace(/{{allMutations}}/g, allMutations?.join('\n\n'))
    .replace(/{{queryNameSmall}}/g, queryNameSmall)
    .replace(/{{allQueriesAndMutations}}/g, allQueriesAndMutations?.join('\n'));

  const fileQueryName = `src/graphql/queries/${queryNameSmall}Queries.js`;

  fse.outputFile(fileQueryName, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});
