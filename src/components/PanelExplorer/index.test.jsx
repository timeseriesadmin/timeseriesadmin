import React from 'react';
import {
  render,
  fireEvent,
  waitForElement,
  setupClient,
  within,
} from 'test-utils';

import PanelExplorer from './index';

const mocks = {
  Query: {
    form: () => ({ __typename: 'FormData', url: 'http://test.test:8086' }),
  },
  Mutation: {
    databases: () => [{ __typename: 'Database', id: 'TestDB', name: 'TestDB' }],
    series: () => [
      { __typename: 'Series', id: 'testS', key: 'testS', tags: 'tag1=val1' },
      {
        __typename: 'Series',
        id: 'testS_noTags',
        key: 'testS_noTags',
        tags: '',
      },
    ],
    measurements: () => [
      { __typename: 'Measurement', name: 'testM', id: 'testM' },
    ],
    policies: () => [
      {
        __typename: 'RetentionPolicy',
        name: 'autogen',
        id: 'autogen',
        duration: '720h0m0s',
        shardGroupDuration: '168h0m0s',
        replicaN: 1,
        default: true,
      },
    ],
    fieldKeys: () => [
      { __typename: 'FieldKey', id: 'fk1', name: 'fk1', type: 'integer' },
      { __typename: 'FieldKey', id: 'fk2', name: 'fk2', type: 'string' },
    ],
    tagKeys: () => [{ __typename: 'TagKey', id: 'tk1', name: 'tk1' }],
    tagValues: () => [
      { __typename: 'TagValue', id: 'tag_value', value: 'tag_value' },
    ],
  },
};

describe('<PanelExplorer />', () => {
  test('rendering when not connected', () => {
    const mockedResolvers = {
      Query: {
        form: () => null,
      },
    };
    const { getByText, queryByText } = render(
      <PanelExplorer client={setupClient(mockedResolvers)} />,
    );
    expect(getByText('Not connected')).toBeDefined();
    expect(
      getByText(/Use "RUN QUERY" button to connect to a server/),
    ).toBeDefined();

    expect(queryByText('Databases')).toBeNull();
  });
  test('rendering when connected', async () => {
    const { getByText, getByLabelText, queryByText } = render(
      <PanelExplorer client={setupClient(mocks)} />,
    );

    await waitForElement(() => getByText('Connected to http://test.test:8086'));

    // Expanding sections
    fireEvent.click(getByText('Databases'));
    expect(getByText('Loading...')).toBeDefined();
    await waitForElement(() => getByText('TestDB'));

    // refresh
    fireEvent.click(getByLabelText('Refresh'));
    expect(getByText('Loading...')).toBeDefined();
    await waitForElement(() => getByText('TestDB'));

    fireEvent.click(getByText('TestDB'));

    // Series
    fireEvent.click(getByText('Series'));
    expect(getByText('Loading...')).toBeDefined();
    await waitForElement(() => getByText('testS'));
    expect(getByText('tag1=val1')).toBeDefined();
    fireEvent.click(getByText('Series'));
    // hide for future tests
    await waitForElement(() => !queryByText('tag1=val1'));

    // RP
    fireEvent.click(getByText('Retention Policies'));
    expect(getByText('Loading...')).toBeDefined();
    await waitForElement(() => getByText('autogen'));
    expect(
      getByText(
        'id: autogen, name: autogen, duration: 720h0m0s, ' +
          'shardGroupDuration: 168h0m0s, replicaN: 1, default: true',
      ),
    ).toBeDefined();

    // Measurements
    fireEvent.click(getByText('Measurements'));
    expect(getByText('Loading...')).toBeDefined();
    await waitForElement(() => getByText('testM'));

    fireEvent.click(getByText('testM'));

    fireEvent.click(getByText('Field Keys'));
    expect(getByText('Loading...')).toBeDefined();
    await waitForElement(() => getByText('fk1'));
    expect(getByText('(integer)')).toBeDefined();
    expect(getByText('fk2')).toBeDefined();
    expect(getByText('(string)')).toBeDefined();

    fireEvent.click(getByText('Tag Keys'));
    expect(getByText('Loading...')).toBeDefined();
    await waitForElement(() => getByText('tk1'));

    fireEvent.click(getByText('tk1'));

    fireEvent.click(getByText('Tag Values'));
    expect(getByText('Loading...')).toBeDefined();
    await waitForElement(() => getByText('tag_value'));

    // Look for measurement specific series
    const { getByText: byText } = within(
      getByText('testM').parentNode.parentNode,
    );
    fireEvent.click(byText('Series'));
    // loading won't be triggered because of query caching (?)
    // expect(byText('Loading...')).toBeDefined();
    await waitForElement(() => byText('testS'));
    expect(byText('(tag1=val1)')).toBeDefined();
  });
});
