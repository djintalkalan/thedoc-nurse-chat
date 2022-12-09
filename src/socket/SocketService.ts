import { config } from "api";
import { increaseUnreadMessage, markReadMessages, setChatInPatient } from "app-store/actions";
import Database from "database";
import { Dispatch } from "react";
import { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client";
import { DefaultLanguage, LanguageType } from "src/language/Language";
import { NavigationService } from "utils";
import { EMIT_JOIN_ROOMS_AS_NURSE, ON_CONNECT, ON_CONNECTION, ON_DISCONNECT, ON_GET_MISSING_MESSAGES, ON_JOIN, ON_JOIN_ROOM, ON_LEAVE_ROOM, ON_PATIENT_READ_MESSAGE, ON_PERSONAL_MESSAGE, ON_READ_MESSAGE, ON_RECONNECT } from "./SocketEvents";

class Service {
    static instance?: Service;
    private socket?: Socket;
    private dispatch!: Dispatch<any>;

    static getInstance = () => {
        if (!this.instance) {
            this.instance = new Service()
        }
        return this.instance;
    }

    init = (dispatch: Dispatch<any>) => {
        this.dispatch = dispatch
        const isLogin = Database.getStoredValue('isLogin')
        if (!this.socket) {
            if (isLogin) {
                const authToken = Database.getStoredValue('authToken')
                const selectedLanguage = Database.getStoredValue<LanguageType>('selectedLanguage') || DefaultLanguage

                const url = config?.SOCKET_URL + (config?.SOCKET_PORT ? (":" + config?.SOCKET_PORT) : "")
                const options: Partial<ManagerOptions & SocketOptions> = {
                    timeout: 5000,
                    reconnection: true,
                    // autoConnect: false,
                    // reconnectionDelay: 5000,
                    secure: url?.startsWith("https") || url?.startsWith("wss"),
                    // secure: true,
                    transports: ['websocket', 'polling'],
                    extraHeaders: {
                        Authorization: "Bearer " + authToken,
                        'Accept-Language': selectedLanguage,
                        platform: 'nurseapp',
                        uuid: Database.getStoredValue('uuid'),
                    }
                }
                console.log('url', url);
                console.log('options', options);

                this.socket = io(url, options);
                this.initListeners();
                console.log("connecting");
                this.socket.connect()
            }
        } else {
            if (isLogin) {
                this.socket?.connect()
            }
        }
    }

    closeSocket = () => {
        if (this.socket) {
            this.socket.disconnect();
            Database.setSocketConnected(false);
            this.socket = undefined
        }
    }

    emit = (event: string, data?: any) => {
        console.log("Event Emit", event);
        console.log("Event Payload", data);
        this.socket?.emit(event, {
            event,
            payload: data
        })
    }


    private initListeners = () => {
        this.socket?.on(ON_CONNECTION, this.onConnection)
        this.socket?.on(ON_CONNECT, this.onConnect)
        this.socket?.on(ON_DISCONNECT, this.onDisconnect)
        this.socket?.io?.on(ON_RECONNECT, this.onReconnect)

        this.socket?.on(ON_JOIN, this.onJoin)
        this.socket?.on(ON_JOIN_ROOM, this.onJoinRoom)
        this.socket?.on(ON_LEAVE_ROOM, this.onLeaveRoom)
        this.socket?.on(ON_PERSONAL_MESSAGE, this.onPersonalMessage)
        this.socket?.on(ON_READ_MESSAGE, this.onReadMessage)
        this.socket?.on(ON_PATIENT_READ_MESSAGE, this.onPatientReadMessage)
        this.socket?.on(ON_GET_MISSING_MESSAGES, this.onMissingPersonalMessage)


        this.listenErrors();
        // this.socket?.on(ON_EVENT_MESSAGE_TYPING, this.onEventMessageTyping)
    }

    private onJoin = (e: any) => {

    }

    private onJoinRoom = (e: any) => {

    }

    private onLeaveRoom = (e: any) => {

    }




    /////  connection and error

    private onConnection = (e: any) => {
        console.log("Connection Successful", e)
        this.emit(EMIT_JOIN_ROOMS_AS_NURSE)
        Database.setSocketConnected(true);
    }

    private onConnect = () => {
        console.log("Socket Connect")
    }

    private onReconnect = () => {
        console.log("Socket Re-Connect")
        // this.emit(EMIT_JOIN)
    }

    private onMissingPersonalMessage = (e: any) => {
        console.log('onMissingPersonalMessage', e);
        if (e?.status == 200 && e?.data?.length) {
            const data: any[] = e?.data
            this.dispatch(setChatInPatient({
                chatRoomUserId: data?.[0]?.chat_room_id,
                chats: data?.reverse(),
            }))
        }
    }

    private onPersonalMessage = (e: any) => {
        console.log('onPersonalMessage', e);
        console.log('userdata', Database.getStoredValue('userData'));
        if (e?.status == 200 && e?.data) {
            const data = e?.data
            this.dispatch(setChatInPatient({
                chatRoomUserId: data?.chat_room_id,
                chats: [data]
            }))
            const currentScreen = NavigationService.getCurrentScreen()
            console.log("currentScreen", currentScreen);

            if (e?.data?.User?.patient_id != 0) {

                if (currentScreen?.name != 'NurseChat' || currentScreen?.params?.patient?.chat_room_id != e?.data?.chat_room_id) {

                    // const index = store.getState()?.patients?.allPatients?.findIndex(_ => {
                    //    return _?.chat_room_id == e?.data?.chat_room_id
                    // })
                    //     ?.unreadMessages || 0
                    console.log("updating", e?.data?.chat_room_id);

                    this.dispatch(increaseUnreadMessage({
                        chat_room_id: e?.data?.chat_room_id,
                        created_at: e?.data?.created_at
                    }));
                }
            } else {
                if (currentScreen?.name != 'NurseChat' || currentScreen?.params?.patient?.chat_room_id != e?.data?.chat_room_id) {
                    this.dispatch(markReadMessages({
                        chat_room_id: e?.data?.chat_room_id,
                        created_at: e?.data?.created_at
                    }));
                }
            }
        }
    }
    private onReadMessage = (e: any) => {
        const currentScreen = NavigationService.getCurrentScreen()
        console.log('onReadMessage', e);
        if ((currentScreen?.name != 'NurseChat' || currentScreen?.params?.patient?.chat_room_id != e?.data?.chat_room_id) && e?.data?.user_type != 'patient') {
            this.dispatch(markReadMessages({
                chat_room_id: e?.data?.chat_room_id,
                created_at: e?.data?.created_at
            }));
        }
    }

    private onPatientReadMessage = (e: any) => {
        console.log('onPatientReadMessage', e);
        if (e?.status == 200 && e?.data?.length) {
            this.dispatch(setChatInPatient({
                chatRoomUserId: e?.data?.[0]?.chat_room_id,
                chats: e?.data
            }))
        }
    }

    private onDisconnect = (reason: Socket.DisconnectReason) => {
        console.log("Connection Closed", reason)
        Database.setSocketConnected(false);
        switch (reason) {
            case 'io server disconnect':

                break;
            case 'io client disconnect':

                break;

            case 'ping timeout':

                break;

            case 'transport close':

                break;

            case 'transport error':

                break;

            default:
                break;
        }
    }

    private listenErrors = () => {
        this.socket?.on("connect_error", (err: Error) => {
            console.log("connect_error", err); // prints the message associated with the error
        });

        this.socket?.on('reconnecting', function () {
            console.log("reconnecting", 'Attempting to re-connect to the server'); // prints the message associated with the error

        });

        this.socket?.io.on("reconnect_attempt", () => {
            console.log("reconnect_attempt", 'Attempting to re-connect to the server'); // prints the message associated with the error

        });

        this.socket?.on('error', function (e) {
            console.log("error error", e);
        });



    }
}

export const SocketService = Service.getInstance()
