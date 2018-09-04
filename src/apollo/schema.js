import storage from '../helpers/storage';

// In order to extract schema to separate .graphql file it will be required to alter
// webpack config which is not possible without ejecting or using rewired version of CRA
export const typeDefs = `
  type InfluxQuery {
    query: String
    error: String
  }
  type FormData {
    url: String
    u: String
    p: String
    db: String
    q: String
  }
  type Server {
    id: String!
    databases: [Database!]
  }
  type Database {
    id: String!
    name: String!
    measurements: [Measurement!]
  }
  type Measurement {
    id: String!
    name: String!
    fieldKeys: [FieldKey!]
    fieldTags: [FieldTag!]
  }
  type FieldKey {
    id: String!
    name: String!
    type: String!
  }
  type FieldTag {
    id: String!
    name: String!
  }
  type Mutation {
    executeQuery(url: String!, u: String, p: String, db: String, q: String!): Boolean
    updateForm(url: String, u: String, p: String, db: String, q: String): Boolean
		setOpenDrawer(isOpen: Boolean!): Boolean
  }
  type Query {
		isOpenDrawer: Boolean
    form: FormData
    queryHistory: [InfluxQuery!]
    server: Server
  }
`;

// TODO: prevent adding history with no query instead of filtering on init
const queryHistory = JSON.parse(storage.get('queryHistory', '[]')).filter(hist => hist.query);
const form = JSON.parse(storage.get('form', JSON.stringify({
	url: '',
	u: '',
	p: '',
	db: '',
	q: '',
	__typename: 'FormData',
})));
const isOpenDrawer = storage.get('isOpenDrawer', 'true') === 'true';
const server = {
  __typename: 'Server',
  id: 'test@test.com:8086',
  name: 'test@test.com:8086',
  databases: [
    {
      __typename: 'Database',
      id: 'testDB',
      name: 'testDB',
      measurements: [
        {
          __typename: 'Measurement',
          id: 'testMeas',
          name: 'testMeas',
          fieldKeys: [
            {
              __typename: 'FieldKey',
              id: 'testFK',
              name: 'testFK',
              type: 'float',
            }
          ],
          fieldTags: [
            {
              __typename: 'FieldTag',
              id: 'testFT',
              name: 'testFT',
            }
          ],
        },
      ],
    },
  ],
};//JSON.parse(storage.get('explorer', null));

export const defaults = {
	isOpenDrawer,
  queryHistory,
  form,
  server,
};
