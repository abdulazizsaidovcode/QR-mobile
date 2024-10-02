import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Welcome from './(welcome)/welcome'
import { useNavigation } from 'expo-router'
import { RootStackParamList } from '@/types/root/root'
import { NavigationProp } from '@react-navigation/native'

type SettingsScreenNavigationProp = NavigationProp<
  RootStackParamList,
  "(tabs)"
>;

const Index = () => {
  const [role, setRole] = useState<string | null>('')
  const [token, setToken] = useState<string | null>('')
  const navigation = useNavigation<SettingsScreenNavigationProp>();

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
  if (token) {
    navigation.navigate('(tabs)')

  } else {
    return <Welcome />
  }

}

export default Index;