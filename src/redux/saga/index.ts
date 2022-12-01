import { all, fork } from 'redux-saga/effects';
import watchAuth from "./authSaga";
import watchChat from './chatSaga';
import watchUploadSaga from './imageUploadSaga';

export function* rootSaga() {
  yield all([
    fork(watchAuth),
    fork(watchUploadSaga),
    fork(watchChat)
  ]);
}