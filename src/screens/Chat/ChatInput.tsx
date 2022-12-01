import { colors } from 'assets/Colors';
import { Fonts } from 'assets/Fonts';
import React, { ForwardedRef, forwardRef, memo } from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import Language from 'src/language/Language';
import { scaler } from 'utils';
import { useAttachmentUtilities, useProfileImageUtilities } from 'utils/ImageUtils';

interface ChatInputProps {
    onChange: (e: string) => void;
    onPressSend: () => void;
    value?: string;
    disabled: boolean
}


const ChatInput = forwardRef<TextInput, ChatInputProps>((props, ref: ForwardedRef<TextInput>) => {
    const { onChange, onPressSend, value, disabled } = props

    const [onPickAttachment] = useAttachmentUtilities()
    const [pickImage] = useProfileImageUtilities()

    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={0.6} onPress={onPickAttachment}>
                <LinearGradient
                    colors={[colors.colorPrimary, colors.colorSecondary]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={styles.gradient}>
                    <Feather
                        name='plus'
                        color={colors.colorWhite}
                        size={scaler(25)}
                    />
                </LinearGradient>
            </TouchableOpacity>
            <View style={styles.inputContainer}>
                <TextInput
                    ref={ref}
                    value={value}
                    onChangeText={onChange}
                    style={styles.textInput}
                    placeholderTextColor={colors.colorGreyText}
                    placeholder={Language.type_a_message}
                    numberOfLines={1}
                    multiline={true}
                    spellCheck={true}
                    inputAccessoryViewID={'done'}
                />
            </View>
            <View style={{ height: scaler(50), alignItems: 'center', justifyContent: 'center' }}>
                <Feather
                    name='send'
                    size={scaler(25)}
                    onPress={disabled ? () => { } : onPressSend}
                    color={colors.colorPrimary}
                    style={{ marginRight: scaler(10) }} />
            </View>

        </View>
    )
})
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.colorWhite,
        flexDirection: 'row',
        alignItems: 'flex-end',
        maxHeight: scaler(200),
        // paddingVertical: scaler(5)
        // flex: 1
    },
    inputContainer: {
        flex: 1,
        minHeight: scaler(50),
        paddingHorizontal: scaler(10),
        maxHeight: scaler(200),
        justifyContent: 'center',
        // backgroundColor: 'red'
    },
    textInput: {
        paddingBottom: Platform.OS == 'ios' ? scaler(5) : 0,
        includeFontPadding: false,
        paddingVertical: 0,
        marginVertical: 0,
        fontSize: scaler(14),
        fontFamily: Fonts.regular,
        fontWeight: '500',
        color: colors.colorBlackText,
    },
    gradient: {
        height: scaler(50),
        width: scaler(50),
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default memo(ChatInput)