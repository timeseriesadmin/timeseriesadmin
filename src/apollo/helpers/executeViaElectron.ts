import { getIpcRenderer } from 'src/apollo/helpers/getIpcRenderer';

const ipc = getIpcRenderer();

export async function executeViaElectron(params: any): Promise<any> {
  return new Promise((resolve, reject) => {
    ipc.send('influx-query', { params });
    ipc.once('influx-query-response', function(
      _event: Event,
      { response, error }: any,
    ) {
      if (error) {
        console.log('electron error', error);
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}
