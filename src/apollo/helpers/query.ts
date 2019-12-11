import { query as influxQuery, QueryArgs } from 'influx-api';

import { getForm, FormParams } from 'apollo/resolvers/form';
import { resetResultsTable } from 'apollo/helpers/results';
import { saveQueryHistory } from 'apollo/helpers/history';
import { handleQueryError } from 'apollo/helpers/errors';
import { isElectron } from 'apollo/helpers/isElectron';
import { executeViaElectron } from 'apollo/helpers/executeViaElectron';

export async function queryBase(
  cache: any,
  queryArgs: QueryArgs | { q: string },
  isManualQuery = true,
): Promise<{ data: any }> {
  const form: FormParams = getForm(cache);

  const queryParams: QueryArgs = {
    db: '',
    p: '',
    u: '',
    ...form,
    ...queryArgs,
    responseType: 'csv',
  };

  let queryError;
  let response;
  try {
    if (isElectron()) {
      response = await executeViaElectron({
        queryArgs: queryParams,
        rejectUnauthorized: !form.unsafeSsl,
      });
    } else {
      response = await influxQuery(queryParams);
    }
  } catch (error) {
    queryError = error;
  }

  if (isManualQuery) {
    saveQueryHistory(queryParams.q, cache, queryError);

    handleQueryError(queryError);

    resetResultsTable(cache);
  }

  return {
    request: { params: queryParams },
    response,
  };
}
