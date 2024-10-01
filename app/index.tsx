import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Welcome from './(welcome)/welcome'
import HomeScreen from './(tabs)/home'

const Index = () => {
  const [role, setRole] = useState<string | null>('')
  const [token, setToken] = useState<string | null>('')
  useEffect(() => {
    const getToken = async () => {
      // await AsyncStorage.removeItem('role');
      // await AsyncStorage.removeItem('token');
      const role = await AsyncStorage.getItem('role');
      const token = await AsyncStorage.getItem('token');
      setRole(role);
      setToken(token);
    }

    getToken()
  }, []);

  return token ? <HomeScreen /> : <Welcome />
}

export default Index;