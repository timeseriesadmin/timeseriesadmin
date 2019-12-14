describe('defaults', () => {
  test('initial values', () => {
    const defaults = require('./defaults').default;
    expect(defaults).toEqual({
      isOpenDrawer: true,
      drawerWidth: 480,
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
