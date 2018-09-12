// @flow
import * as React from 'react';
import { Collapse } from '@material-ui/core';
// TODO: it might be rewritten to use React Context API (like react Popper do)

type Props = {
  renderToggler: (toggle: () => void, isExpanded: boolean) => React.Node,
  children: React.Node,
};
type State = {
  isExpanded: boolean,
};
class ExplorerCollapse extends React.Component<Props, State> {
  state = {
    isExpanded: false,
  };

  render() {
    const toggle = () => {
      this.setState({ isExpanded: !this.state.isExpanded });
    };

    return (
      <React.Fragment>
        {this.props.renderToggler(toggle, this.state.isExpanded)}
        <Collapse in={this.state.isExpanded} timeout="auto" unmountOnExit>
          {this.props.children}
        </Collapse>
      </React.Fragment>
    );
  }
}

export default ExplorerCollapse;
