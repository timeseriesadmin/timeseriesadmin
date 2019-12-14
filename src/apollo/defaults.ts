import storage from '../helpers/storage';

// ensure connection fields existence
const connections = JSON.parse(storage.get('connections', '[]')).map(
  (conn: any) => ({
    url: '',
    u: '',
    p: '',
    db: '',
    unsafeSsl: false,
    ...conn,
  }),
);

const form = {
  q: 'show databases',
  u: 'admin',
  p: 'password',
  url: 'https://localhost:8086',
  db: 'issue3',
  unsafeSsl: false,
  __typename: 'FormData',
  ...JSON.parse(storage.get('form', '{}')),
};

const isOpenDrawer = storage.get('isOpenDrawer', 'true') === 'true';

const initTimeFormat = storage.get('timeFormat', 'timestamp');

export const MIN_DRAWER_WIDTH = 480;
export const MIN_CONTENT_WIDTH = 360;

export default {
  isOpenDrawer,
  drawerWidth: MIN_DRAWER_WIDTH,
  connections,
  form,
  server: null,
  resultsTable: {
    timeFormat: initTimeFormat,
    __typename: 'ResultsTable',
  },
};
