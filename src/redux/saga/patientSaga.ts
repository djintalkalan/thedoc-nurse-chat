import * as ApiProvider from 'api/APIProvider';
import { setAllPatients, setLoadingAction } from 'app-store/actions';
import { IPatientReducer } from 'app-store/reducers';
import { call, put, select, takeLeading } from "redux-saga/effects";
import { _showErrorMessage } from "utils";
import ActionTypes, { action } from "../action-types";

function* _fetchAllPatients({ type, payload, }: action): Generator<any, any, any> {

    const { searchText = '', fetchAllData = false } = payload

    if (fetchAllData) {
        var currentPage = 0, totalPages = 1
    } else {
        var { currentPage, totalPages }: IPatientReducer = yield select(state => ({
            currentPage: state.patients?.currentPage,
            totalPages: state.patients?.totalPages,
        }))
    }
    if (currentPage >= totalPages) return
    try {
        let res = yield call(ApiProvider._fetchAllPatients, { offset: currentPage + 1, search: searchText, limit: 20 });
        if (res.success) {
            yield put(setAllPatients({
                currentPage: parseInt(res?.currentPage),
                patients: res?.patientChatList,
                totalPages: res?.totalPages,
                searchText
            }))
        } else {
            _showErrorMessage(res.message);
        }
        yield put(setLoadingAction(false));
    }
    catch (error) {
        console.log("Catch Error", error);
        yield put(setLoadingAction(false));
    }
}

export default function* watchPatients() {
    yield takeLeading(ActionTypes.FETCH_ALL_PATIENTS, _fetchAllPatients);
};