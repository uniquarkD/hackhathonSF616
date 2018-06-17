import React, { Component } from 'react';
import { render, ReactDOM } from 'react-dom';
import { Meteor } from 'meteor/meteor';
/* Redux */
import { updateAlert } from "../../../reduxActions";
import { connect } from "react-redux";
/* Third-party components */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class Alert extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  componentWillMount() {
    this._isMounted = true
  }
  componentWillUnmount() {
    this._isMounted = false
  }
  render() {
    const { alertObject, doUpdateAlert } = this.props
    return (
      <div>
        <Dialog
          open={alertObject.alertVisible}
          onClose={() => { this.props.doUpdateAlert() }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {alertObject && alertObject.alertMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
              doUpdateAlert()
              }}
              color="primary"
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { alertObject } = state.reducers
  return { alertObject }
}
const mapDispatchToProps = (dispatch) => {
  return {
    doUpdateAlert: () => {
      dispatch(updateAlert())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Alert)
