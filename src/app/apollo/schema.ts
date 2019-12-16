// In order to extract schema to separate .graphql file it will be required to alter
// webpack config which is not possible without ejecting or using rewired version of CRA
export default `
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
  type Connection {
    id: String!
    url: String!
    u: String
    p: String
    db: String
    unsafeSsl: Boolean
  }
  type ResultsTable {
    timeFormat: String!
  }
  type Mutation {
    executeQuery(url: String!, u: String, p: String, db: String, q: String!): Boolean
    updateForm(url: String, u: String, p: String, db: String, q: String): Boolean
    saveConnection(url: String, u: String, p: String, db: String): Boolean
    deleteConnection(id: String!): Boolean
  }
  type Query {
    form: FormData
    server: Server
    connections: [Connection]!
  }
`;
