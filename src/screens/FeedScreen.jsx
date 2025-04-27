//import : react components
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Alert,
  Button,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
//import : utils
import {getDBConnection, getPosts} from '../services/dbService';
import {deletePost as deletePostDB} from '../services/dbService';
//import : hooks
import useNetworkStatus from '../hooks/useNetworkStatus';
//import : redux
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../redux/authSlice';
import {setPosts} from '../redux/postSlice';
import {syncPosts} from '../services/syncService';
import {deletePost as deletePostRedux} from '../redux/postSlice';

const FeedScreen = () => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.posts.posts);
  const navigation = useNavigation();
  const isConnected = useNetworkStatus();
  //hook : states
  const [refreshing, setRefreshing] = useState(false);
  //function : imp func
  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };
  const handleDelete = postId => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => confirmDelete(postId),
        },
      ],
      {cancelable: true},
    );
  };
  //function : serv func
  const confirmDelete = async postId => {
    try {
      const db = await getDBConnection();
      await deletePostDB(db, postId);
      dispatch(deletePostRedux({id: postId}));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };
  const loadPosts = async () => {
    try {
      const db = await getDBConnection();
      const localPosts = await getPosts(db);
      dispatch(setPosts(localPosts));
    } catch (error) {
      console.error('Failed to load posts', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadPosts();
    });
    return unsubscribe;
  }, [navigation]);
  //function : render func
  const renderItem = ({item}) => (
    <TouchableOpacity onLongPress={() => handleDelete(item.id)}>
      <View style={styles.postItem}>
        <Text style={styles.postContent}>{item.content}</Text>
        <Text style={styles.postDate}>
          {new Date(item.created_at).toLocaleString()}
        </Text>
        {!item.synced && <Text style={styles.unsynced}>Unsynced 🚫</Text>}
      </View>
    </TouchableOpacity>
  );
  //hook : useEffect
  useEffect(() => {
    if (isConnected) {
      syncPosts(dispatch);
    }
  }, [isConnected]);
  //UI
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{padding: 16}}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      <View
        style={{
          padding: 20,
          rowGap: 10,
        }}>
        <Button
          title={isConnected ? 'Create Post (Online)' : 'Create Post (Offline)'}
          onPress={() => navigation.navigate('CreatePost')}
        />

        <Button title="Logout" onPress={() => dispatch(logout())} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postItem: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  postContent: {
    fontSize: 16,
    marginBottom: 8,
  },
  postDate: {
    fontSize: 12,
    color: 'gray',
  },
  unsynced: {
    marginTop: 4,
    fontSize: 12,
    color: 'red',
  },
});

export default FeedScreen;
