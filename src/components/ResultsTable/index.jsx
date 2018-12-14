// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import format from 'date-fns/format';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

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
  title: string,
  parsedData: { [string]: string }[],
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

const ResultsTable = ({ classes, title, parsedData }: Props) => (
  <Mutation mutation={SET_RESULTS_TABLE}>
    {setResultsTable => {
      const handleChangePage = (event, page) => {
        setResultsTable({ variables: { page } });
      };

      const handleChangeRowsPerPage = event => {
        setResultsTable({
          variables: {
            rowsPerPage: parseInt(event.target.value, 10),
          },
        });
      };

      const handleFormatChange = event => {
        setResultsTable({
          variables: { timeFormat: event.target.value },
        });
      };

      return (
        <Query query={GET_RESULTS_TABLE}>
          {({
            data: { resultsTable },
            loading: cacheLoading,
          }: {
            // $FlowFixMe
            data: { resultsTable: ResultsSettings },
            loading: boolean,
          }) => {
            if (cacheLoading) {
              // this is possible only in tests, because real cache has no loading state
              return null;
            }

            const sortedData = sortData(
              parsedData,
              resultsTable.order,
              resultsTable.orderKey,
            );

            const keys = Object.keys(sortedData[0]);

            return (
              <React.Fragment>
                <TableToolbar
                  title={title}
                  hasTime={!!parsedData[0]['time']}
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
      );
    }}
  </Mutation>
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
