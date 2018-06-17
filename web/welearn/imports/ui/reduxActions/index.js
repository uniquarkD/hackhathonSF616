import { MYCONSTS, UPDATE_ALERT } from "../reduxConsts"

export const updateUIState = (uiState) => {
  return {
    type: MYCONSTS,
    uiState,
  }
}


export const updateAlert = (alertMessage) => {
  const newAlertMessage = alertMessage || ''
  return {
    type: UPDATE_ALERT,
    alertMessage: newAlertMessage,
  }
}
