import React, { Component } from 'react';
import AppNavigator from './navigation/AppNavigator';
import { Font } from 'expo';
import {Provider} from 'react-redux';
import configureStore from './store/index.js';

class App extends Component {

  async componentDidMount(){
    await Font.loadAsync({
      'caviar-dreams-bold': require('./assets/fonts/Caviar_Dreams_Bold.ttf'),
      'caviar-dreams': require('./assets/fonts/CaviarDreams.ttf'),
      'caviar-dreams-bold-italic': require('./assets/fonts/CaviarDreams_BoldItalic.ttf'),
      'caviar-dreams-italic': require('./assets/fonts/CaviarDreams_Italic.ttf'),
      'bebas-neue': require('./assets/fonts/BebasNeue-Regular.ttf'),
      'bebas-neue-bold': require('./assets/fonts/BebasNeue-Bold.ttf')
    })
    
  }

  //Additional code has to be implemented in order to get custom text to work
  render() {
    return (
      <Provider store={configureStore()}>
        <AppNavigator />
      </Provider>
    );
  }
}

export default App;
