import ActionTypes, { action } from "app-store/action-types";

export const getConditionList = (): action => {
    return {
        type: ActionTypes.GET_CONDITION_LIST
    }
}

export const setConditionList = (payload: Array<any>): action => {
    return {
        type: ActionTypes.SET_CONDITION_LIST,
        payload
    }
}

export const getQrCode = (): action => {
    return {
        type: ActionTypes.GET_QR_CODE
    }
}

export const setQrCode = (payload: Array<any>): action => {
    return {
        type: ActionTypes.SET_QR_CODE,
        payload
    }
}

export const getProfile = (): action => {
    return {
        type: ActionTypes.GET_PROFILE,
    }
}

export const setProfile = (payload: any): action => {
    return {
        type: ActionTypes.SET_PROFILE,
        payload
    }
}

export const getDocumentList = (payload: any): action => {
    return {
        type: ActionTypes.GET_DOCUMENT_LIST,
        payload
    }
}

export const setDocumentList = (payload: any): action => {
    return {
        type: ActionTypes.SET_DOCUMENT_LIST,
        payload
    }
}

export const updateNickname = (payload: any): action => {
    return {
        type: ActionTypes.UPDATE_NICKNAME,
        payload
    }
}

export const updateLang = (payload: any): action => {
    return {
        type: ActionTypes.UPDATE_LANGUAGE,
        payload
    }
}

export const getPatientAddress = (): action => {
    return {
        type: ActionTypes.GET_PATIENT_ADDRESS,
    }
}

export const setPatientAddress = (payload: any): action => {
    return {
        type: ActionTypes.SET_PATIENT_ADDRESS,
        payload
    }
}

export const getMedicalHistory = (): action => {
    return {
        type: ActionTypes.GET_MEDICAL_HISTORY,
    }
}

export const setMedicalHistory = (payload: any): action => {
    return {
        type: ActionTypes.SET_MEDICAL_HISTORY,
        payload
    }
}

export const updateHeightWeight = (payload: any): action => {
    return {
        type: ActionTypes.UPDATE_HEIGHT_WEIGHT,
        payload
    }
}

export const addAllergy = (payload: any): action => {
    return {
        type: ActionTypes.ADD_ALLERGY,
        payload
    }
}

export const updateAllergy = (payload: any): action => {
    return {
        type: ActionTypes.UPDATE_ALLERGY,
        payload
    }
}

export const addCondition = (payload: any): action => {
    return {
        type: ActionTypes.ADD_CONDITION,
        payload
    }
}

export const getAllergyList = (): action => {
    return {
        type: ActionTypes.GET_ALLERGY_LIST
    }
}

export const setAllergyList = (payload: Array<any>): action => {
    return {
        type: ActionTypes.SET_ALLERGY_LIST,
        payload
    }
}

export const getSearchedConditionList = (payload: any): action => {
    return {
        type: ActionTypes.GET_SEARCHED_CONDITION_LIST,
        payload
    }
}

export const setSearchedConditionList = (payload: Array<any>): action => {
    return {
        type: ActionTypes.SET_SEARCHED_CONDITION_LIST,
        payload
    }
}

export const getPatientInsurance = (): action => {
    return {
        type: ActionTypes.GET_PATIENT_INSURANCE,
    }
}

export const setPatientInsurance = (payload: Array<any>): action => {
    return {
        type: ActionTypes.SET_PATIENT_INSURANCE,
        payload
    }
}

export const updateAddress = (payload: any): action => {
    return {
        type: ActionTypes.UPDATE_ADDRESS,
        payload
    }
}


