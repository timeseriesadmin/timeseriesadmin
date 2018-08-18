// @flow
import React from 'react';
import { TableHead, TableCell, TableRow, TableSortLabel, Tooltip } from '@material-ui/core';

type Props = {
  headers: string[],
  onRequestSort: Function,
  order: 'asc' | 'desc',
  orderBy: number,
};
class ResultsTableHead extends React.Component<Props> {
  createSortHandler = (property: string) => (event: Event) => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { headers, order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
          {headers.map((cell, index) => (
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
									onClick={this.createSortHandler(index.toString())}
								>
									{cell}
								</TableSortLabel>
							</Tooltip>
						</TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
}

export default ResultsTableHead;
