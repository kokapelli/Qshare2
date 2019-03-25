import React from 'react';
import {createStackNavigator} from 'react-navigation';
import Icon from '@expo/vector-icons/Ionicons';
import HostTabNavigator from './HostTabNavigator';

export default HostStackNavigator = createStackNavigator(
    {
      HostStackNavigator: HostTabNavigator
    },
    {
      defaultNavigationOptions: ({ navigation }) => {
        return {
          headerLeft: (
            <Icon
              style={{ paddingLeft: 10 }}
              onPress={() => navigation.openDrawer()}
              name="md-menu"
              size={30}
            />
          )
        };
      }
    }
  );
  