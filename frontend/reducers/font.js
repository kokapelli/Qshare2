import {SET_FONT_LOADED} from '../actions/font';

const initialState = {
  fontLoaded: false
};

export default (state = initialState, action) => {
  switch (action.type){
    case SET_FONT_LOADED:
      return {...state, fontLoaded:true};
    default:
      return state;
  }
}