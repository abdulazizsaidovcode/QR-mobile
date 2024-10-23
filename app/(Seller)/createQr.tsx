import { Colors } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import { createPayment } from "@/helpers/url";
import ErrorBoundary from "@/components/ErrorBoundary";
import { RenderQRCode } from "@/components/QRgenerate";
import { useAuthStore } from "@/helpers/stores/auth/auth-store";
import { Platform } from "react-native";

const CreateQr = () => {
  const [amount, setAmount] = useState("");
  const { phoneNumber } = useAuthStore();
  const [Messageamount, setMessageAmount] = useState("");
  const [alertShown, setAlertShown] = useState(false);
  const [qrValue, setQrValue] = useState<any>("238cc3c 3 32h3iuhchchew "); // State to hold the QR code value

  const paymentCreate = useGlobalRequest(
    createPayment,
    "POST",
    { amount: amount },
    "DEFAULT"
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
    <View style={styles.container}>
      <View style={{ flex: 1, height: 40 }}>
        <ScrollView
          style={{ flex: 1}}
        >
          <Text style={styles.label}>Введите сумму</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ""))} // Allow only numbers
            keyboardType="numeric"
          />
          {qrValue ? ( // Render QR code if qrValue is set
            <View style={styles.qrContainer}>
              <View style={{ paddingVertical: 10 }}>
                <Text style={styles.qrTextTop}>
                  {`QR-сумма: ${Messageamount} UZS`}
                </Text>
              </View>
              <ErrorBoundary>
                <RenderQRCode url={qrValue ? qrValue : null} />
              </ErrorBoundary>
              <Text style={styles.qrText}>
                Отсканируйте этот QR-код, чтобы продолжить
              </Text>
            </View>
          ) : null}
        </ScrollView>
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
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            "Создать платеж"
          )}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 40,
    marginTop: 8,
    height: 70,
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
});

export default CreateQr;
