import React, {Component}  from 'react';
import {connect} from 'react-redux';
import { TouchableOpacity, Text, StyleSheet, View, } from 'react-native';
import { Icon } from 'expo';
import _ from 'lodash';
import {addSong} from '../actions/queue'

export class SearchSongButton extends Component
{
  render () {
    const {item, queueID} = this.props;
    if (item && queueID) {
      const {artists} = item;
      const name = _.truncate(item.name, {length:20});
      const artist = artists[0]? _.truncate(artists[0].name, {length:20}):'Undefined';
      return (
        <View style={styles.searchItem}>
          <View style={styles.songName}>
            <Text testID='songDetails' style={styles.songText}>
              {name} - {artist}
            </Text>
          </View>
          <TouchableOpacity 
                testID='addSong' 
                style={styles.addButton} 
                onPress={() => {this.props.addSong(queueID, item)}}>
            <Icon.Ionicons 
              testID='addSongIcon' 
              name={'md-add'} 
              size={50} 
              color="white"/>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <View style={styles.searchItem}>
        <Text />
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  queueID: state.queue.queueID
})

export default connect(mapStateToProps, {addSong})(SearchSongButton)

const styles = StyleSheet.create({
  searchItem: {
    height: 80,
    borderWidth: 1,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 50,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    borderColor: '#383838',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#282828',
  },
  songName: {
    flex: 4,
    justifyContent: 'center',
    backgroundColor: '#282828',
    zIndex: 2
  },
  songText: {
    color: 'white',
    fontSize: 25,
  },
  addButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'transparent',
  },
})
