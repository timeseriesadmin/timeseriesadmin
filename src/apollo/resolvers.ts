import { getLatestVersion } from './resolvers/github';
import {
  databases,
  series,
  policies,
  measurements,
  fieldKeys,
  tagKeys,
  tagValues,
} from './resolvers/explorer';
import { saveConnection, deleteConnection } from './resolvers/connections';
import { setOpenDrawer, setDrawerWidth } from './resolvers/drawer';
import { updateForm } from './resolvers/form';
import { executeQuery } from './resolvers/query';
import { setResultsTable } from './resolvers/results';

export const resolvers = {
  Query: {
    getLatestVersion,
  },
  Mutation: {
    databases,
    series,
    policies,
    measurements,
    fieldKeys,
    tagKeys,
    tagValues,
    saveConnection,
    deleteConnection,
    setOpenDrawer,
    setDrawerWidth,
    updateForm,
    executeQuery,
    setResultsTable,
  },
};
