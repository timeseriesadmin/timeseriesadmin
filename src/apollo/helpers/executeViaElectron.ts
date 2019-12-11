import { QueryArgs } from 'influx-api';
import { getIpcRenderer } from 'apollo/helpers/getIpcRenderer';

export async function executeViaElectron(eventArg: {
  queryArgs: QueryArgs;
  rejectUnauthorized: boolean;
}): Promise<string> {
  // console.log('ipc', ipc);
  return new Promise((resolve, reject) => {
    const ipc = getIpcRenderer();
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
