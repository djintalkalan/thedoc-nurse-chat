import React from "react"
import { TouchableOpacity, ViewStyle } from "react-native"
import CardView from 'react-native-cardview'

interface ICardProps {
    cardElevation?: number
    cardMaxElevation?: number
    cornerRadius?: number
    useCompatPadding?: boolean
    style?: ViewStyle | Array<ViewStyle>
    onPress?: (e: any) => void
}

export const Card: React.FC<ICardProps> = (props) => {

    if (props?.onPress) {
        return <TouchableOpacity activeOpacity={0.8} onPress={props?.onPress}>
            <MyCardView {...props} />
        </TouchableOpacity>
    }
    return <MyCardView {...props} />


}

const MyCardView: React.FC<ICardProps> = (props) => <CardView
    useCompatPadding={props?.useCompatPadding}
    style={props?.style}
    cardElevation={props?.cardElevation}
    cardMaxElevation={props?.cardMaxElevation}
    cornerRadius={props?.cornerRadius}>
    {props.children}
</CardView>