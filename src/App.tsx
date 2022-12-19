import { persistor, store } from 'app-store/store';
import { colors } from 'assets';
import { Loader } from 'custom-components';
import { VideoProvider } from 'custom-components/VideoProvider';
import React, { FC, useEffect } from 'react';
import { Dimensions, LogBox, StyleSheet } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
// import FastImage from 'react-native-fast-image';
import CodePush, { useCodePushDialog } from 'codepush';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Database from './database/Database';
import MyNavigationContainer from './routes/MyNavigationContainer';


// Database.setMultipleValues({
//     authToken: "",
//     userData: Database.getStoredValue('userData') || {},
//     isLogin: true
// })
// if (__DEV__) {
//     FastImage.clearMemoryCache()
//     FastImage.clearDiskCache()
// }
LogBox.ignoreAllLogs();
const { height, width } = Dimensions.get('screen')
Database.setOtherBool("showGif", true)
const App: FC = () => {

    useEffect(() => {
        setTimeout(() => {
            RNBootSplash.hide({ fade: true });
        }, 1000);
    }, [])

    const dialog = useCodePushDialog()

    return (
        <GestureHandlerRootView style={styles.container} >
            <VideoProvider>
                <Provider store={store}>
                    <PersistGate persistor={persistor}>
                        <MyNavigationContainer />
                        <Loader />
                        {dialog}
                    </PersistGate>
                </Provider>
            </VideoProvider>
        </GestureHandlerRootView>
    )
}

export default CodePush(App)

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.colorWhite }
})
