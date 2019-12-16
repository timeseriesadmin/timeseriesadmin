import React from 'react';
import { render } from 'utils/test-utils';
import { QueryHistoryContext } from 'app/contexts/QueryHistoryContext';

import MainContent from './MainContent';
import Form from './form/Form';
import Results from './results/Results';
jest.mock('./form/Form', () => jest.fn(() => <div></div>));
jest.mock('./results/Results', () => jest.fn(() => <div></div>));

const mocks = [];

const appendHistoryEntry = () => {
  return null;
};

describe('<MainContent />', () => {
  test('rendering', () => {
    render(
      <QueryHistoryContext.Provider value={{ appendHistoryEntry }}>
        <MainContent />
      </QueryHistoryContext.Provider>,
      { mocks },
    );
    expect(Form).toBeCalledTimes(1);
    expect(Results).toBeCalledTimes(1);
  });
});
