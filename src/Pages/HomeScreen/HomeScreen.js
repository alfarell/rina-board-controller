import React, {useContext, useEffect, useState} from 'react';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import {
  // useColorScheme,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
} from 'react-native';
import {faces} from '../../Data/FaceList';
import {BleContext} from '../../Context/BleProvider';

const HomeScreen = ({navigation}) => {
  // const isDarkMode = useColorScheme() === 'dark';

  const {sendFaceData} = useContext(BleContext);

  const [page, setPage] = useState(0);

  const backgroundStyle = {
    // backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View>
        <Button
          title="Connect bluetooth"
          onPress={() => navigation.push('Bluetooth')}
        />
      </View>
      <FlatList
        data={faces.slice(page * 10, page * 10 + 10)}
        keyExtractor={(_, index) => index.toString()}
        decelerationRate="normal"
        numColumns={2}
        style={{marginTop: 'auto'}}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              key={index}
              style={{padding: 10, width: '50%'}}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              onPress={() => sendFaceData(Number(`${page}${index}`))}>
              <View>
                <Image
                  source={item}
                  style={{
                    width: '100%',
                    height: undefined,
                    aspectRatio: 16 / 10,
                  }}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          padding: 20,
        }}>
        {[...Array(Math.ceil(faces.length / 10))].map((_, i) => {
          return (
            <Text
              key={i}
              style={{
                padding: 10,
                backgroundColor: 'pink',
              }}
              onPress={() => setPage(i)}>
              {i + 1}
            </Text>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
