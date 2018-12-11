import React from 'react';
import { render } from 'react-testing-library';
import { MockedProvider } from 'react-apollo/test-utils';

const customRender = (node, options) => {
  const rendered = render(
    node.props && node.props.mocks ? (
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

// re-export everything
export * from 'react-testing-library';

// override render method
export { customRender as render };
