import {
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/helpers/stores/auth/auth-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "expo-router";
import { RootStackParamList } from "@/types/root/root";
import { NavigationProp } from "@react-navigation/native";
import { loginUrl } from "@/helpers/url";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import { Colors } from "@/constants/Colors";
import NavigationMenu from "@/components/navigationMenu/NavigationMenu";

type SettingsScreenNavigationProp = NavigationProp<
  RootStackParamList,
  "(auth)/checkCode"
>;

const CheckCode = () => {
  const { phoneNumber } = useAuthStore();
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [response, setResponse] = useState<any>({});

  const checkCode = useGlobalRequest(loginUrl, "POST", {
    phone: "+998" + phoneNumber.split(" ").join(""),
    code: +code.join(""),
  });

  const handleInputChange = (text: string, index: number) => {
    const newCode = [...code];

















    
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (text === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (checkCode.response) {
        setResponse(checkCode.response);
      } else if (checkCode.error) {
        alert(checkCode.error?.message);
      }
    }, [checkCode.response, checkCode.error])
  );
  useFocusEffect(
    useCallback(() => {
      if (response && response?.token) {
        AsyncStorage.setItem("token", response?.token ? response?.token : null);
        AsyncStorage.setItem("role", response?.role ? response?.role : null);
        navigation.navigate("(tabs)");
        setResponse({});
      }
    }, [response])
  );

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      checkCode.globalDataFunc();
    }
  }, [code]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.navigationContainer}>
          <NavigationMenu name="To'lov cheki" />
        </View>
        <View style={{ marginTop: 50 }}>
          <Text style={styles.title}>Подтверждение номера</Text>
          <Text style={[styles.title, { fontWeight: "500", marginTop: 30 }]}>
            +998 {phoneNumber}
          </Text>
          <Text style={styles.des}>
            Мы отправим вам SMS с кодом подтверждения.
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              marginTop: 40,
            }}
          >
            {code.map((digit, index) => (
              <TextInput
                key={index}
                value={digit}
                onChangeText={(text) => handleInputChange(text, index)}
                maxLength={1}
                keyboardType="numeric"
                style={styles.input}
                ref={(el) => (inputRefs.current[index] = el)} // Assigning refs
                returnKeyType="next"
              />
            ))}
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CheckCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.darkGreen,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
  },
  navigationContainer: {
    paddingTop: Platform.OS === "android" ? 35 : 0,
    padding: 16,
  },
  title: {
    fontSize: 25,
    // color: colors.white,
    textAlign: "center",
  },
  des: {
    fontSize: 16.5,
    color: "#828282",
    textAlign: "center",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    width: 65,
    height: 65,
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 5,
    borderRadius: 10,
    color: Colors.dark.primary,
    // backgroundColor: Colors.dark.primary
  },
});
