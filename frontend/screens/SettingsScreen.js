import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';


class SettingsScreen extends Component {
  
  static navigationOptions = {
    header: null,
  };
  render() {
    return (
        <View style={styles.container}>
              <Text style={styles.headerText}>This is the Settings Screen</Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Main')}>
                <Text testID='errorBtn' style={styles.buttonText}>Go back!</Text>
              </TouchableOpacity>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#181818',
},
headerText: {
  fontFamily: 'caviar-dreams-bold',
  height: '35%',
  fontSize: 30,
  textAlign: 'center',
  margin: 10,
  color: 'white',
},
});

export default SettingsScreen