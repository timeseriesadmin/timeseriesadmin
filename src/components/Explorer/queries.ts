import gql from 'graphql-tag';

export const SHOW_DATABASES = gql`
  mutation {
    databases @client {
      id
      name
    }
  }
`;

export const SHOW_SERIES = gql`
  mutation($db: String, $meas: String) {
    series(db: $db, meas: $meas) @client {
      id
      tags
      key
    }
  }
`;

export const SHOW_MEASUREMENTS = gql`
  mutation($db: String) {
    measurements(db: $db) @client {
      id
      name
    }
  }
`;

export const SHOW_RET_POLICIES = gql`
  mutation($db: String) {
    policies(db: $db) @client {
      id
      name
      duration
      shardGroupDuration
      replicaN
      default
    }
  }
`;

export const SHOW_FIELD_KEYS = gql`
  mutation($db: String, $meas: String, $retPol: String) {
    fieldKeys(db: $db, meas: $meas, retPol: $retPol) @client {
      id
      name
      type
    }
  }
`;

export const SHOW_TAG_KEYS = gql`
  mutation($db: String, $meas: String) {
    tagKeys(db: $db, meas: $meas) @client {
      id
      name
    }
  }
`;

export const SHOW_TAG_VALUES = gql`
  mutation($db: String, $meas: String, $tagKey: String) {
    tagValues(db: $db, meas: $meas, tagKey: $tagKey) @client {
      id
      value
    }
  }
`;
