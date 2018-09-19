// @flow
import React from 'react';
import gql from 'graphql-tag';
import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import { ErrorOutline as ErrorIcon } from '@material-ui/icons';
import { Query, Mutation } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';

import { HISTORY_MAX_LENGTH } from '../../apollo/resolvers';

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
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing.unit*2,
    paddingRight: theme.spacing.unit*2,
  },
  listItemText: {
    paddingLeft: theme.spacing.unit,
    paddingRight: 0,
  }
});

const SET_FORM_QUERY = gql`
  mutation updateForm($query: String!) {
    updateForm(q: $query) @client
  }
`;

const GET_HISTORY = gql`
  query queryHistory {
    queryHistory {
      query
      error
    }
  }
`;
type Props = {
  classes: any,
};
// TODO: display Error details somehow, not with a Tooltip because of performance issues when there are 100 Tooltips...
const QueryHistory = ({ classes }: Props) => (
  <Query query={GET_HISTORY}>
  {({ loading, error, data }) => (
    <Mutation mutation={SET_FORM_QUERY}>
    {(setFormQuery, mutateState) => {
      const handleQueryClick = (query: string) => (event: Event) => {
        setFormQuery({ variables: { query } });
      };
      // $FlowFixMe
      if (!data || !data.queryHistory) return null;
      return (
        <div className={classes.root}>
          <Typography variant="body1" className={classes.info}>
            List of most recent queries executed, with max length of {HISTORY_MAX_LENGTH} items.
          </Typography>
          <List dense>
            {data.queryHistory.map((executeQuery, index) => (
              <ListItem button disableGutters
                className={classes.listItem}
                key={index}
                onClick={handleQueryClick(executeQuery.query)}
              >
                {executeQuery.error !== null &&
                <ListItemIcon>
                  <ErrorIcon color="error" className={classes.btnIcon}/>
                </ListItemIcon>
                }
                <ListItemText primary={executeQuery.query}
                  className={classes.listItemText}
                />
              </ListItem>
            ))}
          </List>
        </div>
      );
    }}
    </Mutation>
  )}
  </Query>
);

export default withStyles(styles)(QueryHistory);
