
import * as Reducers from 'app-store/reducers';
import { rootSaga } from "app-store/saga";
import { DefaultRootState } from 'react-redux';
import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import { Persistor, persistReducer, persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import { SelectEffect, Tail } from 'redux-saga/effects';
import { mergeStorageInPersistedReducer } from 'src/database/Database';
declare module 'react-redux' {
    interface DefaultRootState {
        isLoading: boolean
        loadingMsg: string
    }
}

declare module 'redux-saga/effects' {
    function select<Fn extends (state: DefaultRootState, ...args: any[]) => any>(
        selector: Fn,
        ...args: Tail<Parameters<Fn>>
    ): SelectEffect
}

const PERSIST_ENABLED = true

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
    // Root
    key: 'root',
    // Storage Method (React Native)
    // storage: AsyncStorage // 
    // Whitelist (Save Specific Reducers)
    whitelist: PERSIST_ENABLED ? [

    ] : [],
    blacklist: [],
    throttle: 1000,
    debounce: 1000,
};

const rootReducer = combineReducers({
    isLoading: Reducers.isLoadingReducer,
    loadingMsg: Reducers.loadingMsgReducer,
});

const persistedReducer = mergeStorageInPersistedReducer(persistReducer, persistConfig, rootReducer);

const store: Store<DefaultRootState, any> = createStore<DefaultRootState, any, any, any>(
    persistedReducer,/* preloadedState, */
    applyMiddleware(sagaMiddleware)
)

// Middleware: Redux Persist Persister
const persistor: Persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export { store, persistor };
