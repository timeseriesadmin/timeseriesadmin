// @flow
import React from 'react';
import gql from 'graphql-tag';
import { Collapse, Button, ListSubheader, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import { ErrorOutline as ErrorIcon } from '@material-ui/icons';
import { Query, Mutation } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
  },
});

type Props = {
  classes: any,
  query: any, // gql string
  label: string,
  showData: any,
  db?: string,
  meas?: string,
  tagKey?: string,
};
type State = {
  isExpanded: boolean,
};
class ExplorerItem extends React.Component<Props, State> {
  state = {
    isExpanded: false,
  };

  render() {
    const { classes, db, meas, label, query, tagKey, showData } = this.props;

    return (
      <ListItem>
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
              <div>
                <Button onClick={handleExpand(!this.state.isExpanded)}>
                  {label}
                </Button>
                {called &&
                <Button onClick={handleRefresh}>
                  Refresh
                </Button>
                }
                {!called ? null :
                  loading ? <div>Loading...</div> :
                  error ? <div>ERROR</div> :
                  !data ? <div>NO DATA</div> :
                  <Collapse in={this.state.isExpanded} timeout="auto" unmountOnExit>
                    <List>
                      {showData(data)}
                    </List>
                  </Collapse>
                }
              </div>
            );
          }}
        </Mutation>
      </ListItem>
    );
  }
}

export default withStyles(styles)(ExplorerItem);
