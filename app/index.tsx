import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Welcome from "./(welcome)/welcome";
import { useNavigation } from "expo-router";
import i18n from "i18next";
import { RootStackParamList } from "@/types/root/root";
import { NavigationProp } from "@react-navigation/native";
import { langStore } from "@/helpers/stores/language/languageStore";
import { initReactI18next } from "react-i18next";
import { TranslateUz } from "../helpers/locales/translateUz";
import { TranslateRu } from "../helpers/locales/translateRu";

type SettingsScreenNavigationProp = NavigationProp<
  RootStackParamList,
  "(tabs)"
>;

i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: TranslateUz },
    ru: { translation: TranslateRu },
  },
  lng: "uz",
  fallbackLng: "uz",
});

const Index = () => {
  const [role, setRole] = useState<string | null>("");
  const [token, setToken] = useState<string | null>("");
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  useEffect(() => {
    const getToken = async () => {
      // await AsyncStorage.removeItem('role');
      // await AsyncStorage.removeItem('token');
      const role = await AsyncStorage.getItem("role");
      const token = await AsyncStorage.getItem("token");
      setRole(role);
      setToken(token);
    };

    getToken();
  }, []);
  if (token && role) {
    navigation.navigate("(tabs)");
  } else {
    return <Welcome />;
  }
};

export default Index;
