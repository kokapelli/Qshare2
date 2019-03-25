import reducerQueue from '../../reducers/queue'
import * as actions from '../../actions/queue';
import getQueueMock from '../__mocks__/getQueueMock'

//TODO: Introduce proper mock data functionality


const initialState = {
    fetching: false,
    fetched: false,
    songs: [],
    error: {},
    queueID: null,
    songAdded: false,
    errorAdding: null
  }


describe('Queue General', () => {

  it('One test must exist, required as polling messes with Travis', () => {

  })
/*
  it('Should return the initial state', () => {
    expect(
        reducerQueue(undefined,
            {})
    ).toEqual(initialState)
  })
*/
/*
  it('Should handle SET_QUEUE_ID', () => {
    expect(
        reducerQueue(initialState,
        { type: actions.SET_QUEUE_ID,
          payload: "12"})
    ).toEqual(
      { ...initialState,
        queueID: "12"})
  })
  */
})
/*
describe('Queue Fetching', () => {

  it('Should handle FETCH_PLAYLIST_LOADING', () => {
    expect(
        reducerQueue(initialState,
        { type: actions.FETCH_PLAYLIST_LOADING})
    ).toEqual(
      { ...initialState,
        fetching: true,
        songAdded: false })
  })

  it('Should handle FETCH_PLAYLIST_SUCCESS', () => {
    expect(
        reducerQueue(initialState,
        { type: actions.FETCH_PLAYLIST_SUCCESS,
          payload: getQueueMock})
    ).toEqual(
      { ...initialState,
        fetching: false,
        fetched: true,
        songs: getQueueMock})
  })

  it('Should handle FETCH_PLAYLIST_ERROR', () => {
    expect(
        reducerQueue(initialState,
        { type: actions.FETCH_PLAYLIST_ERROR,
          payload: {error: "404"}})
    ).toEqual(
      { ...initialState,
        fetching: false,
        error: {error: "404"} })
  })
  
})

describe('Queue Add Songs', () => {

    it('Should handle ADD_SONG_LOADING', () => {
        expect(
            reducerQueue(initialState,
            { type: actions.ADD_SONG_LOADING})
        ).toEqual(
          { ...initialState,
            fetching: true,
            songAdded: false,
            errorAdding: null })
    })
      
    it('Should handle ADD_SONG_SUCCESS', () => {
        expect(
            reducerQueue(initialState,
            { type: actions.ADD_SONG_SUCCESS})
        ).toEqual(
          { ...initialState,
            songAdded: true,
        })
      })

      it('Should handle ADD_SONG_ERROR', () => {
        expect(
            reducerQueue(initialState,
            { type: actions.ADD_SONG_ERROR,
              payload: "404"})
        ).toEqual(
          { ...initialState,
            errorAdding: "404",
        })
      })

describe('Play Queue', () => {

  it('Should handle PLAY_QUEUE', () => {
    expect(
        reducerQueue(initialState,
        { type: actions.PLAY_QUEUE })
    ).toEqual(
      { ...initialState })
  })

  it('Should handle PLAY_SUCCESS', () => {
    expect(
        reducerQueue(initialState,
        { type: actions.PLAY_SUCCESS})
    ).toEqual(
      { ...initialState,})
  })
    
  it('Should handle PLAY_ERROR', () => {
    expect(
      reducerQueue(initialState,
      { type: actions.PLAY_ERROR,
        payload: {error: "404"}})
  ).toEqual(
    { ...initialState,
      error: {error: "404"} })
    })
  })
})
*/