// @flow
import React from 'react';
import {
  TableHead,
  TableCell,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@material-ui/core';

type Props = {
  headers: string[],
  handleSort: string => void,
  order: 'asc' | 'desc',
  orderKey: string,
};

const ResultsTableHead = ({ handleSort, headers, order, orderKey }: Props) => (
  <TableHead>
    <TableRow>
      {headers.map((cell, index) => (
        <TableCell
          padding="dense"
          key={index}
          sortDirection={orderKey === cell ? order : false}
          numeric
        >
          <Tooltip title="Sort" enterDelay={300}>
            <TableSortLabel
              active={orderKey === cell}
              direction={order}
              onClick={() => handleSort(cell)}
            >
              {cell}
            </TableSortLabel>
          </Tooltip>
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

export default ResultsTableHead;
