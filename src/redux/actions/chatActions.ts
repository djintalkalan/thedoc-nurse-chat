import ActionTypes from "app-store/action-types"

export const getPatientChat = (payload: any) => ({
    type: ActionTypes.GET_PATIENT_CHAT,
    payload
})

export const setChatInPatient = (payload: { chatRoomUserId: string, chats: Array<any>, message_id?: string }) => ({
    type: ActionTypes.SET_CHAT_IN_PATIENT,
    payload
})

export const addChatInPatient = (payload: { chatRoomUserId: string, chat: any }) => ({
    type: ActionTypes.ADD_CHAT_IN_PATIENT,
    payload
})

export const updateChatInPatient = (payload: { chatRoomUserId: string, chat: any }) => ({
    type: ActionTypes.UPDATE_CHAT_IN_PATIENT,
    payload
})

export const updateChatInPatientSuccess = (payload: { chatRoomUserId: string, resourceId: any, message: any }) => ({
    type: ActionTypes.UPDATE_CHAT_IN_PATIENT_SUCCESS,
    payload
})

export const refreshChatInPatient = (payload: { chatRoomUserId: string, chats: Array<any> }) => ({
    type: ActionTypes.REFRESH_CHAT_IN_PATIENT,
    payload
})


