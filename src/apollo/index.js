import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
// import { HttpLink } from 'apollo-link-http';

// import clientStore from './modules';

import { defaults, resolvers } from './resolvers';

// TODO: extract separate schema.graphql file see server implementation for more info
const typeDefs = `
  type FormData {
    url: String
    u: String
    p: String
    db: String
    q: String
  }
  type Results {
    type: String
    data: String
  }
  type Mutation {
    influxQuery(url: String!, u: String, p: String, db: String, q: String!): Boolean
    updateForm(url: String!, u: String, p: String, db: String, q: String!): Boolean
  }
  type Query {
    connection: Connection
    results: Results
    form: FormData
  }
`;

const cache = new InMemoryCache();

const linkState = withClientState({ resolvers, defaults, cache, typeDefs });
// https://github.com/apollographql/apollo-link/tree/master/packages/apollo-link-http
// const httpLink = new HttpLink({ uri: 'http://localhost:4000/api' });

const client = new ApolloClient({
  cache,
  // some info about links order https://www.apollographql.com/docs/link/links/state.html#start
  link: ApolloLink.from([linkState]),//, httpLink]),
});

export default client;
