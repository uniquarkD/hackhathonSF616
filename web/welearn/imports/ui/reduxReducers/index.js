import { MYCONSTS, UPDATE_ALERT } from "../reduxConsts"

const initialState = {
  myState: {},
  alertObject: {
    alertVisible: false,
    alertMessage: '',
  },
}

const reducers = (state = initialState, action) => {
  if (action.type === UPDATE_ALERT) {
    return Object.assign({}, state, { alertObject: { alertVisible: !state.alertObject.alertVisible, alertMessage: action.alertMessage } })
  }
  return state
}

export default reducers
