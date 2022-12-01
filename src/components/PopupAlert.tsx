import { colors } from "assets";
import { Text } from "custom-components";
import React, { Component, FC } from "react";
import { BackHandler, Dimensions, GestureResponderEvent, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';
import { scaler } from "utils";
import Button from "./Button";
import { SafeAreaViewWithStatusBar } from "./FocusAwareStatusBar";

const { height, width } = Dimensions.get('screen')
interface PopupAlertProps {

}

export interface IAlertType {
    onPressRightButton?: (e?: GestureResponderEvent) => any
    title?: string
    customView?: FC<any>
    message?: string
    rightButtonText?: string
    rightButtonStyle?: StyleProp<ViewStyle>
    leftButtonStyle?: StyleProp<ViewStyle>
    leftButtonText?: string | null
    onPressLeftButton?: () => void
}

export class PopupAlert extends Component<PopupAlertProps, any> {
    constructor(props: PopupAlertProps) {
        super(props)
        this.state = {
            alertVisible: false,
        }
        this.onBackPress = this.onBackPress.bind(this)
    }

    title: string = ""
    customView?: FC
    message: string = ""
    rightButtonText: string = ''
    rightButtonStyle: StyleProp<ViewStyle> = {}
    leftButtonStyle: StyleProp<ViewStyle> = {}
    leftButtonText = ""
    onPressLeftButton: any = null
    onPressRightButton: any = null
    fullWidthMessage: boolean = true
    // fullWidthMessage: boolean = false

    showAlert = ({ title, message, rightButtonText, onPressRightButton, rightButtonStyle, leftButtonStyle, leftButtonText, customView, onPressLeftButton }: IAlertType) => {
        this.title = title || ""
        this.message = message || ""
        this.rightButtonText = rightButtonText || ""
        this.rightButtonStyle = StyleSheet.flatten(rightButtonStyle) || {}
        this.leftButtonStyle = StyleSheet.flatten(leftButtonStyle) || {}
        this.leftButtonText = leftButtonText === null ? "" : (leftButtonText || '')
        this.customView = customView
        // this.onPressLeftButton = () => {
        //     onPressLeftButton && onPressLeftButton()
        //     this.hideAlert()
        // }
        this.onPressLeftButton = onPressLeftButton
        this.onPressRightButton = onPressRightButton
        // if (this.message?.length > 70) {
        //     this.fullWidthMessage = true
        // }
        //@ts-ignore
        // this.state.alertVisible = true
        if (!this.state.alertVisible) {
            this.setState({ alertVisible: true })
        } else
            this.forceUpdate()
    }

    hideAlert = () => {
        this.setState({ alertVisible: false })
    }

    shouldComponentUpdate = (nextProps: Readonly<PopupAlertProps>, nextState: Readonly<{ alertVisible: boolean }>) => {
        if (nextState?.alertVisible) {
            setTimeout(() => {
                BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
            }, 100);
        } else {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackPress)
        }
        return this.state.alertVisible != nextState.alertVisible
    }

    onBackPress = () => {
        // this.setState({ alertVisible: false })
        return true
    }

    // <View style={styles.languageView}>
    //       <Text type='semiBold' style={[styles.textStyle, { color: colors.colorBlackText }]}>{Language.notification}</Text>
    //       <Text type='medium' style={[styles.textStyle, { fontSize: scaler(13), textAlign: 'center', margin: scaler(15) }]}>{Language.doctor_chat}</Text>

    //       <View style={[styles.infoView, { marginHorizontal: scaler(15) }]}>
    //         <Button
    //           type='semiBold'
    //           fontSize={scaler(12)}
    //           backgroundColor={colors.colorWhite}
    //           onPress={onDismiss}
    //           title={Language.cancel}
    //           containerStyle={{ flex: 1 }}
    //           rightButtonStyle={styles.buttonContainer}
    //           textStyle={{ color: colors.colorPrimary }} />
    //         <Button
    //           fontSize={scaler(12)}
    //           type='semiBold'
    //           onPress={() => { Linking.openURL(config.LINE_CHAT_URL); onDismiss() }}
    //           containerStyle={{ flex: 1 }}
    //           rightButtonStyle={{ paddingVertical: scaler(12) }}
    //           title={Language.chat} />
    //       </View>
    //     </View>

    render() {
        if (this.state.alertVisible)
            return (
                <SafeAreaViewWithStatusBar translucent style={styles.absolute}  >
                    <View style={styles.alertContainer} >


                        {this.title ? <Text type='semiBold' style={[styles.title, { color: colors.colorBlackText }]}>{this.title}</Text> : null}
                        {this.message ?

                            <ScrollView bounces={false} overScrollMode={'never'} contentContainerStyle={[styles.scrollViewContainerStyle, this?.fullWidthMessage ? { marginHorizontal: scaler(30) } : {}]} style={styles.scrollViewStyle} >
                                <Text type='medium' style={[styles.title, { fontSize: scaler(13), textAlign: 'center', margin: scaler(15) }]}>{this.message}</Text>
                            </ScrollView>
                            : null}

                        {this.customView ?
                            <this.customView />
                            : null}

                        <View style={[styles.infoView, { marginHorizontal: scaler(5) }]}>
                            {this.leftButtonText ? <Button
                                type='semiBold'
                                fontSize={scaler(12)}
                                onPress={this.onPressLeftButton}
                                backgroundColor={colors.colorWhite}
                                title={this.leftButtonText}
                                containerStyle={{ flex: 1 }}
                                buttonStyle={[styles.buttonContainer, this.leftButtonStyle]}
                                textStyle={{ color: colors.colorPrimary }} /> : null}
                            {this.rightButtonText ? <Button
                                fontSize={scaler(12)}
                                type='semiBold'
                                onPress={this.onPressRightButton}
                                title={this.rightButtonText}
                                containerStyle={{ flex: 1 }}
                                buttonStyle={[{ paddingVertical: scaler(12) }, this.rightButtonStyle]} /> : null}
                        </View>
                    </View>
                </SafeAreaViewWithStatusBar>
            )
        return null
    }
}

