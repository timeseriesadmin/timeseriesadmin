import React from 'react';
import {
  render,
  fireEvent,
  waitForElement,
  setupClient,
  within,
  wait,
} from 'utils/test-utils';

jest.mock('app/helpers/queryBase');
import { queryBase } from 'app/helpers/queryBase';

import PanelExplorer from './PanelExplorer';

const mocks = {
  Query: {
    form: () => ({
      __typename: 'FormData',
      u: 'test',
      p: 'test',
      unsafeSsl: false,
      url: 'http://test.test:8086',
    }),
  },
};

describe('<PanelExplorer />', () => {
  test('rendering when not connected', async () => {
    const mockedResolvers = {
      Query: {
        form: () => null,
      },
    };
    const { getByText, queryByText } = render(<PanelExplorer />, {
      client: setupClient(mockedResolvers),
    });
    await wait();

    expect(getByText('Not connected')).toBeDefined();
    expect(
      getByText(/Use "RUN QUERY" button to connect to a server/),
    ).toBeDefined();

    expect(queryByText('Databases')).toBeNull();
  });
  test('rendering when connected', async () => {
    const { getByText, getByLabelText, queryByText } = render(
      <PanelExplorer />,
      { client: setupClient(mocks) },
    );

    await waitForElement(() => getByText('Connected to http://test.test:8086'));

    // Expanding sections
    (queryBase as jest.Mock<any>).mockReturnValue({
      response: {
        data: [{ name: 'TestDB', tags: '' }],
      },
    });
    fireEvent.click(getByLabelText('Expand Databases'));
    expect(getByText('Loading...')).toBeDefined();
    await waitForElement(() => getByText('TestDB'));

    // refresh
    fireEvent.click(getByLabelText('Refresh'));
    expect(getByText('Loading...')).toBeDefined();
    await waitForElement(() => getByText('TestDB'));

    fireEvent.click(getByLabelText('Expand TestDB'));

    // Series
    (queryBase as jest.Mock<any>).mockReturnValueOnce({
      response: {
        data: [{ name: '', tags: '', key: 'testS,tag1=val1' }],
      },
    });
    fireEvent.click(getByLabelText('Expand Series'));
    expect(getByText('Loading...')).toBeDefined();
    await waitForElement(() => getByText('testS,tag1=val1'));
    fireEvent.click(getByLabelText('Collapse Series'));
    // hide for future tests
    await waitForElement(() => !queryByText('tag1=val1'));

    // RP
    (queryBase as jest.Mock<any>).mockReturnValueOnce({
      response: {
        data: [
          {
            name: 'autogen',
            duration: '168h0m0s',
            default: 'true',
            shardGroupDuration: '168h0m0s',
            replicaN: 'replicaN',
            tags: '',
          },
        ],
      },
    });
    fireEvent.click(getByLabelText('Expand Retention Policies'));
    expect(getByText('Loading...')).toBeDefined();
    await waitForElement(() => getByText('autogen'));
    expect(
      getByText(
        'name: autogen, duration: 168h0m0s, default: true, shardGroupDuration: 168h0m0s, replicaN: replicaN, tags:',
      ),
    ).toBeDefined();

    // Measurements
    (queryBase as jest.Mock<any>).mockReturnValueOnce({
      response: {
        data: [{ name: 'testM', tags: 'tag1' }],
      },
    });
    fireEvent.click(getByLabelText('Expand Measurements'));
    expect(getByText('Loading...')).toBeDefined();
    await waitForElement(() => getByText('testM'));

    fireEvent.click(getByLabelText('Expand testM'));

    // Field Keys (Retention Policies)
    (queryBase as jest.Mock<any>).mockReturnValueOnce({
      response: {
        data: [
          {
            name: 'autogen',
            duration: '168h0m0s',
            default: 'true',
            shardGroupDuration: '168h0m0s',
            replicaN: 'replicaN',
            tags: '',
          },
        ],
      },
    });
    fireEvent.click(getByLabelText('Expand Field Keys (by retention policy)'));
    expect(getByText('Loading...')).toBeDefined();
    await waitForElement(() => getByLabelText('Expand autogen'));

    // Field Keys
    (queryBase as jest.Mock<any>).mockReturnValueOnce({
      response: {
        data: [
          {
            name: 'testM',
            tags: '',
            fieldKey: 'fk1',
            fieldType: 'integer',
          },
          {
            name: 'testM',
            tags: '',
            fieldKey: 'fk2',
            fieldType: 'string',
          },
        ],
      },
    });
    fireEvent.click(getByLabelText('Expand autogen'));
    expect(getByText('Loading...')).toBeDefined();
    await waitForElement(() => getByText('fk1'));
    expect(getByText('(integer)')).toBeDefined();
    expect(getByText('fk2')).toBeDefined();
    expect(getByText('(string)')).toBeDefined();

    // Tag Keys
    (queryBase as jest.Mock<any>).mockReturnValueOnce({
      response: {
        data: [{ name: 'testM', tags: '', tagKey: 'tk1' }],
      },
    });
    fireEvent.click(getByLabelText('Expand Tag Keys'));
    expect(getByText('Loading...')).toBeDefined();
    await waitForElement(() => getByText('tk1'));

    fireEvent.click(getByLabelText('Expand tk1'));

    // Tag Values
    (queryBase as jest.Mock<any>).mockReturnValueOnce({
      response: {
        data: [{ name: 'testM', tags: '', key: 'tk1', value: 'tag_value' }],
      },
    });
    fireEvent.click(getByLabelText('Expand Tag Values'));
    expect(getByText('Loading...')).toBeDefined();
    await waitForElement(() => getByText('tag_value'));

    // Look for measurement specific series
    const measurement = within(getByText('testM').parentNode.parentNode);
    (queryBase as jest.Mock<any>).mockReturnValueOnce({
      response: {
        data: [{ name: '', tags: '', key: 'testX,tag1=val1' }],
      },
    });
    fireEvent.click(measurement.getByLabelText('Expand Series'));
    // loading won't be triggered because of query caching (?)
    expect(measurement.getByText('Loading...')).toBeDefined();
    await waitForElement(() => measurement.getByText('testX,tag1=val1'));
  });
});
