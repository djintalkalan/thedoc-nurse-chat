// import { useNetInfo } from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { getAppVersion, refreshLanguage } from 'app-store/actions';
import { Images } from 'assets';
import { PopupAlert } from 'custom-components';
import { BottomMenu } from 'custom-components/BottomMenu';
import { ImageZoom } from 'custom-components/ImageZoom';
import { TouchAlert } from 'custom-components/TouchAlert';
import DropdownAlert from 'dj-react-native-dropdown-alert';
import { useFirebaseServices } from 'firebase-services';
import * as React from 'react';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { useDatabase } from 'src/database/Database';
import { useLanguage } from 'src/language/Language';

import Login from 'screens/Auth/Login';
import NurseChat from 'screens/Chat/NurseChat/NurseChat';
import Home from 'screens/Dashboard/Home';
import { useLocalAuthentication } from 'src/LocalAuthentication';
import { SocketService } from 'src/socket/SocketService';
import { NavigationService } from 'utils';
import { KeyboardAccessoryView, StaticHolder } from 'utils/StaticHolder';

const NativeStack = createNativeStackNavigator();

const commonScreens = {};

const authScreens = {
  Login

};

const dashboardScreens = {
  Home,
  NurseChat,
};

const getScreenOptions = (name: string): NativeStackNavigationOptions | undefined => {
  switch (name) {
    // case "VideoConnect":
    //   return {
    //     presentation: 'card',
    //     animation: 'slide_from_bottom',
    //   }
    // case "AppointmentResult":
    //   return {
    //     gestureEnabled: false
    //   }
    default:
      return undefined
  }
}
const MyNavigationContainer = () => {
  useFirebaseServices();
  useLocalAuthentication()
  const dispatch = useDispatch();


  // const { isConnected, isInternetReachable } = useNetInfo()
  // useSelector(_ => console.log(_))

  const [isLogin] = useDatabase<boolean>('isLogin', false);
  const language = useLanguage();


  useEffect(() => {
    dispatch(getAppVersion())
  }, [])


  useEffect(() => {
    if (isLogin) {
      SocketService.init(dispatch);
    }
    return () => {
      SocketService.closeSocket();
    }
  }, [isLogin, language])

  useEffect(() => {
    dispatch(refreshLanguage())
  }, [isLogin])

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={NavigationService.setNavigationRef}
      >
        <NativeStack.Navigator screenOptions={{ headerShown: false }}>
          {Object.entries({
            // Use some screens conditionally based on some condition
            ...(isLogin ? dashboardScreens : authScreens),
            // Use the screens normally
            ...commonScreens,
          }).map(([name, component]) => (
            <NativeStack.Screen
              key={name}
              name={name}
              options={getScreenOptions(name)}
              component={component} />
          ))}
        </NativeStack.Navigator>
        <ImageZoom ref={StaticHolder.setImageZoom} />
        <PopupAlert ref={StaticHolder.setPopupAlert} />
        <BottomMenu ref={StaticHolder.setBottomMenu} />
        <KeyboardAccessoryView ref={StaticHolder.setKeyboardAccessoryView} />
        <TouchAlert ref={StaticHolder.setTouchAlert} />
        <DropdownAlertWithStatusBar />
      </NavigationContainer>
    </SafeAreaProvider>

  );
};

const DropdownAlertWithStatusBar = () => {
  return <DropdownAlert
    successImageSrc={Images.ic_success_alert_icon}
    updateStatusBar={false}
    ref={StaticHolder.setDropDown} />
}


export default MyNavigationContainer;
