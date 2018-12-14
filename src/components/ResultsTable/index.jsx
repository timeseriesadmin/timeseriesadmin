// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Paper,
} from '@material-ui/core';
import format from 'date-fns/format';
import Papa from 'papaparse';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

import QueryError from '../QueryError';
import TableToolbar from './TableToolbar';
import TableHead from './TableHead';
import orderBy from 'lodash/orderBy';

import type { ResultsSettings } from '../../apollo/resolvers';

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

export const parseDate = (
  date: string,
  timeFormat: $PropertyType<ResultsSettings, 'timeFormat'>,
): string => {
  switch (timeFormat) {
    case 's':
      return format(parseInt(date.slice(0, -6), 10), 'YYYY-MM-dd HH:mm:ss');
    case 'ms':
      return format(parseInt(date.slice(0, -6), 10), 'YYYY-MM-dd HH:mm:ss.SSS');
    case 'ns':
      return (
        format(parseInt(date.slice(0, -6), 10), 'YYYY-MM-dd HH:mm:ss.SSS') +
        date.slice(-6)
      );
    default:
      return date;
  }
};

// Sorts data array of arrays with string values
export const sortData = (
  data: { [string]: string }[],
  order: $PropertyType<ResultsSettings, 'order'>,
  orderKey: string,
) => {
  if (orderKey === '' || !order) {
    return data;
  }
  return orderBy(data, orderKey, order);
};

export const parseQueryResults = (data: string) =>
  Papa.parse(data, {
    header: true,
    // $FlowFixMe
    skipEmptyLines: 'greedy', // skip empty and whitespace lines
  });

const handleSort = (update: any => any, settings: ResultsSettings) => (
  orderKey: string,
) => {
  const order =
    settings.orderKey === orderKey && settings.order === 'desc'
      ? 'asc'
      : 'desc';

  update({ variables: { order, orderKey } });
};

const renderBody = (
  data: { [string]: string }[],
  keys: string[],
  timeFormat: $PropertyType<ResultsSettings, 'timeFormat'>,
) =>
  data.map((row, index) => (
    <TableRow hover tabIndex={-1} key={index}>
      {keys.map(key => (
        <TableCell key={key} padding="dense" numeric>
          {timeFormat && key === 'time'
            ? parseDate(row[key], timeFormat)
            : row[key]}
        </TableCell>
      ))}
    </TableRow>
  ));

const ResultsTable = ({ classes, queryState }: Props) => (
  <Paper className={classes.root}>
    <Mutation mutation={SET_RESULTS_TABLE}>
      {setResultsTable => (
        <Query query={GET_RESULTS_TABLE}>
          {({
            data: { resultsTable },
            loading: cacheLoading,
          }: {
            // $FlowFixMe
            data: { resultsTable: ResultsSettings },
            loading: boolean,
          }) => {
            const handleChangePage = (event, page) => {
              setResultsTable({ variables: { page } });
            };

            const handleChangeRowsPerPage = event => {
              setResultsTable({
                variables: { rowsPerPage: parseInt(event.target.value, 10) },
              });
            };

            const handleFormatChange = event => {
              setResultsTable({
                variables: { timeFormat: event.target.value },
              });
            };

            const { called, loading, data: query, error } = queryState;

            if (error) {
              return (
                <div className={classes.contentNoTable}>
                  <QueryError error={error} />
                </div>
              );
            }

            if (!called) {
              return (
                <div className={classes.contentNoTable}>
                  <Typography
                    variant="display1"
                    component="p"
                    style={{ textAlign: 'center' }}
                  >
                    Go ahead and "RUN QUERY"!
                  </Typography>
                </div>
              );
            }

            if (loading || cacheLoading) {
              return (
                <div className={classes.contentNoTable}>
                  <div style={{ textAlign: 'center' }}>
                    <CircularProgress color="secondary" />
                    <Typography variant="headline">
                      Executing query please wait...
                    </Typography>
                  </div>
                </div>
              );
            }

            // no point in parsing before error check
            const results = parseQueryResults(query.executeQuery.response.data);

            if (!results.data || !results.data.length) {
              const statusCode = query.executeQuery.response.status;
              return (
                <div className={classes.contentNoTable}>
                  <Typography
                    variant="headline"
                    component="h3"
                    style={{
                      marginBottom: 8,
                      color:
                        statusCode >= 200 && statusCode < 300 ? 'green' : 'red',
                    }}
                  >
                    {query.executeQuery.response.status}:
                    {query.executeQuery.response.statusText} No data
                  </Typography>
                  <Typography component="p" variant="body1">
                    Please verify your query if this is not the expected
                    response.
                  </Typography>
                  <Typography component="p" variant="caption">
                    Maybe queried measurement doesn't exist ?
                  </Typography>
                  <Typography component="p" variant="caption">
                    Maybe you query only for TAGS (your query should contain at
                    least one FIELD) ?
                  </Typography>
                  <Typography component="p" variant="caption">
                    Remember, measurement names are CASE SENSITIVE !
                  </Typography>
                </div>
              );
            }

            const sortedData = sortData(
              results.data,
              resultsTable.order,
              resultsTable.orderKey,
            );

            const keys = Object.keys(sortedData[0]);

            return (
              <React.Fragment>
                <TableToolbar
                  title={query.executeQuery.request.params.q}
                  hasTime={!!results.data[0]['time']}
                  timeFormat={resultsTable.timeFormat}
                  handleFormatChange={handleFormatChange}
                />
                <div className={classes.tableWrapper}>
                  <Table className={classes.table} aria-labelledby="tableTitle">
                    <TableHead
                      order={resultsTable.order}
                      orderKey={resultsTable.orderKey}
                      handleSort={handleSort(setResultsTable, resultsTable)}
                      headers={keys}
                    />
                    <TableBody>
                      {renderBody(
                        sortedData.slice(
                          resultsTable.rowsPerPage * resultsTable.page,
                          resultsTable.rowsPerPage * (resultsTable.page + 1),
                        ),
                        keys,
                        resultsTable.timeFormat,
                      )}
                    </TableBody>
                  </Table>
                </div>
                <TablePagination
                  component="div"
                  count={sortedData.length}
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
              </React.Fragment>
            );
          }}
        </Query>
      )}
    </Mutation>
  </Paper>
);

export const SET_RESULTS_TABLE = gql`
  mutation setResultsTable(
    $order: String
    $orderKey: String
    $page: Int
    $rowsPerPage: Int
    $timeFormat: String
  ) {
    setResultsTable(
      order: $order
      orderKey: $orderKey
      page: $page
      rowsPerPage: $rowsPerPage
      timeFormat: $timeFormat
    ) @client
  }
`;

export const GET_RESULTS_TABLE = gql`
  {
    resultsTable @client {
      order
      orderKey
      page
      rowsPerPage
      timeFormat
    }
  }
`;

export default withStyles(styles)(ResultsTable);
