import React, {PureComponent} from 'react';
import {DrawerItems} from 'react-navigation';
import {View, SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {logout} from '../actions/login';
import { Alert } from 'react-native'

class LogoutDrawerComponent extends PureComponent
{
  render (){
    return (
    <View style={{flex:1}}>
      <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
        <DrawerItems {...this.props} />
        <TouchableOpacity onPress={()=>
          Alert.alert(
            'Log Out',
            'Do you want to logout?',
            [
              {text: 'Cancel', onPress: () => {return null}},
              {text: 'Confirm', onPress: () => {
                  this.props.logout();
                  this.props.navigation.navigate('Main')

                }},
            ],
            { cancelable: false }
          )
        }>
          <Text style={{margin: 16,fontWeight: 'bold'}}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
    );
  }

}

export default connect(null,{logout})(LogoutDrawerComponent)