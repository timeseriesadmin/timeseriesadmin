import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';

import { resolvers } from './resolvers';
import typeDefs from './schema';
import defaults from './defaults';

const cache = new InMemoryCache();

const linkState = withClientState({ resolvers, defaults, cache, typeDefs });

const client = new ApolloClient({
  cache,
  // some info about links order https://www.apollographql.com/docs/link/links/state.html#start
  link: ApolloLink.from([linkState]),
});

export default client;
