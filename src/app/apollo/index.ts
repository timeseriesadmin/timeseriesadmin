import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { resolvers } from './resolvers';
import typeDefs from './schema';
import defaults from './defaults';

const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  resolvers: resolvers || {},
  typeDefs,
});

cache.writeData({
  data: defaults,
});

export default client;
