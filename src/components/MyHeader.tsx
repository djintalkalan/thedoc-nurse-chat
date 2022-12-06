import { colors } from 'assets'
import { Text, useKeyboardService } from 'custom-components'
import React, { FC, useCallback } from 'react'
import { GestureResponderEvent, Image, ImageStyle, ImageURISource, StyleProp, StyleSheet, TouchableOpacity, View } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import { NavigationService, scaler } from 'utils'
interface MyHeaderProps {
    onPress?: (e?: GestureResponderEvent) => void
    title: string
    backEnabled?: boolean
    rightText?: string | any
    leftText?: string
    leftIcon?: ImageURISource,
    rightIcon?: ImageURISource,
    leftIconStyle?: StyleProp<ImageStyle>
    rightIconStyle?: StyleProp<ImageStyle>
    onPressLeft?: (e?: GestureResponderEvent) => void
    onPressRight?: (e?: GestureResponderEvent) => void
    isWebView?: boolean
}

export const MyHeader: FC<MyHeaderProps> = (props) => {
    const { isKeyboard, dismissKeyboard } = useKeyboardService()
    const onPressDefault = useCallback(
        () => {
            if (isKeyboard && !props.isWebView) {
                dismissKeyboard()
            } else if (props?.onPress) {
                props?.onPress()
            } else
                NavigationService.goBack()
        },
        [isKeyboard, props?.onPress, props?.isWebView],
    )

    const { backEnabled = true, title, onPressRight, rightIcon, onPressLeft, rightText, leftText, leftIcon, rightIconStyle, leftIconStyle } = props

    const styles = StyleSheet.create({
        textStyle: {
            fontSize: scaler(15),
            color: colors.colorPrimary
        },
        button: {
            paddingHorizontal: scaler(15),
            // backgroundColor: colors.colorWhite,
            position: 'absolute',
            left: 0, height: '100%',
            alignItems: 'center',
            justifyContent: 'center'
        },
        title: {
            // fontWeight: '700',
            color: colors.colorPrimary,
            fontSize: scaler(16)
        },
        container: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: scaler(15),
            backgroundColor: colors.colorWhite,
        },
        leftText: {
            fontSize: scaler(16),
            fontWeight: '400',
            color: colors.colorSecondary
        },
        iconStyle: {
            height: scaler(42),
            width: scaler(36),
            resizeMode: 'contain',
            // aspectRatio: scaler(130) / scaler(50),
            ...StyleSheet.flatten(leftIconStyle)
        },
        rightIconStyle: {
            height: scaler(42),
            width: scaler(36),
            resizeMode: 'contain',
            // aspectRatio: scaler(130) / scaler(50),
            ...StyleSheet.flatten(rightIconStyle)
        }
    })



    return (
        <View style={styles.container} >
            {backEnabled &&
                <TouchableOpacity onPress={onPressDefault} style={[styles.button, {
                }]} >
                    <Entypo size={scaler(18)} name={'chevron-thin-left'} color={colors.colorBlack} />
                </TouchableOpacity>}
            {leftIcon && <TouchableOpacity onPress={onPressLeft} activeOpacity={onPressLeft ? 0.7 : 10} style={styles.button} >
                <Image source={leftIcon} style={styles.iconStyle} />
            </TouchableOpacity>}
            {leftText && <TouchableOpacity onPress={onPressDefault} style={[styles.button, {
            }]} >
                <Text style={styles.leftText}>{leftText}</Text>
            </TouchableOpacity>}
            <Text type='bold' style={styles.title} >{title}</Text>
            {rightIcon &&
                <TouchableOpacity onPress={onPressRight} activeOpacity={onPressRight ? 0.7 : 10} style={[styles.button, {
                    left: undefined, right: 0
                }]} >
                    <Image source={rightIcon} style={styles.rightIconStyle} />
                </TouchableOpacity>}
            {rightText &&
                <TouchableOpacity onPress={onPressRight} style={[styles.button, {
                    left: undefined, right: 0
                }]} >
                    <Text style={styles.leftText}>{rightText}</Text>
                </TouchableOpacity>}
        </View>

    )
}

