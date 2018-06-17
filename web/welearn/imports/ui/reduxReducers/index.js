import { MYCONSTS } from "../reduxConsts"

const initialState = {
  myState: {},
}

const reducers = (state = initialState, action) => {
  if (action.type === MYCONSTS) {
    return Object.assign({}, state, { uiState: action.uiState })
  }
  return state
}

export default reducers
