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
  orderBy: number | null,
};

const ResultsTableHead = ({ handleSort, headers, order, orderBy }: Props) => (
  <TableHead>
    <TableRow>
      {headers.map((cell, index) => (
        <TableCell
          padding="dense"
          key={index}
          sortDirection={orderBy === index ? order : false}
          numeric
        >
          <Tooltip title="Sort" enterDelay={300}>
            <TableSortLabel
              active={orderBy === index}
              direction={order}
              onClick={() => handleSort(index.toString())}
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
