import React, { Component } from 'react'
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native'
import { Icon } from 'expo'
import SongButton from '../components/SearchSongButton'
import { connect } from 'react-redux'
import { setSearchQuery, searchSongs } from '../actions/search'
import {addSong} from '../actions/queue'

/*Insert filter connected to Spotify API */
export class SearchScreen extends Component {
  static navigationOptions = {
    header: null,
  }

  componentWillReceiveProps (newProps){
    const {songAdded:songAddedOld, errorAdding:errorAddingOld} = this.props;
    const {songAdded,errorAdding} = newProps;

    //if song added songAddedOld = false, songAdded = true
    if (!songAddedOld && songAdded && !errorAdding){
      //display alert that it was successful.
      Alert.alert(
        'Queue',
        'Song added to queue.',
        [],
        {cancelable: true},
      );
    }

    if (!songAddedOld && !songAdded && errorAdding) {
      Alert.alert(
        'Queue',
        'Oh no! Something went wrong!',
        [],
        {cancelable: false},
      );
    }
  }

  onSubmit () {
    const {query} = this.props
    this.props.searchSongs(query)
  }

  _keyExtractor = (item, index) => {
    return item.uri
  }

  _renderItem = ({item}) => {
    return <SongButton item={item}/>
  }

  render () {
    const {query, songs} = this.props
    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity testID = 'searchButton' onPress={() => {}}>
              <Icon.Ionicons name={'md-search'} size={35} color="#999999"/>
            </TouchableOpacity>
          </View>
          <TextInput
            testID='searchInput' 
            style={styles.searchInput}
            placeholder="Search for a song"
            placeholderTextColor="gray"
            value={query}
            onChangeText={(text) => this.props.setSearchQuery(text)}
            onSubmitEditing={this.onSubmit.bind(this)}
          />
        </View>
        {
          songs && songs.length > 0 ? <View style={styles.headerContainer}>
            <Text testID='songsFound' style={styles.headerText}>Songs Found</Text>
          </View> : <Text/>
        }
        <View style={styles.resultsContainer}>
          <FlatList
            testID='songList' 
            data={songs}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    borderColor: '#999999',
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 50,
    margin: 10,
  },
  searchInput: {
    flex: 5,
    marginTop: 5,
    fontSize: 25,
    color: '#ffffff',
    marginBottom: 5
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  headerText: {
    marginLeft: 15,
    fontSize: 35,
    color: 'white',
  },
  resultsContainer: {
    flex: 11,
    color: '#282828',
    borderColor: '#383838',
    flexDirection: 'column',
  },
})

const mapStateToProps = (state) => ({
  songs: state.search.songs,
  query: state.search.query,
  songAdded: state.queue.songAdded,
  errorAdding: state.queue.errorAdding
})

export default connect(mapStateToProps, {setSearchQuery, searchSongs, addSong})(SearchScreen)