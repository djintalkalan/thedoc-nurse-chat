import { colors } from "assets";
import { Text } from "custom-components";
import React, { Component } from "react";
import { BackHandler, FlatList, GestureResponderEvent, Image, ImageSourcePropType, Platform, StyleProp, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import Language from "src/language/Language";
import { scaler } from "utils";
import { SafeAreaViewWithStatusBar } from "./FocusAwareStatusBar";

interface BottomMenuProps {

}

export interface IBottomMenuButton {
    title: string,
    textStyle?: StyleProp<TextStyle>
    buttonContainerStyle?: StyleProp<ViewStyle>
    onPress?: (e?: GestureResponderEvent) => void
    iconSource?: ImageSourcePropType
}

export interface IBottomMenu {
    buttons: Array<IBottomMenuButton>
    onPressCloseButton?: () => void
    cancelButtonText?: string
    cancelTextStyle?: StyleProp<TextStyle>
    cancelButtonContainerStyle?: StyleProp<ViewStyle>
}

export class BottomMenu extends Component<BottomMenuProps, { alertVisible: boolean }> {
    constructor(props: BottomMenuProps) {
        super(props)
        this.state = {
            alertVisible: false,
        }
        this.onBackPress = this.onBackPress.bind(this)
    }

    shouldComponentUpdate = (nextProps: Readonly<BottomMenuProps>, nextState: Readonly<{ alertVisible: boolean }>) => {
        if (nextState?.alertVisible) {
            setTimeout(() => {
                BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
            }, 200);
        } else {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackPress)
        }
        return this.state.alertVisible != nextState.alertVisible
    }

    onBackPress = () => {
        // this.setState({ alertVisible: false })
        return true
    }

    buttons: Array<IBottomMenuButton> = []
    cancelButtonText = Language.close
    cancelTextStyle = {}
    cancelButtonContainerStyle = {}
    onPressCloseButton = () => { }

    showBottomMenu = ({ buttons, onPressCloseButton, cancelButtonText, cancelTextStyle, cancelButtonContainerStyle }: IBottomMenu) => {
        this.cancelButtonText = cancelButtonText || Language.close
        this.buttons = buttons || []
        this.cancelButtonContainerStyle = StyleSheet.flatten(cancelButtonContainerStyle)
        this.cancelTextStyle = StyleSheet.flatten(cancelTextStyle)
        this.onPressCloseButton = () => {
            this.setState({ alertVisible: false })
            onPressCloseButton && onPressCloseButton()
        }
        if (!this.state?.alertVisible)
            this.setState({ alertVisible: true })
        else
            this.forceUpdate()
    }

    _renderButtonItem = ({ item, index }: { item: IBottomMenuButton, index: number }) => {
        return <>
            {index > 0 && <View style={{ height: 1, width: '100%', backgroundColor: colors.colorD }} />}
            <TouchableOpacity onPress={() => {
                item?.onPress && item?.onPress()
                this.setState({ alertVisible: false })

            }} style={[{ paddingVertical: scaler(15) }, item?.buttonContainerStyle, { flexDirection: item?.iconSource ? 'row' : 'column', alignItems: 'center', justifyContent: 'center' }]} >
                {item?.iconSource ?
                    <View style={styles.iconContainer}>
                        <Image style={styles.iconStyle} source={item?.iconSource} />
                    </View>
                    : null}
                <Text style={[styles.title, { flex: 0.6 }, item?.textStyle,]} >{item?.title}</Text>
            </TouchableOpacity>
        </>
    }

    render() {
        if (this.state.alertVisible && this.buttons?.length)
            return (
                <SafeAreaViewWithStatusBar translucent style={styles.absolute}  >
                    <View style={styles.alertContainer} >
                        <FlatList
                            scrollEnabled={false}
                            style={{ width: '100%' }}
                            data={this.buttons}
                            renderItem={this._renderButtonItem}
                        />
                    </View>

                    <TouchableOpacity onPress={this.onPressCloseButton} activeOpacity={0.9} style={[styles.alertContainer, { paddingVertical: scaler(15), marginBottom: Platform.OS == 'android' ? scaler(10) : 0 }, this.cancelButtonContainerStyle]} >
                        <Text style={[styles.title, this.cancelTextStyle]} >{this.cancelButtonText}</Text>
                    </TouchableOpacity>

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
        paddingHorizontal: scaler(15),
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end'
    },
    alertContainer: {
        backgroundColor: colors.colorWhite,
        paddingVertical: scaler(5),
        width: '100%',
        elevation: 3,
        alignItems: 'center',
        borderRadius: scaler(12),
        marginVertical: scaler(3),
    },
    title: {
        fontSize: scaler(15),
        color: colors.colorBlackText,
        textAlign: 'left',
        // backgroundColor: 'red'
        // alignSelf: 'flex-start'
    },
    button: {
        width: '80%',
        marginTop: scaler(20)
    },
    iconStyle: {
        height: scaler(25),
        width: scaler(25),
        resizeMode: 'contain',
        marginRight: scaler(10),

    },
    iconContainer: {
        flex: 0.4,
        alignItems: 'flex-end',
        // backgroundColor: 'red',
    },
    closeButtonContainer: {

    }
})