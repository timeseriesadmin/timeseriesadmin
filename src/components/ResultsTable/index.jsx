// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
	CircularProgress, Typography, Table, TableBody, TableCell, TablePagination, TableRow, Paper
} from '@material-ui/core';
import format from 'date-fns/format';
import Papa from 'papaparse';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

import QueryError from '../QueryError';
import TableToolbar from './TableToolbar';
import TableHead from './TableHead';

import type { ResultsSettings } from '../../apollo/resolvers';

function getSorting(order, orderBy): (a: any, b: any) => number {
  if (order === 'desc') {
    return (a, b) => a[orderBy] > b[orderBy] ? 1 : -1;
  }
  return (a, b) => a[orderBy] > b[orderBy] ? -1 : 1;
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  contentNoTable: {
    padding: theme.spacing.unit * 4,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

type Props = {
  classes: any,
  queryState: any,
};

const parseDate = (date: string, timeFormat: $PropertyType<ResultsSettings, 'timeFormat'>): string => {
  switch (timeFormat) {
    case 's':
      return format(parseInt(date.slice(0, -6), 10), 'YYYY-MM-dd HH:mm:ss');
    case 'ms':
      return format(parseInt(date.slice(0, -6), 10), 'YYYY-MM-dd HH:mm:ss.SSS');
    case 'ns':
      return format(parseInt(date.slice(0, -6), 10), 'YYYY-MM-dd HH:mm:ss.SSS') + date.slice(-6);
    default:
      return date;
  }
};

const ResultsTable = (props: Props) => (
  <Mutation mutation={SET_RESULTS_TABLE}>
    {setResultsTable => (
  <Query query={GET_RESULTS_TABLE}>
    { // $FlowFixMe
      ({ data: { resultsTable } }: { data: { resultsTable: ResultsSettings } }) => {
      // const { order, orderBy, page, rowsPerPage, timeFormat } = data;

  const handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (resultsTable.orderBy === property && resultsTable.order === 'desc') {
      order = 'asc';
    }

    setResultsTable({ variables: { order, orderBy } });
    // this.setState({ order, orderBy });
  };

  const handleChangePage = (event, page) => {
    setResultsTable({ variables: { page } });
    // this.setState({ page });
  };

  const handleChangeRowsPerPage = event => {
    setResultsTable({ variables: { rowsPerPage: parseInt(event.target.value, 10) } });
    // this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
  };

  const handleFormatChange = event => {
    // TODO: decide if timeFormat should be saved in storage
    // storage.set('timeFormat', event.target.value);
    setResultsTable({ variables: { timeFormat: event.target.value } });
    // this.setState({ timeFormat: event.target.value });
  };

    const { classes, queryState: { called, loading, data: query, error } } = props;

    if (error) {
      return (
        <Paper className={classes.root}>
          <div className={classes.contentNoTable}>
            <QueryError error={error} />
          </div>
        </Paper>
      );
    }

    if (!called) {
      return (
        <Paper className={classes.root}>
          <div className={classes.contentNoTable}>
            <Typography variant="display1" component="p" style={{ textAlign: 'center' }}>
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
              <Typography variant="headline">
                Executing query please wait...
              </Typography>
            </div>
          </div>
        </Paper>
      );
    }

    // no point in parsing before error check
    let results = Papa.parse(query.executeQuery.response.data, {
      header: true,
      // $FlowFixMe
      skipEmptyLines: 'greedy', // skip empty and whitespace lines
    });

    if (!results.data || !results.data.length) {
      const statusCode = query.executeQuery.response.status;
      return (
        <Paper className={classes.root}>
          <div className={classes.contentNoTable}>
            <Typography variant="headline" component="h3" style={{ marginBottom: 8, color: statusCode >= 200 && statusCode < 300 ? "green" : "red" }}>
              {query.executeQuery.response.status}:{query.executeQuery.response.statusText} No data
            </Typography>
            <Typography component="p" variant="body1">
              Please verify your query if this is not the expected response.
            </Typography>
            <Typography component="p" variant="caption">
              Maybe queried measurement doesn't exist ?
            </Typography>
            <Typography component="p" variant="caption">
              Maybe you query only for TAGS (your query should contain at least one FIELD) ?
            </Typography>
            <Typography component="p" variant="caption">
              Remember, measurement names are CASE SENSITIVE !
            </Typography>
          </div>
        </Paper>
      );
    }

		// look for time column
		const tIndex = Object.keys(results.data[0]).findIndex(val => val === 'time');

		// skip sorting if not selected
    let dataset;
		if (resultsTable.orderBy) {
			dataset = results.data.sort(getSorting(resultsTable.order, resultsTable.orderBy));
    } else {
      dataset = results.data;
    }

    return (
      <Paper className={classes.root}>
				<TableToolbar
          title={query.executeQuery.request.params.q}
          hasTime={tIndex > -1}
          timeFormat={resultsTable.timeFormat}
          handleFormatChange={handleFormatChange}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <TableHead
              order={resultsTable.order}
              orderBy={resultsTable.orderBy}
              onRequestSort={handleRequestSort}
              headers={Object.keys(dataset[0])}
            />
            <TableBody>
              {dataset.slice(resultsTable.page * resultsTable.rowsPerPage, resultsTable.page * resultsTable.rowsPerPage + resultsTable.rowsPerPage)
                .map((row, rIndex) => (
                  <TableRow hover tabIndex={-1} key={rIndex}>
                    {Object.keys(row).map(key => (
                      <TableCell key={key} padding="dense" numeric>
												{resultsTable.timeFormat && key === 'time' ? parseDate(row[key], resultsTable.timeFormat) : row[key]} 
											</TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={dataset.length}
          rowsPerPage={resultsTable.rowsPerPage}
          page={resultsTable.page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    );
    }}
  </Query>
    )}
  </Mutation>
);

const SET_RESULTS_TABLE = gql`
  mutation setResultsTable($order: String, $orderBy: String, $page: Int, $rowsPerPage: Int, $timeFormat: String) {
    setResultsTable(order: $order, orderBy: $orderBy, page: $page, rowsPerPage: $rowsPerPage, timeFormat: $timeFormat) @client
  }
`;

const GET_RESULTS_TABLE = gql`{
  resultsTable @client { order orderBy page rowsPerPage timeFormat }
}`;

export default withStyles(styles)(ResultsTable);
