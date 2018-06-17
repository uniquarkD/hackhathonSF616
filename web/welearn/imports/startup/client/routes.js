import React, { Component } from 'react'
import { render } from 'react-dom'
import { Route } from 'react-router-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'
import { createBrowserHistory } from 'history'
import reducers from "../../ui/reduxReducers"
/* Pages */
import LandingPage from "../../ui/user/pages/LandingPage"
import MainPage from "../../ui/user/pages/MainPage"
/* Components */
import Alert from "../../ui/common/components/Alert"
import Navbar from "../../ui/common/components/Navbar"
import Footer from "../../ui/common/components/Footer"

const history = createBrowserHistory()
const middleware = routerMiddleware(history)
const store = createStore(combineReducers({ reducers, router: routerReducer }), applyMiddleware(middleware))

class Routes extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>
            <div className="cont-nav" style={{ zIndex: 10 }}>
              <Navbar history={history} />
            </div>
            <div className='cont-body'>
              <Route exact path="/" component={ LandingPage } />
              <Route exact path="/mainpage" component={ MainPage } />
            </div>
          </div>
        </ConnectedRouter>
      </Provider>
    )
  }
}

Meteor.startup(() => {
  render(<Routes />, document.getElementById('render-target'))
})
