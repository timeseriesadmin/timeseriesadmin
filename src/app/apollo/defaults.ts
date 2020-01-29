import storage from 'app/helpers/storage';

// ensure connection fields existence
const connections = JSON.parse(storage.get('connections', '[]')).map(
  (conn: {}) => ({
    url: '',
    u: '',
    p: '',
    db: '',
    unsafeSsl: false,
    ...conn,
  }),
);

const form = {
  q: '',
  u: '',
  p: '',
  url: '',
  db: '',
  unsafeSsl: false,
  __typename: 'FormData',
  ...JSON.parse(storage.get('form', '{}')),
};

export const MIN_DRAWER_WIDTH = 480;
export const MIN_CONTENT_WIDTH = 360;

export default {
  connections,
  form,
  server: null,
};
