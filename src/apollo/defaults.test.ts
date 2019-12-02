describe('defaults', () => {
  test('initial values', () => {
    const defaults = require('./defaults').default;
    expect(defaults).toEqual({
      isOpenDrawer: true,
      drawerWidth: 480,
      queryHistory: [],
      connections: [],
      form: {
        url: '',
        u: '',
        p: '',
        db: '',
        q: '',
        unsafeSsl: false,
        __typename: 'FormData',
      },
      server: null,
      resultsTable: {
        timeFormat: 'timestamp',
        __typename: 'ResultsTable',
      },
    });
  });

  test('queryHistory filtering and providing default values', () => {
    jest.resetModules();
    jest.doMock('../helpers/storage', () => ({
      get: () =>
        '[{},{"query":""},{"something":"test"},{"query":"select","other":"test"}]',
    }));
    const defaults = require('./defaults').default;
    expect(defaults.queryHistory).toEqual([
      { other: 'test', query: 'select', error: '' },
    ]);
  });

  test('connections default values', () => {
    jest.resetModules();
    jest.doMock('../helpers/storage', () => ({
      get: () => '[{"url":"http://test.test"}, {"u":"username","p":"pass"}]',
    }));
    const defaults = require('./defaults').default;
    expect(defaults.connections).toEqual([
      { url: 'http://test.test', u: '', p: '', db: '', unsafeSsl: false },
      { url: '', u: 'username', p: 'pass', db: '', unsafeSsl: false },
    ]);
  });
});
