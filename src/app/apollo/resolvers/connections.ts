import { getConnections, updateConnections } from '../helpers/connections';

import { FormParams } from './form';

export const saveConnection = (
  _obj: void,
  { url, u, p, db }: FormParams,
  { cache }: any,
): null => {
  const connections = getConnections(cache);
  const connection = {
    url,
    u,
    p,
    db,
    id: `${url}${u || '_'}${db || '_'}`,
    __typename: 'Connection',
  };

  const id = connections.findIndex(
    (c: { id: string }) => c.id === connection.id,
  );
  if (id < 0) {
    connections.push(connection);
  } else {
    connections[id] = connection;
  }

  updateConnections(cache, connections);

  // it is important to return anything e.g. null (in other case you will see a warning)
  return null;
};

export const deleteConnection = (
  _obj: void,
  { id }: { id: string },
  { cache }: any,
): null => {
  const connections = getConnections(cache);

  const index = connections.findIndex((c: { id: string }) => c.id === id);
  if (index < 0) {
    // TODO: maybe report an error?
  } else {
    connections.splice(index, 1);
  }

  updateConnections(cache, connections);

  // it is important to return anything e.g. null (in other case you will see a warning)
  return null;
};
