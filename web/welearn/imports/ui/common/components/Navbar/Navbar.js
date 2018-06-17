import React, { Component } from 'react';
import { render, ReactDOM } from 'react-dom';
import styles from './styles'
import colors from '../../../../config/colors'
import globalStyles from '../../../../config/globalStyles'
import { appName } from '../../../../config/globalConsts'
/* Meteor data on React */
import { withTracker, createContainer } from 'meteor/react-meteor-data';
/* Redux */
import { connect } from "react-redux";
import { updateAlert } from "../../../reduxActions";
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
      loadingBtn: false,
    }
    this.setVisibleDrawer = this.setVisibleDrawer.bind(this)
    this._isMounted = false
  }
  componentDidMount() {
    this._isMounted = true
  }
  setVisibleDrawer() {
    this.setState({ isVisibleDrawer: !this.state.isVisibleDrawer })
  }
  loginFb() {
    if (this._isMounted) this.setState({ loadingBtn: !this.state.loadingBtn });
    Meteor.loginWithFacebook({}, (err) => {
      if (this._isMounted) { this.setState({ loadingBtn: !this.state.loadingBtn }); }
      if (err) {
        throw new Meteor.Error("Facebook login failed");
      }
    })
  }
  login(userId) {
    if (userId) {
      Meteor.logout()
    } else {
      this.loginFb()
    }
  }
  renderSmall() {
    const { userId } = this.props
    return (
       <Hidden only={['md', 'lg', 'xl']}>
         <div style={{ height: 60, width: '100%' }}>
           <Drawer open={this.state.isVisibleDrawer} onClose={this.setVisibleDrawer}>
             <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 30, paddingLeft: 50, paddingRight: 50 }}>
               <Button color="primary" onClick={() => { console.log('Sign In!'); }}>
                 Home
               </Button>
               <Button color="primary" onClick={() => {
                   this.props.doUpdateAlert('Working alert!')
                }}>
                 Main Page
               </Button>
               <Button color="primary" onClick={() => { this.login(userId) }}>
                 {
                   userId ?
                     'Sign out'
                     :
                     'Login with Facebook'
                 }
               </Button>
             </div>
          </Drawer>
          <div style={{ height: 60, width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', paddingRight: 20 }}>
            <div style={{ height: 60, width: '20%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', paddingRight: 20 }}>
              <IconButton
                aria-label="Menu"
                onClick={this.setVisibleDrawer}
              >
                <MdMenu />
              </IconButton>
            </div>
            <div style={{ height: 60, width: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', fontSize: 20, fontWeight: '500' }}>
              {appName}
            </div>
          </div>
         </div>
       </Hidden>
    )
  }
  renderBig() {
    const { userId } = this.props
    return (
       <Hidden only={['xs', 'sm']}>
         <div style={{ height: 60, width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 20 }}>
           <Button color="primary" onClick={() => {
              this.login(userId)
            }}>
              {
                userId ?
                  'Sign out'
                  :
                  'Login with Facebook'
              }
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

const MeteorNavbar = withTracker(() => {
  return {
    user: Meteor.user(),
    userId: Meteor.userId(),
  };
})(Navbar);

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

export default connect(mapStateToProps, mapDispatchToProps)(MeteorNavbar)
