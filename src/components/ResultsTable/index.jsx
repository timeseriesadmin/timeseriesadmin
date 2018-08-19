// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
	CircularProgress, Typography, Table, TableBody, TableCell, TablePagination, TableRow, Paper
} from '@material-ui/core';

import QueryError from '../QueryError';
import ResultsTableHead from '../ResultsTableHead';

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
  // data: any,
  queryState: any,
};
type State = {
  order: 'asc'|'desc',
  orderBy: number,
  selected: number[],
  page: number,
  rowsPerPage: number,
};
class ResultsTable extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      order: 'asc',
      orderBy: 0,
      selected: [],
      page: 0,
      rowsPerPage: 10,
    };
  }

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

  render() {
    const { classes, queryState: { called, loading, data, error } } = this.props;
    const { order, orderBy, rowsPerPage, page } = this.state;

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
    const { results, headers } = parseQueryResults(data.influxQuery.data);

    if (!results || !results.length) {
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
              Maybe you query only for TAGS (your query should contain at least one field) ?
            </Typography>
          </div>
        </Paper>
      );
    }

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <ResultsTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              headers={headers}
            />
            <TableBody>
              {results.sort(getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => row ? (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={index}
                  >
                    {row.map((cell, index) => (
                      <TableCell key={index} padding="dense" numeric>{cell}</TableCell>
                    ))}
                  </TableRow>
                ) : null)
              }
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
