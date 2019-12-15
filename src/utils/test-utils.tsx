import React from 'react';
import { render, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { ApolloProvider } from 'react-apollo';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

function customRender(node: any, options?: any): any {
  const rendered = render(
    options && options.client ? (
      <ApolloProvider client={options.client}>{node}</ApolloProvider>
    ) : options && options.mocks ? (
      <MockedProvider mocks={options.mocks} addTypename={false}>
        {node}
      </MockedProvider>
    ) : (
      node
    ),
    options,
  );

  return {
    ...rendered,
    rerender: (ui: any, options: any) =>
      customRender(ui, { container: rendered.container, ...options }),
  };
}

// custom mocked apollo client
export function setupClient(resolvers: any) {
  const cache = new InMemoryCache();

  const client = new ApolloClient({
    cache,
    resolvers,
    typeDefs: '',
  });

  cache.writeData({
    data: {},
  });

  return client;
}

// it is sometimes required to wait for a while in order to execute Apollo Query or Mutation
export const wait = async (timeout = 0) =>
  act(async () => {
    new Promise(res => setTimeout(res, timeout));
  });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
