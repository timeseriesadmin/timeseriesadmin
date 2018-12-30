// @flow
import gql from 'graphql-tag';
import storage from '../../helpers/storage';

import type { FormParams } from './form';

export const saveConnection = (
  _obj: void,
  { url, u, p, db }: FormParams,
  { cache }: any,
): null => {
  let { connections } = cache.readQuery({
    query: gql`
      {
        connections @client {
          id
          url
          u
          p
          db
        }
      }
    `,
  });
  if (!connections) {
    // initialize if empty
    connections = [];
  }

  const connection = {
    url,
    u,
    p,
    db,
    id: `${url}${u || '_'}${db || '_'}`,
    __typename: 'Connection',
  };

  const id = connections.findIndex(c => c.id === connection.id);
  if (id < 0) {
    connections.push(connection);
  } else {
    connections[id] = connection;
  }

  storage.set('connections', JSON.stringify(connections));
  cache.writeData({
    data: {
      connections,
    },
  });

  // it is important to return anything e.g. null (in other case you will see a warning)
  return null;
};
export const deleteConnection = (
  _obj: void,
  { id }: { id: string },
  { cache }: any,
): null => {
  let { connections } = cache.readQuery({
    query: gql`
      {
        connections @client {
          id
          url
          u
          p
          db
        }
      }
    `,
  });
  if (!connections) {
    // initialize if empty
    connections = [];
  }

  const index = connections.findIndex(c => c.id === id);
  if (index < 0) {
    // TODO: maybe report an error?
  } else {
    connections.splice(index, 1);
  }

  storage.set('connections', JSON.stringify(connections));
  cache.writeData({
    data: {
      connections,
    },
  });

  return null;
};
