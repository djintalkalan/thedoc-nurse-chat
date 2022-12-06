import { useIsFocused } from '@react-navigation/native';
import { getPatientChat, markReadMessages } from 'app-store/actions';
import { store } from 'app-store/index';
import { colors } from 'assets/Colors';
import { Images } from 'assets/Images';
import { MyHeader, Text, useKeyboardService } from 'custom-components';
import { SafeAreaViewWithStatusBar } from 'custom-components/FocusAwareStatusBar';
import { useDatabase } from 'database';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Platform, StyleSheet, TextInput, View } from 'react-native';
import { Bar } from 'react-native-progress';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Language from 'src/language/Language';
import { EMIT_GET_MISSING_MESSAGES, EMIT_READ_MESSAGE, EMIT_SEND_PERSONAL_MESSAGE, SocketService } from 'src/socket';
import { getChatDateTime, NavigationService, scaler } from 'utils';
import ChatInput from '../ChatInput';
import ChatItem from '../ChatItem';

let loadMore = false
const { width } = Dimensions.get('screen')
const NurseChat: FC<any> = (props: any) => {
    const patient = props?.route?.params?.patient
    const patientName = patient?.first_name + (patient?.last_name ? " " + patient?.last_name : "")
    const textMessageRef = useRef("")
    const flatListRef = useRef<FlatList>(null);
    const inputRef = useRef<TextInput>(null);
    const [userData] = useDatabase('userData')
    const [isChatLoader, setChatLoader] = useState(false)
    const [socketConnected] = useDatabase<boolean>('socketConnected');
    const { bottom } = useSafeAreaInsets()
    const { keyboardHeight, isKeyboard } = useKeyboardService();
    const { chats } = useSelector(state => ({
        chats: state?.patientChat?.chatRooms?.[patient?.chat_room_id]?.chats,
    }))
    const isFocused = useIsFocused()
    const dispatch = useDispatch()
    const socketConnectionRef = useRef<boolean | null>(socketConnected)

    useEffect(() => {
        if (!socketConnectionRef?.current && socketConnected) {
            const id = store?.getState()?.patientChat?.chatRooms?.[patient?.chat_room_id]?.chats?.[0]?.id
            SocketService.emit(EMIT_GET_MISSING_MESSAGES, {
                chat_room_id: patient?.chat_room_id,
                last_read_message_id: id
            })
            // dispatch(getPatientChat({
            //     id: patient?.chat_room_id,
            //     setChatLoader: chats?.length ? null : setChatLoader,
            //     isMissing: true
            // }))
        }
        socketConnectionRef.current = socketConnected;
    }, [socketConnected])


    useEffect(() => {
        dispatch(getPatientChat({
            chat_room_id: patient?.chat_room_id,
            setChatLoader: chats?.length ? null : setChatLoader,
        }))
        setTimeout(() => {
            loadMore = true
        }, 200);
        return () => { loadMore = false }
    }, [])

    useEffect(() => {
        setTimeout(() => {
            if (chats?.length > 0) {
                const lastMessage = chats[0]
                console.log("lastMessage", lastMessage);
                SocketService.emit(EMIT_READ_MESSAGE, {
                    chat_room_id: patient?.chat_room_id,
                    last_read_message_id: lastMessage?.id,
                })
                dispatch(markReadMessages({
                    chat_room_id: patient?.chat_room_id
                }))
            }
        }, 500);

    }, [(chats || [])?.[0]?.id?.toString()])

    const _onPressSend = useCallback(() => {
        if (textMessageRef?.current?.trim()) {
            SocketService.emit(EMIT_SEND_PERSONAL_MESSAGE, {
                chat_room_id: patient?.chat_room_id,
                message_type: 'text',
                text: textMessageRef?.current?.trim()
            })
            textMessageRef.current = ""
            inputRef.current?.clear()
            // inputRef.current?.blur()
            try {
                flatListRef?.current?.scrollToIndex({ index: 0, animated: true });
            }
            catch (e) {
                console.log(e);
            }
        }
    }, [userData])

    const _renderChatItem = useCallback(({ item, index }: any) => {
        const dateTime = getChatDateTime(item?.created_at)
        const patientReadOnDate = item?.patient_read_on && getChatDateTime(item?.patient_read_on)
        return <ChatItem
            message={item?.text}
            messageType={item?.message_type}
            myMessage={!(item?.User?.patient_id && item?.User?.patient_id != '0')}
            imageUrl={item?.image}
            docUrl={item?.file}
            date={dateTime}
            patientReadOnDate={patientReadOnDate}
            originalFileName={item?.original_file_name}
            patientName={patientName}
        />
    }, [])

    return (
        <SafeAreaViewWithStatusBar edges={['bottom', 'top']}>
            <View style={styles.container}>
                <MyHeader title={patientName}
                    rightIcon={Images.ic_info}
                    rightIconStyle={{ height: scaler(30), width: scaler(30), }}
                    onPressRight={() => {
                        NavigationService.navigate("PatientDetail", { patient })
                    }}
                />
                <View style={styles.mainView}>

                    <View style={{ flexShrink: 1 }} >
                        {isChatLoader && <Bar width={width} height={scaler(2.5)} borderRadius={scaler(10)} animated
                            borderWidth={0}
                            animationConfig={{ bounciness: 2 }}
                            animationType={'decay'}
                            indeterminateAnimationDuration={600}
                            indeterminate
                            useNativeDriver
                            color={colors.colorPrimary} />}
                        <FlatList
                            // removeClippedSubviews={false}
                            keyboardShouldPersistTaps={'handled'}
                            showsVerticalScrollIndicator={false}
                            data={chats}
                            extraData={chats?.length}
                            keyExtractor={(_, i) => i.toString()}
                            bounces={false}
                            ref={flatListRef}
                            inverted
                            onEndReached={() => {
                                if (loadMore && !isChatLoader && isFocused) {
                                    console.log("End", chats[chats.length - 1]?.id);
                                    loadMore = false
                                    dispatch(getPatientChat({
                                        chat_room_id: patient?.chat_room_id,
                                        last_chat_id: chats[chats.length - 1]?.id,
                                        setChatLoader: setChatLoader,
                                    }))
                                    setTimeout(() => {
                                        loadMore = true
                                    }, 2000);
                                }

                            }}
                            renderItem={_renderChatItem}
                        />
                    </View>
                </View>

            </View>
            <View style={{ marginBottom: isKeyboard && Platform.OS == 'ios' ? (keyboardHeight - bottom) : undefined, backgroundColor: 'transparent', justifyContent: 'flex-end' }} >
                <ChatInput
                    ref={inputRef}
                    disabled={!socketConnected}
                    onPressSend={_onPressSend}
                    chat_room_id={patient?.chat_room_id}
                    onChange={(e: string) => textMessageRef.current = e}
                />
                {!socketConnected ? <View style={{ paddingVertical: scaler(4), paddingHorizontal: scaler(10), backgroundColor: colors.colorRed }} >
                    <Text style={{ color: colors.colorWhite, textAlign: 'center', fontSize: scaler(10) }} >{Language.chat_services_down}</Text>
                </View> : null}
            </View>

        </SafeAreaViewWithStatusBar>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.colorContainer
    },
    mainView: {
        flex: 1,
        marginHorizontal: scaler(20),
        marginBottom: scaler(5)
    },

    chatContainer: {
        borderRadius: scaler(6),
        backgroundColor: colors.colorPrimary,
        padding: scaler(8),
        maxWidth: '80%',
        alignSelf: 'flex-end'
    },
    chatText: {
        fontSize: scaler(16),
        color: colors.colorWhite
    }
})

export default NurseChat