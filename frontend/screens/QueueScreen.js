import React from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Icon } from 'expo'
import { connect } from 'react-redux'
import QueueSongButton from '../components/QueueSongButton'
import { fetchPlaylist, playQueue } from '../actions/queue';


export class QueueScreen extends React.Component {

  static navigationOptions = {
    header: null,
  }

  componentDidMount(){
    const {queueID} = this.props;
    //Checking to see if the queue has changed every 5 seconds
    this.timer = setInterval(()=> this.props.fetchPlaylist(queueID), 5000);
  }

  //Stop Polling whenever client disconnects
  componentWillUnmount(){
    clearInterval(this.timer)
    this.timer = null;
  }

  render () {
    const {songs, queueID} = this.props;
    if (songs && queueID) {
      let queueSize = songs.length
      let songsMap = songs.map((item, key) => {
        return <View key={key} style={styles.item}>
          <QueueSongButton track={item.data}/>
        </View>
      })
      return (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text 
              testID='nonEmpty' 
              style={styles.headerText}>
              {queueSize} Songs in the queue {'\n'} 
            </Text>
          </View>
          <View style={styles.queueContainer}>
            <ScrollView>
              {songsMap}
            </ScrollView>
          </View>
          <View style={styles.playContainer}>
              <TouchableOpacity testID='playButton' style={styles.playButton} testID = 'playButton' onPress={() => {this.props.playQueue(queueID)}}>
                <Icon.Ionicons name={'md-play'} size={35} color="white"/>
              </TouchableOpacity>
          </View>
        </View>
      )
    }
    return (
      <View>
        <Text testID='empty'> Empty Queue.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
  },
  headerContainer: {
    flex: 1,
    backgroundColor: '#181818',
    justifyContent: 'center',
  },
  headerText: {
    paddingTop: 15,
    fontSize: 25,
    color: 'white',
    flex: 1,
    textAlign: 'center'
  },
  playContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 15,
  },
  playButton: {
    borderWidth: 1,
    borderColor: '#383838',
    alignItems: 'center',
    justifyContent: 'center',
    width: 65,
    height: 65,
    backgroundColor: '#383838',
    borderRadius: 100,
  },
  queueContainer: {
    flex: 10,
  },
  item: {
    flex: 1,

  }
})

//Connects to the variable given in rootReducer

const mapStateToProps = (state) => ({
  songs: state.queue.songs,
  fetching: state.queue.fetching,
  fetched: state.queue.fetched,
  queueID: state.queue.queueID
})

export default connect(mapStateToProps, {fetchPlaylist, playQueue})(QueueScreen)