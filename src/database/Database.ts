// import * as RNLocalize from "react-native-localize";
import { getGenericPassword as GetGenericPasswordFromKeyChain, setGenericPassword as SetGenericPasswordFromKeyChain } from 'react-native-keychain';
import { MMKVInstance, MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage";
import uuid from 'react-native-uuid';
import { config } from 'src/api/config';
import { ILanguages, LanguageType } from "src/language/Language";
import { _showErrorMessage } from "utils";

export type StorageType = "userData" | "isLogin" | "firebaseToken" |
    "authToken" | "selectedLanguage" | 'socketConnected' | "allLanguages" | "uuid"
const StorageVariables = ["userData", "isLogin", "firebaseToken",
    "authToken", "selectedLanguage", 'socketConnected', "allLanguages", "uuid"]

type DataBaseType = {
    userData?: any
    isLogin?: boolean
    socketConnected?: boolean
    firebaseToken?: string
    authToken?: string
    selectedLanguage?: LanguageType
    allLanguages?: ILanguages
}

const retrieveToken = () => {
    console.log("Retrieving Token");

    GetGenericPasswordFromKeyChain({ service: config.BUNDLE_ID_PACKAGE_NAME }).then((res) => {
        console.log("RES", res);
        if (res && res?.service == config.BUNDLE_ID_PACKAGE_NAME && res?.username == config.BUNDLE_ID_PACKAGE_NAME && res?.password) {
            console.log("uuid is ", res?.password);
            Database.getInstance()?.setValue('uuid', res?.password)
            return
        }
        console.log("Generating new Token");
        let newToken = ''
        try {
            newToken = uuid?.v4()?.toString();
        }
        catch (e) {
            console.log("Error generating new Token")
            console.log(e)
        }
        console.log("New Token is ", newToken);
        SetGenericPasswordFromKeyChain(config.BUNDLE_ID_PACKAGE_NAME, newToken, { service: config.BUNDLE_ID_PACKAGE_NAME }).then(res => {
            Database.getInstance()?.setValue('uuid', newToken)
        }).catch(e => {
            console.log("Error setting uuid in the KeyChain")
            console.log(e)
        })
    }).catch(e => {
        console.log("Error getting uuid from KeyChain")
        console.log(e)
    });
}

class Database {

    private static mInstance: Database

    static getInstance = () => {
        if (!this.mInstance) {
            this.mInstance = new Database()
            const uuid = this.mInstance.getStoredValue('uuid');
            console.log("uuid is ", uuid);
            if (!uuid) retrieveToken();
        }
        return this.mInstance
    }


    static phoneStorage = new MMKVLoader().withEncryption().initialize();

    private userDataStorage = new MMKVLoader().withEncryption().withInstanceID("userDataStorage").initialize();
    private otherDataStorage = new MMKVLoader().withEncryption().withInstanceID("otherDataStorage").initialize();
    private languageStorage = new MMKVLoader().withEncryption().withInstanceID("languageStorage").initialize();
    private socketStorage = new MMKVLoader().withEncryption().withInstanceID("socketStorage").initialize();
    private uuidStorage = new MMKVLoader().withEncryption().withInstanceID("uuidStorage").initialize();

    DefaultCountry = 'US' // RNLocalize.getCountry() ?? 'US'

    public setLogin = (isLogin?: boolean) => {
        this.userDataStorage.setBool('isLogin', isLogin ?? false)
    }

    public setUserData = (userData?: any) => {
        this.userDataStorage.setMap('userData', userData ?? null)
    }

    public setAllLanguages = (languages: ILanguages) => {
        this.languageStorage.setMap('allLanguages', languages ?? null)
    }

    public setSocketConnected = (c?: boolean) => {
        this.socketStorage.setBool('socketConnected', c ?? false)
    }

    public setFirebaseToken = (token: string | null) => {
        this.userDataStorage.setString('firebaseToken', token ?? "")
    }

    public setAuthToken = (token: any) => {
        this.userDataStorage.setString('authToken', token ?? "")
    }

    public setSelectedLanguage = (language: LanguageType) => {
        this.languageStorage.setString('selectedLanguage', language)
    }

    getStorageForKey = (key?: StorageType): MMKVInstance => {
        switch (key) {
            case 'allLanguages':
            case 'selectedLanguage':
                return this.languageStorage
            case 'authToken':
            case 'isLogin':
            case 'authToken':
            case 'userData':
            case 'firebaseToken':
                return this.userDataStorage
            case 'socketConnected':
                return this.socketStorage
            case 'uuid':
                return this.uuidStorage

            default:
                return Database.phoneStorage
        }
    }

    public setMultipleValues = (data: DataBaseType) => {
        Object.keys(data)?.forEach((key) => {
            switch (key) {
                case 'authToken':
                case 'firebaseToken':
                case 'selectedLanguage':
                    return this.getStorageForKey(key).setString(key, data[key] ?? "")

                case 'isLogin':
                    return this.getStorageForKey(key).setBool(key, data[key] ?? false)

                case 'socketConnected':
                    return this.getStorageForKey(key).setBool(key, data[key] ?? false)

                case 'userData':
                case 'allLanguages':
                    return this.getStorageForKey(key).setMap(key, data[key] ?? null)

            }
        })
    }

    public setOtherString = (key: string, value: string) => {
        this.otherDataStorage.setString(key, value)
    }

    public setOtherBool = (key: string, value: boolean) => {
        this.otherDataStorage.setBool(key, value)
    }


    public getOtherString = (key: string) => {
        return this.otherDataStorage.getString(key) ?? ""
    }

    public getOtherBool = (key: string) => {
        return this.otherDataStorage.getBool(key) ?? ""
    }

    //@ts-ignore
    public getStoredValue = <T = any>(key: StorageType, defaultValue?: any): T => {
        switch (key) {
            case 'authToken':
            case 'firebaseToken':
            case 'selectedLanguage':
            case 'uuid':
                return this.getStorageForKey(key).getString(key) || defaultValue

            case 'isLogin':
            case 'socketConnected':
                return this.getStorageForKey(key).getBool(key) || defaultValue

            case 'userData':
            case 'allLanguages':
                return this.getStorageForKey(key).getMap(key) || defaultValue

        }
    }

    public setValue = (key: StorageType, value: any) => {
        switch (key) {
            case 'authToken':
            case 'firebaseToken':
            case 'uuid':
                return this.getStorageForKey(key).setString(key, value ?? "")

            case 'isLogin':
            case 'socketConnected':
                return this.getStorageForKey(key).setBool(key, value ?? false)

            case 'userData':
            case 'allLanguages':
                return this.getStorageForKey(key).setMap(key, value ?? null)

        }
    }

}

export const useDatabase = <T = any>(key: StorageType, defaultValue?: T):
    [T | null, (value: T | ((prevValue: T) => T)) => void] => {
    if (!StorageVariables.includes(key)) {
        _showErrorMessage("Wrong Key Used in UseDatabase")
        return [null, () => null]
    }
    const [value, setValue] = useMMKVStorage<T>(key, Database.getInstance().getStorageForKey(key), defaultValue);
    return [value, key == 'selectedLanguage' ? () => null : setValue];

}

export const useOtherValues = <T = any>(key: StorageType, defaultValue?: T):
    [T | null, (value: T | ((prevValue: T) => T)) => void] => {
    return useMMKVStorage<T>(key, Database.getInstance().getStorageForKey(key), defaultValue);
    // return [value, setValue];
}

export const mergeStorageInPersistedReducer = (persistReducer: any, persistConfig: any, rootReducer: any) => {
    return persistReducer({
        ...persistConfig,
        storage: Database.phoneStorage,
    }, rootReducer)
}

export default Database.getInstance()