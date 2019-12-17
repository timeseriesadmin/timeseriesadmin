import { getIpcRenderer } from './getIpcRenderer';

export async function executeViaElectron(params: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const ipc = getIpcRenderer();
    ipc.send('influx-query', { params });
    ipc.once(
      'influx-query-response',
      (_event: Event, { response, error }: any) => {
        if (error) {
          // console.log('electron error', error);
          reject(error);
        } else {
          resolve(response);
        }
      },
    );
  });
}
