import React, { Component } from 'react';
import { render, ReactDOM } from 'react-dom';
import styles from './styles'
/* Meteor data on React */
import { withTracker, createContainer } from 'meteor/react-meteor-data';
/* Redux */
import { connect } from "react-redux";
import { updateAlert } from "../../../reduxActions";
/* Third-party components */
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  renderChooseRole() {
    const { user, doUpdateAlert } = this.props
    if (user) {
      const { userAccountType } = user.profile || {}
      if (!userAccountType) {
        return (
          <div style={{ paddingTop: 30, paddingBottom: 30, width: '100%' }}>
            <div style={{ paddingTop: 30, width: '100%', textAlign: 'center' }}>
              Please, choose your account type
            </div>
            <div style={{ paddingTop: 30, paddingBottom: 30, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                style={{ marginRight: 10 }}
                onClick={() => {
                  Meteor.call('updateAccountType', 'student', (err, res) => {
                    if (!err) {
                      doUpdateAlert('Welcome to our community! Learn and improve your future!')
                    }
                  })
                }}
              >
                Student
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: 10 }}
                onClick={() => {
                  Meteor.call('updateAccountType', 'donor', (err, res) => {
                    if (!err) {
                      doUpdateAlert('Welcome to our community! Help our bright future by donating for education!')
                    }
                  })
                }}
              >
                Donor
              </Button>
            </div>
          </div>
        )
      }
    }
    return null
  }
  render() {
    const windowHeight = window.innerHeight
    return (
      <div style={{ height: windowHeight }}>
        {this.renderChooseRole()}
      </div>
    )
  }
}


const MeteorLandingPage = withTracker(() => {
  return {
    user: Meteor.user(),
    userId: Meteor.userId(),
  };
})(LandingPage);


const mapStateToProps = (state) => {
  const { alertObject } = state.reducers
  return { alertObject }
}
const mapDispatchToProps = (dispatch) => {
  return {
    doUpdateAlert: (alertMessage) => {
      dispatch(updateAlert(alertMessage))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MeteorLandingPage)
