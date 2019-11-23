import React from 'react';
import { render } from 'react-testing-library';
import { MockedProvider } from 'react-apollo/test-utils';
import { ApolloProvider } from 'react-apollo';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';

const customRender = (node, options) => {
  const rendered = render(
    node.props && node.props.client ? (
      <ApolloProvider client={node.props.client}>{node}</ApolloProvider>
    ) : node.props && node.props.mocks ? (
      <MockedProvider mocks={node.props.mocks} addTypename={false}>
        {node}
      </MockedProvider>
    ) : (
      node
    ),
    options,
  );
  return {
    ...rendered,
    rerender: (ui, options) =>
      customRender(ui, { container: rendered.container, ...options }),
  };
};

// custom mocked apollo client
export const setupClient = resolvers => {
  const cache = new InMemoryCache();

  const linkState = withClientState({
    resolvers,
    defaults: {},
    cache,
    typeDefs: '',
  });

  const client = new ApolloClient({
    cache,
    // mocks are provided as link state resolvers
    link: ApolloLink.from([linkState]),
  });

  return client;
};

// it is sometimes required to wait for a while in order to execute Apollo Query or Mutation
export const wait = async (timeout = 0) =>
  new Promise(res => setTimeout(res, timeout));

// re-export everything
export * from 'react-testing-library';

// override render method
export { customRender as render };
