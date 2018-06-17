import React, { Component } from 'react';
import { render, ReactDOM } from 'react-dom';
//import styles from './styles'
/* Meteor data on React */
import { withTracker } from 'meteor/react-meteor-data';

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const windowHeight = window.innerHeight
    return (
      <div style={{ padding: 100, paddingTop: 0, height: windowHeight }}>
        <p>
          LandingPage
        </p>
      </div>
    )
  }
}


export default withTracker(() => {
  return {
    user: Meteor.user(),
    userId: Meteor.userId(),
  };
})(LandingPage);
