import React, { Component } from 'react';
import { Text, StyleSheet, View, } from 'react-native';
import _ from 'lodash';

export class QueueSongButton extends Component{
    render(){
      const {track} = this.props;
      const {artists} = track;
      const name = _.truncate(track.name, {length:20});
      const artist = artists[0]? _.truncate(artists[0].name, {length:20}):'Undefined';
        return(
            <View style={styles.queueItem}>
                <View style={styles.songName}>
                    <Text testID='songDetails' style={styles.songText}>
                        {name} - {artist}
                    </Text>
                </View>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    queueItem: {
        height: 60,
        borderWidth: 1,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 50,
        marginTop: 5,
        borderColor: '#383838',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#282828',
        margin: 3,
      },
    songName: {
        flex: 4,
        justifyContent: 'center',
        backgroundColor: '#282828',
    },
    songText: {
        color: 'white',
        fontSize: 20,
    },
    voteButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffea00',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
  });

export default QueueSongButton