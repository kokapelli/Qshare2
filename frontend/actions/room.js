import axios from '../utils/axios';
import { API_ROOM, API_BASE_URL } from "../constants/API";
import { ERROR_CREATE_ROOM, ERROR_JOIN_ROOM } from "../constants/LanguageEnglish"
import { retrieveClientToken, retrieveUserToken } from './api'
import { settings } from '../settings/settings'
import { setQueueIdOnCreateRoom } from './queue'
export const CREATE_ROOM_LOADING = 'create_room_loading';
export const CREATE_ROOM_SUCCESS = 'create_room_success';
export const CREATE_ROOM_ERROR = 'create_room_error';
export const JOIN_ROOM_LOADING = 'join_room_loading';
export const JOIN_ROOM_SUCCESS = 'join_room_success';
export const JOIN_ROOM_ERROR = 'join_room_error';
export const CLEAR_ROOM = 'clear_room';

export const createRoom = () => {
  return (dispatch) => {
    dispatch(createRoomLoading());

    retrieveUserToken()
      .then((token) => {
        if (token){
          axios
            .post(API_BASE_URL + API_ROOM,JSON.stringify({}), {
              headers:{
                'Provider': settings.provider,
                'Token': token,
              }
            })
            .then(({data}) => {
              if (data.status === "success") {
                dispatch(createRoomSuccess(data.roomID));
                dispatch(setQueueIdOnCreateRoom(data.queueID))
              } else {
                dispatch(createRoomError(ERROR_CREATE_ROOM));
                throw new Error(ERROR_CREATE_ROOM)
              }
            })
            .catch(error => {
              dispatch(createRoomError(error));
              throw(error)
            });
        } else {
          dispatch(createRoomError(CREATE_ROOM_ERROR));
        }
      })
      .catch(error => {throw error});
  }
}

export const joinRoom = (roomID) => {
  return (dispatch) => {
    dispatch(joinRoomLoading());
    retrieveClientToken()
      .then((token) => {
        if (token){
          let data = JSON.stringify({
            action: 'join',
            roomID: roomID
          });
          axios
            .put(API_BASE_URL + API_ROOM, data, {
              headers:{
                'Provider': settings.provider,
                'Token': token,
                'Content-type': 'application/json'
              }
            })
            .then((response) => {
              if (response.data.status === "success") {
                dispatch(joinRoomSuccess(roomID));
                dispatch(setQueueIdOnCreateRoom(response.data.queueID))
              } else {
                dispatch(joinRoomError(JOIN_ROOM_ERROR));
              }
            })
            .catch(error => {
              dispatch(joinRoomError(error));
              throw(error)
            });
        } else {
          dispatch(joinRoomError(JOIN_ROOM_ERROR));
        }
      })
      .catch(error => {throw error});
  }
}

function createRoomSuccess(roomID){
  return {
    type: CREATE_ROOM_SUCCESS,
    payload: roomID
  };
}

function createRoomLoading(){
  return {
    type: CREATE_ROOM_LOADING
  };
}

function createRoomError(error){
  return {
    type: CREATE_ROOM_ERROR,
    payload:error
  };
}

function joinRoomSuccess(roomID){
  return {
    type: JOIN_ROOM_SUCCESS,
    payload: roomID
  };
}

function joinRoomLoading(){
  return {
    type: JOIN_ROOM_LOADING
  };
}

function joinRoomError(error){
  return {
    type: JOIN_ROOM_ERROR,
    payload:error
  };
}

export const clearRoom = () => {
  return {
    type: CLEAR_ROOM
  }
}
