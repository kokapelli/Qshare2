import reducerSearch from '../../reducers/search'
import * as actions from '../../actions/search';
import getTracksMock from '../__mocks__/getTracksMock'

describe('Search reducer', () => {

    const initialState = {
        query: '',
        loading: false,
        error: {},
        songs: []
      };

    it('Should return the initial state', () => {
        expect(
            reducerSearch(undefined, 
                {})
        ).toEqual(initialState)
    })

    it('Should handle SEARCH_SONGS_LOADING', () => {
        expect(
            reducerSearch(initialState, 
                { type: actions.SEARCH_SONGS_LOADING})
        ).toEqual( 
            { ...initialState, 
                loading: true })
    })

    it('Should handle SEARCH_SONGS_SUCCESS', () => {
        
        expect(
            reducerSearch(initialState, 
                { type: actions.SEARCH_SONGS_SUCCESS,
                  payload: getTracksMock
                })
        ).toEqual(
            { ...initialState, 
                songs: getTracksMock,
                loading: false }
        )}
    )

    //unclear how or what the errors will look like
    it('Should handle SEARCH_SONGS_ERROR', () => {
        expect(
            reducerSearch(initialState, 
                { type: actions.SEARCH_SONGS_ERROR, 
                  payload: {error: "404"} 
                })
        ).toEqual(
            { ...initialState, 
                error: {error: "404"},
                loading: false,}
        )}
    )

    it('Should handle SET_SEARCH_STRING', () => {
        expect(
            reducerSearch(initialState, {
                type: actions.SET_SEARCH_STRING,
                payload: 'Pepe'
            })
        ).toEqual(
            {
                ...initialState,
                query: 'Pepe',
              }
        )}
    )
})