import React from 'react';
import { withStyles, Theme } from '@material-ui/core/styles';
import format from 'date-fns/format';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo';
import MUIDataTable from 'mui-datatables';

import TableToolbar from './TableToolbar';
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

const ResultsTable = ({ classes, title, parsedData }: Props) => {
  const [setResultsTable] = useMutation(SET_RESULTS_TABLE);
  const { data, loading: cacheLoading } = useQuery(GET_RESULTS_TABLE);

  const handleFormatChange = (event: { target: { value: any } }) => {
    setResultsTable({
      variables: { timeFormat: event.target.value },
    });
  };

  if (cacheLoading) {
    // this is possible only in tests, because real cache has no loading state
    return null;
  }
  const resultsTable = data.resultsTable || {};

  const tableData = parsedData.map(data => ({
    ...data,
    time:
      resultsTable.timeFormat &&
      data.time &&
      parseDate(data.time, resultsTable.timeFormat),
  }));

  const columns = Object.keys(tableData[0]);

  return (
    <React.Fragment>
      <TableToolbar
        title={title}
        hasTime={!!parsedData[0]['time']}
        timeFormat={resultsTable.timeFormat}
        handleFormatChange={handleFormatChange}
      />
      <div className={classes.tableWrapper}>
        <MUIDataTable
          title="Query results"
          data={tableData}
          columns={columns.map(columnKey => ({
            name: columnKey,
            label: columnKey,
            options: {
              filter: true,
              sort: true,
              fixedHeaderOptions: { xAxis: false, yAxis: true },
            },
          }))}
        />
      </div>
    </React.Fragment>
  );
};

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