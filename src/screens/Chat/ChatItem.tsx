import { config } from 'api';
import { colors } from 'assets/Colors';
import { Images } from 'assets/Images';
import { Text } from 'custom-components';
import ImageLoader from 'custom-components/ImageLoader';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Language from 'src/language/Language';
import { scaler, _showDocuments, _zoomImage } from 'utils';

interface ChatItemProps {
    message: string;
    myMessage: boolean;
    messageType: 'text' | 'image' | 'doc'
    imageUrl?: string
    docUrl?: string
    date?: string
    originalFileName?: string
}
const ChatItem = (props: ChatItemProps) => {
    const { message, myMessage, messageType, imageUrl, docUrl, date, originalFileName } = props


    return (
        <View style={{}}>
            <Text style={myMessage ? styles.textStyle : [styles.textStyle, { alignSelf: "flex-start" }]} type='medium'>{myMessage ? Language.you : Language.nurse}</Text>
            <View style={myMessage ? styles.chatContainer : [styles.chatContainer, { alignSelf: 'flex-start', backgroundColor: colors.colorSecondary }]}>
                {messageType == 'text' ?
                    <Text type='medium' style={styles.chatText}>{message}</Text>
                    : messageType == 'image' || docUrl?.toLowerCase()?.endsWith('.png') || docUrl?.toLowerCase()?.endsWith('.jpg') || docUrl?.toLowerCase()?.endsWith('.jpeg') ?
                        <ImageLoader
                            reload={true}
                            borderRadius={scaler(6)}
                            resizeMode={'cover'}
                            onPress={() => _zoomImage(imageUrl ? config.IMAGE_URL + imageUrl : config.IMAGE_URL + docUrl)}
                            // placeholderSource={Images.ic_image_placeholder}
                            source={{ uri: imageUrl ? config.IMAGE_URL + imageUrl : config.IMAGE_URL + docUrl }}// getImageUrl(message, { width: width, type: 'messages' }) }}
                            //@ts-ignore
                            style={styles.imgStyle} />
                        : <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: "center" }}
                            onPress={() => _showDocuments(config.IMAGE_URL + docUrl)}>
                            <Image source={Images.ic_chat_doc} style={styles.chatDoc} />
                            <Text numberOfLines={2} ellipsizeMode={'tail'} type='medium' style={[styles.chatText, { fontSize: scaler(13) }]}>{originalFileName || docUrl}</Text>
                        </TouchableOpacity>}
                <Text type='medium' style={[styles.chatText, { fontSize: scaler(10), alignSelf: myMessage ? 'flex-end' : 'flex-start', marginTop: scaler(5) }]}>{date}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    chatContainer: {
        borderRadius: scaler(6),
        backgroundColor: colors.colorPrimary,
        padding: scaler(8),
        maxWidth: '80%',
        alignSelf: 'flex-end'
    },
    chatText: {
        fontSize: scaler(15),
        color: colors.colorWhite,
        marginRight: scaler(20)
        // flex: 1
    },
    imgStyle: {
        resizeMode: 'cover',
        margin: scaler(5),
        borderRadius: scaler(5),
        height: scaler(175),
        width: scaler(220),
        // backgroundColor: 'red'
    },
    textStyle: {
        fontSize: scaler(14),
        color: colors.colorBlackText,
        alignSelf: 'flex-end',
        marginBottom: scaler(5),
        marginTop: scaler(10)
    },
    chatDoc: {
        height: scaler(23),
        width: scaler(23),
        resizeMode: 'contain',
        marginRight: scaler(5)
    }
})

export default ChatItem