import { isElectron } from './isElectron';
import { executeViaElectron } from './executeViaElectron';
import { parseQueryResults } from './parseQueryResults';
import { influxRequest } from '../shared/influxRequest';

export async function queryBase(
  form: any,
): Promise<{ request: { params: any }; response: any }> {
  let response;
  if (isElectron()) {
    response = await executeViaElectron({
      ...form,
      rejectUnauthorized: !form.unsafeSsl,
    });
  } else {
    response = await influxRequest(form);
  }

  return {
    request: { params: form },
    response: { ...response, data: parseQueryResults(response.data) },
  };
}
