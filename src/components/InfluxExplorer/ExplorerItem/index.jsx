// @flow
import React from 'react';
import { Typography, IconButton, Collapse, Button, List } from '@material-ui/core';
import { Mutation } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import CollapseIcon from '@material-ui/icons/ExpandLess';
import RefreshIcon from '@material-ui/icons/Refresh';
import theme from '../../theme';
import TooltipError from '../../TooltipError';

const styles = theme => ({
  root: {
  },
});

type Props = {
  classes: any,
  query: any, // gql string
  resultsKey: string,
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
    const { classes, label, resultsKey, query, db, meas, tagKey } = this.props;

    return (
      <Mutation mutation={query} variables={{ db, meas, tagKey }}>
        {(mutate, { called, loading, data, error }) => {
          const handleExpand = (expand: boolean = true) => () => {
            if (!called) { // execute mutation on first expansion
              // $FlowFixMe
              mutate();
            }
            this.setState({ isExpanded: expand });
          };

          const handleRefresh = () => {
            // $FlowFixMe
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
                error ? <div><TooltipError content={JSON.stringify(error)} /></div> :
                !data || !data[resultsKey] ? <Typography variant="caption" color="primary" style={{ marginLeft: 22 }}>
                  Results are empty, probably there is no data in this section.
                </Typography> :
                <Collapse in={this.state.isExpanded} timeout="auto" unmountOnExit>
                  <List>
                    {this.props.children(data[resultsKey])}
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
