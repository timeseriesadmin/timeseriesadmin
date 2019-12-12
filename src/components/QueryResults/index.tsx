import React from 'react';
import { withStyles, Theme } from '@material-ui/core/styles';
import { CircularProgress, Typography, Paper } from '@material-ui/core';
import Papa from 'papaparse';
import { SettingsContext } from 'contexts/SettingsContext';

import QueryError from '../QueryError';
import ResultsTable from '../ResultsTable';

const styles = (theme: Theme): any => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  contentNoTable: {
    padding: theme.spacing(4),
  },
});

interface Props {
  classes: any;
  called: boolean;
  loading: boolean;
  query: any;
  error?: any;
}

export const parseQueryResults = (data: string) =>
  Papa.parse(data, {
    header: true,
    skipEmptyLines: 'greedy', // skip empty and whitespace lines
  });

const QueryResults: React.FC<Props> = ({
  classes,
  called,
  loading,
  query,
  error,
}: Props) => {
  const settings = React.useContext(SettingsContext);
  if (error) {
    return (
      <Paper className={classes.root}>
        <div className={classes.contentNoTable}>
          <QueryError error={error} />;
        </div>
      </Paper>
    );
  }
  if (!called) {
    return (
      <Paper className={classes.root}>
        <div className={classes.contentNoTable}>
          <Typography
            variant="h4"
            component="p"
            style={{ textAlign: 'center' }}
          >
            Go ahead and "RUN QUERY"!
          </Typography>
        </div>
      </Paper>
    );
  }
  if (loading) {
    return (
      <Paper className={classes.root}>
        <div className={classes.contentNoTable}>
          <div style={{ textAlign: 'center' }}>
            <CircularProgress color="secondary" />
            <Typography variant="h5">Executing query please wait...</Typography>
          </div>
        </div>
      </Paper>
    );
  }

  // no point in parsing before error check
  const results = parseQueryResults(query.executeQuery.response.data);

  if (!results.data || !results.data.length) {
    const statusCode = query.executeQuery.response.status;
    return (
      <Paper className={classes.root}>
        <div className={classes.contentNoTable}>
          <Typography
            variant="h5"
            component="h3"
            style={{
              marginBottom: 8,
              color: statusCode >= 200 && statusCode < 300 ? 'green' : 'red',
            }}
          >
            {query.executeQuery.response.status}:
            {query.executeQuery.response.statusText} No data
          </Typography>
          <Typography component="p" variant="body1">
            Please verify your query if this is not the expected response.
          </Typography>
          <Typography component="p" variant="caption">
            Maybe queried measurement doesn't exist ?
          </Typography>
          <Typography component="p" variant="caption">
            Maybe you query only for TAGS (your query should contain at least
            one FIELD) ?
          </Typography>
          <Typography component="p" variant="caption">
            Remember, measurement names are CASE SENSITIVE !
          </Typography>
        </div>
      </Paper>
    );
  }

  return (
    <Paper className={classes.root}>
      <ResultsTable
        parsedData={results.data}
        title={query.executeQuery.request.params.q}
        compactLayout={settings.compactLayout}
      />
    </Paper>
  );
};

export default withStyles(styles)(QueryResults);
