import { _getPatientDetail } from "api";
import { colors, Images } from "assets";
import { Card, MyHeader, Text } from "custom-components";
import { SafeAreaViewWithStatusBar } from "custom-components/FocusAwareStatusBar";
import ImageLoader from "custom-components/ImageLoader";
import { capitalize } from "lodash";
import { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Language from "src/language/Language";
import { getGender, parseImageUrl, scaler } from "utils";


const PatientDetail: FC<any> = (props) => {

    const [patient, setPatient] = useState<any>(props?.route?.params?.patient);
    console.log("patient", patient);

    useEffect(() => {
        _getPatientDetail(patient?.chat_room_id)?.then(res => {
            if (res?.success || res?.data) {
                const { patient_detail, observations, allergies } = res?.data
                setPatient((_: any) => ({
                    ..._,
                    ...patient_detail,
                    observations, allergies
                }))
            }
        }).catch(e => {
            console.log("Error", e);
        })

    }, [])


    return <SafeAreaViewWithStatusBar style={styles.container} edges={['top']} >
        <MyHeader title={Language.profile_details} rightIcon={Images.ic_app} />
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} >
            <View style={styles.mainView} >
                <LinearGradient colors={[colors.colorPrimary, colors.colorSecondary]}
                    style={styles.gradient} angle={90} useAngle   >
                    <ImageLoader
                        placeholderSource={Images.ic_profile_placeholder}
                        // placeholderStyle={styles.image}
                        style={styles.image}
                        resizeMode={'cover'}
                        source={parseImageUrl(patient?.patient_photo, patient?.chat_room_id)} />
                    <View style={{ flex: 1 }}>
                        <Text type="bold" style={styles.name} >{patient?.first_name} {patient?.last_name || ''}</Text>
                        <Text style={styles.dob}>{patient?.date_of_birth}</Text>
                    </View>
                </LinearGradient>
                <View style={styles.content} >
                    <Text type='bold' style={styles.about} >{Language.about}</Text>
                    <Card style={styles.card} cornerRadius={scaler(5)}  >
                        <DataRow title="HN." value={"HN." + patient?.h_number} />
                        <DataRow title={Language.phone} value={patient?.cell_phone} />
                        <DataRow title={Language.age} value={patient?.age} />
                        <DataRow title={Language.gender} value={getGender(patient?.gender)} />
                        <DataRow title={Language.preferred_language} value={patient?.planguage} />
                        <DataRow title={Language.questionnaire_7} value={patient?.employer} hideBorder />
                    </Card>

                    <Text type='bold' style={[styles.about, { marginTop: scaler(15) }]} >{Language.allergies}</Text>
                    <Card style={styles.card} cornerRadius={scaler(5)}  >
                        {patient?.allergies?.map((item: any, index: number) => {
                            return (
                                <DataRow key={index} hideBorder={index == patient?.allergies?.length - 1} title={capitalize(item?.name) + " " + Language.allergy} value={item?.response_value} />
                            )
                        })}
                    </Card>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: scaler(15), marginHorizontal: -scaler(5) }} >
                        <DataBlock title={'HT'} value={(patient?.observations?.height?.value || "") + " " + (patient?.observations?.height?.unit || '')} />
                        <DataBlock title={'WT'} value={(patient?.observations?.weight?.value || "") + " " + (patient?.observations?.weight?.unit || "")} />
                        <DataBlock title={'BMI'} value={(patient?.observations?.bmi?.value || "") + " " + (patient?.observations?.bmi?.unit || "")} />
                        <DataBlock title={'BP'} value={(patient?.observations?.bp?.value || "") + (patient?.observations?.bp?.value ? "/" : "") + (patient?.observations?.bp?.value2 || "") + " " + (patient?.observations?.bp?.unit || "")} />
                    </View>
                </View>
            </View>
        </KeyboardAwareScrollView>
        <SafeAreaView style={{ backgroundColor: colors.colorContainer }} edges={['bottom']} />
    </SafeAreaViewWithStatusBar>
}

export default PatientDetail;

interface IDataRow {
    title: string
    value: string
    hideBorder?: boolean
}
const DataRow = ({ title, value, hideBorder = false }: IDataRow) => {
    return <>
        <View style={styles.detailContainer} >
            <Text style={styles.title} >{title || ''}</Text>
            <Text style={styles.value} >{value?.trim() ? value : 'NA'}</Text>
        </View>
        {!hideBorder && <View style={styles.separator} />}
    </>
}

interface IDataRow {
    title: string
    value: string
    hideBorder?: boolean
}
const DataBlock = ({ title, value }: IDataRow) => {
    let superValue;
    if (value?.includes("<sup>")) {
        superValue = value?.substring(value?.indexOf('<sup>') + 5, value?.indexOf('</sup>'))
        console.log("superValue", superValue);
        value = value?.replace("<sup>" + superValue + "</sup>", "");
    }
    return <>
        <View style={styles.blockContainer} >
            <Text type="medium" style={styles.blockTitle} >{title || ''}</Text>
            <View style={{ flexDirection: 'row' }} >
                <Text type={value?.trim() ? undefined : "bold"} style={styles.blockValue} >{value?.trim() ? value : 'NA'}</Text>
                {superValue ?
                    <Text style={styles.superScript}>{superValue}</Text>
                    : null}
            </View>
        </View>
    </>
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainView: {
        flex: 1,
        backgroundColor: colors.colorContainer

    },
    image: {
        height: scaler(80),
        width: scaler(80),
        borderRadius: scaler(40),
        marginVertical: scaler(24),
        marginRight: scaler(15),
    },
    name: {
        color: colors.colorWhite,
        fontSize: scaler(16)
    },
    dob: {
        color: colors.colorWhite,
        fontSize: scaler(13),
        marginTop: scaler(5)
    },
    gradient: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scaler(15),
        paddingBottom: scaler(20),
    },
    content: {
        marginTop: -scaler(20),
        borderTopLeftRadius: scaler(10),
        borderTopRightRadius: scaler(10),
        backgroundColor: colors.colorContainer,
        padding: scaler(12),
    },
    about: {
        color: '#A1A7AF',
        fontSize: scaler(13),
        marginTop: scaler(5),
        textTransform: 'uppercase',
    },
    card: {
        flex: 1,
        marginTop: scaler(10),
        backgroundColor: colors.colorWhite
    },
    detailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: scaler(20),
    },
    blockContainer: {
        aspectRatio: 1.2,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: scaler(5),
        backgroundColor: colors?.colorSecondary,
        borderRadius: scaler(5),
    },
    title: {
        color: '#7684A3',
        fontSize: scaler(15),
    },
    value: {
        flex: 1,
        color: '#1A539F',
        fontSize: scaler(15),
        textAlign: 'right',
    },
    blockTitle: {
        color: colors.colorWhite,
        fontSize: scaler(12),
        textAlign: 'center',
    },
    blockValue: {
        color: colors?.colorWhite,
        fontSize: scaler(12),
        textAlign: 'center',
    },
    separator: {
        marginHorizontal: scaler(15),
        opacity: 0.08,
        backgroundColor: '#111827',
        height: 1
    },
    superScript: {
        color: colors?.colorWhite,
        fontSize: scaler(8),
        lineHeight: 13,
        textAlignVertical: 'top'
    }
})