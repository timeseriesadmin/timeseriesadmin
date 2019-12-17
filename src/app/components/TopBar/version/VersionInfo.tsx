import React from 'react';
import useAsync from 'react-use/lib/useAsync';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';

import { CURRENT_VERSION } from '../../../../config';
import { getLatestVersion, LATEST_RELEASE_URL } from './getLatestVersion';
import { isVersionOutdated } from './isVersionOutdated';

const useStyles = makeStyles({
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

export const VersionInfo: React.FC = () => {
  const { loading, value, error } = useAsync(getLatestVersion);
  const classes = useStyles({});

  return (
    <Typography
      variant="caption"
      color="inherit"
      className={classes.root}
      component="div"
    >
      ver. <span id="version">{CURRENT_VERSION}</span>
      {!loading && !error && value && isVersionOutdated(value) && (
        <Button
          variant="contained"
          size="small"
          className={classes.button}
          target="_blank"
          href={LATEST_RELEASE_URL}
        >
          New version available
        </Button>
      )}
    </Typography>
  );
};
