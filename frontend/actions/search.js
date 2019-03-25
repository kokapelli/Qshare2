import axios from '../utils/axios';
import { API_TRACKS, API_BASE_URL } from "../constants/API";
import { settings } from '../settings/settings'
import { retrieveClientToken } from './api'
export const SET_SEARCH_STRING = 'set_search_string';
export const SEARCH_SONGS_LOADING = 'search_songs_loading';
export const SEARCH_SONGS_SUCCESS = 'search_songs_success';
export const SEARCH_SONGS_ERROR = 'search_songs_error';
export const CLEAR_SEARCH = 'clear_search';

export const setSearchQuery = (query) => {
  return (dispatch) => {
    if (query && query.length > 0){
      dispatch(searchSongs(query));
    }
    dispatch(setSearchQuerySuccess(query));
  }
};

function setSearchQuerySuccess(query){
  return {
    type: SET_SEARCH_STRING,
    payload: query
  };
}

export const searchSongs = (query) => {
  return (dispatch) => {
    dispatch(searchSongsLoading());
    return retrieveClientToken()
      .then((token) => {
        return axios
          .get(API_BASE_URL + API_TRACKS + '?title=' + query,{
            headers:{
              'Provider': settings.provider,
              'Token': token
            },
          })
          .then(({data:{tracks:songs}}) => { dispatch(searchSongsSuccess(songs))})
          .catch(error => {
            dispatch(searchSongsError(error));
            throw error
          });
        })
      .catch((error) => {
        dispatch(searchSongsError(error));
        throw error
      });
  }
}

function searchSongsSuccess(data){
  return {
    type: SEARCH_SONGS_SUCCESS,
    payload: data
  };
}

function searchSongsLoading(){
  return {
    type: SEARCH_SONGS_LOADING
  };
}

function searchSongsError(error){
  return {
    type: SEARCH_SONGS_ERROR,
    payload:error
  };
}

export const clearSearch = () => {
  return {
    type: CLEAR_SEARCH
  }
}