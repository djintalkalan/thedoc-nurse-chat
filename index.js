/**
 * @format
 */
import notifee, { EventType } from "@notifee/react-native";
import messaging from '@react-native-firebase/messaging';
import { onMessageReceived, onNotificationOpened } from 'firebase-services';
import React from 'react';
import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import invokeApp from 'react-native-invoke-app';
import App from 'src/App';
import { name as appName } from './app.json';
import './ReactotronConfig';

notifee.onBackgroundEvent(async ({ type, detail }) => {
    switch (type) {
        case EventType.PRESS:
            invokeApp();
            detail?.notification && onNotificationOpened(detail?.notification)
            break;
    }
});

messaging().setBackgroundMessageHandler(async (m) => await onMessageReceived(m, true));


const HeadlessCheck = ({ isHeadless }) => {

    if (isHeadless) {
        // App has been launched in the background by iOS, ignore
        return null;
    }

    return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);