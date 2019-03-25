import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import expect from 'expect'
import * as actions from '../../actions/login'
import axios from '../../utils/axios';
import { API_LOGIN, API_BASE_URL } from "../../constants/API";
export const LOGIN_LOADING = 'login_loading';
export const LOGIN_ERROR = 'login_error';

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

// Functions used for testing the SEARCH_SONGS_ERROR state
// Unstable approach as any change made to original file would have to be made here
// Testing would improve by creating mock functions in the actions file
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

const errorsLogin = (token) => {
  return (dispatch) => {
    dispatch(loginLoading());
    let data = JSON.stringify({
      action: 'redirect'
    });
    return axios
      .get(API_BASE_URL + API_LOGIN, data, {
        headers:{
          'Token': token,
          'Content-Type': 'application/json'
        },
      })
      .then(({data:{url}}) => {loginSuccess(url)})
      .catch(error => {
        dispatch(loginError(error));
        return error
      });
  }
}

////////////////////////////////////////
/////////////////Testing////////////////
/////////////////////////////////////////

describe('Login Actions', () => {

  beforeEach(function () {
    store = mockStore()
  })


  it('Dispatches an incorrect request to errorLogin to simulate LOGIN_ERROR', () => {
    return store.dispatch(errorsLogin()).then(() => {

      const error = store.getActions()[1].payload
      const expectedActions = [
        { type: actions.LOGIN_LOADING },
        { type: actions.LOGIN_ERROR, payload: error },
      ];

      const actualActions = store.getActions()
      expect(actualActions).toEqual(expectedActions);
      expect(errorsLogin()).toThrowError()
    })
  })
})

