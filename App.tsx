import React, {useEffect, useState} from 'react';
import {Provider, useSelector} from 'react-redux';
import store from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import {getDBConnection, createTables} from './src/services/dbService';
import Toast from 'react-native-toast-message';
import SplashScreen from './src/screens/SplashScreen';

const MainApp = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  useEffect(() => {
    const initDB = async () => {
      const db = await getDBConnection();
      await createTables(db);
    };

    initDB();
  }, []);

  return (
    <>
      <AppNavigator isLoggedIn={isLoggedIn} />
      <Toast />
    </>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
};

export default App;
