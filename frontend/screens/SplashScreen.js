import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import SnackBar from 'react-native-snackbar-component'
import { connect } from 'react-redux'
import { clientLogin } from '../actions/login'

export class SplashScreen extends Component {
  state = {
    showSnackError: false
  }

  static navigationOptions = {
    header: null
  }

  componentDidMount () {
    this.props.clientLogin()
    if (this.props.navigation.getParam('error', null)) {
      this.setState({
        showSnackError: true
      })
      setTimeout(
        () =>
          this.setState({
            showSnackError: false
          }),
        6000
      )
    }
  }

  render () {
    const error = this.props.navigation.getParam('error', null)
    const {navigate} = this.props.navigation

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text
            style={styles.headerText}>
            QShare
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            testID='host'
            style={styles.button}
            onPress={() => navigate('Login')}
          >
            <Text style={styles.buttonText}> Create a Room </Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID='guest'
            style={styles.button}
            onPress={() => navigate('Scanner')}
          >
            <Text style={styles.buttonText}>
              {' '}
              Join an Existing Room{' '}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.founderContainer}>
          <Text style={styles.founderText}>
            {' '}
            Created for PSS 2019, Uppsala University{' '}
          </Text>
        </View>
        <SnackBar
          visible={this.state.showSnackError}
          textMessage={error}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181818'
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 80,
    textAlign: 'center',
    margin: 10,
    color: 'white'
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  button: {
    borderWidth: 1,
    margin: 5,
    borderColor: '#1df954',
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    height: 70,
    backgroundColor: '#1db954',
    borderRadius: 100
  },
  buttonText: {
    color: 'white',
    fontSize: 20
  },
  founderContainer: {
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 10
  },
  founderText: {
    color: 'white',
    fontSize: 15
  }
})

export default connect(null, {clientLogin})(SplashScreen)
