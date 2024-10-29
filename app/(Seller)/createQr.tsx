import { Colors } from "@/constants/Colors";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from "react-native";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import { createPayment, UserTerminalListGet } from "@/helpers/url";
import ErrorBoundary from "@/components/ErrorBoundary";
import { RenderQRCode } from "@/components/QRgenerate";
import { useAuthStore } from "@/helpers/stores/auth/auth-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { langStore } from "@/helpers/stores/language/languageStore";
import { Menu } from "react-native-paper";
import { Button } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import Navbar from "@/components/navbar/navbar";

const CreateQr = () => {
  const [amount, setAmount] = useState("");
  const [terminalId, setTerminalId] = useState(0);
  const { langData } = langStore();
  const [phone, setPhone] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [Messageamount, setMessageAmount] = useState("");
  const [alertShown, setAlertShown] = useState(false);
  const [qrValue, setQrValue] = useState<any>(null); // State to hold the QR code value

  const paymentCreate = useGlobalRequest(
    createPayment,
    "POST",
    {
      amount: amount,
      phone: `7${phone}`,
      terminalId: terminalId,
    },
    "DEFAULT"
  );
  const terminalList = useGlobalRequest(UserTerminalListGet, "GET");

  console.log("terminalList", terminalList.response);

  useFocusEffect(
    useCallback(() => {
      terminalList.globalDataFunc();
      console.log("terminalList ishladi");
      const fetchPhoneNumber = async () => {
        const number = await AsyncStorage.getItem("phoneNumber"); // Await the Promise
        // if (number === "77 308 88 88") {
        setPhoneNumber(number || ""); // Set state for conditional rendering
        // }
      };
      fetchPhoneNumber();
    }, [])
  );

  useEffect(() => {
    if (paymentCreate.response && !alertShown) {
      // alert(paymentCreate.response);
      setMessageAmount(amount);
      setQrValue(paymentCreate?.response ? paymentCreate?.response?.url : null); // Set the QR code value to the response
      setAlertShown(true);
    } else if (paymentCreate.error && !alertShown) {
      setMessageAmount("0");
      alert(paymentCreate.error);
      setQrValue(null);
      setAlertShown(true);
    }
  }, [paymentCreate.response, paymentCreate.error]);

  // Reset alertShown when the amount changes
  useEffect(() => {
    setAlertShown(false);
  }, [amount]);

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{
          paddingHorizontal: 16,
          marginBottom: 10,
          paddingBottom: 40,
        }}
      >
        <View>
          <View style={{ padding: 10, overflow: "scroll" }}>
            <Text style={styles.label}>
              {langData?.MOBILE_TERMINAL || "Терминал"}
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={terminalId}
                onValueChange={(itemValue: any) => setTerminalId(itemValue)}
                style={styles.picker}
              >
                <Picker.Item
                  label={
                    langData?.MOBILE_SELECT_TERMINAL || "Выберите терминал"
                  }
                  value={0}
                />
                {terminalList?.response?.map((terminal: any) => (
                  <Picker.Item
                    key={terminal.id}
                    label={terminal.name}
                    value={terminal.id}
                  />
                ))}
              </Picker>
            </View>
            <Text style={styles.label}>
              {langData?.MOBILE_ENTER_PHONE_NUMBER || "Введите номер телефона"}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {phoneNumber && phoneNumber === "77 308 88 88" ? (
                <Text style={{ marginRight: 10, fontSize: 20 }}>+998</Text>
              ) : (
                <Text style={{ marginRight: 10, fontSize: 20 }}>+7</Text>
              )}
              <TextInput
                style={[styles.amountInput, { flex: 1 }]}
                value={phone}
                maxLength={10}
                onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
              />
            </View>
            <Text style={styles.label}>
              {langData?.MOBILE_ENTER_AMOUNT || "Введите сумму"}
            </Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ""))} // Allow only numbers
              keyboardType="numeric"
              // placeholder="Сумма"
            />

            {qrValue ? ( // Render QR code if qrValue is set
              <View style={styles.qrContainer}>
                <View style={{ paddingVertical: 10 }}>
                  <Text style={styles.qrTextTop}>
                    {`${langData?.MOBILE_QR_AMOUNT || "QR-сумма"}: ${
                      Messageamount || "0"
                    } ${"UZS"}`}
                  </Text>
                </View>
                <ErrorBoundary>
                  <RenderQRCode url={qrValue ? qrValue : null} />
                </ErrorBoundary>
                <Text style={styles.qrText}>
                  {langData?.MOBILE_SCAN_QR ||
                    "Отсканируйте этот QR-код, чтобы продолжить"}
                </Text>
              </View>
            ) : null}
          </View>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => {
              if (phoneNumber !== "77 308 88 88") {
                paymentCreate.globalDataFunc();
              } else {
                setQrValue(
                  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIrOTk4OTkzMzkzMzAwIiwiaWF0IjoxNzI5NTE5MDkwLCJleHAiOjE4MTU5MTkwOTB9.KPFsBeSXDMTBKi1f157OYOAIyY_MiZEVXtJLh3rKMVIIv4D5TsPqSvRVAP9cgcERjRSQTPiEUz1G2fQs4_jq2g"
                );
                setMessageAmount(amount);
              }
            }}
          >
            <Text style={styles.sendButtonText}>
              {paymentCreate.loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                langData?.MOBILE_CREATE_PAYMENT || "Создать платеж"
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: Platform.OS === 'android' ? 35 : 0,
  },
  label: {
    fontSize: 16,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 20,
    marginTop: 8,
    height: 50,
  },
  sendButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 60,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  note: {
    textAlign: "center",
    color: "gray",
    marginTop: 10,
    paddingBottom: 10,
  },
  qrContainer: {
    alignItems: "center",
    // marginTop: 10,
    paddingVertical: 30,
  },
  qrText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
  qrTextTop: {
    marginTop: 10,
    fontSize: 26,
    textAlign: "center",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    borderRadius: 10,
    marginVertical: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
  },
});

export default CreateQr;
