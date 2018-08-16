// @flow
import React from 'react';
import gql from 'graphql-tag';
// $FlowFixMe
import { compose, graphql } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import QueryError from '../QueryError';

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => a[orderBy] > b[orderBy] : (a, b) => b[orderBy] > a[orderBy];
}

type HeadProps = {
  headers: string[],
  onRequestSort: Function,
  order: 'asc' | 'desc',
  orderBy: number,
};
class EnhancedTableHead extends React.Component<HeadProps> {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { headers, order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
          {headers.map((cell, index) => {
            return (
              <TableCell
                padding="dense" 
                key={index}
                sortDirection={orderBy === index ? order : false}
                numeric
              >
                <Tooltip
                  title="Sort"
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === index}
                    direction={order}
                    onClick={this.createSortHandler(index)}
                  >
                    {cell}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

type Props = {
  classes: any,
  data: any,
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
    const { classes, data: { results, headers, error } } = this.props;
    const { order, orderBy, rowsPerPage, page } = this.state;

    if (error) {
      return (
        <Paper className={classes.root}>
          <QueryError error={error} />
        </Paper>
      );
    }

    // TODO: maybe move query logic to ResultsTable so the errors will be automatically available
    // thanks to Apollo
    if (!results || !results.length) {
      return (
        <Paper className={classes.root}>
          <div className={classes.error}>
            <Typography variant="headline" component="h3" style={{ marginBottom: 8 }}>
              Empty server response
            </Typography>
            <Typography component="p">
              Maybe queried measurement doesn't exist ?
            </Typography>
          </div>
        </Paper>
      );
    }

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              headers={headers}
            />
            <TableBody>
              {results
                .sort(getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={index}
                    >
                      {row.map((cell, index) => (
                        <TableCell key={index} padding="dense" numeric>{cell}</TableCell>
                      ))}
                    </TableRow>
                  );
                })}
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

const GET_RESULTS = gql`
  {
    results @client {
      data
      type
      error
    }
  }
`;

export default compose(
  graphql(GET_RESULTS, { 
    props: ({ data }) => {
      let opts = { data: { ...data, results: [], headers: [] } };
      if (!data.results) return opts;

      if (data.results.error) {
        opts.data.error = data.results.error;
        return opts;
      }
      opts.data.results = data.results.data.split('\n')
        .filter(line => line !== '') // remove empty lines
        .map(line => line.split(',')); // create array of values for each line

      opts.data.headers = opts.data.results.shift();

      return opts;
    },
  }),
)(withStyles(styles)(ResultsTable));
