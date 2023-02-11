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

const BluetoothScreen = ({navigation}) => {
  const {manager, devices, startScan, connectToDevice, bluetoothState} =
    useContext(BleContext);
  const [openEnableModal, setOpenEnableModal] = useState(false);

  const isBluetoothOff = bluetoothState === 'PoweredOff';

  useEffect(() => {
    console.log('bluetooth list');
    startScan({
      openEnableModal: () => setOpenEnableModal(true),
    });

    return () => {
      manager.stopDeviceScan();
    };
  }, [startScan, manager]);

  return (
    <SafeAreaView>
      <View>
        {!isBluetoothOff && <Button title="Scan" onPress={startScan} />}
        {isBluetoothOff && (
          <Text style={{color: '#000'}}>
            Please turn on bluetooth to connect to device.
          </Text>
        )}
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
      </View>

      <CenteredModal visible={openEnableModal}>
        <Text style={{color: '#000'}}>Need to enable the bluetooth.</Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-evenly',
          }}>
          <Pressable
            style={{padding: 10, backgroundColor: 'blue'}}
            onPress={() => setOpenEnableModal(false)}>
            <Text>Close</Text>
          </Pressable>
          <Pressable
            style={{padding: 10, backgroundColor: 'blue'}}
            onPress={async () => {
              setOpenEnableModal(false);
              await manager.enable();
              startScan();
            }}>
            <Text>Turn on bluetooth</Text>
          </Pressable>
        </View>
      </CenteredModal>
    </SafeAreaView>
  );
};

export default BluetoothScreen;
