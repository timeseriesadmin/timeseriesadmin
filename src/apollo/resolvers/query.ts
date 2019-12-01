import { query as influxQuery } from 'influx-api';

import { getForm } from './form';
import { resetResultsTable } from '../helpers/results';
import { saveQueryHistory } from '../helpers/history';
import { handleQueryError } from '../helpers/errors';
import { isElectron } from 'apollo/helpers/isElectron';

const ipc = (window as any).ipcRenderer;

async function executeViaElectron(eventArg: {
  queryArgs: any;
  rejectUnauthorized: boolean;
}) {
  return new Promise((resolve, reject) => {
    ipc.send('influx-query', eventArg);
    ipc.once('influx-query-response', function(
      _event: Event,
      { response, error }: any,
    ) {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

export const executeQuery = async (
  _: void,
  queryParams: any,
  { cache }: any,
): Promise<any> => {
  // TODO: ensure LIMIT if not provided but ONLY for SELECTs
  // if (q.indexOf('select') === 0 && q.indexOf('limit') === -1) {
  // q += ' limit 100'; // TODO: increase LIMIT value
  // }

  const form = getForm(cache);

  const queryArgs = {
    ...form,
    ...queryParams,
    responseType: 'csv',
  };

  let queryError;
  let queryResult;
  try {
    if (isElectron()) {
      queryResult = await executeViaElectron({
        queryArgs,
        rejectUnauthorized: false,
      });
    } else {
      queryResult = await influxQuery(queryArgs);
    }
  } catch (error) {
    queryError = error;
  }

  saveQueryHistory(queryArgs.q, cache, queryError);

  handleQueryError(queryError);

  resetResultsTable(cache);

  return {
    request: { params: queryArgs },
    response: queryResult,
  };
};
