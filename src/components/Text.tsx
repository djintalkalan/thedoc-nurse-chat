import { colors, Fonts } from "assets";
import React, { FC, useMemo } from "react";
import { StyleProp, StyleSheet, Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';

type FontType = "bold" | "extraLight" | "light" | "medium" | "regular" | "extraBold" | "semiBold"
interface MyTextStyle extends TextStyle {
    type?: FontType
}

interface TextProps extends RNTextProps {
    type?: FontType,
    style?: StyleProp<MyTextStyle> | undefined;
}

export const Text: FC<TextProps> = (props) => {
    let { style, type = "regular", ...rest } = props
    const styles = useMemo(() => {
        const styles = StyleSheet.flatten(style ?? {})
        if (styles?.type) {
            type = styles?.type
        }
        return StyleSheet.create({
            textStyle: {
                color: colors.colorBlackText,
                fontFamily: Fonts?.[type],
                ...styles
            }
        })
    }, [style, type])

    return (
        <RNText {...rest}
            style={styles.textStyle}
            allowFontScaling={false}
            suppressHighlighting={true}
        />
    )
}

type IFontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | undefined;


export const InnerBoldText = ({ text: IText, style, fontWeight = "500" }: { text: string, style: StyleProp<TextStyle>, fontWeight?: IFontWeight }) => {
    const { arr, text } = useMemo(() => {
        const arr = IText.split(' ')
        return {
            arr,
            text: arr.reduce(reducer, [])
        }
    }, [IText])

    // console.log("text", text)

    return (
        <Text style={style} >
            {text.map((text: string, index: number) => {
                if (text.includes('**')) {
                    return (
                        <Text key={index} style={[StyleSheet.flatten(style), { fontWeight: fontWeight }]}>
                            {text.replace('**', '')?.replace('**', '')}{' '}
                        </Text>
                    );
                }
                return `${text} `;
            })}
        </Text>
    );
};

export const SingleBoldText = ({ text: IText, style, fontWeight = "500" }: { text: string, style: StyleProp<TextStyle>, fontWeight?: IFontWeight }) => {
    let startBoldIndex = IText?.indexOf("**")
    let endBoldIndex = IText?.lastIndexOf("**")
    return <Text style={style} >
        {IText?.substring(0, startBoldIndex)}
        <Text style={[StyleSheet.flatten(style), { fontWeight: fontWeight }]}>
            {IText?.substring(startBoldIndex, endBoldIndex + 2).replaceAll('**', '')}
        </Text>
        {IText?.substring(endBoldIndex + 2)}
    </Text>
};

export const MultiBoldText = ({ text: IText, style, fontWeight = "500" }: { text: string, style: StyleProp<TextStyle>, fontWeight?: IFontWeight }) => {

    const thisStyle = useMemo(() => {
        const flatten = StyleSheet.flatten(style)
        return StyleSheet.create({
            style: flatten,
            boldStyle: StyleSheet.flatten([flatten, {
                fontWeight
            }])
        })
    }, [style, fontWeight])
    let isStart = true
    let arr = Array.from(IText)
    // console.log("arr", arr);

    const finalStrings: any[] = []

    let boldString = ""
    let normalString = ""
    arr.forEach((s: string, i: number) => {
        if (isStart == false)
            boldString += s
        else {
            normalString += s
        }
        if ((s + (arr?.[i + 1] || "")) == "**") {
            if (isStart) {
                isStart = false
                finalStrings.push(<Text style={thisStyle.style} key={i}>{normalString.replace(/\*/g, "")}</Text>)
                normalString = ""
            }
            else {
                isStart = true
                finalStrings.push(<Text style={thisStyle.boldStyle} key={i}>{boldString.replace(/\*/g, "")}</Text>)
                boldString = ""
            }
        }
    })
    finalStrings.push(<Text key={arr?.length + 1}>{normalString.replace(/\*/g, "")}</Text>)
    return <Text children={finalStrings} style={style} />

};

const reducer = (acc: any, cur: any, index: number) => {
    let previousVal = acc[acc.length - 1];
    if (
        previousVal &&
        previousVal.startsWith('**') &&
        !previousVal.endsWith('**')
    ) {
        acc[acc.length - 1] = previousVal + ' ' + cur;
    } else {
        acc.push(cur);
    }
    return acc;
}