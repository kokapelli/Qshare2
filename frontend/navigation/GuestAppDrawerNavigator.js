import { createDrawerNavigator} from 'react-navigation';
import React from 'react';
import LogoutDrawerComponent from './LogoutDrawerComponent'


import GuestStackNavigator from './GuestStackNavigator'

export default GuestAppDrawerNavigator = createDrawerNavigator({
    Guest: {
      screen: GuestStackNavigator
    },
    /* Doesnt change user state because the Switch Navigator remains the same */
  },
  {
    contentComponent:LogoutDrawerComponent,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle'
  },
  {
      contentOptions: {
        activeTintColor: '#1db954',
        activeBackgroundColor: '#E8E8E8',
        inactiveTintColor: 'black',
        inactiveBackgroundColor: 'transparent',
        labelStyle: {
          fontSize: 15,
          marginLeft: 10,
        },
      }
     }
  );
  