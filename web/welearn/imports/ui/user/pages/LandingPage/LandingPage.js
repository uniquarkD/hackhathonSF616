import React, { Component } from 'react';
import { render, ReactDOM } from 'react-dom';
import styles from './styles'
import { logoURI, logoETH } from '../../../../config/globalConsts'
import colors from '../../../../config/colors'
import { Currencies } from '../../../../api/collections'
/* Meteor data on React */
import { withTracker, createContainer } from 'meteor/react-meteor-data';
/* Redux */
import { connect } from "react-redux";
import { updateAlert } from "../../../reduxActions";
/* Third-party components */
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import { Redirect } from 'react-router'

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this._isMounted = false
  }
  componentDidMount() {
    this._isMounted = true
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
  renderFirst() {
    return (
      <Grid item xs={12} sm={12} md={4} lg={4} style={{ paddingLeft: 10, paddingRight: 10 }}>
        <Hidden only={['xs', 'sm']}>
          <div style={{ width: '100%', paddingTop: 50 }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ paddingTop: 30, width: '30%', textAlign: 'center' }}>
                <img src={logoETH} alt="ethereum logo" style={{ width: '100%', height: 'auto' }}/>
              </div>
              <div style={{ paddingTop: 30, width: '70%', textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: '500', paddingBottom: 20 }}>
                  Test Your Smart to
                </div>
                <div style={{ fontSize: 26, fontWeight: '500' }}>
                  Earn Ethereum
                </div>
              </div>
            </div>
            <div style={{ paddingTop: 30, width: '100%', textAlign: 'center' }}>
              <div style={{ fontSize: 30, fontWeight: '500', paddingTop: 100, paddingBottom: 20 }}>
                About Us
              </div>
              <div style={{ fontSize: 20, color: colors.darkGrey }}>
                Kryptokeds is a nonprofit that serves low-income families through providing a monetary incentivized educational tool
              </div>
            </div>
          </div>
        </Hidden>
        <Hidden only={['md', 'lg', 'xl']}>
          <div style={{ width: '100%' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ paddingTop: 30, width: '30%', textAlign: 'center' }}>
                <img src={logoETH} alt="ethereum logo" style={{ width: '100%', height: 'auto' }}/>
              </div>
              <div style={{ paddingTop: 30, width: '70%', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: '500', paddingBottom: 20 }}>
                  Test Your Smart to
                </div>
                <div style={{ fontSize: 20, fontWeight: '500' }}>
                  Earn Ethereum
                </div>
              </div>
            </div>
            <div style={{ paddingTop: 30, width: '100%', textAlign: 'center' }}>
              <div style={{ fontSize: 30, fontWeight: '500', paddingBottom: 20 }}>
                About Us
              </div>
              <div style={{ fontSize: 20, color: colors.darkGrey }}>
                Kryptokeds is a nonprofit that serves low-income families through providing a monetary incentivized educational tool
              </div>
            </div>
          </div>
        </Hidden>
      </Grid>
    )
  }
  renderSecond() {
    const { userId } = this.props
    return (
      <Grid item xs={12} sm={12} md={4} lg={4} style={{ paddingLeft: 10, paddingRight: 10 }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ paddingTop: 30, width: '80%', maxWidth: 300 }}>
            <img src={logoURI} alt="logo" style={{ width: '100%', height: 'auto' }}/>
          </div>
        </div>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button variant="contained" color="primary" onClick={() => { this.login(userId) }}>
            {
              userId ?
                'Sign out'
                :
                'Login with Facebook'
            }
          </Button>
        </div>
        <div style={{ width: '100%', textAlign: 'center', paddingTop: 30 }}>
          <div style={{ fontSize: 20, color: colors.darkGrey }}>
            Thank you for our sponsors
          </div>
        </div>
        <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', paddingTop: 20 }}>
          <div style={{ width: '30%', maxWidth: 300 }}>
            <img src={logoURI} alt="logo" style={{ width: '100%', height: 'auto' }}/>
          </div>
          <div style={{ width: '30%', maxWidth: 300 }}>
            <img src={logoURI} alt="logo" style={{ width: '100%', height: 'auto' }}/>
          </div>
          <div style={{ width: '30%', maxWidth: 300 }}>
            <img src={logoURI} alt="logo" style={{ width: '100%', height: 'auto' }}/>
          </div>
          <div style={{ width: '30%', maxWidth: 300 }}>
            <img src={logoURI} alt="logo" style={{ width: '100%', height: 'auto' }}/>
          </div>
          <div style={{ width: '30%', maxWidth: 300 }}>
            <img src={logoURI} alt="logo" style={{ width: '100%', height: 'auto' }}/>
          </div>
          <div style={{ width: '30%', maxWidth: 300 }}>
            <img src={logoURI} alt="logo" style={{ width: '100%', height: 'auto' }}/>
          </div>
        </div>
      </Grid>
    )
  }
  renderThird() {
    const { currency } = this.props
    const { currencyPrice } = currency || {}
    return (
      <Grid item xs={12} sm={12} md={4} lg={4} style={{ paddingLeft: 10, paddingRight: 10 }}>
        <div style={{ width: '100%', paddingTop: 50 }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ paddingTop: 30, width: '100%', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: '500' }}>
                Ethereum {' - '} ${currencyPrice || '0'}
              </div>
            </div>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ paddingTop: 30, width: '100%', textAlign: 'center' }}>
              <img src='https://s3-us-west-2.amazonaws.com/hackathonsf/graph.png' alt="ethereum logo" style={{ width: '100%', height: 'auto' }}/>
            </div>
          </div>
          <div style={{ paddingTop: 30, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 30, fontWeight: '500', paddingTop: 30, paddingBottom: 20 }}>
              Ethereum Network
            </div>
            <div style={{ fontSize: 20, color: colors.darkGrey }}>
              Ethereum is an open-source, public, blockchain-based distributed computing platform and operating system featuring smart contract (scripting) functionality.
            </div>
          </div>
        </div>
      </Grid>
    )
  }

  renderMain() {
    return (
      <Grid container>
        {this.renderFirst()}
        {this.renderSecond()}
        {this.renderThird()}
      </Grid>
    )
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
    const { userId } = this.props
    if (userId) {
      return <Redirect to='mainpage'/>
    }
    return (
      <div style={{ height: windowHeight, paddingLeft: '5%', paddingRight: '5%' }}>
        {this.renderChooseRole()}
        {this.renderMain()}
      </div>
    )
  }
}


const MeteorLandingPage = withTracker(() => {
  Meteor.subscribe('currencies')
  return {
    user: Meteor.user(),
    userId: Meteor.userId(),
    currency: Currencies.findOne({ currencySymbol: 'ETH' }),
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
