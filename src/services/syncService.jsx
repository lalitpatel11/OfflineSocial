import axios from 'axios';
import {getDBConnection, getPosts, markPostAsSynced} from './dbService';
import {markPostAsSynced as markPostAsSyncedRedux} from '../redux/postSlice';
import Toast from 'react-native-toast-message';
const API_URL = 'https://dummyjson.com/posts'; // Dummy API (you can replace later)

export const syncPosts = async dispatch => {
  try {
    const db = await getDBConnection();
    const localPosts = await getPosts(db);

    const unsyncedPosts = localPosts.filter(post => post.synced === 0);

    if (unsyncedPosts.length === 0) return; // No posts to sync

    for (const post of unsyncedPosts) {
      try {
        await axios.post(API_URL, {
          body: post.content,
          userId: 1,
        });

        await markPostAsSynced(db, post.id);
        dispatch(markPostAsSyncedRedux({id: post.id}));
      } catch (error) {
        console.error('Failed to sync post:', post.id, error);
      }
    }

    // 🎉 Show success toast
    Toast.show({
      type: 'success',
      text1: 'Posts Synced',
      text2: `${unsyncedPosts.length} post(s) synced successfully`,
    });
  } catch (error) {
    console.error('Syncing error:', error);
  }
};
