import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Typography from '@material-ui/core/Typography';
import { withStyles, Theme } from '@material-ui/core/styles';
import Explorer from '../Explorer';

const styles = (theme: Theme): any => ({
  root: {
    paddingTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
  },
  info: {
    padding: theme.spacing.unit * 2,
    paddingBottom: 0,
  },
  noList: {
    paddingTop: 8,
    paddingLeft: 0,
    paddingRight: 16,
    fontSize: 14,
  },
});

type Props = {
  classes: any;
};
const PanelExplorer = ({ classes }: Props) => (
  <Query query={GET_SERVER}>
    {({ data }: any) => (
      <div>
        <Typography variant="body1" className={classes.info}>
          {data && data.form && data.form.url
            ? `Connected to ${data.form.url}`
            : 'Not connected'}
        </Typography>
        <div className={classes.root}>
          {data && data.form && data.form.url ? (
            <Explorer />
          ) : (
            <div className={classes.noList}>
              Use "RUN QUERY" button to connect to a server,
              <br />
              or select one from "CONNECT" panel.
            </div>
          )}
        </div>
      </div>
    )}
  </Query>
);

const GET_SERVER = gql`
  {
    form @client {
      url
    }
  }
`;

export default withStyles(styles)(PanelExplorer);
