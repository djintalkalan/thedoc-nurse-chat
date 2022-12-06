import ActionTypes, { action } from "app-store/action-types";
import { unionBy } from "lodash";

export interface IPatientChatReducer {
    chatRooms: IChatRooms
}

interface IChatRooms {
    [key: string]: IPatientChat
}

interface IPatientChat {
    chats: Array<any>
}

const initialPatientChatState: IPatientChatReducer = {
    chatRooms: {}
}

export const patientChatReducer = (state: IPatientChatReducer = initialPatientChatState, action: action): IPatientChatReducer => {
    const { chatRoomUserId } = action?.payload ?? {}

    switch (action.type) {
        case ActionTypes.SET_CHAT_IN_PATIENT:
            const newState = { ...state }
            if (!newState?.chatRooms?.[chatRoomUserId]) {
                newState.chatRooms[chatRoomUserId] = {
                    chats: [],
                }
            }
            if (action?.payload?.message_id) {
                newState.chatRooms[chatRoomUserId].chats = unionBy(newState.chatRooms[chatRoomUserId]?.chats, action?.payload?.chats, "id")
            } else newState.chatRooms[chatRoomUserId].chats = unionBy(action?.payload?.chats, newState.chatRooms[chatRoomUserId]?.chats, "id")
            console.log("action", action);
            console.log("newState", newState);

            return newState
        case ActionTypes.REFRESH_CHAT_IN_PATIENT:
            const refreshChatState = { ...state }
            if (!refreshChatState.chatRooms?.[chatRoomUserId]) {
                refreshChatState.chatRooms[chatRoomUserId] = {
                    chats: [],
                }
            }
            refreshChatState.chatRooms[chatRoomUserId].chats = action?.payload?.chats
            return refreshChatState
        // case ActionTypes.ADD_CHAT_IN_PATIENT:
        //     const addChatState = { ...state }
        //     if (!addChatState.chatRooms[chatRoomUserId]) {
        //         addChatState.chatRooms[chatRoomUserId].chats = []
        //     }
        //     addChatState.chatRooms[chatRoomUserId].chats.push(action?.payload?.chat)
        //     return addChatState
        // case ActionTypes.UPDATE_CHAT_IN_PATIENT:
        //     const updateChatState = { ...state }
        //     if (!updateChatState.chatRooms[chatRoomUserId]) {
        //         updateChatState.chatRooms[chatRoomUserId].chats = []
        //     }
        //     updateChatState.chatRooms[chatRoomUserId].chats = (state.chatRooms?.[chatRoomUserId]?.chats ?? []).map((_) => {
        //         if (action?.payload?.chat?._id == _._id)
        //             return action?.payload?.chat
        //         else {
        //             return _
        //         }
        //     })
        //     return updateChatState

        // case ActionTypes.UPDATE_CHAT_IN_PATIENT_SUCCESS:
        //     if (state.chatRooms[chatRoomUserId]) {
        //         console.log("UPDATE_CHAT_IN_EVENT_SUCCESS", action?.payload);
        //         const i = state.chatRooms?.[chatRoomUserId]?.chats?.findIndex(_ => _?._id == action?.payload?.resourceId)
        //         if (i > -1) {
        //             const newState = { ...state }
        //             newState.chatRooms[chatRoomUserId].chats[i] = action?.payload?.message
        //             console.log("newState", newState);
        //             return newState
        //         }
        //     }
        //     return state
        case ActionTypes.RESET_STATE_ON_LOGIN:
        case ActionTypes.RESET_STATE_ON_LOGOUT:
            initialPatientChatState.chatRooms = {}
            return initialPatientChatState
        default:
            return state
    }
}


