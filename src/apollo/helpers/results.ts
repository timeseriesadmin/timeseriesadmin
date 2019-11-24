import gql from 'graphql-tag';

// reset current page number to 0 (first page), orderKey and order
export const resetResultsTable = (cache: any) => {
  const { resultsTable } = cache.readQuery({
    query: gql`
      {
        resultsTable {
          rowsPerPage
          timeFormat
        }
      }
    `,
  });
  cache.writeData({
    data: {
      resultsTable: {
        ...resultsTable,
        page: 0,
        orderKey: '',
        order: 'desc',
      },
    },
  });
};
