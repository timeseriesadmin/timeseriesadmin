import { isElectron } from 'src/apollo/helpers/isElectron';
import { executeViaElectron } from 'src/apollo/helpers/executeViaElectron';
import { parseQueryResults } from 'src/apollo/helpers/parseQueryResults';
import { influxRequest } from 'src/shared/influxRequest';
// import { saveQueryHistory } from 'src/apollo/helpers/history';
// const influxRequest = require('shared/influxRequest');
// import influxRequest from 'src/shared/influxRequest';
console.log('influxRequest', influxRequest);

export async function queryBase(
  form: any,
  isManualQuery = true,
): Promise<{ request: { params: any }; response: any }> {
  // const queryParams: any = {
  //   ...form,
  //   // responseType: 'csv',
  // };

  // let queryError;
  let response;
  // try {
  if (isElectron()) {
    response = await executeViaElectron({
      ...form,
      rejectUnauthorized: !form.unsafeSsl,
    });
  } else {
    response = await influxRequest(form);
  }
  //   console.warn(error.message, error.stack, error.code);
  //   // if (isManualQuery) {
  // saveQueryHistory(form.q, cache, queryError);
  //   // console.error(commonError(error));
  //   // resetResultsTable(cache);
  //   // }
  //   return {
  //     request: { params: {} },
  //     response: {},
  //   };
  // }

  return {
    request: { params: form },
    response: { ...response, data: parseQueryResults(response.data) },
  };
}
