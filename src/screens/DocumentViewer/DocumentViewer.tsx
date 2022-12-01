import { colors } from 'assets';
import { Loader, Text } from "custom-components";
import { SafeAreaViewWithStatusBar } from 'custom-components/FocusAwareStatusBar';
import _ from 'lodash';
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import WebView from "react-native-webview";
import { downloadFile, NavigationService, scaler, share, _showErrorMessage } from "utils";
const DOC_VIEWER = `https://docs.google.com/viewerng/viewer?url=`;
const getLoadingUrl = (url: string, propsUrl: string) => {
    return (url?.toLowerCase()?.endsWith("png") ||
        url?.toLowerCase()?.endsWith("jpg") ||
        url?.toLowerCase()?.endsWith("jpeg") ||
        url?.toLowerCase()?.endsWith("heic") ||
        url?.toLowerCase()?.endsWith("heif")) ?
        url :
        DOC_VIEWER + propsUrl;
}

const DocumentViewer: FC<any> = (props: any) => {
    const webViewRef = useRef<WebView>(null)
    const [title, setTitle] = useState("")
    const [loaded, setLoaded] = useState(false)
    const loadedRef = useRef(false)
    const [isLoading, setLoading] = useState(true)
    const hideButtons = "document.querySelector('[role=\"toolbar\"]').remove();true;"
    const navChange = useCallback(state => {
        console.log("NAV STATE , ", state)
        const { url } = state;
        if (!url) return;
        if (state?.title && !state?.title?.includes("https://")) {
            if (state?.title != title)
                setTitle(state?.title)
            loadedRef.current = true
            setLoaded((b) => {
                if (!b)
                    setTimeout(() => {
                        setLoading(false)
                        if (!(url?.toLowerCase()?.endsWith("png") || url?.toLowerCase()?.endsWith("jpg") || url?.toLowerCase()?.endsWith("jpeg") || url?.toLowerCase()?.endsWith("heic") || url?.toLowerCase()?.endsWith("heif")))
                            webViewRef?.current?.injectJavaScript(hideButtons)
                    }, 500);
                return true
            })

        } else {
            if (state?.navigationType != 'other' && state?.title == "" && state?.loading == false && state?.url != "about:blank") {
                webViewRef?.current?.reload()
            }

        }

        if (state?.url == "about:blank") {
            console.log("state?.url", url)
            const newURL = getLoadingUrl(url, props?.route?.params?.url)
            const redirectTo = 'window.location = "' + newURL + '"';
            webViewRef?.current?.injectJavaScript(redirectTo);
        }
        // if (!state?.url.includes("embedded=true") && state?.canGoBack) {
        //     console.log("webViewRef", webViewRef)

        //     webViewRef.current.goBack()

        // }
    }, [])

    useEffect(() => {
        let timeout = setTimeout(() => {
            if (!loadedRef.current) {
                _showErrorMessage("Request Timeout")
                NavigationService.goBack()
            } else {

            }
        }, 15000);
        return () => {
            clearTimeout(timeout);
        }
    }, [])



    const [url, setUrl] = useState(props?.route?.params?.url)
    const insets = useSafeAreaInsets()
    return (
        <SafeAreaViewWithStatusBar barStyle={'light-content'} backgroundColor={colors.colorPrimary} edges={['top']} style={styles.container}>
            <View style={{ justifyContent: 'flex-start', alignItems: 'center', minHeight: scaler(35), flexDirection: 'row', backgroundColor: colors.colorPrimary, overflow: 'hidden' }}>
                <TouchableOpacity onPress={() => {
                    NavigationService.goBack()
                }} style={{ paddingVertical: scaler(5), marginStart: scaler(8), }} >
                    <Entypo size={scaler(18)} name={'chevron-thin-left'} color={colors.colorWhite} />
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: scaler(10) }}>
                    <Text type={'medium'} style={{ color: colors.colorWhite, fontSize: scaler(12) }} >{_.capitalize(title)}</Text>
                </View>

            </View>
            {loaded &&
                <>
                    {/* <TouchableOpacity onPress={() => {
                        downloadFile({ url: url, fileType: "any" })
                    }} style={[styles.downloadButton, { bottom: scaler(30) + (insets?.bottom || 0) }]} >
                        <MaterialCommunityIcons color={colors.colorWhite} size={scaler(24)} name="download" />
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={async () => {
                        const downloadResult = await downloadFile({ url, fileType: "any" }, true)
                        if (downloadResult) {
                            console.log("Result", downloadResult);
                            share({
                                url: 'file://' + downloadResult?.path(),
                                //@ts-ignore
                                excludedActivityTypes: ['com.google.chrome.ios.shareExtension'],
                            })
                        }


                    }} style={[styles.downloadButton, { bottom: scaler(30) + (insets?.bottom || 0) }]} >
                        <MaterialIcons style={{ marginBottom: scaler(4) }} color={colors.colorWhite} size={scaler(24)} name="ios-share" />
                    </TouchableOpacity>
                </>
            }
            <WebView
                onLoadEnd={(e) => {
                    // if (!(url?.toLowerCase()?.endsWith("png") || url?.toLowerCase()?.endsWith("jpg") || url?.toLowerCase()?.endsWith("jpeg") || url?.toLowerCase()?.endsWith("heic") || url?.toLowerCase()?.endsWith("heif")))
                    // webViewRef?.current?.injectJavaScript(hideButtons)
                }}
                onError={(err) => {
                    console.log("Error is ", err)
                }}
                scalesPageToFit
                scrollEnabled
                domStorageEnabled
                javaScriptEnabled
                pullToRefreshEnabled

                // injectedJavaScript={}
                ref={webViewRef}
                onFileDownload={(e) => {
                    console.log(e)
                }}
                onNavigationStateChange={navChange}
                source={{
                    uri: getLoadingUrl(url, props?.route?.params?.url)
                }} />
            {/* </MyHeader> */}
            <Loader loading={isLoading} />
            <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.colorWhite }} />
        </SafeAreaViewWithStatusBar>
    )
}

export default DocumentViewer
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.colorPrimary
    },
    downloadButton: {
        height: scaler(50),
        width: scaler(50),
        borderRadius: scaler(30),
        backgroundColor: colors.colorPrimary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        position: 'absolute',
        bottom: scaler(20),
        right: scaler(20),
        zIndex: 5
    }
})