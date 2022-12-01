import { Platform, ToastAndroid } from 'react-native';
import RNFetchBlob from 'react-native-blob-util';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { _showErrorMessage, _showSuccessMessage } from "utils";

export interface DownloadProps {
    url: string,
    fileType: string,
    fileName?: string
}

export const downloadFile = async (prop: DownloadProps, hideNotification: boolean = false) => {
    prop.url = prop?.url?.replace(/%2F/, "/");
    const permission = Platform.OS == 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
    let permissionResult = await check(permission).catch((error) => {
        console.log("Permission Error", error)
    });
    if (Platform.OS == 'ios') {
        permissionResult = RESULTS.GRANTED
    }
    let file
    switch (permissionResult) {
        case RESULTS.UNAVAILABLE:
            console.log(
                'This feature is not available (on this device / in this context)',
            );
            break;
        case RESULTS.DENIED:
            console.log(
                'The permission has not been requested / is denied but requestable',
            );
            const r = await request(permission)
            if (r == RESULTS.GRANTED) {
                file = download(prop, hideNotification)
            }
            break;
        case RESULTS.GRANTED:
            console.log(
                'Permission Granted', prop
            );
            file = download(prop, hideNotification)
            break;
        case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            _showErrorMessage("Please provide essential permission in the setting")
            break;

    }
    return file

}

export const downloadFileArray = async (fileArray: DownloadProps[]) => {
    fileArray.forEach((item, index) => {
        downloadFile(item, true)
    });

}

const download = async (prop: DownloadProps, hideNotification: boolean) => {
    const { url, fileName, fileType } = prop
    let dirs = Platform.OS == 'ios' ? RNFetchBlob.fs.dirs.CacheDir : RNFetchBlob.fs.dirs.DownloadDir + "/theDoc Documents/";
    let name = url.substring(url.lastIndexOf('/') + 1)
    let exists = false
    if (exists == false) {
        return await RNFetchBlob.config({
            // add this option that makes response data to be stored as a file,
            fileCache: true,
            path: dirs + name,
            addAndroidDownloads: {
                useDownloadManager: true,
                title: name,
                path: dirs + name,
                notification: true
            }
        }).fetch('GET', url, {
            //some headers ..
            // 'Authorization': 'Bearer ' + token

        }).uploadProgress({ interval: 250 }, (written, total) => {
            console.log('uploaded', written / total)
        })
            // listen to download progress event
            .progress({ count: 10 }, (received, total) => {
                console.log('progress', received / total)
            })
            .then((res) => {
                // the temp file path
                // if (Platform.OS === "ios") {
                //     RNFetchBlob.ios.openDocument(res.data);
                // }
                if (!hideNotification && Platform.OS == 'android') _showSuccessMessage("File Saved Successfully at " + dirs + name)
                console.log('The file saved to ', res.path())
                return res
            }).catch((e) => {
                return null
            }).finally(() => {
                return null
            })

    } else {
        if (!hideNotification) ToastAndroid.show("File Already Downloaded at " + dirs + name, ToastAndroid.CENTER)
    }
    return null
}