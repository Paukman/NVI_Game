const config = {
  name: 'pnlReportCustomView',
  queries: [
    {
      name: `pnlReportCustomViewList`,
      method: 'list',
      query: `<copy paste from report md file your query here> !!!EITHER QUERY OR MUTATION NOT BOTH`,
      mutation: `<copy paste from report md file your mutation here>`,
      message: 'fetching Custom View List',
    },
  ],
};

module.exports = {
  config,
};
