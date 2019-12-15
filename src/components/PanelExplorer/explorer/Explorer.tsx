import React, { ReactNode } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';

import ExplorerItem from './ExplorerItem';
import ExplorerButton from './ExplorerButton';
import ExplorerCollapse from './ExplorerCollapse';
import theme from './theme';

type Props = { classes: any; form: any };

const styles = (): any => ({
  listItemText: {
    margin: 0,
  },
});

const Explorer: React.FC<Props> = ({ classes, form }: Props) => (
  <MuiThemeProvider theme={theme}>
    <ExplorerItem params={{ ...form, q: 'SHOW DATABASES' }} label="Databases">
      {(data: { name: string; tag: string }[]): ReactNode =>
        data.map(database => (
          <ListItem key={database.name}>
            <ExplorerCollapse
              renderToggler={(toggle, isExpanded): ReactNode => (
                <ExplorerButton
                  label={database.name}
                  toggle={toggle}
                  isExpanded={isExpanded}
                />
              )}
            >
              <ExplorerItem
                params={{ ...form, q: `SHOW MEASUREMENTS ON ${database.name}` }}
                label="Measurements"
              >
                {(data: {}[]): ReactNode =>
                  data.map((measurement: any) => (
                    <ListItem key={measurement.name}>
                      <ExplorerCollapse
                        renderToggler={(toggle, isExpanded): ReactNode => (
                          <ExplorerButton
                            label={measurement.name}
                            toggle={toggle}
                            isExpanded={isExpanded}
                          />
                        )}
                      >
                        <ExplorerItem
                          params={{
                            ...form,
                            q: `SHOW RETENTION POLICIES ON "${database.name}"`,
                          }}
                          label="Field Keys (by retention policy)"
                        >
                          {(data: {}[]): ReactNode =>
                            data.map((retPol: any) => (
                              <ListItem key={retPol.name}>
                                <ExplorerItem
                                  params={{
                                    ...form,
                                    q: `SHOW FIELD KEYS ON "${database.name}" FROM "${retPol.name}"."${measurement.name}"`,
                                  }}
                                  label={retPol.name}
                                  featured={false}
                                >
                                  {(data: {}[]): ReactNode =>
                                    data.map((fieldKey: any) => (
                                      <ListItem key={fieldKey.fieldKey}>
                                        <ListItemText
                                          className={classes.listItemText}
                                          primary={fieldKey.fieldKey}
                                          secondary={`(${fieldKey.fieldType})`}
                                        />
                                      </ListItem>
                                    ))
                                  }
                                </ExplorerItem>
                              </ListItem>
                            ))
                          }
                        </ExplorerItem>
                        <ExplorerItem
                          params={{
                            ...form,
                            q: `SHOW TAG KEYS ON "${database.name}" FROM "${measurement.name}"`,
                          }}
                          label="Tag Keys"
                        >
                          {(data: {}[]): ReactNode =>
                            data.map((tagKey: any) => (
                              <ListItem key={tagKey.tagKey}>
                                <ExplorerCollapse
                                  renderToggler={(
                                    toggle,
                                    isExpanded,
                                  ): ReactNode => (
                                    <ExplorerButton
                                      label={tagKey.tagKey}
                                      toggle={toggle}
                                      isExpanded={isExpanded}
                                    />
                                  )}
                                >
                                  <ExplorerItem
                                    params={{
                                      ...form,
                                      q: `SHOW TAG VALUES ON "${database.name}" FROM "${measurement.name}" WITH KEY = "${tagKey.tagKey}"`,
                                    }}
                                    label="Tag Values"
                                  >
                                    {(data: {}[]): ReactNode =>
                                      data.map((tagValue: any) => (
                                        <ListItem key={tagValue.id}>
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
                          params={{
                            ...form,
                            q: `SHOW SERIES ON "${database.name}" FROM "${measurement.name}"`,
                          }}
                          label="Series"
                        >
                          {(data: {}[]): ReactNode =>
                            data.map((series: any) => (
                              <ListItem key={series.id}>
                                <ListItemText
                                  primary={series.key}
                                  secondary={
                                    series.tags ? `(${series.tags})` : null
                                  }
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
                label="Retention Policies"
                params={{
                  ...form,
                  q: `SHOW RETENTION POLICIES ON "${database.name}"`,
                }}
              >
                {(data: {}[]): ReactNode =>
                  data.map((policy: any) => {
                    const description = Object.keys(policy)
                      .map(k => `${k}: ${policy[k]}`)
                      .join(', ');
                    return (
                      <ListItem key={policy.name}>
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
                label="Series"
                params={{ ...form, q: `SHOW SERIES ON "${database.name}"` }}
              >
                {(data: {}[]): ReactNode =>
                  data.map((series: any) => (
                    <ListItem key={series.id}>
                      <ListItemText
                        primary={series.key}
                        secondary={series.tags}
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
  </MuiThemeProvider>
);

export default withStyles(styles)(Explorer);
