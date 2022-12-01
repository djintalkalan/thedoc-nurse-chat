import ActionTypes, { action } from "app-store/action-types";

export const getCovidQuestions = (): action => {
    return {
        type: ActionTypes.GET_COVID_QUESTIONS
    }
}

export const setCovidQuestions = (payload: Array<any>): action => {
    return {
        type: ActionTypes.SET_COVID_QUESTIONS,
        payload
    }
}

export const getHealthQuizQuestions = (): action => {
    return {
        type: ActionTypes.GET_HEALTH_QUIZ_QUESTIONS
    }
}

export const setHealthQuizQuestions = (payload: Array<any>): action => {
    return {
        type: ActionTypes.SET_HEALTH_QUIZ_QUESTIONS,
        payload
    }
}

export const saveHealthQuizQuestions = (payload: any): action => {
    return {
        type: ActionTypes.SAVE_HEALTH_QUIZ_QUESTIONS,
        payload
    }
}

export const getDoctorList = (): action => {
    return {
        type: ActionTypes.GET_DOCTOR_LIST
    }
}

export const setDoctorList = (payload: any): action => {
    return {
        type: ActionTypes.SET_DOCTOR_LIST,
        payload
    }
}

export const refreshHomeScreen = (payload?: any): action => {
    return {
        type: ActionTypes.REFRESH_HOME_SCREEN,
        payload
    }
}

export const setCurrentAppointments = (payload: { currentAppointments: any[], appts: any[] }): action => {
    return {
        type: ActionTypes.SET_CURRENT_APPOINTMENTS_AND_APPTS,
        payload
    }
}

export const setJoinedAppointment = (payload: any): action => {
    return {
        type: ActionTypes.SET_JOINED_APPOINTMENT,
        payload
    }
}

export const saveCovidQuestions = (payload: any): action => {
    return {
        type: ActionTypes.SAVE_COVID_QUESTIONS,
        payload
    }
}

export const uploadProfileImage = (payload: any): action => {
    return {
        type: ActionTypes.PROFILE_IMAGE_UPLOAD_SAGA,
        payload
    }
}

export const getUnreadMessages = (): action => {
    return {
        type: ActionTypes.GET_UNREAD_MESSAGES
    }
}

export const setUnreadMessages = (payload: any): action => {
    return {
        type: ActionTypes.SET_UNREAD_MESSAGES,
        payload
    }
}