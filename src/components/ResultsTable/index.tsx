import React from 'react';
import { withStyles, Theme } from '@material-ui/core/styles';
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
import { ResultsSettings } from 'apollo/resolvers/results';

const styles = (theme: Theme): any => ({
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

const tzOffset = new Date().getTimezoneOffset();

type Props = {
  classes: any;
  title: string;
  parsedData: { [key: string]: string }[];
};

export const parseDate = (
  date: string,
  timeFormat: ResultsSettings['timeFormat'],
): string => {
  const ts = parseInt(date.slice(0, -6), 10) + tzOffset * 60 * 1000;
  switch (timeFormat) {
    case 's':
      return format(ts, 'YYYY-MM-dd HH:mm:ss');
    case 'ms':
      return format(ts, 'YYYY-MM-dd HH:mm:ss.SSS');
    case 'ns':
      return format(ts, 'YYYY-MM-dd HH:mm:ss.SSS') + date.slice(-6);
    default:
      return date;
  }
};

// Sorts data array of arrays with string values
export const sortData = (
  data: { [key: string]: string }[],
  order: ResultsSettings['order'],
  orderKey: string,
) => {
  if (orderKey === '' || !order) {
    return data;
  }
  return orderBy(
    // $FlowFixMe
    data,
    val => (!val[orderKey] ? Number.NEGATIVE_INFINITY : Number(val[orderKey])),
    order,
  );
};

const handleSort = (
  update: (setResultsTable: any) => any,
  settings: ResultsSettings,
) => (orderKey: string) => {
  const order =
    settings.orderKey === orderKey && settings.order === 'desc'
      ? 'asc'
      : 'desc';

  update({ variables: { order, orderKey } });
};

const renderBody = (
  data: { [key: string]: string }[],
  keys: string[],
  timeFormat: ResultsSettings['timeFormat'],
) =>
  data.map((row, index) => (
    <TableRow hover tabIndex={-1} key={index}>
      {keys.map(key => (
        <TableCell key={key} padding="dense" align="right">
          {timeFormat && key === 'time'
            ? parseDate(row[key], timeFormat)
            : row[key]}
        </TableCell>
      ))}
    </TableRow>
  ));

const ResultsTable = ({ classes, title, parsedData }: Props) => (
  <Mutation mutation={SET_RESULTS_TABLE}>
    {(setResultsTable: {
      (arg0: { variables: { page: any } }): void;
      (arg0: { variables: { rowsPerPage: number } }): void;
      (arg0: { variables: { timeFormat: any } }): void;
    }) => {
      const handleChangePage = (_event: any, page: any) => {
        setResultsTable({ variables: { page } });
      };

      const handleChangeRowsPerPage = (event: {
        target: { value: string };
      }) => {
        setResultsTable({
          variables: {
            rowsPerPage: parseInt(event.target.value, 10),
          },
        });
      };

      const handleFormatChange = (event: { target: { value: any } }) => {
        setResultsTable({
          variables: { timeFormat: event.target.value },
        });
      };

      return (
        <Query query={GET_RESULTS_TABLE}>
          {({
            data,
            loading: cacheLoading,
          }: {
            // $FlowFixMe
            data: { resultsTable: ResultsSettings };
            loading: boolean;
          }) => {
            if (cacheLoading) {
              // this is possible only in tests, because real cache has no loading state
              return null;
            }
            const resultsTable = data.resultsTable || {};

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
