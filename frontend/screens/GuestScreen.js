import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import ConnectedButton from '../components/ConnectedButton'

class GuestScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}> 
          <Text style={styles.headerText}> Connected Users </Text>
        </View>
        <View style={styles.connectedContainer}>
        <ScrollView>
          <ConnectedButton/>
          <ConnectedButton/>
          <ConnectedButton/>
          <ConnectedButton/>
          <ConnectedButton/>
          <ConnectedButton/>
        </ScrollView>
        </View>
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
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 35,
    color: 'white',
  },
  connectedContainer: {
    flex: 9,
  },
});

export default GuestScreen