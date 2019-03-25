import {combineReducers} from 'redux';
import Font from './font';
import Search from './search';
import Queue from './queue';
import Login from './login';
import Api from './api';
import Room from './room';

export default combineReducers({
  font: Font,
  search: Search,
  queue: Queue,
  login: Login,
  api: Api,
  room: Room
});