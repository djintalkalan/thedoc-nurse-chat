// import * as RNLocalize from "react-native-localize";
import { MMKVInstance, MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage";
import { ILanguages, LanguageType } from "src/language/Language";
import { _showErrorMessage } from "utils";

export type StorageType = "userData" | "isLogin" | "firebaseToken" |
    "authToken" | "selectedLanguage" | 'socketConnected' | "allLanguages"
const StorageVariables = ["userData", "isLogin", "firebaseToken",
    "authToken", "selectedLanguage", 'socketConnected', "allLanguages"]

type DataBaseType = {
    userData?: any
    isLogin?: boolean
    socketConnected?: boolean
    firebaseToken?: string
    authToken?: string
    selectedLanguage?: LanguageType
    allLanguages?: ILanguages
}

class Database {

    private static mInstance: Database

    static getInstance = () => {
        if (!this.mInstance) {
            this.mInstance = new Database()
        }
        return this.mInstance
    }


    static phoneStorage = new MMKVLoader().withEncryption().initialize();

    private userDataStorage = new MMKVLoader().withEncryption().withInstanceID("userDataStorage").initialize();
    private otherDataStorage = new MMKVLoader().withEncryption().withInstanceID("otherDataStorage").initialize();
    private languageStorage = new MMKVLoader().withEncryption().withInstanceID("languageStorage").initialize();
    private socketStorage = new MMKVLoader().withEncryption().withInstanceID("socketStorage").initialize();

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
                return this.getStorageForKey(key).getString(key) || defaultValue

            case 'isLogin':
                return this.getStorageForKey(key).getBool(key) || defaultValue

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
                return this.getStorageForKey(key).setString(key, value ?? "")

            case 'isLogin':
                return this.getStorageForKey(key).setBool(key, value ?? false)

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