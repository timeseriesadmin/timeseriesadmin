import { app, shell, BrowserWindow, ipcMain, Menu } from 'electron';
import https from 'https';
import { commonError } from './shared/commonError';
import { influxRequest } from './shared/influxRequest';

jest.mock('electron', () => ({
  app: {
    on: jest.fn(),
  },
  ipcMain: {
    on: jest.fn(),
  },
}));
jest.mock('https');
jest.mock('./shared/influxRequest');
jest.mock('./shared/commonError');

// import './electron';

describe('electron', () => {
  test('initialization/bootstrap', async () => {
    // given
    require('./electron');

    // then
    expect((app.on as jest.Mock<any>).mock.calls[0][0]).toBe('ready');
    expect((app.on as jest.Mock<any>).mock.calls[1][0]).toBe(
      'window-all-closed',
    );
    expect((app.on as jest.Mock<any>).mock.calls[2][0]).toBe('activate');
    expect((ipcMain.on as jest.Mock<any>).mock.calls[0][0]).toBe(
      'influx-query',
    );
  });
});
