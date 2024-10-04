import { BackHandler, Image, Keyboard, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Buttons from '@/components/buttons/button';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types/root/root';
import { useAuthStore } from '@/helpers/stores/auth/auth-store';
import { useFocusEffect } from 'expo-router';
import { useGlobalRequest } from '@/helpers/apifunctions/univesalFunc';
import { loginUrl } from '@/helpers/url';
import NavigationMenu from '@/components/navigation copy/NavigationMenu';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingsScreenNavigationProp = NavigationProp<
    RootStackParamList,
    "(auth)/login"
>;

const Login = () => {
    const { phoneNumber, setPhoneNumber, status, setStatus, setPassword, password } = useAuthStore();
    const navigation = useNavigation<SettingsScreenNavigationProp>();
    const [backPressCount, setBackPressCount] = useState(0);
    const userData = {
        "phone": `+998${phoneNumber.split(' ').join('')}`,
        "password": password
    }
    const loginUser = useGlobalRequest(`${loginUrl}`, 'POST', userData);

    const [isPhoneNumberComplete, setIsPhoneNumberComplete] = useState(false); // New state to track phone number completeness

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (backPressCount === 0) {
                    setBackPressCount(backPressCount + 1);
                    // Toast.show('Orqaga qaytish uchun yana bir marta bosing', Toast.SHORT);
                    setTimeout(() => {
                        setBackPressCount(0);
                    }, 2000); // 2 soniya ichida ikkinchi marta bosilmasa, holatni qayta boshlaydi
                    return true; // Orqaga qaytishni bloklaydi
                } else {
                    BackHandler.exitApp(); // Ilovadan chiqish
                    return false;
                }
            };
    
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [backPressCount])
    );

    const formatPhoneNumber = (text: string) => {
        let cleaned = ('' + text).replace(/\D/g, '');

        if (cleaned.length > 9) {
            cleaned = cleaned.slice(0, 9);
        }
        const formattedNumber = cleaned.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');

        setPhoneNumber(formattedNumber);

        setIsPhoneNumberComplete(formattedNumber.length == 12);
    };

    function login() {
        if (isPhoneNumberComplete && password.length > 0) {
            loginUser.globalDataFunc();
        }
    }
    useFocusEffect(
        useCallback(() => {
            formatPhoneNumber(phoneNumber.split(' ').join(''))
        }, [])
    )
    useFocusEffect(
        useCallback(() => {
            setStatus(loginUser.response)
            if (loginUser.response && loginUser.response.token) {
                AsyncStorage.setItem('token', loginUser.response.token)
                AsyncStorage.setItem('role', loginUser.response.role)
                navigation.navigate('(tabs)')
            }

        }, [loginUser.response])
    )

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <NavigationMenu name='' />
                <View style={{ marginTop: 50 }}>
                    <Text style={styles.title}>Ваш номер телефона</Text>
                    <Text style={styles.des}>Мы отправим вам SMS с кодом подтверждения.</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                        <View style={styles.phoneCard}>
                            {/* <Image source={require('../../../../assets/images/uzb.png')} /> */}
                            <Text style={{ fontSize: 17, color: 'gray' }}>+998</Text>
                        </View>
                        <View style={{ width: '69%' }}>
                            <TextInput
                                style={styles.phoneInput}
                                placeholder='Phone Number'
                                value={phoneNumber}
                                keyboardType='numeric'
                                onChangeText={formatPhoneNumber}
                                maxLength={12}
                                placeholderTextColor={'gray'}
                            />
                        </View>
                    </View>
                    <View style={{ width: '100%', marginTop: 20 }}>
                        <TextInput
                            style={styles.phoneInput}
                            placeholder='Password'
                            value={password}
                            onChangeText={setPassword}
                            maxLength={12}
                            placeholderTextColor={'gray'}
                        />
                    </View>
                </View>
                {isPhoneNumberComplete && (
                    <View style={{ position: 'absolute', width: '100%', bottom: 0, marginBottom: 25, alignSelf: 'center' }}>
                        <Buttons
                            title="Login"
                            onPress={() => login()}
                        // loading={sendCode.loading || userFound.loading}
                        />

                    </View>
                )}
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 16,
        position: 'relative'
    },
    title: {
        fontSize: 25,
        color: '#000',
        textAlign: 'center'
    },
    des: {
        fontSize: 15,
        color: '#828282',
        textAlign: 'center',
        marginTop: 10
    },
    phoneCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.dark.primary,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        width: '29%',
        shadowColor: Colors.dark.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,

        elevation: 8,
    },
    phoneInput: {
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.dark.primary,
        paddingVertical: 15,
        paddingHorizontal: 15,
        color: '#000',
        fontSize: 17,
        shadowColor: Colors.dark.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,

        elevation: 8,
    }
});
