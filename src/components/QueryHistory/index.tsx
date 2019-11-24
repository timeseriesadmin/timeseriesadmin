import React from 'react';
import gql from 'graphql-tag';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme,
} from '@material-ui/core';
import { ErrorOutline as ErrorIcon } from '@material-ui/icons';
import { Query, Mutation } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme: Theme): any => ({
  btnIcon: {
    color: theme.palette.error.main,
    marginRight: 0,
    fontSize: 18,
    textAlign: 'left',
  },
  listItem: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  listItemText: {
    paddingLeft: theme.spacing.unit,
    paddingRight: 0,
  },
  noList: {
    paddingTop: 8,
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 14,
  },
});

const SET_FORM_QUERY = gql`
  mutation updateForm($query: String!) {
    updateForm(q: $query) @client
  }
`;

const GET_HISTORY = gql`
  {
    queryHistory @client {
      query
      error
    }
  }
`;
type Props = {
  classes: any;
};
// TODO: display Error details somehow, not with a Tooltip because of performance issues when there are 100 Tooltips...
const QueryHistory = ({ classes }: Props) => (
  <Query query={GET_HISTORY}>
    {({ data }: any) => (
      <Mutation mutation={SET_FORM_QUERY}>
        {(setFormQuery: (arg0: { variables: { query: string } }) => void) => {
          const handleQueryClick = (query: string) => () => {
            setFormQuery({ variables: { query } });
          };
          // $FlowFixMe
          if (!data || !data.queryHistory || data.queryHistory.length === 0) {
            return (
              <div className={classes.noList}>
                Query history is empty.
                <br />
                Execute your first query using{' '}
                <a href="#influx-q">Query form</a>
              </div>
            );
          }
          return (
            <List dense>
              {data.queryHistory.map(
                (
                  executeQuery: { query: string; error: null },
                  index: string | number | undefined,
                ) => (
                  <ListItem
                    button
                    disableGutters
                    className={classes.listItem}
                    key={index}
                    onClick={handleQueryClick(executeQuery.query)}
                  >
                    {executeQuery.error !== null && (
                      <ListItemIcon>
                        <ErrorIcon
                          aria-label="Invalid query"
                          color="error"
                          className={classes.btnIcon}
                        />
                      </ListItemIcon>
                    )}
                    <ListItemText
                      primary={executeQuery.query}
                      className={classes.listItemText}
                    />
                  </ListItem>
                ),
              )}
            </List>
          );
        }}
      </Mutation>
    )}
  </Query>
);

export default withStyles(styles)(QueryHistory);
