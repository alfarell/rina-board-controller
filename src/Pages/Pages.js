import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BluetoothScreen, HomeScreen} from './index';
import {PermissionModal} from '../Components';

const Pages = () => {
  const Stack = createNativeStackNavigator();

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Rina-chan Board" component={HomeScreen} />
          <Stack.Screen
            name="Bluetooth"
            component={BluetoothScreen}
            options={{title: 'Connect Bluetooth'}}
          />
        </Stack.Navigator>
      </NavigationContainer>

      <PermissionModal />
    </>
  );
};

export default Pages;
