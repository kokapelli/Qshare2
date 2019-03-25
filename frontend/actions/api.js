import moment from 'moment';
import { AsyncStorage } from 'react-native';
import { API_BASE_URL, API_TOKEN, EXPIRATION_TIME } from '../constants/API'
import { settings } from '../settings/settings'
import axios from '../utils/axios'

export const FETCHING_CLIENT_TOKEN_SUCCESS = 'fetching_client_token';
export const FETCHING_CLIENT_TOKEN_LOADING = 'fetching_client_token_loading';
export const FETCHING_CLIENT_TOKEN_ERROR = 'fetching_client_token_error';

export const retrieveClientToken = () => {
  return new Promise((resolve) => {
    AsyncStorage.getItem('qshare_client_token_date')
      .then((storedDate) => {
        if (storedDate === null){
          AsyncStorage.removeItem('qshare_client_token');
          return dispatch(fetchClientToken());
        } else {
          const expiredToken = isTokenExpired(storedDate);
          if (expiredToken) {
            return dispatch(fetchClientToken());
          } else {
            // return token
            AsyncStorage.getItem('qshare_client_token')
              .then((token) => {
                  resolve(token);
              });
          }
        }
      })
      .catch(error => {
        resolve(null);
        dispatch(fetchClientTokenError(error))
        throw error;
      });
  });
}

export const retrieveUserToken = () => {
  return new Promise((resolve) => {
    AsyncStorage.getItem('qshare_user_token_date')
      .then((storedDate) => {
        if (storedDate === null){
          AsyncStorage.removeItem('qshare_user_token');
        }
        const expiredToken = isTokenExpired(storedDate);
        if (expiredToken) {
          //login again.
          resolve(null);
        } else {
          // return token
          AsyncStorage.getItem('qshare_user_token')
            .then((token) => {
              resolve(token);
            });
        }
      })
      .catch(error => {
        resolve(null);
      });
  });
}


export const fetchClientToken = () => {
  return (dispatch) => {
    dispatch(fetchClientTokenLoading())
    axios
      .post(API_BASE_URL + API_TOKEN, {
        clientID: settings.clientID
      })
      .then(({data}) => {
        if (data && data.status === 'success' && data.token) {
          dispatch(fetchClientTokenSuccess(data.token));
          return new Promise((resolve) => {
            resolve(data.token);
          });
        } else {
          let error = new Error('Client login unsuccessful')
          dispatch(fetchClientTokenError(error))
          throw error
        }
      })
      .catch(error => {
        dispatch(fetchClientTokenError(error))
        throw error
      })
  };
}

function fetchClientTokenSuccess(token) {
  return {
    type: FETCHING_CLIENT_TOKEN_SUCCESS,
    payload: token
  };
}

function fetchClientTokenLoading() {
  return {
    type: FETCHING_CLIENT_TOKEN_LOADING,
    payload: true
  };
}

function fetchClientTokenError (error) {
  return {
    type: FETCHING_CLIENT_TOKEN_SUCCESS,
    payload: error
  };
}

function isTokenExpired(storedDate) {
  let formatDate = "YYYY MM DD HH mm ss";
  let loginAt = moment(storedDate, formatDate);
  let today = moment(moment().format(formatDate), formatDate);
  let secondLapsed = today.diff(loginAt, "seconds");
  return secondLapsed >= EXPIRATION_TIME;
}
