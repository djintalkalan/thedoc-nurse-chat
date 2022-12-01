
import ActionTypes from '../action-types';

export const doLogin = (payload: any) => {
  return {
    type: ActionTypes.DO_LOGIN,
    payload
  };
}

export const doLogout = (payload?: any) => {
  return {
    type: ActionTypes.DO_LOGOUT,
    payload
  };
}

export const tokenExpired = (payload?: any) => {
  return {
    type: ActionTypes.TOKEN_EXPIRED,
    payload
  };
}

export const getAppVersion = () => {
  return {
    type: ActionTypes.GET_APP_VERSION
  };
}





