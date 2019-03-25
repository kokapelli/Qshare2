import { createDrawerNavigator} from 'react-navigation';
import HostStackNavigator from './HostStackNavigator'
import React from 'react';
import LogoutDrawerComponent from './LogoutDrawerComponent'

export default HostAppDrawerNavigator = createDrawerNavigator({
    Host: {
      screen: HostStackNavigator
    }
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
  