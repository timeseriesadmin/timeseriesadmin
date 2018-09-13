// @flow
import React from 'react';
import gql from 'graphql-tag';
import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import { ErrorOutline as ErrorIcon } from '@material-ui/icons';
import { Query, Mutation } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';

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
const PanelConnections = ({ classes }: Props) => (
  <div></div>
);

export default withStyles(styles)(PanelConnections);
