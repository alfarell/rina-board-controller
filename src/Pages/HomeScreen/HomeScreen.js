import React, {useContext, useState} from 'react';
import {
  SafeAreaView,
  Image,
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
} from 'react-native';
import {AppColor} from '../../Data/Colors';
import {faces} from '../../Data/FaceList';
import {BleContext} from '../../Context/BleProvider';

const HomeScreen = ({navigation}) => {
  const {connectedDevice, sendFaceData} = useContext(BleContext);

  const [page, setPage] = useState(0);

  return (
    <SafeAreaView
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
      <View>
        <Button
          title={
            connectedDevice
              ? `Connected to: ${connectedDevice.name}`
              : 'Connect bluetooth'
          }
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
              onPress={() => sendFaceData(item.value)}>
              <Image
                source={item.image}
                style={{
                  width: '100%',
                  height: undefined,
                  aspectRatio: 17 / 11,
                }}
              />
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
                borderRadius: 5,
                backgroundColor: AppColor.primary,
                color: '#fff',
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
