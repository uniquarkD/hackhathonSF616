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
/* Components */
import QuizItem from "../../components/QuizItem"
/* Third-party components */
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import ReactCountdownClock from 'react-countdown-clock'

const indexToLetter = (index) => {
  let letter = 'A'
  if (index === 0) {
    letter = 'A'
  } else if (index === 1) {
    letter = 'B'
  } else if (index === 2) {
    letter = 'C'
  } else if (index === 3) {
    letter = 'D'
  } else if (index === 4) {
   letter = 'E'
  }
  return letter
}


class TestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalScore: 0,
      answersArr: [],
    };
    this._isMounted = false
    this.handleAsnwer = this.handleAsnwer.bind(this)
  }
  componentDidMount() {
    this._isMounted = true
  }
  handleAsnwer(answerObj) {
    const { answersArr } = this.state
    if (answersArr && answersArr.length > 0) {
      let hasAnswer = false
      for (let i = 0; i < answersArr.length; i++) {
        if (answersArr[i].quizIndex === answerObj.quizIndex) {
          answersArr[i] = answerObj
          hasAnswer = true
          break
        }
      }
      if (!hasAnswer) {
        answersArr.push(answerObj)
      }
      this.setState({ answersArr })
    } else {
      this.setState({ answersArr: [answerObj] })
    }
  }
  submitAnswer(testId, answersArr) {
    Meteor.call('submitTest', { testId, answersArr }, (err, res) => {
      if (err) {
        console.log(err)
      }
      if (res) {
        const textMsg = `${res.msg} The page will be redirected to home page in shortly.`
        this.props.doUpdateAlert(textMsg)
        setTimeout(() => {
          //doUpdateAlert()
          this.props.history.push('/mainpage')
        }, 4 * 1000)
      }
    })
  }
  renderMain() {
    const { userId, user, test, readyTest, history, doUpdateAlert } = this.props
    if (!test) {
      return null
    }
    return (
      <Grid container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Grid item xs={12} sm={10} md={8} lg={6} style={{ paddingLeft: 10, paddingRight: 10 }}>
          <div style={{ width: '100%', textAlign: 'center', paddingTop: 30 }}>
            <div style={{ fontSize: 22, color: colors.darkGrey }}>
             {test.testName}
            </div>
          </div>
          {
            test && test.quizzesArr && test.quizzesArr.length > 0 ?
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 20 }}>
                <div style={{ width: '100%', paddingTop: 10, paddingBottom: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: '500' }}>
                   Pass more tests
                  </div>
                  <div style={{ fontSize: 20, fontWeight: '500' }}>
                   Earn more money
                  </div>
                </div>
                <div style={{ paddingTop: 20 }}>
                  <ReactCountdownClock seconds={test.timeMinute * 60 || 60}
                     color={colors.blue}
                     alpha={0.9}
                     size={200}
                     onComplete={() => {
                       const { answersArr } = this.state
                       this.submitAnswer(test._id, answersArr)
                     }}
                  />
                </div>
                {test.quizzesArr.map((quiz, index) => {
                  const { question, answersArr } = quiz
                  return (
                    <div key={`quiz-${index}`} style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ width: '100%', paddingTop: 30 }}>
                        <div style={{ fontSize: 18, color: colors.darkGrey }}>
                         {index + 1}. {question}
                        </div>
                      </div>
                      {
                        answersArr && answersArr.length > 0 ?
                          <div style={{ width: '100%', paddingLeft: 20, paddingTop: 10, paddingBottom: 10 }}>
                            <QuizItem answersArr={answersArr} index={index} handleAsnwer={this.handleAsnwer} />
                          </div>
                          :
                          <div style={{ width: '100%', paddingTop: 10, paddingBottom: 10 }}>
                            Sorry, answers are missing! Please, report the issue to admin.
                          </div>
                      }
                      <div style={{ width: '100%', paddingTop: 10, paddingBottom: 10 }}>
                        <Divider light />
                      </div>
                    </div>
                  )
                })}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    const { answersArr } = this.state
                    if (test.quizzesArr.length === answersArr.length) {
                      Meteor.call('submitTest', { testId: test._id, answersArr }, (err, res) => {
                        if (err) {
                          console.log(err)
                        }
                        if (res) {
                          const textMsg = `${res.msg} The page will be redirected to home page in shortly.`
                          this.props.doUpdateAlert(textMsg)
                          setTimeout(() => {
                            //doUpdateAlert()
                            history.push('/mainpage')
                          }, 4 * 1000)
                        }
                      })
                    } else {
                      this.props.doUpdateAlert('Please, complete your test!')
                    }
                  }}
                  style={{ marginTop: 20, marginBottom: 80 }}>
                  Submit
                </Button>
              </div>
              :
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 20 }}>
                {
                  readyTest ?
                    `There's no tests for at the moment! Please, check it later.`
                    :
                    <CircularProgress size={50} />
                }
              </div>
          }
        </Grid>
      </Grid>
    )
  }
  render() {
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

const MeteorTestPage = withTracker(() => {
  const { pathname } = location
  let testId = pathname.replace('/testpage/', '')
  testId = testId.replace('/', '')
  testId.trim()
  const subsTest = Meteor.subscribe('singleTest', testId)
  return {
    user: Meteor.user(),
    userId: Meteor.userId(),
    test: Tests.findOne({ _id: testId }),
    readyTest: subsTest.ready(),
  };
})(TestPage);


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

export default connect(mapStateToProps, mapDispatchToProps)(MeteorTestPage)
