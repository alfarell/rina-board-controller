import React from 'react';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
  View,
  Text,
  useColorScheme,
} from 'react-native';
import {faces} from '../Data/FaceList';

const HomeScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  return (
    <SafeAreaView style={backgroundStyle}>
      <View>
        <ScrollView>
          {faces.map((item, i) => {
            return (
              <Image key={i} source={item} style={{width: 40, height: 40}} />
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
