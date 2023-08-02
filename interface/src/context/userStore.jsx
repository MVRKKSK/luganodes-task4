export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';

// Action creators
export const loginSuccess = (returnsData) => ({
  type: LOGIN_SUCCESS,
  payload: returnsData,
});

export const logout = () => ({
  type: LOGOUT,
});