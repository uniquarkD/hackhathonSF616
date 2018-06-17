import React, { Component } from 'react';
import { render, ReactDOM } from 'react-dom';
import styles from './styles'
import colors from '../../../../config/colors'
import globalStyles from '../../../../config/globalStyles'
/* Meteor data on React */
import { withTracker, createContainer } from 'meteor/react-meteor-data';
/* Third-party components */
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MdMenu from 'react-icons/lib/md/menu'


class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisibleDrawer: false,
    }
    this.setVisibleDrawer = this.setVisibleDrawer.bind(this)
  }
  setVisibleDrawer() {
    this.setState({ isVisibleDrawer: !this.state.isVisibleDrawer })
  }
  renderSmall() {
    return (
       <Hidden only={['md', 'lg', 'xl']}>
         <div style={{ height: 60, width: '100%' }}>
           <Drawer open={this.state.isVisibleDrawer} onClose={this.setVisibleDrawer}>
            <div
              tabIndex={0}
              role="button"
              onClick={this.setVisibleDrawer}
              onKeyDown={this.setVisibleDrawer}
            >
              <div style={{ paddingTop: 30, paddingLeft: 50, paddingRight: 40 }}>
                <div style={{ paddingTop: 10 }}>
                  Home
                </div>
                <div style={{ paddingTop: 10 }}>
                  page 1
                </div>
                <div style={{ paddingTop: 10 }}>
                  page 2
                </div>
                <Button variant="contained" color="primary" onClick={() => { console.log('Sign In!'); }}>
                  Sign In
                </Button>
              </div>
            </div>
          </Drawer>
          <div style={{ height: 60, width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', paddingRight: 20 }}>
            <IconButton
              aria-label="Menu"
              onClick={this.setVisibleDrawer}
            >
              <MdMenu />
            </IconButton>
          </div>
         </div>
       </Hidden>
    )
  }
  renderBig() {
    return (
       <Hidden only={['xs', 'sm']}>
         <div style={{ height: 60, width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 20 }}>
           <Button variant="contained" color="primary" onClick={() => { console.log('clicked!'); }}>
             Sign In
           </Button>
         </div>
       </Hidden>
    )
  }
  render() {
    return (
      <div style={{ height: 60, width: '100%' }}>
        {this.renderSmall()}
        {this.renderBig()}
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
