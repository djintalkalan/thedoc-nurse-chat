import * as ApiProvider from 'api/APIProvider';
import { refreshChatInPatient, setChatInPatient } from 'app-store/actions';
import { call, put, takeLeading } from "redux-saga/effects";
import Language from 'src/language/Language';
import { _showErrorMessage } from "utils";
import ActionTypes, { action } from "../action-types";

function* _getPatientChat({ type, payload, }: action): Generator<any, any, any> {
    const { setChatLoader, ...rest } = payload
    setChatLoader && setChatLoader(true)
    try {
        let res = yield call(ApiProvider._getPatientChat, rest);
        if (res.success) {
            const chats = res?.chatList
            // return
            yield put((payload?.last_chat_id ? setChatInPatient : refreshChatInPatient)({ chatRoomUserId: rest?.chat_room_id, chats: chats, message_id: payload?.last_chat_id }))
        } else if (res.status == 400) {
            _showErrorMessage(res.message);
        } else {
            _showErrorMessage(Language.something_went_wrong);
        }
        payload?.setChatLoader && payload?.setChatLoader(false)
        // yield put(setLoadingAction(false));
    }
    catch (error) {
        console.log("Catch Error", error);
        payload?.setChatLoader && payload?.setChatLoader(false)
        // yield put(setLoadingAction(false));
    }
}

// Watcher: watch auth request
export default function* watchChat() {
    // yield takeLeading(ActionTypes.GET_PERSON_CHAT, _getPersonChat);
    yield takeLeading(ActionTypes.GET_PATIENT_CHAT, _getPatientChat);


};