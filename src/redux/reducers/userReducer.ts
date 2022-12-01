import ActionTypes, { action } from "app-store/action-types"

export interface IUserReducer {
    conditionList: Array<any>
    qrCode: string
    patient: any
    documentList: Array<any>
    claimList: Array<any>
    medicalHistory: any
    allergyList: Array<any>
    searchedConditions: Array<any>
    patientAddresses: Array<any>
    patientInsurance: Array<any>
}

const initialUserReducerValues: any = {
    conditionList: [],
    qrCode: '',
    patient: {},
    documentList: [],
    claimList: [],
    medicalHistory: {},
    allergyList: [],
    searchedConditions: [],
    patientAddresses: [],
    patientInsurance: []
}

export const userReducer = (state: IUserReducer = { ...initialUserReducerValues }, action: action) => {
    switch (action.type) {
        case ActionTypes.SET_CONDITION_LIST:
            return ({ ...state, conditionList: action.payload })
        case ActionTypes.SET_QR_CODE:
            return ({ ...state, qrCode: action.payload })
        case ActionTypes.SET_PROFILE:
            return ({ ...state, profile: action.payload })
        case ActionTypes.SET_DOCUMENT_LIST:
            return ({ ...state, documentList: action.payload.documentList, claimList: action.payload.claimList })
        case ActionTypes.SET_MEDICAL_HISTORY:
            return ({ ...state, medicalHistory: action.payload })
        case ActionTypes.SET_ALLERGY_LIST:
            return ({ ...state, allergyList: action.payload })
        case ActionTypes.SET_SEARCHED_CONDITION_LIST:
            return ({ ...state, searchedConditions: action.payload })
        case ActionTypes.SET_PATIENT_ADDRESS:
            return ({ ...state, patientAddresses: action.payload })
        case ActionTypes.SET_PATIENT_INSURANCE:
            return ({ ...state, patientInsurance: action.payload })
        case ActionTypes.RESET_STATE_ON_LOGIN:
        case ActionTypes.RESET_STATE_ON_LOGOUT:
            return initialUserReducerValues
        default:
            return { ...state }
    }

}