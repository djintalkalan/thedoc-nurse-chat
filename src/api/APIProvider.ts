import { config } from 'api/config';
import { setLoadingAction, tokenExpired } from 'app-store/actions';
import { store } from 'app-store/store';
import axios, { AxiosRequestHeaders, AxiosResponse, Method } from 'axios';
import React, { MutableRefObject } from 'react';
import { Progress, Request, RNS3 } from 'react-native-aws3';
import Database, { retrieveToken } from 'src/database/Database';
import { LanguageType } from 'src/language/Language';
import { WaitTill, _showErrorMessage, _showErrorMessageParsed } from 'utils';


const FORCE_GET_CONTENT_TYPE_URLS = ['patient/address', 'getLanguage']

interface header {
  "Content-Type"?: string;
  "Accept-Language"?: LanguageType
  Accept?: string;
  Authorization?: string,
  platform?: string
  uuid: string
}

interface IApiResponse {
  success: boolean
  message?: string
  data?: any
  [key: string]: any
}

let uploadRequest: Request

export const TOKEN_EXPIRED: MutableRefObject<boolean | null> = React.createRef()

function interceptResponse(this: AxiosResponse<any>): any {
  try {
    if (config.TERMINAL_CONSOLES) {
      console.log("-----------AXIOS  Api Response is----------- ");
      console.log("url string ", this.config?.url);
      console.log("header ", this.config?.headers);
      console.log("body ", this.config?.data);
      console.log("methodType ", this.config?.method)
    }
    if (JSON.stringify(this.data).startsWith("<") || JSON.stringify(this.data).startsWith("\"<")) {
      store.dispatch(setLoadingAction(false))
      setTimeout(() => {
        _showErrorMessage("Internal Server Error")
      }, 500);
    } else if (this.status == 401) {
      if (!TOKEN_EXPIRED.current) {
        TOKEN_EXPIRED.current = true
        _showErrorMessageParsed(this?.data?.message)
        store.dispatch(tokenExpired())
      }
    }
    else {
      if (config.TERMINAL_CONSOLES)
        console.log(JSON.stringify(this?.data));
      return this?.data
    }
  } finally {

  }
}

const api = axios.create({
  baseURL: config.BASE_URL + config.API_VERSION,
  timeout: 1000 * 30,
  headers: {
    'Accept': "application/json",
    'X-Platform-Type': 'app',
  }
});


api.interceptors.request.use(async function (requestConfig) {
  try {

    if (config.TERMINAL_CONSOLES) {
      console.log("-----------AXIOS  Api request is----------- ");
      console.log("url string ", requestConfig.url);
      console.log("header ", requestConfig?.headers);
      console.log("body ", requestConfig?.data);
      console.log("methodType ", requestConfig?.method)
    }

  } finally {
    return requestConfig;
  }
});


api.interceptors.response.use(
  async function (response) {
    return interceptResponse.call(response)
  },
  async function (error) {
    return interceptResponse.call(error?.response)
  },
);


async function callApi(url: string, header: header, body: any, method?: Method): Promise<IApiResponse> {
  return api.request({
    method: method,
    url: url,
    data: body,
    headers: header as unknown as AxiosRequestHeaders,
    transformRequest: FORCE_GET_CONTENT_TYPE_URLS?.includes(url) && method == 'GET' ? (data, headers: any) => {
      if (headers) {
        headers.get = { "Content-Type": "application/json", }
      }
      return {}
    } : undefined
  })
}

export const _cancelUpload = () => {
  return uploadRequest?.abort();
}


async function fetchApiData(url: string, method?: Method, body?: any) {
  const isMultipart = (body && body instanceof FormData) ? true : false
  const authToken = Database.getStoredValue('authToken')
  const selectedLanguage = Database.getStoredValue<LanguageType>('selectedLanguage') || "en"
  try {
    let uuid = Database.getStoredValue('uuid');
    if (!uuid) {
      uuid = await retrieveToken();
      await WaitTill(500);
      Database?.setValue('uuid', uuid)
    }
    const header: header = {
      "Content-Type": (isMultipart) ? "multipart/form-data" : "application/json",
      Authorization: authToken ? `Bearer ${authToken}` : '',
      'Accept-Language': selectedLanguage,
      platform: 'nurseapp',
      uuid
    }
    return callApi(url, header, body, method)
  } catch (error: any) {
    throw new Error(error)
  }
}

const callUploadFileAWS = async (file: { uri: string, name: string, type: any, }, prefix: any, progressCallback: (progress: Progress, id: string) => any) => {
  console.log("Body S3", JSON.stringify(file))
  try {
    const options = {
      keyPrefix: config.AWS3_KEY_PREFIX,
      bucket: config.AWS3_IMAGE_BUCKET,
      region: config.AWS3_REGION,
      accessKey: config.AWS3_ACCESS_K + config.AWS3_ACCESS_E + config.AWS3_ACCESS_Y,
      secretKey: config.AWS3_SECRET_K + config.AWS3_SECRET_E + config.AWS3_SECRET_Y,
      successActionStatus: 201
    }
    console.log('options', options);

    uploadRequest = RNS3.put(file, options)
    uploadRequest.progress((progress) => progressCallback(progress, file?.name.substring(0, file?.name?.indexOf(".")))).then((response) => {
      console.log("response", response)
      if (response.status !== 201)
        throw new Error("Failed to upload image to S3");
      // console.log("res" + response.body);
      return response
    })
      .catch((error) => {
        console.log("AWS ERROR ", JSON.stringify(error));
      })
    return uploadRequest
  }
  catch (e) {
    console.log(e)
  }


}

export const uploadFileAWS = async (body: any, prefix: any, progressCallback: (progress: Progress, id: string) => any) => {
  return callUploadFileAWS(body, prefix, progressCallback)
}

const objectToParamString = (body: any) => {
  let s = ""
  Object.keys(body).some((d: string, index: number) => {
    if (body?.[d]?.toString().trim()) s += ((index ? "&" : "") + d + "=" + body?.[d]?.toString()?.trim())
  })
  return s
}

export const _doLogin = async (body: any) => {
  console.log("----------_doLogin Api Call ---------------")
  return fetchApiData('nurse/login', "POST", body)
}

export const _fetchAllPatients = async (body: any) => {
  console.log("----------Fetch all chats Api Call ---------------")
  return fetchApiData('nurse/chat-listing?' + (new URLSearchParams(body)).toString(), "GET")
}

export const _getAppVersion = async () => {
  console.log("---------- _bookAppointment Api Call ---------------")
  return fetchApiData('patient/app/version', "GET")
}

export const _getPatientChat = async (body: any) => {
  console.log("---------- _getPatientChat Api Call ---------------")
  return fetchApiData('nurse/chat-detail?' + (new URLSearchParams(body)).toString(), "GET")
}

export const _getUnreadMsgCount = async () => {
  console.log("---------- _getUnreadMsgCount Api Call ---------------")
  return fetchApiData('patient/get-unread-count', "GET")
}

export const _getPatientDetail = async (body: string) => {
  console.log("---------- _getPatientDetail Api Call ---------------")
  return fetchApiData('nurse/patient-detail/' + body, "GET")
}

export const _logout = async () => {
  console.log("---------- _getPatientDetail Api Call ---------------")
  return fetchApiData('nurse/logout', "POST")
}


