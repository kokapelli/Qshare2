import {
  SET_SEARCH_STRING,
  SEARCH_SONGS_LOADING,
  SEARCH_SONGS_SUCCESS,
  SEARCH_SONGS_ERROR,
  CLEAR_SEARCH
} from '../actions/search';

const initialState = {
  query: '',
  loading: false,
  error: {},
  songs: []
};

export default (state = initialState, action) => {
  switch (action.type){
    case SET_SEARCH_STRING:
      return {...state, query: action.payload};
    case SEARCH_SONGS_LOADING:
      return {...state, loading: true};
    case SEARCH_SONGS_SUCCESS:
      return {...state, songs: action.payload, loading: false};
    case SEARCH_SONGS_ERROR:
      return {...state, error: action.payload, loading: false}
    case CLEAR_SEARCH:
      return {...initialState};
    default:
      return state;
  }
}