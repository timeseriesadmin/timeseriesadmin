import React, { FC } from 'react';
import { withStyles, Theme } from '@material-ui/core/styles';
import format from 'date-fns/format';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo';
import MUIDataTable from 'mui-datatables';

import TableToolbar from './TableToolbar';
import { ResultsSettings } from 'src/apollo/resolvers/results';
import orderBy from 'lodash/orderBy';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const styles = (theme: Theme): any => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  contentNoTable: {
    padding: theme.spacing(4),
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

export const SET_RESULTS_TABLE = gql`
  mutation setResultsTable($timeFormat: String) {
    setResultsTable(timeFormat: $timeFormat) @client
  }
`;

export const GET_RESULTS_TABLE = gql`
  {
    resultsTable {
      timeFormat
    }
  }
`;

const compactLayoutTheme = createMuiTheme({
  overrides: {
    PrivateSwitchBase: {
      root: {
        padding: 2,
      },
    },
    MUIDataTableBodyCell: {
      root: {
        paddingTop: 2,
        paddingBottom: 2,
        lineHeight: 1.2,
      },
    },
  },
} as any);

const tzOffset = new Date().getTimezoneOffset();

type Props = {
  classes: any;
  title: string;
  compactLayout: boolean;
  parsedData: { [key: string]: string }[];
};

export const parseDate = (
  date: string,
  timeFormat: ResultsSettings['timeFormat'],
): string => {
  const ts = parseInt(date.slice(0, -6), 10) + tzOffset * 60 * 1000;
  switch (timeFormat) {
    case 's':
      return format(ts, 'yyyy-MM-dd HH:mm:ss');
    case 'ms':
      return format(ts, 'yyyy-MM-dd HH:mm:ss.SSS');
    case 'ns':
      return format(ts, 'yyyy-MM-dd HH:mm:ss.SSS') + date.slice(-6);
    default:
      return date;
  }
};

function customSort(
  data: Props['parsedData'],
  colIndex: number,
  order: string,
): Props['parsedData'] {
  return orderBy(
    data,
    val =>
      !val.data[colIndex]
        ? Number.NEGATIVE_INFINITY
        : Number(val.data[colIndex]),
    order as 'asc' | 'desc',
  );
}

const ResultsTable: FC<Props> = ({
  classes,
  title,
  parsedData,
  compactLayout,
}: Props) => {
  const [setResultsTable] = useMutation(SET_RESULTS_TABLE);
  const { data, loading: cacheLoading } = useQuery(GET_RESULTS_TABLE);

  const handleFormatChange = (event: { target: { value: string } }): void => {
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
        <MuiThemeProvider theme={compactLayout ? compactLayoutTheme : {}}>
          <MUIDataTable
            title="Query results"
            data={tableData}
            columns={columns.map(columnKey => ({
              name: columnKey,
              label: columnKey,
            }))}
            options={{
              customSort,
              print: false,
              rowsPerPage: 100,
              rowsPerPageOptions: [20, 100, 500, 1000, 5000],
              disableToolbarSelect: true,
              onRowsDelete: (): boolean => false,
            }}
          />
        </MuiThemeProvider>
      </div>
    </React.Fragment>
  );
};

export default withStyles(styles)(ResultsTable);
