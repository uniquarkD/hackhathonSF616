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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import MdMenu from 'react-icons/lib/md/menu'

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


class QuizItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      score: 0,
    }
    this._isMounted = false
    this.handleChange = this.handleChange.bind(this)
  }
  componentDidMount() {
    this._isMounted = true
  }
  handleChange(event) {
    const { index } = this.props
    const newValue = event.target.value
    this.setState({ value: newValue })
    const answerIndex = parseInt(newValue, 10)
    this.props.handleAsnwer({ quizIndex: index, answerIndex })
  }
  render() {
    const { answersArr, index } = this.props
    return (
      <FormControl component="fieldset" required>
        <RadioGroup
          name={`${index}`}
          value={this.state.value}
          onChange={this.handleChange}
        >
          {
            answersArr.map((answer, indexAnswer) => {
              const { text } = answer
              return (
                <FormControlLabel key={`quiz-${index}-${indexAnswer}`} value={`${indexAnswer}`} control={<Radio />} label={`${indexToLetter(indexAnswer)}. ${text}`} />
              )
            })
          }
        </RadioGroup>
      </FormControl>
    )
  }
}

const MeteorQuizItem = withTracker(() => {
  return {
    user: Meteor.user(),
    userId: Meteor.userId(),
  };
})(QuizItem);

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

export default connect(mapStateToProps, mapDispatchToProps)(MeteorQuizItem)
