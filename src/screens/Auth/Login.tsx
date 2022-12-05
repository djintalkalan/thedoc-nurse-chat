import { config } from 'api'
import { doLogin } from 'app-store/actions'
import { colors, Images } from 'assets'
import { Button, Text, TextInput } from 'custom-components'
import { SafeAreaViewWithStatusBar } from 'custom-components/FocusAwareStatusBar'
import React, { FC, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Image, Platform, StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useDispatch } from 'react-redux'
import Language from 'src/language/Language'
import { scaler } from 'utils'

type LoginFormType = {
    username: string
    password: string
}

const Login: FC = () => {

    const { control, handleSubmit, getValues, setValue, formState: { errors, isValid } } = useForm<LoginFormType>({
        defaultValues: __DEV__ ? Platform.OS == 'ios' ? {

            username: config.APP_TYPE == 'dev' ? "mukeshnurse" : "mukeshnurse",
            password: config.APP_TYPE == 'dev' ? "Shine@2015" : "Shine@2015",
            // email: "deepakq@testings.com",
            // password: "Dj@123456",

        } : {
            // email: "deepakq@testings.com",
            //     password: "Dj@123456",
            username: config.APP_TYPE == 'dev' ? "mukeshnurse" : "mukeshnurse",
            password: config.APP_TYPE == 'dev' ? "Shine@2015" : "Shine@2015",
        } : {},
        mode: 'onChange'
    })

    const dispatch = useDispatch()

    const onSubmit = useCallback(() => handleSubmit(data => {
        dispatch(doLogin(data))
    })(), []);

    return (
        <SafeAreaViewWithStatusBar style={styles.container} >
            <ScrollView enableResetScrollToCoords={false} contentContainerStyle={{ flex: 1 }} keyboardShouldPersistTaps={'handled'} >

                <View style={{ width: '100%', paddingHorizontal: scaler(20), paddingVertical: scaler(20) }} >

                    <View style={{ marginTop: scaler(30), marginBottom: scaler(50), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                        <View style={{}} >
                            <Text type='bold' style={styles.welcomeStyle} >{Language.welcome_back}</Text>
                            <Text type='medium' style={styles.letSignIn} >{Language.lets_sign_in_you}</Text>
                        </View>
                        <Image source={Images.ic_app} style={styles.icon} />
                    </View>

                    <TextInput
                        name='username'
                        placeholder={Language.username + ' *'}
                        containerStyle={{ marginBottom: scaler(10) }}
                        icon={Images.ic_account_info}
                        required={true}
                        control={control}
                        errors={errors}
                    />

                    <TextInput
                        name='password'
                        placeholder={Language.password + ' *'}
                        containerStyle={{ marginBottom: scaler(10) }}
                        icon={Images.ic_lock}
                        required={true}
                        secureTextEntry
                        control={control}
                        errors={errors}
                    />



                    <Button
                        containerStyle={{ marginTop: scaler(20) }}
                        title={Language.sign_in} onPress={onSubmit} />


                </View>

            </ScrollView>
        </SafeAreaViewWithStatusBar>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.colorWhite,
        justifyContent: 'center'
    },
    icon: {
        height: scaler(50),
        width: scaler(50),
        resizeMode: 'contain',
    },
    welcomeStyle: {
        fontSize: scaler(21),
        color: colors.colorPrimary
    },

    letSignIn: {
        fontSize: scaler(15),
        marginVertical: scaler(10),
        color: colors.colorGreyText,
    },
})


// _showPopUpAlert({
//     title: "Success",
//     image: Images.ic_delete_user,
//     message: "User created successfully",
//     buttonText: "Close",
//     isCloseButton: true
// })