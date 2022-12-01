import { persistor, store } from 'app-store/store';
import { colors } from 'assets';
import { Loader, Text } from 'custom-components';
import { VideoProvider } from 'custom-components/VideoProvider';
import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { Dimensions, LogBox, StyleSheet, TouchableOpacity, View } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
// import FastImage from 'react-native-fast-image';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Database from './database/Database';
import MyNavigationContainer from './routes/MyNavigationContainer';

import { config } from 'api';
import { round, toNumber } from 'lodash';
import CodePush from 'react-native-code-push';
import { Bar as ProgressBar } from 'react-native-progress';
import { scaler } from 'utils';

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
        }, 2000);
    }, [])



    return (
        <GestureHandlerRootView style={styles.container} >
            <VideoProvider>
                <Child />
            </VideoProvider>
        </GestureHandlerRootView>
    )
}


const Child = memo(() => {

    useEffect(() => {
        !__DEV__ && setTimeout(() => {
            getCodePushUpdate()
        }, 2000);
    }, [])


    const [showUpdateDialog, setShowUpdateDialog] = useState(false);

    const [{ status, percent, message }, setProgress] = useState({
        percent: 0, status: "", message: "Downloading update"
    });

    const getCodePushUpdate = useCallback(() => {
        const isDev = config.APP_TYPE == 'dev'
        let codePushOptions = {
            deploymentKey: config.CODEPUSH_DEPLOY_KEY,
            // installMode: isDev ? CodePush.InstallMode.IMMEDIATE : CodePush.InstallMode.ON_NEXT_SUSPEND,
            // mandatoryInstallMode: isDev ? CodePush.InstallMode.IMMEDIATE : CodePush.InstallMode.ON_NEXT_SUSPEND,
            installMode: CodePush.InstallMode.IMMEDIATE,
            mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
            // updateDialog: {
            //     title: "An update is available!",
            // },
        }

        CodePush.sync(codePushOptions, (status) => {
            console.log("STATUS", status);
            switch (status) {
                case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                    console.log("Checking for updates.");
                    break;
                case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                    console.log("Downloading package.");
                    setProgress((_) => ({
                        ..._,
                        message: "Downloading update",
                    }))
                    if (isDev)
                        setShowUpdateDialog(true)
                    break;
                case CodePush.SyncStatus.INSTALLING_UPDATE:
                    console.log("Installing update.");
                    setProgress((_) => ({
                        ..._,
                        message: "Installing update",
                    }))
                    break;
                case CodePush.SyncStatus.UP_TO_DATE:
                    console.log("Up-to-date.");
                    setShowUpdateDialog(false)
                    break;
                case CodePush.SyncStatus.UPDATE_INSTALLED: // Once package has been installed
                    // DO SOME MAGIC SHIT
                    console.log("UPDATE_INSTALLED");
                    setShowUpdateDialog(false)
                    // Hide "downloading" modal
                    break;
            }
        }, ({ receivedBytes, totalBytes }) => {
            /* Update download modal progress */
            console.log(receivedBytes + "/" + totalBytes,);

            if (!isDev && !__DEV__) {
                return
            }

            const percent = round(receivedBytes / totalBytes * 100, 2)
            let stringText = "Byte"
            let divider = 1
            if (totalBytes >= 1000000000) {
                stringText = "Gb"
                divider = 1000000000
            } else if (totalBytes >= 1000000) {
                stringText = "Mb"
                divider = 1000000
            } else if (totalBytes >= 1000) {
                stringText = "Kb"
                divider = 1000
            }

            const loaded = round((receivedBytes / divider), 2)
            const total = round((totalBytes / divider), 2)

            const status = `${loaded} ${stringText} /${total} ${stringText}`// (loaded+"/"+total+stringText)

            // console.log("percent", percent);
            // console.log("loaded", loaded);
            // console.log("total", total);
            // console.log("divider", divider);
            console.log("status", status);
            // console.log("stringText", stringText);

            setProgress((_) => ({
                ..._,
                percent: percent || 0,
                status: status || "",
            }))

        });
    }, [])

    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <MyNavigationContainer />
                <Loader />
                {showUpdateDialog ? <TouchableOpacity activeOpacity={1} style={{ backgroundColor: '#00000080', flex: 1, position: 'absolute', justifyContent: 'flex-end', top: 0, bottom: 0, left: 0, right: 0, }} >
                    <View style={{ alignContent: 'center', justifyContent: 'center', paddingVertical: scaler(15), backgroundColor: 'white', elevation: 5, marginHorizontal: scaler(5), borderTopLeftRadius: scaler(10), borderTopRightRadius: scaler(10) }} >
                        <Text style={{ paddingBottom: scaler(10), fontWeight: '500', textAlign: 'center', color: 'black', fontSize: scaler(18) }} >Update available</Text>
                        <View style={{ alignSelf: 'center', alignItems: 'center', flexDirection: 'row', width: width / 1.5, paddingHorizontal: scaler(5), justifyContent: 'space-between' }} >
                            <Text style={{ fontSize: scaler(12), fontWeight: '500', color: "#7D7F85", marginBottom: scaler(5) }} >{percent + "%"}</Text>
                            <Text style={{ fontSize: scaler(12), fontWeight: '400', color: "#7D7F85", marginBottom: scaler(5) }} >{status}</Text>
                        </View>

                        <ProgressBar width={width / 1.5} height={scaler(10)} animated
                            indeterminateAnimationDuration={900}
                            indeterminate={toNumber(percent) < 2 || toNumber(percent) == 100}
                            useNativeDriver
                            style={{ alignSelf: 'center', }}
                            color={colors.colorPrimary}
                            progress={toNumber(percent) / 100} />
                        <View style={{ alignSelf: 'center', alignItems: 'center', flexDirection: 'row', width: width / 1.5, paddingHorizontal: scaler(5), justifyContent: 'center' }} >
                            <Text style={{ fontSize: scaler(14), fontWeight: '500', color: 'black', marginTop: scaler(10) }} >{message}</Text>
                        </View>

                        <Text style={{ paddingVertical: scaler(15), fontWeight: '500', textAlign: 'center', color: "#7D7F85", fontSize: scaler(12) }} >Please wait until we finish installing the available update. It won't take much time.</Text>

                    </View>


                </TouchableOpacity> : null}
            </PersistGate>
        </Provider>
    )
})


export default (App)

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.colorWhite }
})
