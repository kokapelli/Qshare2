import {
  createSwitchNavigator,
  createAppContainer,
} from 'react-navigation';

import SplashScreen from '../screens/SplashScreen';
import HostAppDrawerNavigator from './HostAppDrawerNavigator'
import GuestAppDrawerNavigator from './GuestAppDrawerNavigator'
import LoginScreen from '../screens/LoginScreen';
import ScannerScreen from '../screens/ScannerScreen';
import CreateRoomScreen from '../screens/CreateRoomScreen';
import JoinRoomScreen from '../screens/JoinRoomScreen'

const AppSwitchNavigator = createSwitchNavigator({
  Main: SplashScreen,
  Login: LoginScreen,
  CreateRoom: CreateRoomScreen,
  JoinRoom: JoinRoomScreen,
  Host: HostAppDrawerNavigator,
  Guest: GuestAppDrawerNavigator,
  Scanner: ScannerScreen,
});
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html

  export default AppContainer = createAppContainer(AppSwitchNavigator);

