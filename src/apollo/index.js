import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';

import { defaults, resolvers } from './resolvers';

// TODO: extract separate schema.graphql file see server implementation for more info
const typeDefs = `
  type InfluxQuery {
    query: String!
    error: String
  }
  type FormData {
    url: String
    u: String
    p: String
    db: String
    q: String
  }
  type Mutation {
    influxQuery(url: String!, u: String, p: String, db: String, q: String!): Boolean
    updateForm(url: String, u: String, p: String, db: String, q: String): Boolean
  }
  type Query {
    connection: Connection
    form: FormData
    queryHistory: [InfluxQuery]!
  }
`;

const cache = new InMemoryCache();

const linkState = withClientState({ resolvers, defaults, cache, typeDefs });

const client = new ApolloClient({
  cache,
  // some info about links order https://www.apollographql.com/docs/link/links/state.html#start
  link: ApolloLink.from([linkState]),
});

export default client;
