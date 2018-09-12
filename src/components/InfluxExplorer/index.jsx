// @flow
import React from 'react';
import gql from 'graphql-tag';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Button, ListItem, ListItemText } from '@material-ui/core';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import CollapseIcon from '@material-ui/icons/ExpandLess';
import { withStyles } from '@material-ui/core/styles';
import ExplorerItem from './ExplorerItem';
import ExplorerCollapse from './ExplorerCollapse';

const theme = createMuiTheme({
  overrides: {
    MuiSvgIcon: {
      root: {
        marginRight: 3,
        fontSize: 18,
      },
    },
    MuiButton: {
      label: {
        paddingRight: 8,
      },
      sizeSmall: {
        paddingTop: 0,
        paddingBottom: 0,
        minHeight: 26,
      },
    },
    MuiCollapse: {
      wrapper: {
        paddingLeft: 20,
      },
    },
    MuiList: {
      padding: {
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
    MuiListItem: {
      gutters: {
        padding: 0,
        flexDirection: 'column',
        alignItems: 'flex-start',
        '@media (min-width: 600px)': {
          padding: 0,
        },
      },
    },
    MuiListItemText: {
      primary: {
        display: 'inline-block',
        fontSize: 14,
        marginRight: 8,
      },
      secondary: {
        display: 'inline-block',
        fontSize: 12,
      }
    },
  },
});

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
  }
});

const SHOW_DATABASES = gql`
  mutation {
    databases @client {
      id
      name
    }
  }
`;

const SHOW_SERIES = gql`
  mutation ($db: String, $meas: String) {
    series(db: $db, meas: $meas) @client {
      id
      tags
      key
    }
  }
`;

const SHOW_MEASUREMENTS = gql`
  mutation ($db: String) {
    measurements(db: $db) @client {
      id
      name
    }
  }
`;

const SHOW_RET_POLICIES = gql`
  mutation ($db: String) {
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
  mutation ($db: String, $meas: String) {
    fieldKeys(db: $db, meas: $meas) @client {
        id
        name
        type
    }
  }
`;

const SHOW_TAG_KEYS = gql`
  mutation ($db: String, $meas: String) {
    tagKeys(db: $db, meas: $meas) @client {
      id
      name
    }
  }
`;

const SHOW_TAG_VALUES = gql`
  mutation ($db: String, $meas: String, $tagKey: String) {
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
<MuiThemeProvider theme={theme}>
  <div className={classes.root}>
  <ExplorerItem query={SHOW_DATABASES} label="Databases" resultsKey="databases">
    {data => data.map((database, index) => (
      <ListItem key={index}>
        <ExplorerCollapse renderToggler={(toggle, isExpanded) => (
          <Button size="small" aria-label={isExpanded ? "Collapse" : "Expand"} onClick={toggle}>
            {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
            {database.name}
          </Button>
        )}>
        <ExplorerItem db={database.id} query={SHOW_MEASUREMENTS}
          label="Measurements" resultsKey="measurements">
            {data => data.map((meas, index) => (
              <ListItem key={index}>
                <ExplorerCollapse renderToggler={(toggle, isExpanded) => (
                  <Button size="small" aria-label={isExpanded ? "Collapse" : "Expand"} onClick={toggle}>
                    {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
                    {meas.name}
                  </Button>
                )}>
                  <ExplorerItem db={database.id} meas={meas.id} query={SHOW_FIELD_KEYS}
                    label="Field Keys" resultsKey="fieldKeys">
                    {data => data.map((fieldKey, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={fieldKey.name} secondary={`(${fieldKey.type})`} />
                      </ListItem>
                    ))}
                  </ExplorerItem>
                  <ExplorerItem db={database.id} meas={meas.id} query={SHOW_TAG_KEYS}
                    label="Tag Keys" resultsKey="tagKeys">
                    {data => data.map((tagKey, index) => (
                      <ListItem key={index}>
                        <ExplorerCollapse renderToggler={(toggle, isExpanded) => (
                          <Button size="small" aria-label={isExpanded ? "Collapse" : "Expand"} onClick={toggle}>
                            {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
                            {tagKey.name}
                          </Button>
                        )}>
                          <ExplorerItem db={database.id} meas={meas.id} tagKey={tagKey.id}
                            query={SHOW_TAG_VALUES} label="Tag Values" resultsKey="tagValues">
                            {data => data.map((tagValue, index) => (
                              <ListItem key={index}>
                                <ListItemText primary={tagValue.value} />
                              </ListItem>
                            ))}
                          </ExplorerItem>
                        </ExplorerCollapse>
                      </ListItem>
                    ))}
                  </ExplorerItem>
                  <ExplorerItem db={database.id} meas={meas.id} query={SHOW_SERIES}
                    label="Series" resultsKey="series">
                    {data => data.map((se, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={se.key} secondary={se.tags ? `(${se.tags})` : null} />
                      </ListItem>
                    ))}
                  </ExplorerItem>
                </ExplorerCollapse>
              </ListItem>
            ))}
          </ExplorerItem>
          <ExplorerItem db={database.id} query={SHOW_RET_POLICIES}
            label="Retention Policies" resultsKey="policies">
            {data => data.map((policy, index) => {
              const description = Object.keys(policy)
                .filter(k => k !== '__typename')
                .map(k => `${k}: ${policy[k]}`)
                .join(', ');
              return (
                <ListItem key={index}>
                  <ListItemText primary={policy.name} secondary={description} />
                </ListItem>
              );
            })}
          </ExplorerItem>
          <ExplorerItem db={database.id} query={SHOW_SERIES} label="Series" resultsKey="series">
            {data => data.map((se, index) => (
              <ListItem key={index}>
                <ListItemText primary={se.key} secondary={se.tags} />
              </ListItem>
            ))}
          </ExplorerItem>
        </ExplorerCollapse>
      </ListItem>
    ))}
  </ExplorerItem>
  </div>
</MuiThemeProvider>
);

export default withStyles(styles)(QueryHistory);
