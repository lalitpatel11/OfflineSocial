import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007bff" />
      <Text style={styles.text}>Offline Social App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {marginTop: 16, fontSize: 24, fontWeight: 'bold'},
});

export default SplashScreen;
