import React, {useContext} from 'react';
import {Modal, Text, Pressable, View} from 'react-native';
import {openSettings} from 'react-native-permissions';
import {BleContext} from '../../Context/BleProvider';
import {styles} from './PermissionModal.style';

const PermissionModal = () => {
  const {permissionError, setPermissionError} = useContext(BleContext);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={!!permissionError?.length}
      onRequestClose={() => {
        setPermissionError();
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {permissionError?.map(item => {
            return (
              <Text key={item.key} style={styles.modalText}>
                {item.key} : {item.val}
              </Text>
            );
          })}
          <Text style={styles.modalText}>
            Please allow the permissions manually in the app > app permission
          </Text>
          <View style={styles.actions}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setPermissionError()}>
              <Text style={[styles.textStyle, styles.textClose]}>Close</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={() =>
                openSettings().catch(() => console.warn('cannot open settings'))
              }>
              <Text style={styles.textStyle}>Open Settings</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PermissionModal;
