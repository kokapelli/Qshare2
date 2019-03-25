import React from 'react';
import {
  createBottomTabNavigator,
  createStackNavigator
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HostScreen from '../screens/HostScreen';
import QueueScreen from '../screens/QueueScreen';
import GuestScreen from '../screens/GuestScreen';
import SearchScreen from '../screens/SearchScreen';

/* Create Home Screen */
const Home = createStackNavigator({
  Home: HostScreen,
});

Home.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'md-home'}
    />
  ),
};

/* Create Queue Screen */
const Queue = createStackNavigator({
  Queue: QueueScreen,
});

Queue.navigationOptions = {
  tabBarLabel: 'Queue',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'md-play'}
    />
  ),
};

const Search = createStackNavigator({
    Search: SearchScreen,
  });
  
  Search.navigationOptions = {
    tabBarLabel: 'Search',
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        name={'md-search'}
      />
    ),
  };
  

export default GuestTabNavigator =  createBottomTabNavigator({
  Home,
  Queue,
  Search
},{
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      return {
        headerTitle: routeName
      };
    }
  });
