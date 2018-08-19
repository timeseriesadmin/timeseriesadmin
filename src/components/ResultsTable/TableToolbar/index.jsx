// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FormGroup, Toolbar, Typography, FormLabel, Select, MenuItem } from '@material-ui/core';

const styles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    flex: '0 0 auto',
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});
type Props = {
  title: string,
  classes: any,
	timeFormat: 's'|'ms'|'ns'|'timestamp',
	handleFormatChange: Function,
};
const TableToolbar = ({ classes, title, timeFormat, handleFormatChange }: Props) => (
<Toolbar className={classes.root}>
  <div className={classes.title}>
    <Typography variant="subheading" id="tableTitle">
      {title}
    </Typography>
  </div>
  <div className={classes.spacer} />
  <div className={classes.actions}>
		<FormGroup row style={{ flexWrap: 'nowrap' }}>
			<FormLabel style={{ margin: 8, marginRight: 16 }}>Time format</FormLabel>
			<Select
				value={timeFormat}
				onChange={handleFormatChange}
				displayEmpty
				name="timeFormat"
				className={classes.selectEmpty}
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
</Toolbar>
);

export default withStyles(styles)(TableToolbar);
