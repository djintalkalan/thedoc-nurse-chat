
import notifee, { AndroidDefaults, AndroidImportance, AndroidLaunchActivityFlag, EventType, Notification } from "@notifee/react-native";
import messaging from '@react-native-firebase/messaging';
import Database, { useDatabase } from 'database';
import { Dispatch, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useUpdateLanguage } from "src/language/Language";
import { NavigationService, WaitTill } from 'utils';

const CHANNEL_NAME = "high-priority"

notifee.createChannel({
    id: CHANNEL_NAME,
    name: CHANNEL_NAME,
    lights: true,
    vibration: true,
    sound: 'default',
    importance: AndroidImportance.HIGH,
})

notifee.createChannel({
    id: "upload",
    name: "upload",
    lights: true,
    vibration: false,
    sound: 'default',
    importance: AndroidImportance.HIGH,
})

let isFirstTime = true

let dispatch: Dispatch<any>

export const useFirebaseServices = () => {
    const [isLogin] = useDatabase<boolean>("isLogin");

    const updateLanguage = useUpdateLanguage()

    dispatch = useDispatch()
    const checkPermission = useCallback(async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
            messaging().getToken().then(token => {
                console.log("Token", token)
                Database.setFirebaseToken(token)
                // messaging().registerDeviceForRemoteMessages()
            }).catch(e => {
                console.log("error in getting token", e);

            })
        }
    }, [])


    const createNotificationListeners = useCallback(() => {
        const messageSubs = messaging().onMessage(onMessageReceived);
        const foregroundSubs = notifee.onForegroundEvent(({ type, detail }) => {
            switch (type) {
                case EventType.PRESS:
                    detail?.notification && onNotificationOpened(detail?.notification)
                    break;
            }
        });
        return () => {
            messageSubs();
            foregroundSubs();
        };
    }, [isLogin])

    useEffect(() => {
        checkPermission();
        const removeSubscription = createNotificationListeners()
        setTimeout(() => {
            isFirstTime = false
        }, 1500);
        return () => {
            removeSubscription()
        }
    }, [isLogin])
}

export const onNotificationOpened = (notification: Notification) => {
    navigateToPages(notification)
}

const navigateToPages = async (notification: any) => {
    console.log("isFirstTime", isFirstTime);

    if (isFirstTime) {
        await WaitTill(1500)
    }
    let { message: data } = notification?.data ?? {};
    if (data) {
        if (typeof data == 'string') {
            data = JSON.parse(data)
        }
        console.log("data is ", data, JSON.stringify(data));

        if (data?.message) {
            NavigationService.closeAndPush('NurseChat', {
                patient: {
                    ...data?.patient?.PatientGeneralInformation,
                    chat_room_id: data?.patient?.patient_id
                }
            })
        }

        // if (data?.chat_room_id) {
        //     const user = data?.users?.[data?.users?.[0]?._id == data?.user_id ? 0 : 1]
        //     NavigationService.closeAndPush("PersonChat", { person: user, chatRoomId: data?.chat_room_id })
        // }
    }
}


export const onMessageReceived = async (message: any, isBackground: boolean = false) => {
    if (isBackground)
        console.log("Background Firebase Message ", message)
    else
        console.log("Firebase Message ", message)

    const isLogin = Database.getStoredValue("isLogin");
    if (isLogin) {
        showNotification(message, isBackground)
    }
}

const showNotification = async (message: any, isBackground: boolean) => {
    if (!message?.data?.message) return
    const { name, params } = NavigationService?.getCurrentScreen() ?? {}
    let { title, body, message: messageData } = message?.data ?? {};
    if (messageData && typeof messageData == 'string') {
        messageData = JSON.parse(messageData)
    }
    if (!isBackground && name == "NurseChat" && params?.patient?.chat_room_id == messageData?.patient?.patient_id) {

    }
    else {
        console.log("data is ", messageData);
        notifee.displayNotification({
            body: body?.trim(),
            title: title.trim() || "theDoc Chat",
            data: { title, body, message: (JSON.stringify(messageData || '')) },
            android: {
                channelId: CHANNEL_NAME,
                sound: 'default',
                // category: AndroidCategory.ALARM,
                defaults: [AndroidDefaults.ALL],
                pressAction: {
                    id: 'default',
                    launchActivity: 'default',
                    launchActivityFlags: [AndroidLaunchActivityFlag.SINGLE_TOP],
                },
            },
            ios: {
                sound: 'default',
            }
        });
    }
}
