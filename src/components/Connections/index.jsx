// @flow
import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { List, ListItem, Button, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  btnConnect: {
    display: 'inline-block',
    textTransform: 'none',
    textAlign: 'left',
    width: 'calc(100% - 36px)',
    borderRadius: 0,
  },
  btnDelete: {
    minWidth: 36,
    width: 36,
  },
  list: {
    padding: 0,
  },
  listItem: {
    padding: 0,
    // paddingTop: 0,
    // paddingBottom: 0,
  },
});

const SET_FORM_QUERY = gql`
  mutation ($url: String!, $u: String, $p: String, $db: String) {
    updateForm(url: $url, u: $u, p: $p, db: $db) @client
  }
`;

const GET_CONNECTIONS = gql`{
  connections @client { id url u p db }
}`;

const DELETE_CONNECTION = gql`
  mutation ($id: String!) {
    deleteConnection(id: $id) @client
  }
`;

type Props = {
  classes: any,
};
const Connections = ({ classes }: Props) => (
  <Query query={GET_CONNECTIONS}>
  {({ loading, error, data }) => (
    <Mutation mutation={DELETE_CONNECTION}>
    {deleteConnection => {
      const handleDelete = (id) => () => {
        deleteConnection({ variables: { id } });
      };
      return (
        <Mutation mutation={SET_FORM_QUERY}>
        {updateForm =>
          loading ?  <div>Loading...</div> 
          : !data || !data.connections || data.connections.length === 0 ?  <div>No data</div>
          : error ? <div>Error!</div>
          : <List className={classes.list}>
            {data.connections.map((conn, index) => (
              <ListItem key={index} className={classes.listItem}>
                <Button className={classes.btnConnect}
                  onClick={() => updateForm({ variables: { ...conn } })}
                >
                  <Typography variant="body1">
                    {conn.url}
                  </Typography>
                  {conn.db &&
                  <Typography variant="body1" color="textSecondary" style={{ fontSize: 12 }}>
                    database: {conn.db}
                  </Typography>
                  }
                  {conn.u &&
                  <Typography variant="body1" color="textSecondary" style={{ fontSize: 12 }}>
                    user: {conn.u}
                  </Typography>
                  }
                </Button>
                <Button className={classes.btnDelete}
                  onClick={handleDelete(conn.id)}
                >
                  <DeleteIcon style={{ fontSize: 18 }}/>
                </Button>
              </ListItem>
            ))}
          </List>
        }
        </Mutation>
      );
    }}
    </Mutation>
  )}
  </Query>
);

export default withStyles(styles)(Connections);
