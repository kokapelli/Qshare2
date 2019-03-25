import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import expect from 'expect' 
import * as actions from '../../actions/search'
import axios from '../../utils/axios';
import { API_TRACKS, API_BASE_URL } from "../../constants/API";
export const SEARCH_SONGS_LOADING = 'search_songs_loading';
export const SEARCH_SONGS_ERROR = 'search_songs_error';

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

// Functions used for testing the SEARCH_SONGS_ERROR state
// Unstable approach as any change made to original file would have to be made here
// Testing would improve by creating mock functions in the actions file
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

const errorSearchSongs = (query) => {
    return (dispatch) => {
      dispatch(searchSongsLoading());
      return axios
        .get(API_BASE_URL + API_TRACKS + '?title=' + query,{
          headers:{
            'Provider': "Spootify"
          },
        })
        .then(({data:{tracks:songs}}) => { dispatch(searchSongsSuccess(songs))})
        .catch(error => {
          dispatch(searchSongsError(error));
          return error
        });
    }
}

  ////////////////////////////////////////
 /////////////////Testing////////////////
/////////////////////////////////////////

describe('Search Actions', () => {

    beforeEach(function () {
        store = mockStore()
      })

    it('Dispatches SEARCH_SONGS_LOADING followed by SET_SEARCH_STRING, does not get', () => {

        const expectedActions = [
            { type: actions.SEARCH_SONGS_LOADING },
            { type: actions.SET_SEARCH_STRING, payload: "Tiesto" },
        ];

        store.dispatch(actions.setSearchQuery("Tiesto"))

        const actualActions = store.getActions()
        expect(actualActions).toEqual(expectedActions);
    });


    it('Dispatches SET_SEARCH_STRING with no query input, does not get', () => {
        const expectedActions = [
            { type: actions.SET_SEARCH_STRING, payload: "" },
        ];

        store.dispatch(actions.setSearchQuery(""))

        const actualActions = store.getActions()
        expect(actualActions).toEqual(expectedActions);
    })

    // TODO implement expectad actions. May require mocks
    // As the received payload must be used to test the fetch
    // Alternatively fetch twice and compare the results.

    /*it('Dispatches get request for a track using the query "Tiesto" and searchSong', () => {
        const query = "Tiesto"
        return store.dispatch(actions.searchSongs(query)).then(() => {

            const data = store.getActions()[1].payload
            const expectedActions = [
                { type: actions.SEARCH_SONGS_LOADING },
                { type: actions.SEARCH_SONGS_SUCCESS, payload: data },
            ];

            const actualActions = store.getActions()
            expect(actualActions).toEqual(expectedActions);
        })        
    })*/

    it('Dispatches an incorrect request to errorSearchSong to simulate SET_SONGS_ERROR', () => {
        return store.dispatch(errorSearchSongs()).then(() => {

            const error = store.getActions()[1].payload
            const expectedActions = [
                { type: actions.SEARCH_SONGS_LOADING },
                { type: actions.SEARCH_SONGS_ERROR, payload: error },
            ];

            const actualActions = store.getActions()
            expect(actualActions).toEqual(expectedActions);
            expect(errorSearchSongs()).toThrowError()
        })        
    })
})

