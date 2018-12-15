import React from 'react';
import { render } from 'test-utils';

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
    render(<MainContent mocks={mocks} />);
    expect(FormInflux).toBeCalledTimes(1);
    expect(QueryResults).toBeCalledTimes(1);
  });
  // TODO: more tests needed (e.g. submit handling)
});
