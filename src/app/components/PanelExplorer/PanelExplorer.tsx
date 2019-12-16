import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Typography from '@material-ui/core/Typography';
import { withStyles, Theme } from '@material-ui/core/styles';
import Explorer from './explorer/Explorer';

const styles = (theme: Theme): any => ({
  root: {
    paddingTop: theme.spacing(),
    paddingLeft: theme.spacing(2),
  },
  info: {
    padding: theme.spacing(2),
    paddingBottom: 0,
  },
  noList: {
    paddingTop: 8,
    paddingLeft: 0,
    paddingRight: 16,
    fontSize: 14,
  },
});

const GET_SERVER = gql`
  {
    form @client {
      url
      u
      p
      unsafeSsl
    }
  }
`;

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
            <Explorer form={data.form} />
          ) : (
            <div className={classes.noList}>
              Use &quot;RUN QUERY&quot; button to connect to a server,
              <br />
              or select one from &quot;CONNECT&quot; panel.
            </div>
          )}
        </div>
      </div>
    )}
  </Query>
);

export default withStyles(styles)(PanelExplorer);
