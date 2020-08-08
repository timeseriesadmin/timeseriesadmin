import React, { ReactNode } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo';
import { List, ListItem, Button, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';

const styles = (): any => ({
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
  mutation(
    $url: String!
    $u: String
    $p: String
    $db: String
    $unsafeSsl: Boolean
  ) {
    updateForm(url: $url, u: $u, p: $p, db: $db, unsafeSsl: $unsafeSsl) @client
  }
`;

export const GET_CONNECTIONS = gql`
  {
    connections {
      id
      url
      u
      p
      db
      unsafeSsl
    }
  }
`;

export const DELETE_CONNECTION = gql`
  mutation($id: String!) {
    deleteConnection(id: $id) @client
  }
`;

type Props = {
  classes: any;
};
const Connections = ({ classes }: Props): ReactNode => {
  const { loading, error, data } = useQuery(GET_CONNECTIONS);
  const [deleteConnection] = useMutation(DELETE_CONNECTION);
  const [updateForm] = useMutation(SET_FORM_QUERY);

  const handleDelete = (connectionId: string) => () =>
    deleteConnection({ variables: { id: connectionId } });

  if (loading) {
    return <div className={classes.noList}>Loading...</div>;
  }
  if (!data || !data.connections || data.connections.length === 0) {
    return (
      <div className={classes.noList}>
        No saved connections. <br />
        Add one using SAVE CONNECTION DATA button.
      </div>
    );
  }
  if (error) {
    return <div className={classes.noList}>Error!</div>;
  }
  return (
    <List className={classes.list}>
      {data.connections.map(
        (
          conn: {
            url: string;
            db: string;
            u: string;
            id: string;
            unsafeSsl: boolean;
          },
          index: string | number | undefined,
        ) => (
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
              {conn.unsafeSsl && (
                <Typography
                  variant="body1"
                  color="textSecondary"
                  style={{ fontSize: 12 }}
                >
                  SSL errors ignored
                </Typography>
              )}
            </Button>
            <Button
              className={classes.btnDelete}
              onClick={handleDelete(conn.id)}
              aria-label="Delete"
            >
              <DeleteIcon style={{ fontSize: 18 }} />
            </Button>
          </ListItem>
        ),
      )}
    </List>
  );
};

export default withStyles(styles)(Connections);
