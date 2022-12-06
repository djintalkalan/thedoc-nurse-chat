import ActionTypes, { action } from "app-store/action-types"

const initialState = {
    currentPage: -1,
    totalPages: 1,
    allPatients: new Array(),
    searchedPatients: new Array(),
    searchText: '',
}

export type IPatientReducer = typeof initialState

export const patientReducer = (state = { ...initialState }, { type, payload }: action): IPatientReducer => {
    switch (type) {
        case ActionTypes.SET_ALL_PATIENTS:
            const { currentPage, patients = [], totalPages, searchText = '' } = payload
            const newState = { ...state }
            newState.currentPage = currentPage
            newState.totalPages = totalPages
            newState.searchText = searchText
            const updateKey = searchText?.trim() ? 'searchedPatients' : 'allPatients'
            if (currentPage > 1) newState[updateKey] = [...newState[updateKey], ...patients]
            else newState[updateKey] = patients;
            console.log("newState", newState);

            return newState
        case ActionTypes.MARK_READ_MESSAGES:
        case ActionTypes.INCREASE_UNREAD_MESSAGE:
            let oldIndex = 0, newIndex = 0;
            let allArray = state?.allPatients?.map((_, index) => {
                if (_?.chat_room_id == payload?.chat_room_id) {
                    oldIndex = index;
                    return { ..._, total_unread: type == ActionTypes.MARK_READ_MESSAGES ? 0 : _?.total_unread + 1, created_message_time: payload?.created_at || _?.created_message_time }
                }
                return _
            });
            if (oldIndex != newIndex)
                allArray?.splice(newIndex, 0, allArray?.splice(oldIndex, 1)[0])
            oldIndex = 0;
            let searchedArray = state?.searchedPatients?.map((_, index) => {
                if (_?.chat_room_id == payload?.chat_room_id) {
                    oldIndex = index;
                    return {
                        ..._,
                        total_unread:
                            type == ActionTypes.MARK_READ_MESSAGES ? 0 :
                                _?.total_unread + 1,
                        created_message_time: payload?.created_at || _?.created_message_time
                    }
                }
                return _
            });
            if (oldIndex != newIndex)
                searchedArray?.splice(newIndex, 0, searchedArray?.splice(oldIndex, 1)[0])

            return {
                ...state,
                allPatients: allArray,
                searchedPatients: searchedArray
            }


        case ActionTypes.RESET_STATE_ON_LOGIN:
        case ActionTypes.RESET_STATE_ON_LOGOUT:

            return { ...initialState }

        default:
            return state

    }


}