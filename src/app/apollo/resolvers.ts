import { saveConnection, deleteConnection } from './resolvers/connections';
import { setOpenDrawer, setDrawerWidth } from './resolvers/drawer';
import { updateForm } from './resolvers/form';
import { executeQuery } from './resolvers/executeQuery';

export const resolvers = {
  Mutation: {
    saveConnection,
    deleteConnection,
    setOpenDrawer,
    setDrawerWidth,
    updateForm,
    executeQuery,
  },
};
