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
  type Database {
    id: String!
    name: String!
    measurements: [Measurement!]
  }
  type Series {
    id: String!
    name: String!
    tags: String!
    key: String!
  }
  type RetentionPolicy {
    id: String!
    name: String!
    duration: String!
    shardGroupDuration: String!
    replicaN: Int!
    default: Boolean!
  }
  type Measurement {
    id: String!
    name: String!
    fieldKeys: [FieldKey!]
    tagKeys: [TagKey!]
  }
  type FieldKey {
    id: String!
    name: String!
    type: String!
  }
  type TagKey {
    id: String!
    name: String!
  }
  type TagValue {
    id: String!
    name: String!
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
    setOpenDrawer(isOpen: Boolean!): Boolean
    setDrawerWidth(newWidth: Number!): Boolean
    saveConnection(url: String, u: String, p: String, db: String): Boolean
    deleteConnection(id: String!): Boolean
  }
  type Query {
    isOpenDrawer: Boolean
    drawerWidth: Number
    form: FormData
    server: Server
    connections: [Connection]!
    getResultsTable: ResultsTable
  }
`;
