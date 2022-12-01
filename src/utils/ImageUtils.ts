import { uploadFile, uploadProfileImage } from "app-store/actions";
import { colors } from "assets/Colors";
import { Fonts } from "assets/Fonts";
import { Images } from "assets/Images";
import { useDatabase } from "database";
import { useCallback } from "react";
import { Alert, GestureResponderEvent, PermissionsAndroid, Platform } from "react-native";
import DocumentPicker, { DocumentPickerOptions } from 'react-native-document-picker';
import ImagePicker, { Options as ImageOption } from 'react-native-image-crop-picker';
import { useDispatch } from "react-redux";
import Language, { useLanguage } from "src/language/Language";
import { EMIT_SEND_PERSONAL_MESSAGE, SocketService } from "src/socket";
import { scaler } from "./Scaler";
import { _showBottomMenu } from "./utilities";

const selectFile = async (type: 1 | 2, options: ImageOption) => {
    try {
        const launch = type == 1 ? ImagePicker.openCamera : ImagePicker.openPicker;
        const response = await launch(options);
        const photo = {
            uri: response?.path,
            type: response?.mime || 'image/jpeg',
            name: response?.path?.substring(
                response?.path?.lastIndexOf('/') + 1,
            ),
        }
        return photo
    } catch (e) {
        console.log('Error is ', e);
        return null
    }
}

const selectAttachment = async (options: DocumentPickerOptions<any>) => {
    try {
        const launch = DocumentPicker.pick
        const response = await launch(options);
        console.log('response', response);

        const photo = {
            uri: response[0]?.uri,
            type: response[0]?.type || 'image/jpeg',
            name: response[0]?.name
        }
        return photo
    } catch (e) {
        console.log('Error is ', e);
        return null
    }
}

const PROFILE_IMAGE_OPTIONS: ImageOption = {
    mediaType: 'photo',
    cropping: true,
    height: 400,
    width: 400,
}

const ATTACHMENT_OPTIONS: DocumentPickerOptions<any> = {
    allowMultiSelection: false,
    presentationStyle: 'fullScreen',
    transitionStyle: 'coverVertical',
    type: [
        // 'application/msword',
        // 'image/jpeg',
        // 'image/png',
        'application/pdf',
        DocumentPicker.types.pdf,
        // DocumentPicker.types.images,
    ]
}

const requestExternalStoragePermissions = async (options: DocumentPickerOptions<any>) => {
    if (Platform.OS === 'android') {
        try {
            const read = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            );
            const write = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            );
            if (read === PermissionsAndroid.RESULTS.GRANTED) {
                return selectAttachment(options);
            } else {
                Alert.alert(
                    Language.alert,
                    Language.permissiondenied,
                    [
                        {
                            text: Language.ok,
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                    ],
                    // {cancelable: false},
                );
            }
        } catch (err) {
            // alert(err);
            Alert.alert(
                Language.alert,
                err?.toString(),
                [
                    {
                        text: Language.ok,
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                ],
                // {cancelable: false},
            );
            console.warn(err);
        }
        return null;
    }
    else {
        return selectAttachment(options);
    }
};

const requestCameraPermission = async (options: ImageOption) => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return selectFile(1, options);
            } else {
                Alert.alert(
                    Language.alert,
                    Language.permissiondenied,
                    [
                        {
                            text: Language.ok,
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                    ],
                    // {cancelable: false},
                );
            }
        } catch (err) {
            // alert(err);
            Alert.alert(
                Language.alert,
                err?.toString(),
                [
                    {
                        text: Language.ok,
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                ],
                // {cancelable: false},
            );
            console.warn(err);
        }
    } else {
        return selectFile(1, options);
    }
    return null;
}

export const useProfileImageUtilities = () => {

    const dispatch = useDispatch()

    const openCamera = useCallback(async () => {
        const image = await requestCameraPermission(PROFILE_IMAGE_OPTIONS)
        if (image) {
            dispatch(uploadProfileImage(image))
        }
        console.log("CAMERA_IMAGE", image);

    }, [])

    const openGallery = useCallback(async () => {
        const image = await selectFile(2, PROFILE_IMAGE_OPTIONS)
        if (image) {
            dispatch(uploadProfileImage(image))
        }
        console.log("GALLERY_IMAGE", image);
    }, [])

    const pickImage = useCallback(() => {
        _showBottomMenu({
            buttons: [{
                title: Language.camera,
                iconSource: Images.ic_camera_icon,
                textStyle: { color: colors.colorPrimary, fontFamily: Fonts.medium, flex: 0.5 },
                onPress: openCamera
            }, {
                title: Language.gallery,
                iconSource: Images.ic_gallery_icon,
                textStyle: { color: colors.colorPrimary, fontFamily: Fonts.medium, flex: 0.5 },
                onPress: openGallery

            }],
            cancelTextStyle: { color: colors.colorErrorRed, fontFamily: Fonts.semiBold },
            cancelButtonContainerStyle: { marginBottom: scaler(10) },

        })
    }, [])

    return [pickImage, openCamera, openGallery]
}
type UseAttachmentResult = [(e?: GestureResponderEvent) => void, (data: any, prefix: string, originalName: string) => void]
export const useAttachmentUtilities = (): UseAttachmentResult => {
    const dispatch = useDispatch()
    const [userData] = useDatabase('userData')

    const openCamera = useCallback(async () => {
        const image = await requestCameraPermission(PROFILE_IMAGE_OPTIONS)
        if (image) dispatch(uploadFile({ image, onSuccess, prefixType: 'photo' }))
    }, [])

    const openGallery = useCallback(async () => {
        const image = await selectFile(2, PROFILE_IMAGE_OPTIONS)
        if (image) dispatch(uploadFile({ image, onSuccess, prefixType: 'photo' }))
        console.log("GALLERY_IMAGE", image);
    }, [])


    const openFile = useCallback(async () => {
        const file = await requestExternalStoragePermissions(ATTACHMENT_OPTIONS)
        if (file) dispatch(uploadFile({ image: file, onSuccess, prefixType: 'file' }))
    }, [])

    const onSuccess = useCallback((data: any, prefix: string, originalName: string) => {
        SocketService.emit(EMIT_SEND_PERSONAL_MESSAGE, {
            chat_room_id: userData?.patient_id,
            message_type: prefix == 'photo' ? 'image' : 'file',
            text: '',
            image: prefix == 'photo' ? data : '',
            file: prefix == 'photo' ? '' : data,
            original_file_name: originalName
        })
    }, [])

    const onPickAttachment = useCallback((e?: GestureResponderEvent) => {
        _showBottomMenu({
            buttons: [{
                title: Language.take_a_picture,
                iconSource: Images.ic_camera_icon,
                textStyle: { color: colors.colorPrimary, fontFamily: Fonts.medium },
                onPress: openCamera,
                // buttonContainerStyle: { flex: 1, backgroundColor: 'red' }
            }, {
                title: Language.upload_a_file,
                iconSource: Images.ic_file_icon,
                textStyle: { color: colors.colorPrimary, fontFamily: Fonts.medium },
                onPress: openFile

            }, {
                title: Language.upload_an_image,
                iconSource: Images.ic_gallery_icon,
                textStyle: { color: colors.colorPrimary, fontFamily: Fonts.medium },
                onPress: openGallery

            }],
            cancelTextStyle: { color: colors.colorBlackText, fontFamily: Fonts.semiBold },
            cancelButtonContainerStyle: { marginBottom: scaler(10) },

        })
    }, [useLanguage()])
    return [onPickAttachment, onSuccess]
}
