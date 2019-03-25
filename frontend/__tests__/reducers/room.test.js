import room from '../../reducers/room'
import * as actions from '../../actions/room';
import createRoomMock from '../__mocks__/createRoomMock';

describe('Room reducer', () => {

    const initialState = {
        roomID: null,
        loading: false,
        joinedStatus: null,
        error: {},
      };

    it('Should return the initial state', () => {
        expect(
            room(undefined, 
                {})
        ).toEqual(initialState)
    })

      // //////////// //  
     // CREATE TESTS //
    // //////////// //  
    it('Should handle CREATE_ROOM_LOADING', () => {
        expect(
            room(initialState, 
                { type: actions.CREATE_ROOM_LOADING})
        ).toEqual( 
            { ...initialState, 
                loading: true })
    })

    it('Should handle CREATE_ROOM_SUCCESS', () => {
        expect(
            room(initialState, 
                { type: actions.CREATE_ROOM_SUCCESS, 
                  payload: createRoomMock.roomID
                })
        ).toEqual(
            { ...initialState, 
                roomID: createRoomMock.roomID,
                loading: false }
        )}
    )

    it('Should handle CREATE_ROOM_ERROR', () => {
        expect(
            room(initialState, 
                { type: actions.CREATE_ROOM_ERROR,
                  payload: {error: "404"} 
                })
       ).toEqual(
            { ...initialState, 
                error: {error: "404"},
                loading: false,}
        )}
    )

      // ////////// //  
     // JOIN TESTS //
    // ////////// //  
    it('Should handle JOIN_ROOM_LOADING', () => {
        expect(
            room(initialState, 
                { type: actions.JOIN_ROOM_LOADING})
        ).toEqual( 
            { ...initialState, 
                loading: true })
    })

    it('Should handle JOIN_ROOM_SUCCESS', () => {
        expect(
            room(initialState, 
                { type: actions.JOIN_ROOM_SUCCESS, 
                  payload: "ad3b3f41-9133-443e-acc6-aa30d2367b48",
                })
        ).toEqual(
            { ...initialState, 
                roomID: "ad3b3f41-9133-443e-acc6-aa30d2367b48",
                joinedStatus:true,
                loading: false,}
        )}
    )

    it('Should handle JOIN_ROOM_ERROR', () => {
        expect(
            room(initialState, 
                { type: actions.JOIN_ROOM_ERROR,
                  payload: {error: "404"} 
                })
        ).toEqual(
            { ...initialState, 
                error: {error: "404"},
                joinedStatus:false,
                loading: false }
        )}
    )
})