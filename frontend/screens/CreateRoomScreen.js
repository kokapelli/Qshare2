import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { createRoom } from '../actions/room';

class CreateRoomScreen extends React.Component
{
    componentWillReceiveProps(newProps)
    {
        if (newProps.roomID != '')
        {
            this.props.navigation.navigate('Host');
        }
    }

    render()
    {
        if (this.props.error)
        {
            return (
                <View>
                    <Text>{ JSON.stringify(this.props.error)}</Text>
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
    loading: state.room.loading
})

export default connect(mapStateToProps, { createRoom })(CreateRoomScreen);