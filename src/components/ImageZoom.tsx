import { colors } from 'assets';
import React, { Component } from 'react';
import { BackHandler, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Zoom from 'react-native-image-pan-zoom';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { downloadFile, scaler, share } from 'utils';
import { SafeAreaViewWithStatusBar } from './FocusAwareStatusBar';
import ImageLoader from './ImageLoader';

const { width, height } = Dimensions.get('window')

export class ImageZoom extends Component<any, { imageUrl: string, toggle: boolean, isDownloadable: boolean }> {

    constructor(props: any) {
        super(props)
        this.state = {
            imageUrl: "",
            toggle: false,
            isDownloadable: false
        }
        this.onBackPress = this.onBackPress.bind(this)
    }

    shouldComponentUpdate = (nextProps: Readonly<any>, nextState: Readonly<{ imageUrl: string, toggle: boolean }>) => {
        if (nextState?.imageUrl && this.state.imageUrl !== nextState.imageUrl) {
            setTimeout(() => {
                BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
            }, 100);
        } else {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackPress)
        }
        return this.state.imageUrl !== nextState.imageUrl || this.state.toggle !== nextState.toggle
    }

    onBackPress = () => {
        this.setState({ imageUrl: "", isDownloadable: false })
        return true
    }


    showImage = (imageUrl = "", isDownloadable = false) => {
        this.setState({ imageUrl, isDownloadable })
    }

    insets = { h: 0, w: 0 }

    render() {
        if (!this.state.imageUrl) return null
        const { h = 0, w = 0 } = this?.insets ?? {}
        return <SafeAreaViewWithStatusBar style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: colors.colorWhite }} >
            <View onLayout={(e) => {
                if (!this?.insets?.w) {
                    this.insets = {
                        h: e?.nativeEvent?.layout?.height,
                        w: width
                    }
                    this.setState({ toggle: !this.state?.toggle })
                }

            }} style={{ flex: 1 }} >

                <Zoom cropWidth={w}
                    cropHeight={h}
                    imageWidth={w}
                    imageHeight={h}
                >
                    <ImageLoader resizeMode='contain' style={{
                        width: w,
                        height: h
                    }}
                        source={{ uri: this.state.imageUrl }} />
                </Zoom>
                <TouchableOpacity onPress={() => this.setState({ imageUrl: "", isDownloadable: false })} style={[styles.backButton, { top: scaler(10), left: scaler(10) }]} >
                    <Entypo size={scaler(18)} name={'chevron-thin-left'} color={colors.colorPrimary} />
                </TouchableOpacity>
                {/* {this.state?.isDownloadable ? <TouchableOpacity onPress={() => {
                    downloadFile({ url: this.state.imageUrl, fileType: "any" })
                }} style={styles.downloadButton} >
                    <MaterialCommunityIcons color={colors.colorWhite} size={scaler(24)} name="download" />
                </TouchableOpacity> : null} */}

                {this.state?.isDownloadable ? <TouchableOpacity onPress={async () => {
                    const downloadResult = await downloadFile({ url: this?.state?.imageUrl, fileType: "any" }, true)
                    if (downloadResult) {
                        console.log("Result", downloadResult);
                        share({
                            url: 'file://' + downloadResult?.path(),
                            // message: this?.state?.imageUrl,
                            type: 'image/jpg',
                            //@ts-ignore
                            excludedActivityTypes: ['com.google.chrome.ios.shareExtension'],
                        })
                    }


                }} style={[styles.downloadButton]} >
                    <MaterialIcons style={{ marginBottom: scaler(4) }} color={colors.colorWhite} size={scaler(24)} name="ios-share" />
                </TouchableOpacity> : null}
            </View>
        </SafeAreaViewWithStatusBar>
    }
}

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        borderRadius: scaler(20), height: scaler(35), width: scaler(35),
        alignItems: 'center', justifyContent: 'center'
    },
    imgBack: {
        width: '100%',
        height: '100%', resizeMode: 'contain'
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