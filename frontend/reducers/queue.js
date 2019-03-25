import {
  FETCH_PLAYLIST_LOADING,
  FETCH_PLAYLIST_SUCCESS,
  FETCH_PLAYLIST_ERROR,
  ADD_SONG_LOADING,
  ADD_SONG_SUCCESS,
  ADD_SONG_ERROR,
  SET_QUEUE_ID, 
  CLEAR_QUEUE,
  PLAY_QUEUE,
  PLAY_SUCCESS,
  PLAY_ERROR,
} from '../actions/queue'
  
  const initialState = {
    fetching: false,
    fetched: false,
    songs: [],
    error: {},
    queueID: null,
    songAdded: false,
    errorAdding: null
  }

  export default (state = initialState, action) => {
    switch (action.type){
      case FETCH_PLAYLIST_LOADING:
      return {...state, fetching: true};
      case FETCH_PLAYLIST_SUCCESS:      
        return {...state, fetching: false, fetched: true,  songs: action.payload};
      case FETCH_PLAYLIST_ERROR:
        return {...state, fetching: false, error: action.payload};
      case ADD_SONG_LOADING:
        return {...state, fetching: true, songAdded: false , errorAdding: null};
      case ADD_SONG_SUCCESS:
        return {...state, songAdded: true};
      case ADD_SONG_ERROR:
        return {...state, errorAdding: action.payload};
      case SET_QUEUE_ID:
        return {...state, queueID: action.payload};
      case CLEAR_QUEUE:
        return {...state};
      case PLAY_QUEUE:
        return {...state};
      case PLAY_SUCCESS:
        return {...state};
      case PLAY_ERROR:
        return {...state, error: action.payload};
      default:
        return state;
    }
  }