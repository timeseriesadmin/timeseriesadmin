// @flow
import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

type Props = {
  headers: string[],
  onRequestSort: Function,
  order: 'asc' | 'desc',
  orderBy: number,
};
class ResultsTableHead extends React.Component<Props> {
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

export default ResultsTableHead;
