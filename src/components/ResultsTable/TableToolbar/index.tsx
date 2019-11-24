import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  FormGroup,
  Toolbar,
  Typography,
  FormLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import styles from './style';

interface Props {
  title: string;
  classes: any;
  hasTime: boolean;
  timeFormat: 's' | 'ms' | 'ns' | 'timestamp';
  handleFormatChange:
    | ((
        event: React.ChangeEvent<HTMLSelectElement>,
        child: React.ReactNode,
      ) => void)
    | undefined;
}

const TableToolbar = ({
  classes,
  title,
  timeFormat,
  handleFormatChange,
  hasTime,
}: Props) => (
  <Toolbar className={classes.root}>
    <div className={classes.title}>
      <Typography variant="subheading" id="tableTitle">
        {title}
      </Typography>
    </div>
    <div className={classes.spacer} />
    {hasTime && (
      <div className={classes.actions}>
        <FormGroup row style={{ flexWrap: 'nowrap', display: 'flex' }}>
          <FormLabel style={{ margin: 8, marginRight: 16 }}>
            Time format
          </FormLabel>
          <Select
            value={timeFormat}
            onChange={handleFormatChange}
            displayEmpty
            name="timeFormat"
            style={{ flexGrow: 1 }}
          >
            <MenuItem value="timestamp">
              <em>Timestamp</em>
            </MenuItem>
            <MenuItem value="s">Date with seconds</MenuItem>
            <MenuItem value="ms">Date with milliseconds</MenuItem>
            <MenuItem value="ns">Date with nanoseconds</MenuItem>
          </Select>
        </FormGroup>
      </div>
    )}
  </Toolbar>
);

export default withStyles(styles)(TableToolbar);
