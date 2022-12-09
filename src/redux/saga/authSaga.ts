import * as ApiProvider from 'api/APIProvider';
import { resetStateOnLogin, resetStateOnLogout, setLoadingAction, setLoadingMsg, tokenExpired as tokenExpiredAction } from "app-store/actions";
import { call, put, takeLatest } from "redux-saga/effects";
import Database from 'src/database/Database';
import Language from 'src/language/Language';
import { WaitTill, _showErrorMessage, _showSuccessMessage } from "utils";
import ActionTypes, { action } from "../action-types";

function* _getAppVersion({ type, payload }: action): Generator<any, any, any> {
    // try {
    //     const res = yield call(ApiProvider._getAppVersion, payload);
    //     if (res?.success && !__DEV__ && config.APP_TYPE != 'dev') {
    //         if (res.version[`${Platform.OS}Version`] > config.SERVER_APP_VERSION) {
    //             _showPopUpAlert({
    //                 title: Language.please_update,
    //                 message: Language.version_update,
    //                 rightButtonText: Language.update,
    //                 onPressRightButton: () => {
    //                     Linking.openURL(
    //                         Platform.OS == 'ios'
    //                             ? 'itms-apps://itunes.apple.com/us/app/apple-store/1516209111?mt=8'
    //                             : 'https://play.google.com/store/apps/details?id=' + config.BUNDLE_ID_PACKAGE_NAME,
    //                     );
    //                     setTimeout(() => {
    //                         RNExitApp.exitApp();
    //                     }, 200);
    //                 },
    //             })
    //         }
    //     }

    // } catch (e) {
    //     console.log(e);
    // }
}

function* _doLogin({ type, payload }: action): Generator<any, any, any> {

    yield put(setLoadingAction(true))

    const firebaseToken = Database.getStoredValue('firebaseToken');
    payload.fcmtoken = firebaseToken
    try {
        const res = yield call(ApiProvider._doLogin, payload);
        if (res?.success) {
            const { authtoken, ...userData } = res?.data
            ApiProvider.TOKEN_EXPIRED.current = false
            Database.setMultipleValues({
                authToken: authtoken,
                userData: userData,
                isLogin: true
            })
            yield put(resetStateOnLogin())
        } else {
            _showErrorMessage(res?.message)
        }
        yield put(setLoadingAction(false))
    } catch (e) {
        yield put(setLoadingAction(false))
        console.log(e);
    }
}


function* doLogout({ type, payload, }: action): Generator<any, any, any> {
    yield put(setLoadingAction(true));

    try {
        const res = yield call(ApiProvider._logout);
        if (res?.success) {
            _showSuccessMessage((Language as any)[res?.message]);
        }
        // _hidePopUpAlert()
        yield put(tokenExpiredAction(false));
        yield put(setLoadingAction(false));
    }
    catch (error) {
        console.log("Catch Error", error);
        // _hidePopUpAlert()
        yield put(tokenExpiredAction(false));
        yield put(setLoadingAction(false));
    }
}

function* tokenExpired({ type, payload, }: action): Generator<any, any, any> {
    if (payload) {
        yield put(setLoadingAction(true));
        yield put(setLoadingMsg("Logging out"));
    }
    try {
        // if (!__DEV__) {
        yield put(setLoadingAction(true));
        // yield call(AnalyticService.clearUserData)
        yield put(setLoadingAction(false));
        // }

        Database.setMultipleValues({
            isLogin: false,
            userData: null,
            authToken: '',
        })
        yield call(WaitTill, 1000)
        yield put(resetStateOnLogout())
        // FastImage.clearMemoryCache()
    }
    catch (error) {
        console.log("Catch Error", error);
        yield put(setLoadingAction(false));
    }
}

// Watcher: watch auth request
export default function* watchAuth() {
    yield takeLatest(ActionTypes.DO_LOGOUT, doLogout);
    yield takeLatest(ActionTypes.DO_LOGIN, _doLogin);
    yield takeLatest(ActionTypes.TOKEN_EXPIRED, tokenExpired);
    yield takeLatest(ActionTypes.GET_APP_VERSION, _getAppVersion);
};