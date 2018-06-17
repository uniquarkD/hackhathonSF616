import React, { Component } from 'react';
import { render, ReactDOM } from 'react-dom';
import styles from './styles'
/* Meteor data on React */
import { withTracker, createContainer } from 'meteor/react-meteor-data';

class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  render() {
    return (
      <div style={{ padding: 100 }}>
        <p>
          Navbar
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
})(Navbar);
