import React, { FC, useContext } from 'react';
import { withStyles, Theme } from '@material-ui/core/styles';
import MUIDataTable from 'mui-datatables';
import { unparse } from 'papaparse';

import TableToolbar from './TableToolbar';
import orderBy from 'lodash/orderBy';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { parseTime } from './parseTime';
import { SettingsContext } from 'app/contexts/SettingsContext';

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

const stdLayoutTheme = createMuiTheme();

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

type Props = {
  classes: any;
  title: string;
  compactLayout: boolean;
  parsedData: { [key: string]: string }[];
};

function customSort(
  data: Props['parsedData'],
  colIndex: number,
  order: string,
): Props['parsedData'] {
  return orderBy(
    data,
    (val) =>
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
  const { timeFormat, setTimeFormat } = useContext(SettingsContext);

  const handleFormatChange = (event: { target: { value: string } }): void => {
    const timeFormat = event.target.value;
    setTimeFormat(timeFormat);
  };

  const tableData = parsedData.map((data) => {
    if (timeFormat && data.time) {
      return {
        ...data,
        time: parseTime(data.time, timeFormat),
      };
    }
    return data;
  });

  const columns = Object.keys(tableData[0]);

  return (
    <React.Fragment>
      <TableToolbar
        title={title}
        hasTime={Boolean(tableData[0]['time'])}
        timeFormat={timeFormat}
        handleFormatChange={handleFormatChange}
      />
      <div className={classes.tableWrapper}>
        <MuiThemeProvider
          theme={compactLayout ? compactLayoutTheme : stdLayoutTheme}
        >
          <MUIDataTable
            title="Query results"
            data={tableData}
            columns={columns.map((columnKey) => ({
              name: columnKey,
              label: columnKey === 'time' ? 'time (UTC)' : columnKey,
            }))}
            options={{
              customSort,
              print: false,
              rowsPerPage: 100,
              rowsPerPageOptions: [20, 100, 500, 1000, 5000],
              disableToolbarSelect: true,
              onRowsDelete: (): boolean => false,
              onDownload: (
                buildHead: (columns: any) => string,
                buildBody: (data: any) => string,
                columns: any[],
                data: any[],
              ): string => {
                const headers = columns.map((column) => column.label);
                const rows = data.map((row) => row.data);
                rows.unshift(headers);

                return unparse(rows);
              },
            }}
          />
        </MuiThemeProvider>
      </div>
    </React.Fragment>
  );
};

export default withStyles(styles)(ResultsTable);
