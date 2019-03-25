import React from 'react';
import { ActivityIndicator, View, Text,TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { joinRoom } from '../actions/room';

class JoinRoomScreen extends React.Component
{
    componentDidMount()
    {
        const roomID = this.props.navigation.getParam('roomID');
        this.props.joinRoom(roomID)
    }

    componentWillReceiveProps(newProps)
    {
      const {joinedStatus: newJoinedStatus} = newProps;
      if (newJoinedStatus) {
        this.props.navigation.navigate('Guest');
      }
    }

    render()
    {
        if (this.props.error)
        {
            return (
                <View style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text>Something went wrong</Text>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Main')}
                  >
                    <Text>Go back!</Text>
                  </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text>{ JSON.stringify(this.props) }</Text>
                <ActivityIndicator size="large" />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    error: state.room.error,
    roomID: state.room.roomID,
    loading: state.room.loading,
    joinedStatus: state.room.joinedStatus
})

export default connect(mapStateToProps, { joinRoom })(JoinRoomScreen);

//export default connect((state) => {
//    return {
//        ...state.joinRoom
//    };
//}, { joinRoom })(JoinRoomScreen);