import React, { useContext } from 'react';
import gql from 'graphql-tag';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme,
} from '@material-ui/core';
import { ErrorOutline as ErrorIcon } from '@material-ui/icons';
import { Mutation } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import { QueryHistoryContext } from 'app/contexts/QueryHistoryContext';
import { HistoryEntry } from 'types/HistoryEntry';

const styles = (theme: Theme): any => ({
  btnIcon: {
    color: theme.palette.error.main,
    marginRight: 0,
    fontSize: 18,
    textAlign: 'left',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  listIcon: {
    minWidth: 0,
  },
  listItemText: {
    paddingLeft: theme.spacing(),
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

type Props = {
  classes: any;
};
// TODO: display Error details somehow, not with a Tooltip because of performance issues when there are 100 Tooltips...
const QueryHistory = ({ classes }: Props) => {
  const { queryHistory } = useContext<QueryHistoryContext>(QueryHistoryContext);

  return (
    <Mutation mutation={SET_FORM_QUERY}>
      {(setFormQuery: (arg0: { variables: { query: string } }) => void) => {
        const handleQueryClick = (query: string) => () => {
          setFormQuery({ variables: { query } });
        };
        if (!queryHistory || queryHistory.length === 0) {
          return (
            <div className={classes.noList}>
              Query history is empty.
              <br />
              Execute your first query using <a href="#influx-q">Query form</a>
            </div>
          );
        }
        return (
          <List dense>
            {queryHistory.map(
              (entry: HistoryEntry, index: string | number | undefined) => (
                <ListItem
                  button
                  disableGutters
                  className={classes.listItem}
                  key={index}
                  onClick={handleQueryClick(entry.query)}
                >
                  {entry.error !== null && (
                    <ListItemIcon className={classes.listIcon}>
                      <ErrorIcon
                        aria-label="Invalid query"
                        color="error"
                        className={classes.btnIcon}
                      />
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primary={entry.query}
                    className={classes.listItemText}
                  />
                </ListItem>
              ),
            )}
          </List>
        );
      }}
    </Mutation>
  );
};

export default withStyles(styles)(QueryHistory);
