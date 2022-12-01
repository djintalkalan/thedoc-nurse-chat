import { useEffect } from "react";
import ExitApp from 'react-native-exit-app';
import SecureAuthentication, { AuthenticationErrors } from 'react-native-secure-authentication';
import Language from "./language/Language";

import Database from "database";
import { _showPopUpAlert } from "utils";

export const useLocalAuthentication = (props?: any) => {
    useEffect(() => {
        const isLogin = Database.getStoredValue('isLogin')
        if (!isLogin || __DEV__) return
        const _onError = (e: AuthenticationErrors) => {
            if (e?.name)
                switch (e?.name) {
                    case 'LAErrorUserCancel':
                    case 'LAErrorAuthenticationFailed':
                    case 'LAErrorSystemCancel':
                        _showPopUpAlert({
                            title: "Secure Device",
                            message: "You can not continue without authentication.",
                            rightButtonText: Language.ok,
                            onPressRightButton: ExitApp.exitApp
                        })
                        break;
                    case 'LAErrorUserFallback':
                        _showPopUpAlert({
                            title: "Secure Device",
                            message: "Please add passcode/pin/fingerprint authentication in your device to use the application",
                            rightButtonText: Language.ok,
                            onPressRightButton: ExitApp.exitApp
                        })
                        break;
                }
        }
        setTimeout(() => {
            SecureAuthentication.authenticate().catch(_onError)
        }, 2500);
    }, [])
}