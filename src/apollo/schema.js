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
  type Mutation {
    executeQuery(url: String!, u: String, p: String, db: String, q: String!): Boolean
    updateForm(url: String, u: String, p: String, db: String, q: String): Boolean
		setOpenDrawer(isOpen: Boolean!): Boolean
  }
  type Query {
		isOpenDrawer: Boolean
    form: FormData
    queryHistory: [InfluxQuery!]
  }
`;

const queryHistory = JSON.parse(storage.get('queryHistory', '[]'));
const form = JSON.parse(storage.get('form', JSON.stringify({
	url: '',
	u: '',
	p: '',
	db: '',
	q: '',
	__typename: 'FormData',
})));
const isOpenDrawer = storage.get('isOpenDrawer', 'true') === 'true';

export const defaults = {
	isOpenDrawer,
  queryHistory,
  form,
};
