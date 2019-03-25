import React, { Component } from 'react';
import QRCode from 'react-native-qrcode';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import {CLIENT_ID} from '../constants/Provider';

class HostScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const {roomID} = this.props;
    if (roomID){
      return (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Room{'\n'}{roomID}</Text>
            <Text style={styles.headerText}>Device{'\n'}{CLIENT_ID}</Text>
          </View>
          <View style={styles.qrContainer}>
            <QRCode
              value={this.props.roomID}
              size={250}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
              No QR code.
            </Text>
          </View>
        </View>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  roomID: state.room.roomID
})

export default connect(mapStateToProps)(HostScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    flex: 1,
    alignItems:'center',
    justifyContent: 'flex-start',
    marginTop:15
  },
  headerText: {
    flex:1,
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
  },
  qrContainer:{
    flex:3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reloadContainer: {
    flex: 1,
    top: 0,
    marginTop: 10,
    alignItems: 'center',
  },
  reloadLinkText: {
    fontSize: 20,
    color: '#2e78b7',
  },
});