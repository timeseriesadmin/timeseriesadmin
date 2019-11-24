import { ApolloError } from 'apollo-client';
import Papa from 'papaparse';

// exported only for tests
export const handleQueryError = (queryError: any) => {
  if (!queryError) {
    return;
  }

  let errorMessage = `${queryError.response.status}:${
    queryError.response.statusText
  } `;
  try {
    const msg = Papa.parse(queryError.response.data, {
      trimHeaders: true,
      skipEmptyLines: true,
    });
    if (msg.data && msg.data.length > 1 && msg.data[1].length > 0) {
      errorMessage += msg.data[1][0];
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    // console.error(error);
    throw new ApolloError({
      errorMessage: error,
      networkError: queryError.response,
      extraInfo: queryError,
    });
  }

  throw new ApolloError({
    errorMessage,
    networkError: queryError.response,
    extraInfo: queryError,
  });
};
