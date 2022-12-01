import { colors } from "assets";
import * as React from "react";
import { ColorValue, GestureResponderEvent, StyleProp, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
// import { TouchableOpacity as GTO } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { scaler } from "utils";
import { Text } from "./Text";

interface ButtonProps {
    disabled?: boolean
    onPress?: (event: GestureResponderEvent) => void;
    buttonStyle?: StyleProp<ViewStyle>;
    containerStyle?: ViewStyle;
    center?: boolean;
    backgroundColor?: string
    width?: number | string;
    minWidth?: number | string
    title: string;
    type?: 'bold' | 'light' | 'regular' | 'medium' | 'semiBold'
    fontColor?: ColorValue;
    radius?: number;
    fontSize?: number
    paddingVertical?: number
    paddingHorizontal?: number
    pointerEvents?: 'none'
    textStyle?: TextStyle
    opacityType?: 'gesture' | 'react'
}

export const Button = (props: ButtonProps) => {

    const { disabled = false, onPress, opacityType = "react", textStyle, containerStyle, center, radius, backgroundColor, width, title, type = 'medium', fontColor = colors.colorWhite, buttonStyle, fontSize = scaler(14), minWidth, paddingHorizontal, paddingVertical } = props
    // const TouchableOpacity = React.useMemo(() => {
    //     if (opacityType == 'gesture' && Platform.OS == 'ios') {
    //         return RTO
    //     } else {
    //         return RTO
    //     }
    //     return GTO
    // }, [opacityType])
    const onPressButton = React.useMemo(() => {
        return onPress ? (e: GestureResponderEvent) => {
            requestAnimationFrame(() => {
                onPress(e);
            });
        } : undefined
    }, [onPress])

    const styles = React.useMemo(() => {
        let container = {}
        if (center) {
            container = { width: '100%', alignItems: 'center' }
        }
        return StyleSheet.create({
            contentContainerStyle: {
                marginVertical: scaler(5),
                paddingHorizontal: scaler(5),
                ...container,
                ...StyleSheet.flatten(containerStyle) // Object.assign({}, ...(Array.isArray(containerStyle) ? containerStyle : [containerStyle]))
            },

            buttonStyle: {
                borderRadius: radius ?? scaler(5),
                backgroundColor: disabled ? colors?.colorGreyText : backgroundColor ?? colors?.colorSecondary,
                minWidth: minWidth == null ? undefined : minWidth ?? scaler(120),
                width: width ?? undefined,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: paddingVertical ?? scaler(15),
                paddingHorizontal: paddingHorizontal ?? scaler(15),
                ...StyleSheet.flatten(buttonStyle) //Object.assign({}, ...(Array.isArray(buttonStyle) ? buttonStyle : [buttonStyle]))

            },
            textStyle: {
                fontSize: fontSize ?? scaler(15),
                color: fontColor,
                fontWeight: '600',
                ...StyleSheet.flatten(textStyle) //Object.assign({}, ...(Array.isArray(textStyle) ? textStyle : [textStyle]))

            }
        })
    }, [containerStyle, textStyle, fontColor, fontSize, center, width, buttonStyle, backgroundColor, paddingHorizontal, radius, paddingVertical, minWidth, disabled]);

    return (
        <View pointerEvents={props.pointerEvents} style={styles.contentContainerStyle}>
            <TouchableOpacity disabled={disabled} onPress={onPressButton}>
                <LinearGradient
                    colors={backgroundColor ? [backgroundColor, backgroundColor] : disabled ? [colors.colorInactiveButton, colors.colorInactiveButton] : [colors.colorPrimary, colors.colorSecondary]}
                    style={styles.buttonStyle} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Text style={styles.textStyle} type={type ?? 'semiBold'} >{title}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}


export default Button