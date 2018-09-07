// @flow
import React from 'react';
import gql from 'graphql-tag';
import { ListSubheader, Button, Collapse, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import { ErrorOutline as ErrorIcon } from '@material-ui/icons';
import { Query, Mutation } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import ExplorerItem from './ExplorerItem';

const styles = theme => ({
  info: {
    padding: theme.spacing.unit*2,
    paddingBottom: 0,
  },
  btnIcon: {
    color: theme.palette.error.main,
    marginRight: 0,
    fontSize: 18,
    textAlign: 'left',
  },
  listItem: {
		flexDirection: 'column',
  },
	itemContent: {
		width: '100%',
	},
  listItemText: {
    paddingLeft: theme.spacing.unit,
    paddingRight: 0,
  }
});

const SHOW_DATABASES = gql`
  mutation showDatabases {
    databases @client {
      id
      name
    }
  }
`;

const SHOW_SERIES = gql`
  mutation showSeries($db: String, $meas: String) {
    series(db: $db, meas: $meas) @client {
      id
      tags
      key
    }
  }
`;

const SHOW_MEASUREMENTS = gql`
  mutation showMeasurements($db: String) {
    measurements(db: $db) @client {
      id
      name
    }
  }
`;

const SHOW_RET_POLICIES = gql`
  mutation showRetentionPolicies($db: String) {
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

const SHOW_FIELD_KEYS = gql`
  mutation showFieldKeys($db: String, $meas: String) {
    fieldKeys(db: $db, meas: $meas) @client {
        id
        name
        type
    }
  }
`;

const SHOW_TAG_KEYS = gql`
  mutation showTagKeys($db: String, $meas: String) {
    tagKeys(db: $db, meas: $meas) @client {
      id
      name
    }
  }
`;

const SHOW_TAG_VALUES = gql`
  mutation showTagValues($db: String, $meas: String, $tagKey: String) {
    tagValues(db: $db, meas: $meas, tagKey: $tagKey) @client {
      id
      value
    }
  }
`;

type Props = {
  classes: any,
};
const QueryHistory = ({ classes }: Props) => (
  <List>
    <ExplorerItem query={SHOW_DATABASES} label="Databases"
      showData={data => data.databases.map((database, index) => (
      <ListItem key={index}>
        <ListItemText primary={database.name} />
        <List>
          <ExplorerItem db={database.id} query={SHOW_MEASUREMENTS} label="Measurements"
            showData={data => data.measurements.map((meas, index) => (
              <ListItem key={index}>
                <ListItemText primary={meas.name} />
                <List>
                  <ExplorerItem db={database.id} meas={meas.id} query={SHOW_FIELD_KEYS} label="Field Keys"
                    showData={data => data.fieldKeys.map((fieldKey, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={fieldKey.name} secondary={fieldKey.type} />
                      </ListItem>
                    ))} />
                  <ExplorerItem db={database.id} meas={meas.id} query={SHOW_TAG_KEYS} label="Tag Keys"
                    showData={data => data.tagKeys.map((tagKey, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={tagKey.name} />
                        <List>
                          <ExplorerItem db={database.id} meas={meas.id} tagKey={tagKey.id} query={SHOW_TAG_VALUES} label="Tag Values"
                            showData={data => data.tagValues.map((tagValue, index) => (
                              <ListItem key={index}>
                                <ListItemText primary={tagValue.value} />
                              </ListItem>
                            ))} />
                        </List>
                      </ListItem>
                    ))} />
                  <ExplorerItem db={database.id} meas={meas.id} query={SHOW_SERIES}
                    label="Series" showData={data => data.series.map((se, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={se.key} secondary={se.tags} />
                      </ListItem>
                    ))} />
                </List>
              </ListItem>
            ))} />
          <ExplorerItem db={database.id} query={SHOW_RET_POLICIES} label="Retention Policies"
            showData={data => data.policies.map((policy, index) => (
              <ListItem key={index}>
                <ListItemText primary={policy.name} secondary={`duration: ${policy.duration}, shardGroupDuration: ${policy.shardGroupDuration}, replicaN: ${policy.replicaN}, default: ${policy.default}`} />
              </ListItem>
            ))} />
          <ExplorerItem db={database.id} query={SHOW_SERIES} label="Series"
            showData={data => data.series.map((se, index) => (
              <ListItem key={index}>
                <ListItemText primary={se.key} secondary={se.tags} />
              </ListItem>
            ))} />
        </List>
      </ListItem>
    ))} />
</List>
);

export default withStyles(styles)(QueryHistory);
