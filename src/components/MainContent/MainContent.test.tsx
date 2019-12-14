import React from 'react';
import { render } from 'utils/test-utils';

import MainContent from './MainContent';
import FormInflux from './form/Form';
import QueryResults from './results/Results';
jest.mock('../FormInflux', () => jest.fn(() => <div></div>));
jest.mock('../QueryResults', () => jest.fn(() => <div></div>));

const mocks = [
  {
    request: {
      query: FORM_QUERY,
    },
  },
  {
    request: {
      query: UPDATE_FORM,
    },
  },
];

describe('<MainContent />', () => {
  test('rendering', () => {
    render(<MainContent />, { mocks });
    expect(FormInflux).toBeCalledTimes(1);
    expect(QueryResults).toBeCalledTimes(1);
  });

  // test('onSubmit()', () => {
  //   render(<MainContent mocks={mocks} />);
  //   FormInflux.mock.calls[0][0].onSubmit({ val1: 'test1', val2: 'test2' });
  //   // TODO: expect formMutate and executeQuery calls
  // });
});
