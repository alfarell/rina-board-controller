import React from 'react';
import {Modal, View} from 'react-native';
import {styles} from './CenteredModal.style';

const CenteredModal = ({
  visible,
  onRequestClose = () => {},
  children,
  ...otherProps
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      {...otherProps}
      onRequestClose={onRequestClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>{children}</View>
      </View>
    </Modal>
  );
};

export default CenteredModal;
