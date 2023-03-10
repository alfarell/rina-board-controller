import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Button,
  TouchableHighlight,
  Pressable,
} from 'react-native';
import CenteredModal from '../../Components/Modal/CenteredModal';
import {BleContext} from '../../Context/BleProvider';
import {AppColor} from '../../Data/Colors';

const BluetoothScreen = ({navigation}) => {
  const {manager, devices, startScan, connectToDevice, bluetoothState} =
    useContext(BleContext);
  const [openEnableModal, setOpenEnableModal] = useState(false);

  const isBluetoothOff = bluetoothState === 'PoweredOff';

  useEffect(() => {
    startScan({
      openEnableModal: () => setOpenEnableModal(true),
    });

    return () => {
      manager.stopDeviceScan();
    };
  }, [startScan, manager]);

  return (
    <SafeAreaView>
      <View style={{height: '100%', display: 'flex'}}>
        {!isBluetoothOff && <Button title="Scan" onPress={startScan} />}
        {isBluetoothOff && (
          <View
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: '#000',
              }}>
              Please turn on bluetooth to connect to device.
            </Text>
          </View>
        )}
        {!!devices?.length && (
          <FlatList
            data={devices}
            keyExtractor={(_, index) => index.toString()}
            decelerationRate="normal"
            numColumns={1}
            style={{marginTop: 'auto'}}
            renderItem={({item, index}) => {
              return (
                <TouchableHighlight
                  key={index}
                  activeOpacity={0.6}
                  underlayColor="#DDDDDD"
                  onPress={async () => {
                    await connectToDevice(item, {
                      callbback: () => navigation.navigate('Home'),
                    });
                  }}>
                  <View>
                    <Text style={{color: 'black'}}>{item.name}</Text>
                    <Text style={{color: 'black'}}>{item.id}</Text>
                  </View>
                </TouchableHighlight>
              );
            }}
          />
        )}
      </View>

      <CenteredModal visible={openEnableModal}>
        <Text style={{color: '#000', marginBottom: 30}}>
          Need to enable the bluetooth.
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-evenly',
          }}>
          <Pressable
            style={{
              paddingHorizontal: 30,
              paddingVertical: 10,
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: AppColor.primary,
              borderRadius: 5,
            }}
            onPress={() => setOpenEnableModal(false)}>
            <Text style={{color: AppColor.primary}}>Close</Text>
          </Pressable>
          <Pressable
            style={{
              paddingHorizontal: 30,
              paddingVertical: 10,
              backgroundColor: AppColor.primary,
              borderRadius: 5,
            }}
            onPress={async () => {
              setOpenEnableModal(false);
              await manager.enable();
              startScan();
            }}>
            <Text style={{color: '#fff'}}>Turn on bluetooth</Text>
          </Pressable>
        </View>
      </CenteredModal>
    </SafeAreaView>
  );
};

export default BluetoothScreen;
