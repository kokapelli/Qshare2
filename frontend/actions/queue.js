import axios from 'axios'
import { API_QUEUE, API_BASE_URL, API_PLAY } from '../constants/API'
import { retrieveClientToken, retrieveUserToken } from './api'
import {settings} from '../settings/settings'

export const FETCH_PLAYLIST_ERROR = 'fetch_playlist_error'
export const FETCH_PLAYLIST_SUCCESS = 'fetch_playlist_success'
export const FETCH_PLAYLIST_LOADING = 'fetch_playlist_loading'

export const SET_QUEUE_ID = 'set_queue_id';

export const ADD_SONG_SUCCESS = 'add_song_success'
export const ADD_SONG_LOADING = 'add_song_loading'
export const ADD_SONG_ERROR = 'add_song_error'

export const CLEAR_QUEUE = 'clear_queue';
export const PLAY_QUEUE = 'play_queue';
export const PLAY_ERROR = 'play_error';
export const PLAY_SUCCESS = 'play_success';

export const fetchPlaylist = (queueID) => {
  return (dispatch) => {
    dispatch(fetchPlaylistLoading())
    retrieveClientToken()
      .then((token) => {
        if (token) {
          dispatch(fetchUserPlaylist(token, queueID))
        }
      })
      .catch(error => { throw error })
  }
}

const fetchUserPlaylist = (token, queueID) => {
  //console.log("Token:", token, "QueueID:", queueID)
  return (dispatch) => {
    if (token !== null) {
      return axios
        .get(API_BASE_URL + API_QUEUE + '/' + queueID, {
          headers: {
            'Provider': settings.provider,
            'Token': token
          },
        })
        .then(({data: {tracks: songs}}) => {
          dispatch(fetchPlaylistSuccess(songs))
        })
        .catch(error => {
          dispatch(fetchPlaylistError(error))
          throw error
        })
    }
  }
}

function fetchPlaylistSuccess (data) {
  return {
    type: FETCH_PLAYLIST_SUCCESS,
    payload: data
  }
}

function fetchPlaylistError (error) {
  return {
    type: FETCH_PLAYLIST_ERROR,
    payload: error
  }
}

function fetchPlaylistLoading () {
  return {
    type: FETCH_PLAYLIST_LOADING
  }
}

export const playQueue = (queueID) => {
  return (dispatch) => {
    retrieveUserToken()
      .then((token) => {
        if (token) {
          dispatch(play(token, queueID))
        }
      })
      .catch(error => { throw error })
  }
}

const play = (token, queueID) => {
  return (dispatch) => {
    if (token !== null) {
      return axios
        .put(API_BASE_URL + API_QUEUE + '/' + queueID + API_PLAY, JSON.stringify({}), {
          headers: {
            'Content-type': 'application/json',
            'Provider': settings.provider,
            'Token': token,
          },
        })
        .then(() => {
          dispatch(playSuccess())
        })
        .catch(error => {
          dispatch(playError(error))
          throw error
        })
    }
  }
}

function playSuccess () {
  return {
    type: PLAY_SUCCESS,
  }
}

function playError (error) {
  return {
    type: PLAY_ERROR,
    payload: error
  }
}

export const addSong = (queueID, song) => {
  return (dispatch) => {
    dispatch(addSongLoading())
    retrieveClientToken()
      .then((token) => {
        let body = JSON.stringify({
          track: song
        });
        axios.post(API_BASE_URL + API_QUEUE + '/' + queueID + '/tracks',body,
          {
            headers: {
              'Provider': settings.provider,
              'Token': token,
              'Content-type': 'application/json'
            }
          })
          .then(({data}) => {
            if (data && data.status === 'success'){
              dispatch(fetchPlaylist(queueID))
              dispatch(addSongSuccess())
            } else {
              const error = new Error('Failed to add song')
              dispatch(addSongError(error))
              throw error;
            }
          })
          .catch(error => {
            dispatch(addSongError(error))
            throw error
          })
      })
      .catch(error => {
        dispatch(addSongError(error))
      })
  }
}

function addSongSuccess () {
  return {
    type: ADD_SONG_SUCCESS,
  }
}

function addSongLoading () {
  return {
    type: ADD_SONG_LOADING
  }
}

function addSongError (error) {
  return {
    type: ADD_SONG_ERROR,
    payload: error
  }
}

export const setQueueIdOnCreateRoom = (queueID) => {
  return {
    type: SET_QUEUE_ID,
    payload: queueID

  }
}

export const clearQueue = () => {
  return {
    type:CLEAR_QUEUE,
  }
}

