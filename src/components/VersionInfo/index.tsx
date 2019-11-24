import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import compareVersions from 'compare-versions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { LATEST_RELEASE_URL } from '../../apollo/resolvers/github';
import { CURRENT_VERSION } from '../../config';

export const GET_LATEST_VERSION = gql`
  query getLatestVersion {
    getLatestVersion @client
  }
`;

const styles = () => ({
  root: {
    fontSize: 10,
  },
  button: {
    marginLeft: 10,
    minWidth: 0,
    minHeight: 0,
    fontSize: 9,
    padding: '1px 6px',
  },
});

export const versionIsUpToDate = (version: string): boolean =>
  compareVersions(version, CURRENT_VERSION) <= 0;

const VersionInfo = ({ classes }: { classes: any }) => (
  <Typography variant="caption" color="inherit" className={classes.versionInfo}>
    ver. <span id="version">{CURRENT_VERSION}</span>
    <Query query={GET_LATEST_VERSION}>
      {({ data, loading, error }: any) =>
        loading ||
        error ||
        !data ||
        !data.getLatestVersion ||
        versionIsUpToDate(data.getLatestVersion) ? null : (
          <Button
            variant="contained"
            size="small"
            className={classes.button}
            target="_blank"
            href={LATEST_RELEASE_URL}
          >
            New version available
          </Button>
        )
      }
    </Query>
  </Typography>
);

export default withStyles(styles)(VersionInfo);
