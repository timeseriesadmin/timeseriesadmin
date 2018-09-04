// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
	CircularProgress, Typography, Table, TableBody, TableCell, TablePagination, TableRow, Paper
} from '@material-ui/core';
import format from 'date-fns/format';

import QueryError from '../QueryError';
import TableToolbar from './TableToolbar';
import TableHead from './TableHead';
import storage from '../../helpers/storage';

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

type parsedQuery = {
  headers: string[],
  results: Array<?string[]>,
};
const parseQueryResults = (resultsString: string): parsedQuery => {
  let data = {
    headers: [],
    results: [],
  };

  data.results = resultsString.split('\n')
    .filter(line => line !== '') // remove empty lines
    .map(line => line.split(',')); // create array of values for each line

  if (data.results.length > 0) {
    data.headers = data.results.shift() || [];
  }

  return data;
};

type Props = {
  classes: any,
  queryState: any,
};
type State = {
  order: 'asc'|'desc',
  orderBy: number,
  selected: number[],
  page: number,
  rowsPerPage: number,
	timeFormat: 's'|'ms'|'ns'|'timestamp',
};

const parseDate = (date: string, timeFormat: $PropertyType<State, 'timeFormat'>): string => {
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

// $FlowFixMe
const initTimeFormat: $PropertyType<State, 'timeFormat'> = storage.get('timeFormat', 'timestamp');

class ResultsTable extends React.Component<Props, State> {
	state = {
		order: 'asc',
		orderBy: null,
		selected: [],
		page: 0,
		rowsPerPage: 10,
		timeFormat: initTimeFormat,
	};

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
  };

  handleFormatChange = event => {
    storage.set('timeFormat', event.target.value);
    this.setState({ timeFormat: event.target.value });
  };

  render() {
    const { classes, queryState: { called, loading, data, error } } = this.props;
    const { timeFormat, order, orderBy, rowsPerPage, page } = this.state;

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
    let { results, headers } = parseQueryResults(data.executeQuery.response.data);

    if (!headers || !headers.length) {
      return (
        <Paper className={classes.root}>
          <div className={classes.contentNoTable}>
            <Typography variant="headline" component="h3" style={{ marginBottom: 8 }}>
              Empty server response
            </Typography>
            <Typography component="p">
              Maybe queried measurement doesn't exist ?
            </Typography>
            <Typography component="p">
              Maybe you query only for TAGS (your query should contain at least one FIELD) ?
            </Typography>
            <Typography component="p">
              Remember, measurement names are CASE SENSITIVE !
            </Typography>
          </div>
        </Paper>
      );
    }

		// look for time column
		const tIndex = headers.findIndex(val => val === 'time');

		// skip sorting if not selected
		if (results && results.length > 0 && orderBy) {
			results = results.sort(getSorting(order, orderBy));
		}

    const query = data.executeQuery.request.q;

    return (
      <Paper className={classes.root}>
				<TableToolbar
          title={query}
          hasTime={tIndex > -1}
          timeFormat={timeFormat}
          handleFormatChange={this.handleFormatChange}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <TableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              headers={headers}
            />
            <TableBody>
						{results && results.length > 0 ?
							results
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, rIndex) => row ? (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={rIndex}
                  >
                    {row.map((cell, cIndex) => (
                      <TableCell key={cIndex} padding="dense" numeric>
												{timeFormat && cIndex === tIndex ? parseDate(cell, timeFormat) : cell} 
											</TableCell>
                    ))}
                  </TableRow>
                ) : null)
              : null}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={results.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

export default withStyles(styles)(ResultsTable);
