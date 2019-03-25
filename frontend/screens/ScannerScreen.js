import { BarCodeScanner, Permissions } from 'expo';
import React, { Component } from 'react';
import { Alert, Dimensions, LayoutAnimation, Text, View, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';

export default class ScannerScreen extends Component {
  state = {
    hasCameraPermission: null,
    lastScannedUrl: null,
  };

  componentDidMount() {
      this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _handleBarCodeRead = result => {
    if (result.data !== this.state.lastScannedUrl) {
      LayoutAnimation.spring();
      this.setState({ lastScannedUrl: result.data });
    }
  };

  render() {
    return (
        <View style={styles.container}>
          {this.state.hasCameraPermission === null
            ? <Text>Requesting for camera permission</Text>
            : this.state.hasCameraPermission === false
                ? <Text style={{ color: '#fff' }}>
                    Camera permission is not granted
                  </Text>
                : <BarCodeScanner
                    onBarCodeRead={this._handleBarCodeRead.bind(this)}
                    style={{
                      height: Dimensions.get('window').height,
                      width: Dimensions.get('window').width,
                      }}
                  />}
          {this._renderStatus()}
          <StatusBar hidden />
        </View>
      );
  }

  _handlePressUrl = () => {
    const { navigate } = this.props.navigation
    Alert.alert(
       'Join room beloning to User',
       this.state.lastScannedUrl,
       [
         {
             text: 'Yes',
             onPress: () => navigate("JoinRoom", { roomID: this.state.lastScannedUrl })
             //onPress: () => Linking.openURL(this.state.lastScannedUrl),
           },
         { text: 'No', onPress: () => {} },
       ],
       { cancellable: false }
     );
  };

  _handlePressCancel = () => {
    this.setState({ lastScannedUrl: null });
  };

  _renderStatus = () => {
    const { navigate } = this.props.navigation
    if (!this.state.lastScannedUrl) {
        return (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigate('JoinRoom')}>
            <Text style={styles.cancelButtonText}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
        );
    }

    return (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.url} onPress={this._handlePressUrl}>
            <Text numberOfLines={1} style={styles.urlText}>
              Join Room
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={this._handlePressCancel}>
            <Text style={styles.cancelButtonText}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      );
  };
}

const styles = StyleSheet.create({
   container: {
     flex: 1,
     alignItems: 'center',
     justifyContent: 'center',
     backgroundColor: '#000',
   },
   bottomBar: {
     position: 'absolute',
     bottom: 0,
     left: 0,
     right: 0,
     backgroundColor: 'rgba(0,0,0,0.5)',
     padding: 15,
     flexDirection: 'row',
   },
   url: {
     flex: 1,
   },
   urlText: {
     color: '#fff',
     fontSize: 20,
   },
   cancelButton: {
     marginLeft: 10,
     alignItems: 'center',
     justifyContent: 'center',
   },
   cancelButtonText: {
     color: 'rgba(255,255,255,0.8)',
     fontSize: 18,
   },
});
