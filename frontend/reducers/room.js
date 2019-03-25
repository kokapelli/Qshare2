import {
  CREATE_ROOM_LOADING,
  CREATE_ROOM_SUCCESS,
  CREATE_ROOM_ERROR,
  JOIN_ROOM_LOADING,
  JOIN_ROOM_SUCCESS,
  JOIN_ROOM_ERROR, CLEAR_ROOM
} from '../actions/room'

const initialState = {
  roomID: null,
  loading: false,
  error: {},
  joinedStatus: null
};

export default (state = initialState, action) => {
  switch (action.type){
      case CREATE_ROOM_LOADING:
        return{...state, loading:true};
      case CREATE_ROOM_SUCCESS:
        return{...state, roomID:action.payload, loading:false};
      case CREATE_ROOM_ERROR:
        return{...state, error:action.payload, loading:false};

      case JOIN_ROOM_LOADING:
        return{...state, loading:true};
      case JOIN_ROOM_SUCCESS:
        return{...state, roomID:action.payload, loading:false, joinedStatus:true, error:{}};
      case JOIN_ROOM_ERROR:
        return{...state, error:action.payload, loading:false, joinedStatus:false};
    case CLEAR_ROOM:
        return {...initialState};
      default:
        return state;
  }
}