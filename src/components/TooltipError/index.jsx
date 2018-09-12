// @flow
// TODO: add click away and set z-index correctly
import React from 'react';
import { Collapse, Typography, Paper, Button } from '@material-ui/core';
import { Manager, Reference, Popper } from 'react-popper';
import { Report as ErrorIcon } from '@material-ui/icons';

type Props = {
  content: string,
};
type State = {
  isOpen: boolean,
};
class TooltipError extends React.Component<Props, State> {
  state = {
    isOpen: false,
  };

  handleClick = (open: boolean) => () => {
    this.setState({ isOpen: open });
  }

  render() {
    const { isOpen } = this.state;

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
          <div ref={ref} style={{ display: 'inline-block' }}>
            <Button style={{ padding: '0 10px' }} onClick={this.handleClick(!isOpen)}>
              <ErrorIcon color="error" variant="text" />
              Error. Check details.
            </Button>
          </div>
          )}
        </Reference>
        <Popper placement="bottom" positionFixed={true}>
          {({ ref, style, placement, arrowProps }) => (
            <div ref={ref} data-placement={placement} style={{ position: 'fixed', zIndex: 9999, maxWidth: 400 }}>
              <Collapse in={isOpen} style={{ transformOrigin: '0 0 0' }}>
                <Paper style={{ margin: 1, padding: 12 }}>
                  <Typography>{this.props.content}</Typography>
                </Paper>
              </Collapse>
            </div>
          )}
        </Popper>
      </Manager>
    );
  }
}

export default TooltipError;
