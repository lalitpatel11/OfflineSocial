import {createSlice} from '@reduxjs/toolkit';
import uuid from 'react-native-uuid';

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [], // All posts (local + synced)
  },
  reducers: {
    addPost: (state, action) => {
      const newPost = {
        id: uuid.v4(), // generate unique ID
        content: action.payload.content,
        created_at: new Date().toISOString(),
        synced: false, // new posts are initially not synced
      };
      state.posts.unshift(newPost);
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    markPostAsSynced: (state, action) => {
      const post = state.posts.find(p => p.id === action.payload.id);
      if (post) {
        post.synced = true;
      }
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter(post => post.id !== action.payload.id);
    },
  },
});

export const {addPost, setPosts, markPostAsSynced, deletePost} =
  postSlice.actions;
export default postSlice.reducer;
