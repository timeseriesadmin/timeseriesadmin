// @flow
import React from 'react';
import gql from 'graphql-tag';
import { IconButton, Collapse, Button, ListSubheader, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import { ErrorOutline as ErrorIcon } from '@material-ui/icons';
import { Query, Mutation } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import CollapseIcon from '@material-ui/icons/ExpandLess';
import RefreshIcon from '@material-ui/icons/Refresh';
import theme from '../../theme';

const styles = theme => ({
  root: {
  },
});

type Props = {
  classes: any,
  query: any, // gql string
  label: string,
  db?: string,
  meas?: string,
  tagKey?: string,
  children: any,
};
type State = {
  isExpanded: boolean,
};
class ExplorerItem extends React.Component<Props, State> {
  state = {
    isExpanded: false,
  };

  render() {
    const { classes, db, meas, label, query, tagKey } = this.props;

    return (
      <Mutation mutation={query} variables={{ db, meas, tagKey }}>
        {(mutate, { called, loading, data, error }) => {

          // TODO: continue here
          const handleExpand = (expand: boolean = true) => () => {
            if (!called) { // execute mutation on first expansion
              mutate();
            }
            this.setState({ isExpanded: expand });
          };

          const handleRefresh = () => {
            mutate();
          }
          return (
            <div className={classes.root}>
              <Button size="small"
                aria-label={this.state.isExpanded ? "Collapse" : "Expand"} 
                onClick={handleExpand(!this.state.isExpanded)}>
                {this.state.isExpanded ? <CollapseIcon /> : <ExpandIcon />}
                {label}
              </Button>
              {called &&
              <IconButton onClick={handleRefresh} style={{ width: 24, height: 24 }}>
                <RefreshIcon style={{ margin: 0, fontSize: 18, color: theme.palette.secondary.dark }} />
              </IconButton>
              }
              {!called ? null :
                loading ? <div>Loading...</div> :
                error ? <div>ERROR</div> :
                !data ? <div>NO DATA</div> :
                <Collapse in={this.state.isExpanded} timeout="auto" unmountOnExit>
                  <List>
                    {this.props.children(data)}
                  </List>
                </Collapse>
              }
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default withStyles(styles)(ExplorerItem);
