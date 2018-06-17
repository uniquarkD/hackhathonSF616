import React, { Component } from 'react';
import { render, ReactDOM } from 'react-dom';
import styles from './styles'
import { logoURI, logoETH } from '../../../../config/globalConsts'
import colors from '../../../../config/colors'
import { Currencies, Tests } from '../../../../api/collections'
/* Meteor data on React */
import { withTracker, createContainer } from 'meteor/react-meteor-data';
/* Redux */
import { connect } from "react-redux";
import { updateAlert } from "../../../reduxActions";
/* Third-party components */
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import Web3 from 'web3'

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this._isMounted = false
  }
  componentDidMount() {
    this._isMounted = true
    this.initWeb3()
  }
  initWeb3() {
    console.log(`what is web3 right now:  ${window.web3}`);
     if (typeof window.web3 !== 'undefined') {
       console.log(window.web3);
       window.web3.eth.getAccounts((err, res) => {
         if (err) {
           console.log(err);
         }
         if (res) {
           console.log(res);
           if (res[0]) {
             this.setState({ ethAddress: res[0] })
           }
         }
       });
    }
  }
  renderETHAddressInput(ethAddress) {
    if (ethAddress) {
      return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          Your address: {ethAddress}
        </div>
      )
    }
    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <TextField
          id="ETHAddress"
          label="Your Ethereum Address"
          value={this.state.ethAddress}
          defaultValue="Your Ethereum Address"
          placeholder="Your Ethereum Address"
          onChange={(event) => {
            this.setState({ ethAddress: event.target.value })
          }}
          margin="normal"
          fullWidth
        />
      <Button color="primary" onClick={() => {
          const newETHAddress = this.state.ethAddress
          if (Web3.utils.isAddress(newETHAddress)) {
            console.log('submit!  ', newETHAddress);
            Meteor.call('saveETHAddress', newETHAddress, (err, res) => {
              if (err) {
                console.log(err);
              }
            })
          } else {
            this.props.doUpdateAlert('Please, enter a valid wallet address!')
          }
        }}>
          Submit
        </Button>
      </div>
    )
  }
  renderFirst() {
    const { userId, user, tests, readyTests } = this.props
    const { profile } = user || {}
    const { totalEarnedETH, totalTests, successfulTests, ethAddress } = profile || {}
    return (
      <Grid item xs={12} sm={10} md={8} lg={6} style={{ paddingLeft: 10, paddingRight: 10 }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ paddingTop: 30, width: '80%', maxWidth: 300 }}>
            <img src={logoURI} alt="logo" style={{ width: '100%', height: 'auto' }}/>
          </div>
        </div>
        <div style={{ width: '100%', textAlign: 'center', paddingTop: 30 }}>
          <div style={{ fontSize: 18, color: colors.darkGrey }}>
           You've earned {totalEarnedETH || 0} ETH by passing {successfulTests || 0} / {totalTests} { successfulTests && successfulTests > 1 ? 'exams' : 'exam'}
          </div>
        </div>
        <div style={{ width: '100%', textAlign: 'center', paddingTop: 30 }}>
          {user ? this.renderETHAddressInput(ethAddress) : null}
        </div>
        {
          tests && tests.length > 0 ?
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 20 }}>
              <div style={{ width: '100%', paddingTop: 10, paddingBottom: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: '500' }}>
                 Pass more tests
                </div>
                <div style={{ fontSize: 20, fontWeight: '500' }}>
                 Earn more money
                </div>
              </div>
              {tests.map((test) => {
                const { _id, testName, rewardETH } = test
                return (
                  <div key={_id} style={{ width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Link to={`/testpage/${_id}`}>
                      <Button color="primary" onClick={() => {}}>
                        {testName} {"  -  "} {rewardETH} ETH
                      </Button>
                    </Link>
                    <div style={{ width: '100%', maxWidth: 400, paddingTop: 10, paddingBottom: 10 }}>
                      <Divider light />
                    </div>
                  </div>
                )
              })}
            </div>
            :
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 20 }}>
              {
                readyTests ?
                  `There's no tests for at the moment! Please, check it later.`
                  :
                  <CircularProgress size={50} />
              }
            </div>
        }
      </Grid>
    )
  }
  renderMain() {
    return (
      <Grid container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {this.renderFirst()}
      </Grid>
    )
  }
  render() {
    console.log(this.props.tests);
    const windowHeight = window.innerHeight
    const { userId } = this.props
    if (!userId) {
      return null
    }
    return (
      <div style={{ height: windowHeight, paddingLeft: '5%', paddingRight: '5%' }}>
        {this.renderMain()}
      </div>
    )
  }
}

const MeteorMainPage = withTracker(() => {
  const subsTests = Meteor.subscribe('tests')
  return {
    user: Meteor.user(),
    userId: Meteor.userId(),
    currency: Currencies.findOne({ currencySymbol: 'ETH' }),
    tests: Tests.find({}).fetch(),
    readyTests: subsTests.ready(),
  };
})(MainPage);


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

export default connect(mapStateToProps, mapDispatchToProps)(MeteorMainPage)
