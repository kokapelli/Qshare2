import reducerLogin from '../../reducers/login'
import * as actions from '../../actions/login';

//TODO: Introduce proper mock data functionality

describe('Search reducer', () => {

  const initialState = {
    loading: false,
    success: false,
    redirect: false,
    error: {}
  };

  it('Should return the initial state', () => {
    expect(
      reducerLogin(undefined,
        {})
    ).toEqual(initialState)
  })

  it('Should handle LOGIN_LOADING', () => {
    expect(
      reducerLogin(initialState,
        { type: actions.LOGIN_LOADING})
    ).toEqual(
      { ...initialState,
        loading: true })
  })


  it('Should handle LOGIN_SUCCESS', () => {

    expect(
      reducerLogin(initialState,
        { type: actions.LOGIN_SUCCESS,
          payload: "ashdjfhjkashfajkshdfj"
        })
    ).toEqual(
      { ...initialState,
        success: true,
        loading: false,
        redirect: true}
    )}
  )

  //unclear how or what the errors will look like
  it('Should handle LOGIN_ERROR', () => {
    expect(
      reducerLogin(initialState,
        { type: actions.LOGIN_ERROR,
          payload: {error: "404"}
        })
    ).toEqual(
      { ...initialState,
        error: {error: "404"},
        loading: false,}
    )}
  )
})