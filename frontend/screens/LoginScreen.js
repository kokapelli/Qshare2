import React, { Component } from 'react'
import { connect } from 'react-redux'
import { StyleSheet, View, Text, TouchableOpacity} from 'react-native'
import { login } from '../actions/login'

export class LoginScreen extends Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount () {
    this.props.login()
  }

  componentWillReceiveProps(newProps){
    if (newProps.redirect && newProps.success){
      this.props.navigation.navigate('CreateRoom');
    }
  }

  render () {
    const {loading, error} = this.props;
    if (loading){
      return (
        <View style={styles.container}>
          <Text testID='loading' style={styles.buttonText}>Loading...</Text>
        </View>)
    }

    if (error){
      return (
        <View style={styles.container}>
          <Text testID='errorText' style={styles.buttonText}>Something went wrong</Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Main')}>
            <Text testID='errorBtn' style={styles.buttonText}>Go back!</Text>
          </TouchableOpacity>
        </View>)
    }

    return (
      <View style={styles.container}/>
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
    borderColor: '#999999',
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

const mapStateToProps = (state) => ({
  loading: state.login.loading,
  redirect: state.login.redirect,
  success: state.login.success,
  error: state.login.error
})

export default connect(mapStateToProps, {login})(LoginScreen)
