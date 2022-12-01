import { doLogout } from 'app-store/actions'
import { colors, Images } from 'assets'
import { MyHeader, Text } from 'custom-components'
import { SafeAreaViewWithStatusBar } from 'custom-components/FocusAwareStatusBar'
import ImageLoader from 'custom-components/ImageLoader'
import React, { FC, useCallback } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
// import RNShake from 'react-native-shake'
import { useDispatch } from 'react-redux'
import Language from 'src/language/Language'
import { NavigationService, scaler, _hidePopUpAlert, _showPopUpAlert } from 'utils'

const chats = [{
  name: "Danial Swift",
  profile_image: "https://expertphotography.b-cdn.net/wp-content/uploads/2020/08/social-media-profile-photos-9.jpg",
  unreadCount: 4,
  dateOfLastMessage: '28/11/2022',
}, {
  name: "Alberto Robin",
  profile_image: "https://expertphotography.b-cdn.net/wp-content/uploads/2020/08/profile-photos-4.jpg",
  unreadCount: 3,
  dateOfLastMessage: '27/11/2022',
},
{
  name: "Alberto Robin",
  profile_image: "https://expertphotography.b-cdn.net/wp-content/uploads/2020/08/social-media-profiel-photo-venice.jpg",
  unreadCount: 0,
  dateOfLastMessage: '27/11/2022',
}]



const Home: FC = () => {
  const dispatch = useDispatch()

  const _renderChatItem = useCallback(({ item, index }: { item: any, index: number }) => {


    return <TouchableOpacity
      onPress={() => {
        NavigationService.navigate("NurseChat")
      }}
      activeOpacity={0.6} style={{ padding: scaler(15), paddingVertical: scaler(20), width: '100%', flexDirection: 'row', alignItems: 'center' }} >
      <ImageLoader
        source={{ uri: item?.profile_image }}
        style={{
          height: scaler(40),
          width: scaler(40),
          borderRadius: scaler(30),
          marginRight: scaler(8),
        }}
        resizeMode={'cover'}
      />
      <Text ellipsizeMode='tail' type={item?.unreadCount ? 'bold' : 'medium'} style={{ fontSize: scaler(15), color: colors?.colorPrimary, flex: 1, }} >{item?.name}</Text>
      {item?.unreadCount ? <View style={styles.countView} >
        <Text type={'medium'} style={{ fontSize: scaler(12), color: colors?.colorWhite, }} >{item?.unreadCount?.toString()}</Text>
      </View> : null}
      <Text type={item?.unreadCount ? 'bold' : 'medium'} style={{ fontSize: scaler(12), color: colors?.colorPrimary, }} >{item?.dateOfLastMessage}</Text>

    </TouchableOpacity>

  }, [],)


  return (
    <SafeAreaViewWithStatusBar translucent backgroundColor={'white'} edges={['top']} >
      <MyHeader
        leftIcon={Images.ic_app}
        title={"theDoc " + Language.chat} backEnabled={false}
        rightIcon={Images.ic_logout}
        rightIconStyle={{ height: scaler(25), width: scaler(25), }}
        onPressRight={() => {
          _showPopUpAlert({
            title: Language.log_out,
            message: Language.do_you_want_logout,
            leftButtonText: Language.no,
            rightButtonText: Language.yes,
            onPressLeftButton: _hidePopUpAlert,
            onPressRightButton: () => {
              dispatch(doLogout())
              _hidePopUpAlert()
            }
          })
        }} />
      <View style={styles.container} >

        <FlatList
          style={{ flex: 1 }}
          data={chats}
          keyExtractor={(_, i) => i?.toString()}
          renderItem={_renderChatItem}
          ItemSeparatorComponent={() => <View style={{ height: 0.7, width: '100%', backgroundColor: colors.colorGreyMore }} />}
        />

      </View>
    </SafeAreaViewWithStatusBar>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorContainer,
    overflow: 'hidden',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scaler(20),
  },
  locationText: {
    fontWeight: '600',
    fontSize: scaler(15),
    color: '#292929',
    maxWidth: '80%',
  },
  settingButtonContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    // justifyContent: 'flex-end'
  },
  searchInput: {
    height: scaler(40),
    backgroundColor: colors.colorBackground,
    borderRadius: scaler(10),
    paddingHorizontal: scaler(45),
    paddingVertical: 0,
    marginVertical: 0,
    // marginTop: scaler(0),
    marginHorizontal: scaler(20),
    fontSize: scaler(11),
    fontWeight: '300',
    color: colors.colorBlackText,
  },
  imagePlaceholder: {
    height: scaler(20),
    position: 'absolute',
    top: scaler(10),
    left: scaler(25),
    resizeMode: 'contain',
  },
  fabActionContainer: {
    borderRadius: scaler(10),
    paddingHorizontal: scaler(10),
    backgroundColor: colors.colorWhite,
    elevation: 2,
    marginRight: scaler(8),
    justifyContent: 'flex-end',
  },
  countView: {
    height: scaler(20),
    width: scaler(20),
    borderRadius: scaler(11),
    backgroundColor: colors.colorPrimary,
    marginHorizontal: scaler(10),
    alignItems: 'center',
    justifyContent: 'center',
  }
});