const styles = StyleSheet.create({
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: scaler(20),
        paddingVertical: scaler(30),
        alignItems: 'center',
        justifyContent: 'center'
    },
    alertContainer: {
        backgroundColor: colors.colorWhite,
        paddingTop: scaler(30),
        paddingBottom: scaler(10),
        paddingHorizontal: scaler(10),
        width: '100%',
        flexShrink: 1,
        elevation: 3,
        alignItems: 'center',
        borderRadius: scaler(20)
    },
    title: {
        fontSize: scaler(15),
        color: colors.colorGreyText,
        textAlign: 'center',
        // maxWidth: '80%'
    },
    message: {
        fontWeight: '400',
        fontSize: scaler(14),
        lineHeight: scaler(24),
        color: "#7D7F85",
        textAlign: 'center',
        // flex: 1,
    },

    scrollViewContainerStyle: {
        alignItems: 'center',
        marginHorizontal: scaler(30) + (width / 10),
        // maxWidth: width - scaler(60) - (width / 5),
        // backgroundColor: 'yellow',
        // flex: 1,
    },
    scrollViewStyle: {
        marginBottom: scaler(10),

        marginHorizontal: -scaler(30),

        // maxWidth: '80%',
        // backgroundColor: 'red',
        // flex: 1,
    },
    button: {
        width: '70%',
        marginTop: scaler(20)
    },
    cancelText: {
        fontWeight: '400',
        fontSize: scaler(13),
        lineHeight: scaler(24),
        marginTop: scaler(10),
        color: colors.colorBlackText,
    },
    infoView: {
        margin: scaler(15),
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonContainer: {
        borderColor: colors.colorPrimary,
        borderWidth: scaler(1),
        borderRadius: scaler(5),
        paddingHorizontal: 0,
        paddingVertical: scaler(10)
    },
})