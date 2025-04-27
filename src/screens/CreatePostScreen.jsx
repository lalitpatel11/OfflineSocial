import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {useDispatch} from 'react-redux';
import {addPost} from '../redux/postSlice';
import {getDBConnection, insertPost} from '../services/dbService';
import uuid from 'react-native-uuid';
import {useNavigation} from '@react-navigation/native';

const CreatePostScreen = () => {
  const [content, setContent] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handlePost = async () => {
    if (!content.trim()) {
      Alert.alert('Validation', 'Post content cannot be empty.');
      return;
    }

    const newPost = {
      id: uuid.v4(),
      content,
      created_at: new Date().toISOString(),
      synced: false,
    };

    try {
      dispatch(addPost({content}));

      const db = await getDBConnection();
      await insertPost(db, newPost);

      setContent('');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to create post', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button title="Post" onPress={handlePost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  input: {
    height: 150,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 10,
    textAlignVertical: 'top',
  },
});

export default CreatePostScreen;
