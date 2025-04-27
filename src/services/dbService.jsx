import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

// Open or create DB
const getDBConnection = async () => {
  return SQLite.openDatabase({name: 'posts.db', location: 'default'});
};

// Create posts table
const createTables = async db => {
  const query = `CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    content TEXT,
    created_at TEXT,
    synced INTEGER
  );`;
  await db.executeSql(query);
};

// Insert a post
const insertPost = async (db, post) => {
  const insertQuery = `INSERT INTO posts (id, content, created_at, synced) VALUES (?, ?, ?, ?);`;
  await db.executeSql(insertQuery, [
    post.id,
    post.content,
    post.created_at,
    post.synced ? 1 : 0,
  ]);
};

// Fetch all posts
const getPosts = async db => {
  try {
    const posts = [];
    const results = await db.executeSql(
      'SELECT * FROM posts ORDER BY created_at DESC;',
    );
    results.forEach(result => {
      for (let i = 0; i < result.rows.length; i++) {
        posts.push(result.rows.item(i));
      }
    });
    return posts;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get posts !!!');
  }
};

// Update post sync status
const markPostAsSynced = async (db, id) => {
  const updateQuery = `UPDATE posts SET synced = 1 WHERE id = ?;`;
  await db.executeSql(updateQuery, [id]);
};

const deletePost = async (db, postId) => {
  const deleteQuery = `DELETE FROM posts WHERE id = ?`;
  await db.executeSql(deleteQuery, [postId]);
};

export {
  getDBConnection,
  createTables,
  insertPost,
  getPosts,
  markPostAsSynced,
  deletePost,
};
