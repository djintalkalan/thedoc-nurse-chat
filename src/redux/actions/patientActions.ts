import ActionTypes, { action } from "app-store/action-types";

export const fetchAllPatients = (payload: { searchText?: string, fetchAllData?: boolean } = { searchText: '', fetchAllData: false }): action => {
    return {
        type: ActionTypes.FETCH_ALL_PATIENTS,
        payload
    }
}

export const setAllPatients = (payload: { searchText?: string, patients: any[], currentPage: number, totalPages: number }): action => {
    return {
        type: ActionTypes.SET_ALL_PATIENTS,
        payload
    }
}

export const increaseUnreadMessage = (payload: { chat_room_id?: string, created_at?: string }): action => {
    return {
        type: ActionTypes.INCREASE_UNREAD_MESSAGE,
        payload
    }
}

export const markReadMessages = (payload: { chat_room_id?: string }): action => {
    return {
        type: ActionTypes.MARK_READ_MESSAGES,
        payload
    }
}

