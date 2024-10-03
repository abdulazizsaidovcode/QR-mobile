import { useFocusEffect, useNavigation } from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet, View, Text, SafeAreaView, BackHandler } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "@/types/root/root";
import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "@/helpers/stores/auth/auth-store";
import Buttons from "@/components/buttons/button";

type SettingsScreenNavigationProp = NavigationProp<
    RootStackParamList, 
    "index"
>;

const Welcome: React.FC = () => {
    // const {t, i18n} = useTranslation();
    const navigation = useNavigation<SettingsScreenNavigationProp>();
    // const {language, setLanguage} = langstore();
    const { setIsLoginModal } = useAuthStore()
    const [backPressCount, setBackPressCount] = useState(0);


    const changeLanguage = async (lng: string) => {
        // i18n.changeLanguage(lng);
        // await SecureStore.setItemAsync("selectedLanguage", lng);
        // setLanguage(lng);
    };

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

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style='light' />
            <View style={styles.logo}>
                <FontAwesome name="qrcode" size={50} color="black" />
            </View>
            <Text style={styles.title}>SBP mobile</Text>
            <Text style={styles.welcome}> </Text>
            {/* <Text style={styles.selectLanguage}>Buu app orqali o'zngizga yoqan ...</Text> */}
            <View style={styles.button}>
                <Buttons
                    title="Kirish"
                    onPress={() => {
                        navigation.navigate("(auth)/login");
                        changeLanguage("ru");
                        setIsLoginModal(true)
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 100,
        height: 100,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        marginBottom: 20,
    },
    title: {
        fontSize: 44,
        fontWeight: "600",
        color: "#000",
        marginBottom: 10,
    },
    welcome: {
        fontSize: 18,
        color: "#000",
        marginBottom: 5,
    },
    selectLanguage: {
        fontSize: 16,
        color: "#000",
        marginBottom: 20,
    },
    button: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: 16,
    },
});

export default Welcome;
