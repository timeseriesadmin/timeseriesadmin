// @flow
import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { List, ListItem, Button, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';

import type { QueryRenderProps } from 'react-apollo';

const styles = theme => ({
  btnConnect: {
    display: 'inline-block',
    textTransform: 'none',
    textAlign: 'left',
    width: 'calc(100% - 36px)',
    borderRadius: 0,
    paddingLeft: 20,
  },
  btnDelete: {
    minWidth: 36,
    width: 36,
  },
  list: {
    padding: 0,
  },
  noList: {
    paddingTop: 8,
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 14,
  },
  listItem: {
    padding: 0,
    // paddingTop: 0,
    // paddingBottom: 0,
  },
});

export const SET_FORM_QUERY = gql`
  mutation($url: String!, $u: String, $p: String, $db: String) {
    updateForm(url: $url, u: $u, p: $p, db: $db) @client
  }
`;

export const GET_CONNECTIONS = gql`
  {
    connections @client {
      id
      url
      u
      p
      db
    }
  }
`;

export const DELETE_CONNECTION = gql`
  mutation($id: String!) {
    deleteConnection(id: $id) @client
  }
`;

type Props = {
  classes: any,
};
const Connections = ({ classes }: Props) => (
  <Query query={GET_CONNECTIONS}>
    {({ loading, error, data }: QueryRenderProps<{ connections: any[] }>) => (
      <Mutation mutation={DELETE_CONNECTION}>
        {deleteConnection => (
          <Mutation mutation={SET_FORM_QUERY}>
            {updateForm =>
              loading ? (
                <div className={classes.noList}>Loading...</div>
              ) : !data ||
                !data.connections ||
                data.connections.length === 0 ? (
                <div className={classes.noList}>
                  No saved connections. <br />
                  Add one using SAVE CONNECTION DATA button.
                </div>
              ) : error ? (
                <div className={classes.noList}>Error!</div>
              ) : (
                <List className={classes.list}>
                  {data.connections.map((conn, index) => (
                    <ListItem key={index} className={classes.listItem}>
                      <Button
                        className={classes.btnConnect}
                        onClick={() => updateForm({ variables: { ...conn } })}
                      >
                        <Typography variant="body1">{conn.url}</Typography>
                        {conn.db && (
                          <Typography
                            variant="body1"
                            color="textSecondary"
                            style={{ fontSize: 12 }}
                          >
                            database: {conn.db}
                          </Typography>
                        )}
                        {conn.u && (
                          <Typography
                            variant="body1"
                            color="textSecondary"
                            style={{ fontSize: 12 }}
                          >
                            user: {conn.u}
                          </Typography>
                        )}
                      </Button>
                      <Button
                        className={classes.btnDelete}
                        onClick={() =>
                          deleteConnection({ variables: { id: conn.id } })
                        }
                        aria-label="Delete"
                      >
                        <DeleteIcon style={{ fontSize: 18 }} />
                      </Button>
                    </ListItem>
                  ))}
                </List>
              )
            }
          </Mutation>
        )}
      </Mutation>
    )}
  </Query>
);

export default withStyles(styles)(Connections);
