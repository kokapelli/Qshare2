import {
  LOGIN_LOADING, LOGIN_SUCCESS, LOGIN_ERROR, CLEAR_LOGIN,
} from '../actions/login'
import moment from 'moment/moment'
import { AsyncStorage } from 'react-native'

const initialState = {
  loading: false,
  success: false,
  redirect: false,
  error: {}
};

export default (state = initialState, action) => {
  switch (action.type){
    case LOGIN_LOADING:
      return {...state, loading: true, success: false, redirect: false, error:{}};
    case LOGIN_SUCCESS:
      const date =  moment().format('YYYY MM DD HH mm ss');
      AsyncStorage.setItem('qshare_user_token', action.payload);
      AsyncStorage.setItem('qshare_user_token_date', date);
      return {...state, success: true, loading: false, redirect: true};
    case LOGIN_ERROR:
      return {...state, error: action.payload, loading: false};
    case CLEAR_LOGIN:
      AsyncStorage.removeItem('qshare_user_token');
      AsyncStorage.removeItem('qshare_user_token_date');
      return {...initialState};
    default:
      return state;
  }
}