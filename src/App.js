/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import BleProvider from './Context/BleProvider';
import Pages from './Pages/Pages';
import {LogBox} from 'react-native';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

function App() {
  return (
    <BleProvider>
      <Pages />
    </BleProvider>
  );
}

export default App;
