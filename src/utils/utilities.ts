
import { config } from 'api';
import { colors } from 'assets';
import { IBottomMenu } from 'custom-components/BottomMenu';
import { IAlertType } from 'custom-components/PopupAlert';
import { TouchAlertType } from 'custom-components/TouchAlert';
import { format as FNSFormat, sub } from 'date-fns';
import moment from 'moment-timezone';
import { Keyboard, Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import Share, { ShareOptions } from 'react-native-share';
import Toast from 'react-native-simple-toast';
import Language, { LanguageType } from 'src/language/Language';
import { NavigationService } from './NavigationService';
import { StaticHolder } from './StaticHolder';

const urlRegx = /[?&]([^=#]+)=([^&#]*)/g

export const share = async (options: ShareOptions) => {
    return await Share.open(options)
};

export const htmlToPlainText = (text: string): string => {
    if (text) {
        text = text.replace(/[&]nbsp[;]/g, " ");
        text = text.replace(/[<]br[>]/g, "\n");
        text = text.replace(/<[^>]+>/g, '')
    }
    return text
}

export const stringToDate = (_date: string, _format: string = "YYYY-MM-DD", _delimiter: "-" | "/" | "." = "-"): Date => {
    try {
        _format = _format.toLowerCase();
        let _time: Array<any> = []
        if (_date.includes(":")) {
            const arr = _date.split(" ")
            if (arr[0].includes(":")) {
                _date = arr[1]
                _time = arr[0].split(":")
            } else {
                _date = arr[0]
                _time = arr[1].split(":")
            }
        }
        const formatItems = _format.split(_delimiter);
        const dateItems = _date.split(_delimiter);
        const monthIndex = formatItems.indexOf("mm");
        const dayIndex = formatItems.indexOf("dd");
        const yearIndex = formatItems.indexOf("yyyy");
        let month = parseInt(dateItems[monthIndex]);
        month -= 1;
        const dates = new Date(parseInt(dateItems[yearIndex]), month, parseInt(dateItems[dayIndex]), parseInt(_time[0] ?? 0), parseInt(_time[1] ?? 0), parseInt(_time[2] ?? 0));
        return dates
    }
    catch (e) {
        console.log("e", e)
        return new Date()
    }
}

export const dateStringFormat = (dateString: string, toFormat: string, fromFormat: string = "YYYY-MM-DD", delimiter: "-" | "/" | "." = "-") => {
    try {
        return dateFormat(stringToDate(dateString, fromFormat, delimiter), toFormat)
    }
    catch (e) {
        console.log("Error", encodeURIComponent)
        return dateString
    }
}

export const dateFormat = (date: Date, toFormat: string) => {
    try {
        toFormat = toFormat.replace("YYYY", 'yyyy')
        toFormat = toFormat.replace("YYY", 'yyy')
        toFormat = toFormat.replace("YY", 'yy')
        toFormat = toFormat.replace("YY", 'yy')
        toFormat = toFormat.replace("DDD", 'ddd')
        toFormat = toFormat.replace("DD", 'dd')
        toFormat = toFormat.replace("D", 'd')
        toFormat = toFormat.replace("A", 'a')
        return FNSFormat(date, toFormat)
    }
    catch (e) {
        console.log("Error", encodeURIComponent)
        return date.toDateString()
    }
}

export const isNumeric = (value: any) => {
    return /^-?\d+$/.test(value);
}





export const _calculateAge = (birthday: string | Date, format: string = "YYYY-MM-DD", delimiter: "-" | "/" | "." = "-") => { // birthday is a date
    if (typeof birthday == "string") {
        birthday = stringToDate(birthday, format, delimiter)
    }
    return getAge(birthday)
}

function getAge(dob: Date) {
    let now = new Date();
    let yearNow = now.getFullYear();
    let monthNow = now.getMonth();
    let dateNow = now.getDate();

    let yearDob = dob.getFullYear();
    let monthDob = dob.getMonth();
    let dateDob = dob.getDate();
    let age = {
        years: -1,
        months: -1,
        days: -1
    };
    let ageString = "";
    let yearString = "Y";
    let monthString = "M";
    let dayString = "D";


    let yearAge = yearNow - yearDob;
    let monthAge
    if (monthNow >= monthDob)
        monthAge = monthNow - monthDob;
    else {
        yearAge--;
        monthAge = 12 + monthNow - monthDob;
    }
    let dateAge
    if (dateNow >= dateDob)
        dateAge = dateNow - dateDob;
    else {
        monthAge--;
        dateAge = 31 + dateNow - dateDob;

        if (monthAge < 0) {
            monthAge = 11;
            yearAge--;
        }
    }

    age = {
        years: yearAge,
        months: monthAge,
        days: dateAge
    };

    if ((age?.years > 0) && (age.months > 0) && (age.days > 0))
        ageString = age?.years + yearString + ", " + age.months + monthString + ", " + age.days + dayString;
    else if ((age?.years == 0) && (age.months == 0) && (age.days > 0))
        ageString = age.days + dayString;
    else if ((age?.years > 0) && (age.months == 0) && (age.days == 0))
        ageString = age?.years + yearString;
    else if ((age?.years > 0) && (age.months > 0) && (age.days == 0))
        ageString = age?.years + yearString + ", " + age.months + monthString;
    else if ((age?.years == 0) && (age.months > 0) && (age.days > 0))
        ageString = age.months + monthString + ", " + age.days + dayString;
    else if ((age?.years > 0) && (age.months == 0) && (age.days > 0))
        ageString = age?.years + yearString + ", " + age.days + dayString;
    else if ((age?.years == 0) && (age.months > 0) && (age.days == 0))
        ageString = age.months + monthString;
    else ageString = "Oops! Could not calculate age!";

    return ageString;
}



export const _showErrorMessage = async (msg?: string, time?: number) => {
    if (!msg || !msg.trim()) return
    StaticHolder.dropDownAlert('error', "Error", msg, time)
}

export const _showErrorMessageParsed = async (msg?: string, time?: number) => {
    if (!msg || !msg.trim()) return
    msg && _showErrorMessage((Language as any)?.[msg] || msg)
}

export const _showWarningMessage = async (msg?: string, time?: number) => {
    if (!msg || !msg.trim()) return
    StaticHolder.dropDownAlert('warn', "Warning", msg, time)
}

export const _showSuccessMessage = async (msg?: string, time?: number) => {
    if (!msg || !msg.trim()) return
    StaticHolder.dropDownAlert('success', "Success", msg, time)
}

export const _showSuccessMessageParsed = async (msg?: string, time?: number) => {
    if (!msg || !msg.trim()) return
    msg && _showSuccessMessage((Language as any)?.[msg] || msg)
}

export const _showPopUpAlert = (data: IAlertType) => {
    Keyboard.dismiss()
    setTimeout(() => {
        StaticHolder.alert(data)
    }, 0);
}

export const _hidePopUpAlert = () => {
    StaticHolder.hide()
}

export const _showTouchAlert = (data: TouchAlertType) => {
    Keyboard.dismiss()
    setTimeout(() => {
        StaticHolder.showTouchAlert(data)
    }, 0);
}

export const _hideTouchAlert = () => {
    StaticHolder.hideTouchAlert()
}

export const _showBottomMenu = (data: IBottomMenu) => {
    Keyboard.dismiss()
    setTimeout(() => {
        StaticHolder.showBottomMenu(data)
    }, 0);
}

export const _zoomImage = (imageUrl: string, downloadable?: boolean) => {
    console.log("Showing", imageUrl);

    Keyboard.dismiss()
    setTimeout(() => {
        StaticHolder.showImage(imageUrl, downloadable)
    }, 0);
}

export const _cancelZoom = () => {
    StaticHolder.hideImage()
}


export const WaitTill = async (time: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    })
}


export const getDetailsFromDynamicUrl = (url: string): any => {
    try {
        // const arr = url?.split("/").reverse();

        return getQueryVariables(url)


        //@ts-ignore
        // return { id: arr[0], type: arr[1] }
    }
    catch (e) {
        return {}
    }
}

export const _showToast = (message: string, duration: 'SHORT' | 'LONG' = 'SHORT', gravity: 'TOP' | 'BOTTOM' | 'CENTER' = 'BOTTOM') => {
    Toast.showWithGravity(message, Toast?.[duration], Toast?.[gravity]);
}

export const openLink = async (url: string, options: any = {}) => {
    try {
        if (await InAppBrowser.isAvailable()) {
            try {
                InAppBrowser.close()
            }
            catch (e) {
                console.log(e)
            }
            InAppBrowser.open(url, {
                // iOS Properties
                dismissButtonStyle: 'close',
                preferredBarTintColor: 'white',
                preferredControlTintColor: colors.colorBlackText,
                readerMode: false,
                animated: true,
                modalPresentationStyle: 'fullScreen',
                modalTransitionStyle: 'coverVertical',
                modalEnabled: true,
                enableBarCollapsing: false,
                // Android Properties
                showTitle: true,
                toolbarColor: 'white',
                secondaryToolbarColor: colors.colorBlackText,
                hasBackButton: true,
                navigationBarColor: colors.colorBlackText,
                navigationBarDividerColor: 'white',
                enableUrlBarHiding: true,
                enableDefaultShare: true,
                forceCloseOnRedirection: false,
                showInRecents: true,
                // Specify full animation resource identifier(package:anim/name)
                // or only resource name(in case of animation bundled with app).
                animations: {
                    startEnter: 'slide_in_right',
                    startExit: 'slide_out_left',
                    endEnter: 'slide_in_left',
                    endExit: 'slide_out_right'
                },
                headers: {},
                ...options
            })
        }
        else Linking.openURL(url)
    } catch (error: any) {
        _showErrorMessage(error?.message)
    }
}


export const getQueryVariables = (url: string) => {
    let params: any = {}, match
    try {
        while (match = urlRegx.exec(url)) {
            params[match[1]] = match[2];
        }
    }
    catch (e) {
        console.log("Regx error", e);
    }
    return params
}

export const _showDocuments = (url: string,) => {
    if ((url?.toLowerCase()?.endsWith("png") ||
        url?.toLowerCase()?.endsWith("jpg") ||
        url?.toLowerCase()?.endsWith("jpeg") ||
        url?.toLowerCase()?.endsWith("heic") ||
        url?.toLowerCase()?.endsWith("heif"))) {
        _zoomImage(url, true)
    } else {
        NavigationService.navigate("DocumentViewer", { url })
    }

}

const getLanguageString = (language: LanguageType) => {
    switch (language) {
        case 'en':
            return "English";
        case 'th':
            return "Español (Spanish)"
    }
}

export const getNextDate = (currentDate: Date) => {
    let dd = currentDate.getDate();
    let mm = currentDate.getMonth();
    let yyyy = currentDate.getFullYear();
    mm = mm + 1;
    dd = dd + 1;
    if (dd > 28 && mm == 2) {
        dd = 1;
        mm = 3;
    }
    if (dd > 30 && (mm == 4 || mm == 6 || mm == 9 || mm == 11)) {
        dd = dd + 1;
        mm = mm + 1;
    } else if (dd > 31) {
        dd = 1;
        mm = mm + 1;
        if (mm > 12) {
            yyyy = yyyy + 1;
            mm = 1;
            dd = 1;
        }
    }

    return stringToDate(dd + '/' + mm + '/' + yyyy, 'dd/mm/yyyy', '/')
}

export const getPreviousDate = (currentDate: Date) => {

    let dd = currentDate.getDate();
    let mm = currentDate.getMonth();
    let yyyy = currentDate.getFullYear();
    mm = mm + 1;
    dd = dd - 1;
    if (dd < 1) {
        mm = mm - 1;
        if (mm == 0) {
            yyyy = yyyy - 1;
            dd = 31;
            mm = 12;
        } else {
            if (mm == 2) {
                dd = 28
            } else if (mm == 1 || mm == 3 || mm == 5 || mm == 7 || mm == 8 || mm == 10 || mm == 12) {
                dd = 31
            } else {
                dd = 30
            }
        }
    }
    return stringToDate(dd + '/' + mm + '/' + yyyy, 'dd/mm/yyyy', '/')
}

const getFormat = (toFormat: string) => {
    toFormat = toFormat.replace("YYYY", 'yyyy')
    toFormat = toFormat.replace("YYY", 'yyy')
    toFormat = toFormat.replace("YY", 'yy')
    toFormat = toFormat.replace("YY", 'yy')
    toFormat = toFormat.replace("DDD", 'ddd')
    toFormat = toFormat.replace("DD", 'dd')
    toFormat = toFormat.replace("D", 'd')
    toFormat = toFormat.replace("A", 'a')
    return toFormat
}

export const dateFormatInSpecificZone = (iso: string | Date, format: string) => {

    return moment(iso)
        .tz('Asia/Bangkok')
        .format(format)

    // return formatInTimeZone(iso, 'UTC+07:00', getFormat(format))
    // const zoned = getZonedDate(timezone, iso)
    // return TZFormat(zoned, getFormat(format), {
    //     timeZone: timezone,
    // })
}

export const getChatDateTime = (time: string) => {
    let dateTime = ''
    if (dateFormat(new Date(time), "MMMM DD") == dateFormatInSpecificZone(new Date(), "MMMM DD")) {
        dateTime = Language.today + ', ' + dateFormat(new Date(time), "hh:mm A")
    }
    else {
        let date = new Date()
        date.setDate(date.getDate() - 1)
        if (dateFormat(new Date(time), "MMMM DD") == dateFormatInSpecificZone(date, "MMMM DD")) {
            dateTime = Language.yesterday + ', ' + dateFormat(new Date(time), "hh:mm A")
        }
        else
            dateTime = dateFormat(new Date(time), "DD MMM YYYY, hh:mm A")
    }
    return dateTime

}

const todayDateStringInSpecificZone = dateFormatInSpecificZone(new Date(), "YYYYMMDD")
const yesterdayDateStringInSpecificZone = dateFormatInSpecificZone(sub(new Date(), { days: 1 }), "YYYYMMDD")
const todayYearInSpecificZone = dateFormatInSpecificZone(new Date(), "YYYY")

export const getChatDateTimeAtHome = (time: string) => {
    let dateTime = ''
    if (dateFormat(new Date(time), "YYYYMMDD") == todayDateStringInSpecificZone) {
        dateTime = dateFormat(new Date(time), "hh:mm A")
    }
    else {
        let date = new Date()
        date.setDate(date.getDate() - 1)
        if (dateFormat(new Date(time), "YYYYMMDD") == yesterdayDateStringInSpecificZone) {
            dateTime = Language.yesterday + ', ' + dateFormat(new Date(time), "hh:mm A")
        }
        else {
            const format = todayYearInSpecificZone == dateFormat(new Date(time), "YYYY") ? 'DD MMM, hh:mm A' : 'DD MMM, YYYY'
            dateTime = dateFormat(new Date(time), format)
        }
    }
    return dateTime

}

export const parseImageUrl = (image: string, patient_id: any) => {
    if (image?.trim()) {
        return { uri: `${config.BASE_URL}uploads/patient/${patient_id}/profile_pics/thumb_${image}` }
    }
}

export const getGender = (gender: string) => {
    if (gender?.toLowerCase() == 'm') {
        return Language.male
    }
    if (gender?.toLowerCase() == 'f') {
        return Language.female
    }
    return gender
}