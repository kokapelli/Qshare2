import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import expect from 'expect' 
import * as actions from '../../actions/queue'
import { retrieveUserToken } from '../../actions/api'
import axios from '../../utils/axios';
import { API_TRACKS, API_BASE_URL } from "../../constants/API";

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const QUEUE_ID = "76f3c205-b9ac-4017-98ce-4aa99893622c"

  ////////////////////////////////////////
 /////////////////Testing////////////////
/////////////////////////////////////////


describe('Queue Actions', () => {

    /*
    beforeEach(function () {
        store = mockStore()
      })
      */
      it('Dispatches fetchPlaylist expecting an error', () => {
        /* NON FUNCTIONAL TEST
        const expectedActions = [
            { type: actions.FETCH_PLAYLIST_LOADING },
            { type: actions.SET_SEARCH_STRING, payload: QUEUE_ID },
        ];

        const actualActions = store.getActions()

        store.dispatch(actions.fetchPlaylist(QUEUE_ID))
        expect(actualActions).toEqual(expectedActions);
        */
    })

})
