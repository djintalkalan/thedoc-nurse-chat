import { doLogout, fetchAllPatients } from 'app-store/actions'
import { colors, Images } from 'assets'
import { MyHeader, Text } from 'custom-components'
import { SafeAreaViewWithStatusBar } from 'custom-components/FocusAwareStatusBar'
import ImageLoader from 'custom-components/ImageLoader'
import { debounce, isEqual } from 'lodash'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { RefreshControl, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import Entypo from 'react-native-vector-icons/Entypo'
import { useDispatch, useSelector } from 'react-redux'
import Language from 'src/language/Language'
import { getChatDateTimeAtHome, NavigationService, parseImageUrl, scaler, _hidePopUpAlert, _showPopUpAlert } from 'utils'


const Home: FC = () => {
  const dispatch = useDispatch()

  const [isSearching, setSearching] = useState(false);

  const allPatients = useSelector(state => {
    return state.patients?.allPatients
  })

  const searchedPatients = useSelector(state => {
    return state.patients?.searchedPatients
  })

  const { searchText } = useSelector(state => ({
    searchText: state.patients?.searchText,
  }), isEqual)

  useEffect(() => {
    dispatch(fetchAllPatients({ fetchAllData: true }))
  }, [])

  const _renderChatItem = useCallback(({ item, index }: { item: any, index: number }) => {
    if (item?.total_unread) item.total_unread = parseInt(item?.total_unread)
    return <TouchableOpacity
      onPress={() => { NavigationService.navigate("NurseChat", { patient: item }) }}
      activeOpacity={0.6} style={{ padding: scaler(15), paddingVertical: scaler(16), width: '100%', flexDirection: 'row', alignItems: 'center' }} >
      <ImageLoader
        source={parseImageUrl(item?.patient_photo, item?.chat_room_id)}
        placeholderSource={Images.ic_profile_placeholder}
        placeholderStyle={styles.imagePlaceholder}
        style={styles.image}
        resizeMode={'cover'}
      />
      <Text ellipsizeMode='tail' type={item?.total_unread ? 'extraBold' : 'medium'} style={{ marginLeft: scaler(8), fontSize: scaler(14.5), color: colors?.colorPrimary, flex: 1, }} >{item?.first_name} {item?.last_name || ''}</Text>
      {item?.total_unread ? <View style={styles.countView} >
        <Text type={'bold'} style={{ fontSize: scaler(12), color: colors?.colorWhite, }} >{item?.total_unread?.toString()}</Text>
      </View> : null}
      <Text type={item?.total_unread ? 'extraBold' : 'medium'} style={{ fontSize: scaler(12), color: colors?.colorSecondary, }} >{getChatDateTimeAtHome(item?.created_message_time)}</Text>
    </TouchableOpacity>
  }, [],)

  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isSearching) {
      setTimeout(() => {
        searchInputRef?.current?.focus()
      }, 200);
    } else {
      dispatch(fetchAllPatients({ fetchAllData: true }))
    }
  }, [isSearching])

  const debounceSearch = useCallback(debounce((text: string) => {
    dispatch(fetchAllPatients({ fetchAllData: true, searchText: text }))
  }, 1000), [])


  return (
    <SafeAreaViewWithStatusBar translucent backgroundColor={'white'} edges={['top']} >
      {isSearching ?
        <View style={{ flexDirection: 'row', width: '100%', paddingHorizontal: scaler(15), alignItems: 'center' }} >
          <TouchableOpacity
            style={{ marginLeft: -scaler(5), marginRight: scaler(10) }}
            onPress={() => setSearching(false)} >
            <Entypo size={scaler(18)} name={'chevron-thin-left'} color={colors.colorBlack} />
          </TouchableOpacity>
          <TextInput
            onChangeText={debounceSearch}
            ref={searchInputRef}
            style={styles?.searchInput} />
        </View>
        : <MyHeader
          leftIcon={Images.ic_search}
          title={"theDoc " + Language.chat} backEnabled={false}
          rightIcon={Images.ic_logout}
          leftIconStyle={{ height: scaler(25), width: scaler(25), }}
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
          }}
          onPressLeft={() => setSearching(true)}
        />}
      <View style={{ height: 1, alignSelf: 'center', width: '100%', backgroundColor: '#d8deeb' }} />
      <View style={styles.container} >
        <FlatList
          refreshControl={<RefreshControl refreshing={false} onRefresh={() => {
            dispatch(fetchAllPatients({ fetchAllData: true, searchText: searchText }))
          }} />}
          style={{ flex: 1 }}
          data={isSearching && searchText ? searchedPatients : allPatients}
          keyExtractor={(_, i) => i?.toString()}
          renderItem={_renderChatItem}
          onEndReached={() => {
            dispatch(fetchAllPatients({ searchText: searchText }))
          }}
          ItemSeparatorComponent={() => <View style={{ height: 1, alignSelf: 'center', width: '90%', backgroundColor: '#d8deeb' }} />}
        />

      </View>
    </SafeAreaViewWithStatusBar>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorWhite,
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
    paddingHorizontal: scaler(15),
    borderRadius: scaler(5),
    height: scaler(35),
    marginVertical: scaler(10),
    flex: 1,
    backgroundColor: colors.colorThemeBackground
  },
  imagePlaceholder: {
    height: scaler(60),
    width: scaler(60),
    borderRadius: scaler(30),
    tintColor: colors.colorPrimary,
  },
  image: {
    height: scaler(50),
    width: scaler(50),
    borderRadius: scaler(25),
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
    backgroundColor: colors.colorErrorRed,
    marginHorizontal: scaler(10),
    alignItems: 'center',
    justifyContent: 'center',
  }
});
