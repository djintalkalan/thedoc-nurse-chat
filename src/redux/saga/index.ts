import { all, fork } from 'redux-saga/effects';
import watchAuth from "./authSaga";
import watchChat from './chatSaga';
import watchUploadSaga from './imageUploadSaga';
import watchPatients from './patientSaga';

export function* rootSaga() {
  yield all([
    fork(watchAuth),
    fork(watchUploadSaga),
    fork(watchChat),
    fork(watchPatients),
  ]);
}