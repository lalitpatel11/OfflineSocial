import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {login} from '../redux/authSlice';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (username.trim() !== '') {
      dispatch(login({username}));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Offline Social App</Text>
      <TextInput
        placeholder="Enter Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 20},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {borderWidth: 1, padding: 12, marginBottom: 20, borderRadius: 8},
});

export default LoginScreen;
