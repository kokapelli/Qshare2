import { API_BASE_URL, API_LOGIN, API_TOKEN } from '../constants/API';
import axios from '../utils/axios';
import { settings } from '../settings/settings';
import { PROVIDER_SPOTIFY } from '../constants/Provider'
import { ERROR_LOGIN } from '../constants/LanguageEnglish'
import { spotifyRequestAuth } from '../components/login/spotifyRequestAuth';
import { fetchClientToken, retrieveClientToken } from './api'
import {createRoom, clearRoom} from './room';
import {clearQueue} from './queue';
import {clearSearch} from './search';

export const LOGIN_SUCCESS = 'login_success';
export const LOGIN_LOADING = 'login_loading';
export const LOGIN_ERROR = 'login_error';
export const CLEAR_LOGIN = 'clear_login';

export const login = () => {
  return (dispatch) => {
    dispatch(loginLoading());
    
    retrieveClientToken()
      .then((token) => {
        if (token){
          dispatch(loginUser(token));
        }
      })
      .catch(error => {throw error});
  }
}

export const loginUser = (token) => {
  return (dispatch) => {
    if (token !== null){
      let data = JSON.stringify({
        action: 'redirect'
      });
      axios.post(API_BASE_URL + API_LOGIN, data,
        {headers:{
            'Token': token,
            'Content-Type': 'application/json'
          },
        })
        .then((tokenRequest) => {
          switch(settings.provider) {
            case PROVIDER_SPOTIFY:
              spotifyRequestAuth(tokenRequest.data.url)
                .then((response) => {
                  if (response === null || response.type === "cancel") throw new Error("response is null")
                  if (response.params.code !== null) {
                    let data = JSON.stringify({
                      credential: response.params.code,
                      action: "authorize"
                    });
                    axios.post(API_BASE_URL + API_LOGIN, data,{
                      headers:{
                        'Token': token,
                        'Content-Type': 'application/json'
                      }
                    })
                      .then((response) => {
                        if (response.data.status === "success") {
                          dispatch(loginSuccess(response.data.token));
                          dispatch(createRoom())
                        } else if (response.data.type === "failure") {
                          dispatch(loginError(ERROR_LOGIN));
                        }
                      })
                      .catch(error => {
                        dispatch(loginError(error));
                        JSON.stringify(error);
                        throw error;
                      });
                  }
                })
                .catch(error => {
                  dispatch(loginError(error));
                  throw error;
                });
              break
            default:
              let error = new Error("Unable to match provider");
              dispatch(loginError(error));
              throw error;
          }
        })
        .catch(error => {
          dispatch(loginError(error));
        });
    } else {
      let error = new Error('Invalid token.');
      dispatch(loginError(error))
    }

  };
}

function loginSuccess(token){
  return {
    type: LOGIN_SUCCESS,
    payload: token
  };
}

function loginLoading(){
  return {
    type: LOGIN_LOADING
  };
}

function loginError(error){
  return {
    type: LOGIN_ERROR,
    payload:error
  };
}

export const clientLogin = () => {
  return (dispatch) => {
    dispatch(fetchClientToken());
  }
}

export const logout = () => {
  return (dispatch) => {
    dispatch(clearRoom());
    dispatch(clearQueue());
    dispatch(clearSearch());
    dispatch(clearLogin());
  };
}

function clearLogin() {
  return {
    type: CLEAR_LOGIN
  }
}