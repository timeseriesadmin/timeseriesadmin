import React, { ReactNode, ChangeEvent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  FormGroup,
  Toolbar,
  Typography,
  FormLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { TimeFormat } from 'app/contexts/SettingsContext';

import styles from './style';

interface Props {
  title: string;
  classes: any;
  hasTime: boolean;
  timeFormat: TimeFormat;
  handleFormatChange:
    | ((
        event: ChangeEvent<{ name?: string | undefined; value: unknown }>,
        child: ReactNode,
      ) => void)
    | undefined;
}

const TableToolbar: React.FC<Props> = ({
  classes,
  title,
  timeFormat,
  handleFormatChange,
  hasTime,
}: Props) => (
  <Toolbar className={classes.root}>
    <div className={classes.title}>
      <Typography variant="subtitle1" id="tableTitle">
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
