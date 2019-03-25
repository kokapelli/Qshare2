import moment from 'moment/moment'
import { AsyncStorage } from 'react-native'
import {
  FETCHING_CLIENT_TOKEN_ERROR,
  FETCHING_CLIENT_TOKEN_LOADING,
  FETCHING_CLIENT_TOKEN_SUCCESS
} from '../actions/api'

const initialState = {
  qshare_client_token: null,
  qshare_user_token: null,
  is_fetching_client: false,
  is_fetching_user: false,
  error:{}
};

export default (state = initialState, action) => {
  switch (action.type){
    case FETCHING_CLIENT_TOKEN_LOADING:
      return {...state, is_fetching_client: true};
    case FETCHING_CLIENT_TOKEN_SUCCESS:
      const date =  moment().format('YYYY MM DD HH mm ss');
      AsyncStorage.setItem('qshare_client_token', action.payload);
      AsyncStorage.setItem('qshare_client_token_date', date);
      return {...state, qshare_client_token: action.payload, is_fetching_client: false};
    case FETCHING_CLIENT_TOKEN_ERROR:
      return {...state, error: action.payload, is_fetching_client: false};
    default:
      return state;
  }
}


