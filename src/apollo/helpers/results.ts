import gql from 'graphql-tag';

export const resetResultsTable = (cache: any) => {
  const { resultsTable } = cache.readQuery({
    query: gql`
      {
        resultsTable {
          timeFormat
        }
      }
    `,
  });
  cache.writeData({
    data: {
      resultsTable: {
        ...resultsTable,
      },
    },
  });
};
