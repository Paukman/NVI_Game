const queriesConfig = {
  hook: {
    state: `const [{{query.nameSmall}}State, set{{query.nameCaps}}State] = useState({ data: null, errors: [] });`,
    query: `const [query{{query.nameCaps}}, { loading: {{query.nameSmall}}Loading }] = useLazyQuery(
                {{queryNameSmall}}Queries.{{query.methodSmall}},
                  {
                    client: apolloClient,
                    notifyOnNetworkStatusChange: true,
                    fetchPolicy: 'network-only',
                    onCompleted: (response) => {
                      try {
                        const result = response.{{query.nameSmall}} || {};
                        const data = Array.isArray(result.data) ? result.data : [];
              
                        set{{query.nameCaps}}State({
                          data,
                          errors: Array.isArray(result.errors) ? result.errors : [],
                        });
                      } catch (ex) {
                        logger.error('Something went wrong when {{query.message}}: ', ex);
              
                        set{{query.nameCaps}}State({
                          data: [],
                          errors: [
                            { name: '', message: [\`Something went wrong when {{query.message}}. Please try later\`] },
                          ],
                        });
                      }
                    },
                    onError: (response) => {
                      logger.error('Something went wrong when {{query.message}}:', response);
              
                      set{{query.nameCaps}}State({
                        data: [],
                        errors: [
                          {
                            name: '',
                            messages: [\`Something went wrong when {{query.message}}. Please try later\`],
                          },
                        ],
                      });
                    },
                  },
                );`,
    mutation: `  const [mutation{{query.nameCaps}}, { loading: {{query.nameSmall}}Loading }] = useMutation(
        {{queryNameSmall}}Queries.{{query.methodSmall}},
        {
          client: apolloClient,
          notifyOnNetworkStatusChange: true,
          fetchPolicy: 'no-cache',
          onCompleted: (response) => {
            try {
              const result = response.{{query.nameSmall}} || {};
              const data = Array.isArray(result.data) ? result.data : [];
    
              set{{query.nameCaps}}State({
                data,
                errors: Array.isArray(result.errors) ? result.errors : [],
              });
            } catch (ex) {
              logger.error('Something went wrong when {{mutation.message}}:', ex);
    
              set{{query.nameCaps}}State({
                data: [],
                errors: [{ name: '', message: [\`Something went wrong when {{mutation.message}}. Please try later\`] }],
              });
            }
          },
          onError: (response) => {
            logger.error('Something went wrong when {{mutation.message}}:', response);
    
            set{{query.nameCaps}}State({
              data: [],
              errors: [
                {
                  name: '',
                  messages: [\`Something went wrong when {{mutation.message}}. Please try later\`],
                },
              ],
            });
          },
        },
      );`,
    queryCallback: `const {{query.nameSmall}} = useCallback(
            (params) => {
                set{{query.nameCaps}}State({ data: null, errors: [] });
                query{{query.nameCaps}}({ variables: { params } });
            },
            [query{{query.nameCaps}}],
          );`,
    mutationCallback: `const {{query.nameSmall}} = useCallback(
                (params) => {
                    set{{query.nameCaps}}State({ data: null, errors: [] });
                    mutation{{query.nameCaps}}({ variables: { params } });
                },
                [mutation{{query.nameCaps}}],
              );`,

    export: `{{query.nameSmall}},
        {{query.nameSmall}}State,
        {{query.nameSmall}}Loading,`,
    // this is not hook part, I'm lazy to add another object
    queriesQuery: `const {{queries.name}} = gql\` 
        {{queries.body}}
      \`;`,
  },
};

module.exports = {
  queriesConfig,
};
