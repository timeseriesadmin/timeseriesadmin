// @flow
import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import ExpandIcon from '@material-ui/icons/ExpandMore';
import CollapseIcon from '@material-ui/icons/ExpandLess';

const styles = theme => ({
  featuredText: {
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  button: {
    fontSize: 14,
  },
  expandCollapse: {
    minWidth: 0,
    padding: '0 4px',
    marginLeft: theme.spacing.unit,
    borderRadius: '50%',
    '& > span': {
      paddingRight: 0,
    },
    '& > span > svg': {
      margin: 0,
    },
  },
});

type Props = {
  classes: any,
  label: string,
  toggle: () => void,
  isExpanded: boolean,
  suffixedContent: any,
  featured: boolean,
};

const ExplorerButton = ({
  classes,
  label,
  toggle,
  isExpanded,
  suffixedContent = '',
  featured = false,
}: Props) => (
  <div className={classes.button}>
    <span className={featured ? classes.featuredText : null}>{label}</span>
    <Button
      size="small"
      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${label}`}
      onClick={toggle}
      className={classes.expandCollapse}
    >
      {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
    </Button>
    {suffixedContent}
  </div>
);
export default withStyles(styles)(ExplorerButton);
