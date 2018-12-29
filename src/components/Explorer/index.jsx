// @flow
import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Button, ListItem, ListItemText } from '@material-ui/core';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import CollapseIcon from '@material-ui/icons/ExpandLess';
import ExplorerItem from './ExplorerItem';
import ExplorerCollapse from './ExplorerCollapse';
import {
  SHOW_DATABASES,
  SHOW_SERIES,
  SHOW_MEASUREMENTS,
  SHOW_RET_POLICIES,
  SHOW_FIELD_KEYS,
  SHOW_TAG_KEYS,
  SHOW_TAG_VALUES,
} from './queries';
import theme from './theme';

const Explorer = () => (
  <MuiThemeProvider theme={theme}>
    <ExplorerItem
      query={SHOW_DATABASES}
      label="Databases"
      resultsKey="databases"
    >
      {data =>
        data.map((database, index) => (
          <ListItem key={index}>
            <ExplorerCollapse
              renderToggler={(toggle, isExpanded) => (
                <Button
                  size="small"
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  onClick={toggle}
                >
                  {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
                  {database.name}
                </Button>
              )}
            >
              <ExplorerItem
                db={database.id}
                query={SHOW_MEASUREMENTS}
                label="Measurements"
                resultsKey="measurements"
              >
                {data =>
                  data.map((meas, index) => (
                    <ListItem key={index}>
                      <ExplorerCollapse
                        renderToggler={(toggle, isExpanded) => (
                          <Button
                            size="small"
                            aria-label={isExpanded ? 'Collapse' : 'Expand'}
                            onClick={toggle}
                          >
                            {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
                            {meas.name}
                          </Button>
                        )}
                      >
                        <ExplorerItem
                          db={database.id}
                          meas={meas.id}
                          query={SHOW_FIELD_KEYS}
                          label="Field Keys"
                          resultsKey="fieldKeys"
                        >
                          {data =>
                            data.map((fieldKey, index) => (
                              <ListItem key={index}>
                                <ListItemText
                                  primary={fieldKey.name}
                                  secondary={`(${fieldKey.type})`}
                                />
                              </ListItem>
                            ))
                          }
                        </ExplorerItem>
                        <ExplorerItem
                          db={database.id}
                          meas={meas.id}
                          query={SHOW_TAG_KEYS}
                          label="Tag Keys"
                          resultsKey="tagKeys"
                        >
                          {data =>
                            data.map((tagKey, index) => (
                              <ListItem key={index}>
                                <ExplorerCollapse
                                  renderToggler={(toggle, isExpanded) => (
                                    <Button
                                      size="small"
                                      aria-label={
                                        isExpanded ? 'Collapse' : 'Expand'
                                      }
                                      onClick={toggle}
                                    >
                                      {isExpanded ? (
                                        <CollapseIcon />
                                      ) : (
                                        <ExpandIcon />
                                      )}
                                      {tagKey.name}
                                    </Button>
                                  )}
                                >
                                  <ExplorerItem
                                    db={database.id}
                                    meas={meas.id}
                                    tagKey={tagKey.id}
                                    query={SHOW_TAG_VALUES}
                                    label="Tag Values"
                                    resultsKey="tagValues"
                                  >
                                    {data =>
                                      data.map((tagValue, index) => (
                                        <ListItem key={index}>
                                          <ListItemText
                                            primary={tagValue.value}
                                          />
                                        </ListItem>
                                      ))
                                    }
                                  </ExplorerItem>
                                </ExplorerCollapse>
                              </ListItem>
                            ))
                          }
                        </ExplorerItem>
                        <ExplorerItem
                          db={database.id}
                          meas={meas.id}
                          query={SHOW_SERIES}
                          label="Series"
                          resultsKey="series"
                        >
                          {data =>
                            data.map((se, index) => (
                              <ListItem key={index}>
                                <ListItemText
                                  primary={se.key}
                                  secondary={se.tags ? `(${se.tags})` : null}
                                />
                              </ListItem>
                            ))
                          }
                        </ExplorerItem>
                      </ExplorerCollapse>
                    </ListItem>
                  ))
                }
              </ExplorerItem>
              <ExplorerItem
                db={database.id}
                query={SHOW_RET_POLICIES}
                label="Retention Policies"
                resultsKey="policies"
              >
                {data =>
                  data.map((policy, index) => {
                    const description = Object.keys(policy)
                      .filter(k => k !== '__typename')
                      .map(k => `${k}: ${policy[k]}`)
                      .join(', ');
                    return (
                      <ListItem key={index}>
                        <ListItemText
                          primary={policy.name}
                          secondary={description}
                        />
                      </ListItem>
                    );
                  })
                }
              </ExplorerItem>
              <ExplorerItem
                db={database.id}
                query={SHOW_SERIES}
                label="Series"
                resultsKey="series"
              >
                {data =>
                  data.map((se, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={se.key} secondary={se.tags} />
                    </ListItem>
                  ))
                }
              </ExplorerItem>
            </ExplorerCollapse>
          </ListItem>
        ))
      }
    </ExplorerItem>
  </MuiThemeProvider>
);

export default Explorer;
