import React, {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';
import {BleManager} from 'react-native-ble-plx';
import {
  PERMISSIONS,
  RESULTS,
  requestMultiple,
  checkMultiple,
} from 'react-native-permissions';
import base64 from 'react-native-base64';
import {ToastAndroid} from 'react-native';

export const BleContext = createContext();

const initialState = [];
const reducer = (state, action) => {
  switch (action.type) {
    case 'add':
      const checkDuplicate = state.find(item => item.id === action.device.id);

      return checkDuplicate ? state : [...state, action.device];
    case 'clear':
      return initialState;
    default:
      return state;
  }
};

const clear = () => ({type: 'clear'});

const addDevice = device => ({
  type: 'add',
  device,
});

const manager = new BleManager();

const BleProvider = ({children}) => {
  const [devices, dispatch] = useReducer(reducer, initialState);
  const [connectedDevice, setConnectedDevice] = useState();
  const [permissionError, setPermissionError] = useState();
  const [bluetoothState, setBluetoothState] = useState('');

  const scan = useCallback(() => {
    // let timer = 0;
    // const interval = setInterval(() => (timer = timer + 1), 1000);
    manager.startDeviceScan(null, {allowDuplicates: false}, (error, device) => {
      if (error) {
        console.log('error', JSON.stringify(error));
        return;
      }
      console.log(device.name);

      dispatch(addDevice(device));

      // if (interval > 3) {
      //   manager.stopDeviceScan();
      //   clearInterval(interval);
      //   timer = 0;
      // }
    });
  }, []);

  const startScan = useCallback(
    async ({openEnableModal} = {}) => {
      dispatch(clear());

      try {
        await permission();

        const subscription = manager.onStateChange(state => {
          setBluetoothState(state);

          if (state === 'PoweredOn') {
            scan();
            subscription.remove();
          }

          if (state === 'PoweredOff') {
            openEnableModal();
          }
        }, true);
      } catch (err) {}
    },
    [scan],
  );

  const permission = async () => {
    try {
      const permissionList = [
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ];

      const check = await checkMultiple(permissionList);
      const notGrantedPermissions = permissionList.filter(item => {
        return check[item] !== RESULTS.GRANTED;
      });

      if (notGrantedPermissions?.length) {
        const result = await requestMultiple(notGrantedPermissions);

        const permissionsResult = [];
        for (let key in result) {
          permissionsResult.push({
            key,
            val: result[key],
          });
        }

        if (permissionsResult?.find(item => item.val !== RESULTS.GRANTED)) {
          const filterPermissionError = permissionsResult.filter(
            item => item.val !== RESULTS.GRANTED,
          );
          setPermissionError(filterPermissionError);

          throw filterPermissionError;
        }
      }
    } catch (err) {
      setPermissionError(
        err || [
          {
            key: '',
            val: 'An error occured, please try to restart the app.',
          },
        ],
      );

      throw err;
    }
  };

  useEffect(() => {
    permission();
  }, []);

  const connectToDevice = async (device, {callbback} = {}) => {
    try {
      const connectDevice = await manager.connectToDevice(device.id);
      const writeableCharacteristics = await getCharacteristic(connectDevice);

      setConnectedDevice(state => {
        if (state) {
          return {
            ...state,
            writeableCharacteristics,
          };
        }

        return {...connectDevice, writeableCharacteristics};
      });

      ToastAndroid.showWithGravity(
        `Connected to: ${connectDevice.name} (${connectDevice.id})`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      callbback?.();
    } catch (err) {
      ToastAndroid.showWithGravity(
        'Failed to connect to device.',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }
  };

  const getCharacteristic = async connectDevice => {
    try {
      const discoverServiceAndCharacteristic =
        await connectDevice.discoverAllServicesAndCharacteristics();
      const services = await discoverServiceAndCharacteristic.services();
      const characteristicsForServices = await Promise.all(
        services?.map(async service => await service.characteristics()),
      );
      const characteristics = characteristicsForServices?.flat(2);
      const writeableCharacteristics = characteristics?.filter(
        characteristic =>
          characteristic.isReadable &&
          characteristic.isWritableWithResponse &&
          characteristic.isWritableWithoutResponse,
      );

      return writeableCharacteristics;
    } catch (err) {
      throw err;
    }
  };

  const sendFaceData = async (faceNumber, {retry = 0} = {}) => {
    try {
      return await Promise.all(
        connectedDevice?.writeableCharacteristics?.map(async characteristic => {
          await characteristic.writeWithResponse(
            base64.encode(`cf:${faceNumber}`),
          );
        }),
      );
    } catch (err) {
      if (retry <= 3) {
        const isDeviceConnected = await manager.isDeviceConnected(
          connectedDevice.id,
        );

        if (!isDeviceConnected) {
          await connectToDevice(connectedDevice);
        }

        await sendFaceData(faceNumber, {retry: (retry || 0) + 1});
        return;
      }

      ToastAndroid.showWithGravity(
        'Device connection is interrupted. Please try to reconnect again.',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }
  };

  return (
    <BleContext.Provider
      value={{
        manager,
        devices,
        startScan,
        connectedDevice,
        setConnectedDevice,
        connectToDevice,
        sendFaceData,
        permission,
        permissionError,
        setPermissionError,
        bluetoothState,
      }}>
      {children}
    </BleContext.Provider>
  );
};

export default BleProvider;
