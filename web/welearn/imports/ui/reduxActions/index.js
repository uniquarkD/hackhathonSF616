import { MYCONSTS } from "../reduxConsts"

export const updateUIState = (uiState) => {
  return {
    type: MYCONSTS,
    uiState,
  }
}
