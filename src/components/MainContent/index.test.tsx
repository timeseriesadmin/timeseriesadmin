import React from 'react';
import { render } from 'utils/test-utils';

import MainContent, { FORM_QUERY, UPDATE_FORM } from './index';
import FormInflux from '../FormInflux';
import QueryResults from '../QueryResults';
jest.mock('../FormInflux');
jest.mock('../QueryResults');

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
